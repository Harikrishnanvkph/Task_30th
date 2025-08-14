import { 
  User, 
  AuthCredentials, 
  AuthToken, 
  AuthSession,
  AuthProvider,
  UserRole,
  Permission,
  ApiResponse 
} from '@/types';
import { 
  generateId, 
  localStorage, 
  crypto,
  validateEmail,
  validatePassword 
} from '@/lib/utils';
import { 
  TOKEN_KEY, 
  REFRESH_TOKEN_KEY,
  USER_KEY,
  SESSION_KEY,
  API_BASE_URL,
  AUTH_ENDPOINTS,
  TOKEN_EXPIRY_TIME,
  REFRESH_TOKEN_EXPIRY_TIME,
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS,
  TWO_FACTOR_ENABLED,
  OAUTH_PROVIDERS,
  BIOMETRIC_ENABLED,
  SESSION_TIMEOUT,
  REMEMBER_ME_DURATION
} from '@/lib/constants';

interface AuthConfig {
  apiUrl?: string;
  tokenKey?: string;
  refreshTokenKey?: string;
  userKey?: string;
  sessionKey?: string;
  enableBiometric?: boolean;
  enableTwoFactor?: boolean;
  enableOAuth?: boolean;
  sessionTimeout?: number;
  rememberMeDuration?: number;
  maxLoginAttempts?: number;
  lockoutDuration?: number;
}

interface LoginOptions {
  rememberMe?: boolean;
  twoFactorCode?: string;
  deviceId?: string;
  deviceName?: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
}

interface RegisterOptions {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  newsletter?: boolean;
  referralCode?: string;
  captchaToken?: string;
}

interface PasswordResetOptions {
  email?: string;
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface TwoFactorOptions {
  method: 'sms' | 'email' | 'authenticator' | 'backup';
  code?: string;
  backupCode?: string;
  phoneNumber?: string;
  email?: string;
}

interface OAuthOptions {
  provider: 'google' | 'facebook' | 'github' | 'microsoft' | 'apple';
  redirectUrl?: string;
  scope?: string[];
  state?: string;
}

interface BiometricOptions {
  type: 'fingerprint' | 'face' | 'iris' | 'voice';
  data: any;
  deviceId: string;
}

interface SessionInfo {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivity: Date;
  deviceId?: string;
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
}

interface LoginAttempt {
  email: string;
  timestamp: Date;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
}

interface SecurityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class AuthService {
  private config: AuthConfig;
  private currentUser: User | null = null;
  private currentSession: SessionInfo | null = null;
  private loginAttempts: Map<string, LoginAttempt[]> = new Map();
  private activeSessions: Map<string, SessionInfo> = new Map();
  private securityLogs: SecurityLog[] = [];
  private refreshTokenTimer: NodeJS.Timeout | null = null;
  private sessionTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor(config: AuthConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || API_BASE_URL,
      tokenKey: config.tokenKey || TOKEN_KEY,
      refreshTokenKey: config.refreshTokenKey || REFRESH_TOKEN_KEY,
      userKey: config.userKey || USER_KEY,
      sessionKey: config.sessionKey || SESSION_KEY,
      enableBiometric: config.enableBiometric ?? BIOMETRIC_ENABLED,
      enableTwoFactor: config.enableTwoFactor ?? TWO_FACTOR_ENABLED,
      enableOAuth: config.enableOAuth ?? true,
      sessionTimeout: config.sessionTimeout || SESSION_TIMEOUT,
      rememberMeDuration: config.rememberMeDuration || REMEMBER_ME_DURATION,
      maxLoginAttempts: config.maxLoginAttempts || MAX_LOGIN_ATTEMPTS,
      lockoutDuration: config.lockoutDuration || LOCKOUT_DURATION
    };

    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Load saved session
    await this.loadSession();

    // Set up event listeners
    this.setupEventListeners();

    // Start session monitoring
    this.startSessionMonitoring();

    // Check for expired tokens
    await this.checkTokenExpiry();
  }

  private async loadSession(): Promise<void> {
    try {
      const savedToken = localStorage.get(this.config.tokenKey!);
      const savedRefreshToken = localStorage.get(this.config.refreshTokenKey!);
      const savedUser = localStorage.get(this.config.userKey!);
      const savedSession = localStorage.get(this.config.sessionKey!);

      if (savedToken && savedUser) {
        this.currentUser = JSON.parse(savedUser);
        this.currentSession = savedSession ? JSON.parse(savedSession) : null;

        // Verify token is still valid
        const isValid = await this.verifyToken(savedToken);
        if (isValid) {
          this.setAuthHeaders(savedToken);
          this.emit('sessionRestored', { user: this.currentUser, session: this.currentSession });
        } else if (savedRefreshToken) {
          // Try to refresh the token
          await this.refreshToken(savedRefreshToken);
        } else {
          // Clear invalid session
          await this.clearSession();
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      await this.clearSession();
    }
  }

  private setupEventListeners(): void {
    // Listen for storage changes (multi-tab sync)
    window.addEventListener('storage', this.handleStorageChange.bind(this));

    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Listen for visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Listen for user activity
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, this.handleUserActivity.bind(this), { passive: true });
    });
  }

  private startSessionMonitoring(): void {
    // Monitor session timeout
    if (this.config.sessionTimeout) {
      this.resetSessionTimer();
    }

    // Monitor token expiry
    this.startTokenRefreshTimer();
  }

  private resetSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }

    if (this.config.sessionTimeout && this.currentSession) {
      this.sessionTimer = setTimeout(() => {
        this.handleSessionTimeout();
      }, this.config.sessionTimeout);
    }
  }

  private startTokenRefreshTimer(): void {
    if (this.refreshTokenTimer) {
      clearInterval(this.refreshTokenTimer);
    }

    // Check token every minute
    this.refreshTokenTimer = setInterval(() => {
      this.checkTokenExpiry();
    }, 60000) as any;
  }

  private async checkTokenExpiry(): Promise<void> {
    if (!this.currentSession) return;

    const expiresAt = new Date(this.currentSession.expiresAt);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();

    // Refresh token if it expires in less than 5 minutes
    if (timeUntilExpiry < 5 * 60 * 1000) {
      const refreshToken = localStorage.get(this.config.refreshTokenKey!);
      if (refreshToken) {
        await this.refreshToken(refreshToken);
      }
    }
  }

  // Authentication Methods

  public async login(email: string, password: string, options: LoginOptions = {}): Promise<ApiResponse<User>> {
    try {
      // Check if account is locked
      if (this.isAccountLocked(email)) {
        const lockoutEnd = this.getLockoutEndTime(email);
        throw new Error(`Account is locked. Please try again after ${lockoutEnd.toLocaleTimeString()}`);
      }

      // Validate credentials
      if (!validateEmail(email)) {
        throw new Error('Invalid email address');
      }

      if (!validatePassword(password)) {
        throw new Error('Invalid password');
      }

      // Record login attempt
      this.recordLoginAttempt(email, false);

      // Prepare login data
      const loginData = {
        email,
        password: await this.hashPassword(password),
        rememberMe: options.rememberMe,
        deviceId: options.deviceId || this.getDeviceId(),
        deviceName: options.deviceName || this.getDeviceName(),
        location: options.location || await this.getLocation(),
        twoFactorCode: options.twoFactorCode
      };

      // Make API request
      const response = await this.apiRequest<{
        user: User;
        token: string;
        refreshToken: string;
        requiresTwoFactor?: boolean;
        twoFactorMethod?: string;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginData)
      });

      // Handle two-factor authentication
      if (response.data?.requiresTwoFactor) {
        this.emit('twoFactorRequired', { 
          method: response.data.twoFactorMethod,
          email 
        });
        return {
          success: false,
          data: null,
          error: 'Two-factor authentication required',
          requiresTwoFactor: true,
          twoFactorMethod: response.data.twoFactorMethod
        } as any;
      }

      // Process successful login
      if (response.success && response.data) {
        await this.handleLoginSuccess(
          response.data.user,
          response.data.token,
          response.data.refreshToken,
          options
        );

        // Record successful login
        this.recordLoginAttempt(email, true);
        this.logSecurityEvent('login', 'User logged in', 'low');

        return {
          success: true,
          data: response.data.user,
          error: null
        };
      }

      throw new Error(response.error || 'Login failed');
    } catch (error: any) {
      // Record failed login
      this.recordLoginAttempt(email, false, error.message);
      this.logSecurityEvent('login_failed', `Login failed: ${error.message}`, 'medium');

      return {
        success: false,
        data: null,
        error: error.message || 'Login failed'
      };
    }
  }

  public async register(options: RegisterOptions): Promise<ApiResponse<User>> {
    try {
      // Validate registration data
      if (!validateEmail(options.email)) {
        throw new Error('Invalid email address');
      }

      if (!this.validatePasswordStrength(options.password)) {
        throw new Error('Password does not meet requirements');
      }

      if (options.password !== options.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (!options.acceptTerms) {
        throw new Error('You must accept the terms and conditions');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(options.password);

      // Prepare registration data
      const registrationData = {
        firstName: options.firstName,
        lastName: options.lastName,
        email: options.email,
        password: hashedPassword,
        newsletter: options.newsletter,
        referralCode: options.referralCode,
        captchaToken: options.captchaToken,
        deviceId: this.getDeviceId(),
        deviceName: this.getDeviceName(),
        location: await this.getLocation()
      };

      // Make API request
      const response = await this.apiRequest<{
        user: User;
        token: string;
        refreshToken: string;
        verificationRequired?: boolean;
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(registrationData)
      });

      if (response.success && response.data) {
        // Handle email verification requirement
        if (response.data.verificationRequired) {
          this.emit('verificationRequired', { email: options.email });
          return {
            success: true,
            data: response.data.user,
            error: null,
            verificationRequired: true
          } as any;
        }

        // Auto-login after registration
        await this.handleLoginSuccess(
          response.data.user,
          response.data.token,
          response.data.refreshToken,
          { rememberMe: false }
        );

        this.logSecurityEvent('registration', 'New user registered', 'low');

        return {
          success: true,
          data: response.data.user,
          error: null
        };
      }

      throw new Error(response.error || 'Registration failed');
    } catch (error: any) {
      this.logSecurityEvent('registration_failed', `Registration failed: ${error.message}`, 'medium');

      return {
        success: false,
        data: null,
        error: error.message || 'Registration failed'
      };
    }
  }

  public async logout(): Promise<void> {
    try {
      // Notify server
      if (this.currentSession?.token) {
        await this.apiRequest('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.currentSession.token}`
          }
        });
      }

      this.logSecurityEvent('logout', 'User logged out', 'low');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local session
      await this.clearSession();
      this.emit('logout');
    }
  }

  public async refreshToken(refreshToken: string): Promise<ApiResponse<AuthToken>> {
    try {
      const response = await this.apiRequest<{
        token: string;
        refreshToken: string;
        expiresAt: string;
      }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      });

      if (response.success && response.data) {
        // Update session
        localStorage.set(this.config.tokenKey!, response.data.token);
        localStorage.set(this.config.refreshTokenKey!, response.data.refreshToken);

        if (this.currentSession) {
          this.currentSession.token = response.data.token;
          this.currentSession.refreshToken = response.data.refreshToken;
          this.currentSession.expiresAt = new Date(response.data.expiresAt);
          localStorage.set(this.config.sessionKey!, JSON.stringify(this.currentSession));
        }

        this.setAuthHeaders(response.data.token);
        this.emit('tokenRefreshed');

        return {
          success: true,
          data: {
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            expiresAt: new Date(response.data.expiresAt)
          } as any,
          error: null
        };
      }

      throw new Error(response.error || 'Token refresh failed');
    } catch (error: any) {
      // Clear session if refresh fails
      await this.clearSession();
      this.emit('sessionExpired');

      return {
        success: false,
        data: null,
        error: error.message || 'Token refresh failed'
      };
    }
  }

  // Password Management

  public async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    try {
      if (!validateEmail(email)) {
        throw new Error('Invalid email address');
      }

      const response = await this.apiRequest('/auth/password-reset/request', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      if (response.success) {
        this.logSecurityEvent('password_reset_requested', `Password reset requested for ${email}`, 'medium');
        return {
          success: true,
          data: undefined,
          error: null
        };
      }

      throw new Error(response.error || 'Password reset request failed');
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        error: error.message || 'Password reset request failed'
      };
    }
  }

  public async resetPassword(options: PasswordResetOptions): Promise<ApiResponse<void>> {
    try {
      if (!options.token) {
        throw new Error('Reset token is required');
      }

      if (!this.validatePasswordStrength(options.newPassword!)) {
        throw new Error('Password does not meet requirements');
      }

      if (options.newPassword !== options.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const hashedPassword = await this.hashPassword(options.newPassword!);

      const response = await this.apiRequest('/auth/password-reset/confirm', {
        method: 'POST',
        body: JSON.stringify({
          token: options.token,
          password: hashedPassword
        })
      });

      if (response.success) {
        this.logSecurityEvent('password_reset', 'Password reset completed', 'high');
        return {
          success: true,
          data: undefined,
          error: null
        };
      }

      throw new Error(response.error || 'Password reset failed');
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        error: error.message || 'Password reset failed'
      };
    }
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      if (!this.validatePasswordStrength(newPassword)) {
        throw new Error('Password does not meet requirements');
      }

      const currentHash = await this.hashPassword(currentPassword);
      const newHash = await this.hashPassword(newPassword);

      const response = await this.apiRequest('/auth/password/change', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentSession?.token}`
        },
        body: JSON.stringify({
          currentPassword: currentHash,
          newPassword: newHash
        })
      });

      if (response.success) {
        this.logSecurityEvent('password_changed', 'Password changed', 'high');
        return {
          success: true,
          data: undefined,
          error: null
        };
      }

      throw new Error(response.error || 'Password change failed');
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        error: error.message || 'Password change failed'
      };
    }
  }

  // Two-Factor Authentication

  public async enableTwoFactor(method: TwoFactorOptions['method']): Promise<ApiResponse<any>> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await this.apiRequest('/auth/2fa/enable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentSession?.token}`
        },
        body: JSON.stringify({ method })
      });

      if (response.success) {
        this.logSecurityEvent('2fa_enabled', `Two-factor authentication enabled: ${method}`, 'high');
        return response;
      }

      throw new Error(response.error || 'Failed to enable two-factor authentication');
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  public async disableTwoFactor(code: string): Promise<ApiResponse<void>> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await this.apiRequest('/auth/2fa/disable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentSession?.token}`
        },
        body: JSON.stringify({ code })
      });

      if (response.success) {
        this.logSecurityEvent('2fa_disabled', 'Two-factor authentication disabled', 'high');
        return {
          success: true,
          data: undefined,
          error: null
        };
      }

      throw new Error(response.error || 'Failed to disable two-factor authentication');
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        error: error.message
      };
    }
  }

  public async verifyTwoFactor(options: TwoFactorOptions): Promise<ApiResponse<User>> {
    try {
      const response = await this.apiRequest<{
        user: User;
        token: string;
        refreshToken: string;
      }>('/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify(options)
      });

      if (response.success && response.data) {
        await this.handleLoginSuccess(
          response.data.user,
          response.data.token,
          response.data.refreshToken,
          {}
        );

        return {
          success: true,
          data: response.data.user,
          error: null
        };
      }

      throw new Error(response.error || 'Two-factor verification failed');
    } catch (error: any) {
      this.logSecurityEvent('2fa_failed', 'Two-factor verification failed', 'high');
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  // OAuth Authentication

  public async loginWithOAuth(options: OAuthOptions): Promise<void> {
    try {
      const { provider, redirectUrl, scope, state } = options;

      // Build OAuth URL
      const params = new URLSearchParams({
        provider,
        redirect_url: redirectUrl || window.location.origin + '/auth/callback',
        scope: scope?.join(' ') || '',
        state: state || generateId()
      });

      const oauthUrl = `${this.config.apiUrl}/auth/oauth/authorize?${params}`;

      // Store state for verification
      localStorage.set('oauth_state', params.get('state')!);

      // Redirect to OAuth provider
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('OAuth login error:', error);
      throw error;
    }
  }

  public async handleOAuthCallback(code: string, state: string): Promise<ApiResponse<User>> {
    try {
      // Verify state
      const savedState = localStorage.get('oauth_state');
      if (state !== savedState) {
        throw new Error('Invalid OAuth state');
      }

      // Exchange code for tokens
      const response = await this.apiRequest<{
        user: User;
        token: string;
        refreshToken: string;
      }>('/auth/oauth/callback', {
        method: 'POST',
        body: JSON.stringify({ code, state })
      });

      if (response.success && response.data) {
        await this.handleLoginSuccess(
          response.data.user,
          response.data.token,
          response.data.refreshToken,
          {}
        );

        // Clean up
        localStorage.remove('oauth_state');

        this.logSecurityEvent('oauth_login', 'User logged in via OAuth', 'low');

        return {
          success: true,
          data: response.data.user,
          error: null
        };
      }

      throw new Error(response.error || 'OAuth authentication failed');
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  // Biometric Authentication

  public async enrollBiometric(options: BiometricOptions): Promise<ApiResponse<void>> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      // Check browser support
      if (!this.isBiometricSupported(options.type)) {
        throw new Error(`${options.type} authentication is not supported`);
      }

      const response = await this.apiRequest('/auth/biometric/enroll', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentSession?.token}`
        },
        body: JSON.stringify(options)
      });

      if (response.success) {
        this.logSecurityEvent('biometric_enrolled', `Biometric enrolled: ${options.type}`, 'high');
        return {
          success: true,
          data: undefined,
          error: null
        };
      }

      throw new Error(response.error || 'Biometric enrollment failed');
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        error: error.message
      };
    }
  }

  public async loginWithBiometric(options: BiometricOptions): Promise<ApiResponse<User>> {
    try {
      // Check browser support
      if (!this.isBiometricSupported(options.type)) {
        throw new Error(`${options.type} authentication is not supported`);
      }

      // Capture biometric data
      const biometricData = await this.captureBiometric(options.type);

      const response = await this.apiRequest<{
        user: User;
        token: string;
        refreshToken: string;
      }>('/auth/biometric/login', {
        method: 'POST',
        body: JSON.stringify({
          ...options,
          data: biometricData
        })
      });

      if (response.success && response.data) {
        await this.handleLoginSuccess(
          response.data.user,
          response.data.token,
          response.data.refreshToken,
          {}
        );

        this.logSecurityEvent('biometric_login', `User logged in via ${options.type}`, 'low');

        return {
          success: true,
          data: response.data.user,
          error: null
        };
      }

      throw new Error(response.error || 'Biometric authentication failed');
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  // Session Management

  public async getSessions(): Promise<SessionInfo[]> {
    try {
      const response = await this.apiRequest<SessionInfo[]>('/auth/sessions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.currentSession?.token}`
        }
      });

      if (response.success && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Failed to get sessions:', error);
      return [];
    }
  }

  public async revokeSession(sessionId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.apiRequest(`/auth/sessions/${sessionId}/revoke`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentSession?.token}`
        }
      });

      if (response.success) {
        this.logSecurityEvent('session_revoked', `Session revoked: ${sessionId}`, 'medium');
        return {
          success: true,
          data: undefined,
          error: null
        };
      }

      throw new Error(response.error || 'Failed to revoke session');
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        error: error.message
      };
    }
  }

  public async revokeAllSessions(): Promise<ApiResponse<void>> {
    try {
      const response = await this.apiRequest('/auth/sessions/revoke-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentSession?.token}`
        }
      });

      if (response.success) {
        this.logSecurityEvent('all_sessions_revoked', 'All sessions revoked', 'high');
        return {
          success: true,
          data: undefined,
          error: null
        };
      }

      throw new Error(response.error || 'Failed to revoke sessions');
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        error: error.message
      };
    }
  }

  // User Management

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUser && !!this.currentSession?.token;
  }

  public hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  public hasPermission(permission: Permission): boolean {
    return this.currentUser?.permissions?.includes(permission) || false;
  }

  public async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await this.apiRequest<User>('/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.currentSession?.token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.success && response.data) {
        this.currentUser = response.data;
        localStorage.set(this.config.userKey!, JSON.stringify(this.currentUser));
        this.emit('profileUpdated', this.currentUser);

        return {
          success: true,
          data: response.data,
          error: null
        };
      }

      throw new Error(response.error || 'Profile update failed');
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  public async deleteAccount(password: string): Promise<ApiResponse<void>> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      const hashedPassword = await this.hashPassword(password);

      const response = await this.apiRequest('/auth/account/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.currentSession?.token}`
        },
        body: JSON.stringify({ password: hashedPassword })
      });

      if (response.success) {
        this.logSecurityEvent('account_deleted', 'User account deleted', 'critical');
        await this.clearSession();
        return {
          success: true,
          data: undefined,
          error: null
        };
      }

      throw new Error(response.error || 'Account deletion failed');
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        error: error.message
      };
    }
  }

  // Security Methods

  private async hashPassword(password: string): Promise<string> {
    return crypto.hash(password, 'SHA-256');
  }

  private validatePasswordStrength(password: string): boolean {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return false;
    }

    const requirements = PASSWORD_REQUIREMENTS;
    
    if (requirements.uppercase && !/[A-Z]/.test(password)) {
      return false;
    }
    
    if (requirements.lowercase && !/[a-z]/.test(password)) {
      return false;
    }
    
    if (requirements.numbers && !/\d/.test(password)) {
      return false;
    }
    
    if (requirements.special && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return false;
    }

    return true;
  }

  private isAccountLocked(email: string): boolean {
    const attempts = this.loginAttempts.get(email) || [];
    const recentAttempts = attempts.filter(
      a => Date.now() - a.timestamp.getTime() < this.config.lockoutDuration!
    );

    return recentAttempts.filter(a => !a.success).length >= this.config.maxLoginAttempts!;
  }

  private getLockoutEndTime(email: string): Date {
    const attempts = this.loginAttempts.get(email) || [];
    const lastFailedAttempt = attempts
      .filter(a => !a.success)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    if (lastFailedAttempt) {
      return new Date(lastFailedAttempt.timestamp.getTime() + this.config.lockoutDuration!);
    }

    return new Date();
  }

  private recordLoginAttempt(email: string, success: boolean, reason?: string): void {
    const attempts = this.loginAttempts.get(email) || [];
    attempts.push({
      email,
      timestamp: new Date(),
      success,
      ipAddress: this.getIpAddress(),
      userAgent: navigator.userAgent,
      reason
    });

    // Keep only recent attempts
    const recentAttempts = attempts.filter(
      a => Date.now() - a.timestamp.getTime() < 24 * 60 * 60 * 1000 // 24 hours
    );

    this.loginAttempts.set(email, recentAttempts);
  }

  private logSecurityEvent(action: string, details: string, severity: SecurityLog['severity']): void {
    const log: SecurityLog = {
      id: generateId(),
      userId: this.currentUser?.id || 'anonymous',
      action,
      timestamp: new Date(),
      ipAddress: this.getIpAddress(),
      userAgent: navigator.userAgent,
      details,
      severity
    };

    this.securityLogs.push(log);

    // Keep only recent logs
    this.securityLogs = this.securityLogs.filter(
      l => Date.now() - l.timestamp.getTime() < 30 * 24 * 60 * 60 * 1000 // 30 days
    );

    // Send critical events to server
    if (severity === 'critical' || severity === 'high') {
      this.sendSecurityLog(log);
    }
  }

  private async sendSecurityLog(log: SecurityLog): Promise<void> {
    try {
      await this.apiRequest('/auth/security/log', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.currentSession?.token}`
        },
        body: JSON.stringify(log)
      });
    } catch (error) {
      console.error('Failed to send security log:', error);
    }
  }

  // Helper Methods

  private async handleLoginSuccess(
    user: User,
    token: string,
    refreshToken: string,
    options: LoginOptions
  ): Promise<void> {
    // Store user and tokens
    this.currentUser = user;
    localStorage.set(this.config.userKey!, JSON.stringify(user));
    localStorage.set(this.config.tokenKey!, token);
    localStorage.set(this.config.refreshTokenKey!, refreshToken);

    // Create session
    this.currentSession = {
      id: generateId(),
      userId: user.id,
      token,
      refreshToken,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY_TIME),
      createdAt: new Date(),
      lastActivity: new Date(),
      deviceId: options.deviceId || this.getDeviceId(),
      deviceName: options.deviceName || this.getDeviceName(),
      ipAddress: this.getIpAddress(),
      userAgent: navigator.userAgent,
      location: options.location
    };

    localStorage.set(this.config.sessionKey!, JSON.stringify(this.currentSession));
    this.activeSessions.set(this.currentSession.id, this.currentSession);

    // Set auth headers
    this.setAuthHeaders(token);

    // Start session monitoring
    this.startSessionMonitoring();

    // Emit login event
    this.emit('login', { user, session: this.currentSession });
  }

  private async clearSession(): Promise<void> {
    // Clear timers
    if (this.refreshTokenTimer) {
      clearInterval(this.refreshTokenTimer);
      this.refreshTokenTimer = null;
    }

    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }

    // Clear stored data
    localStorage.remove(this.config.tokenKey!);
    localStorage.remove(this.config.refreshTokenKey!);
    localStorage.remove(this.config.userKey!);
    localStorage.remove(this.config.sessionKey!);

    // Clear session
    if (this.currentSession) {
      this.activeSessions.delete(this.currentSession.id);
    }

    this.currentUser = null;
    this.currentSession = null;

    // Clear auth headers
    this.clearAuthHeaders();
  }

  private setAuthHeaders(token: string): void {
    // Set default headers for fetch
    (window as any).__authToken = token;
  }

  private clearAuthHeaders(): void {
    delete (window as any).__authToken;
  }

  private async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await this.apiRequest('/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.success;
    } catch (error) {
      return false;
    }
  }

  private getDeviceId(): string {
    let deviceId = localStorage.get('device_id');
    if (!deviceId) {
      deviceId = generateId();
      localStorage.set('device_id', deviceId);
    }
    return deviceId;
  }

  private getDeviceName(): string {
    const ua = navigator.userAgent;
    const browser = this.getBrowserName();
    const os = this.getOSName();
    return `${browser} on ${os}`;
  }

  private getBrowserName(): string {
    const ua = navigator.userAgent;
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    if (ua.indexOf('Edge') > -1) return 'Edge';
    if (ua.indexOf('Opera') > -1) return 'Opera';
    return 'Unknown Browser';
  }

  private getOSName(): string {
    const ua = navigator.userAgent;
    if (ua.indexOf('Win') > -1) return 'Windows';
    if (ua.indexOf('Mac') > -1) return 'macOS';
    if (ua.indexOf('Linux') > -1) return 'Linux';
    if (ua.indexOf('Android') > -1) return 'Android';
    if (ua.indexOf('iOS') > -1) return 'iOS';
    return 'Unknown OS';
  }

  private getIpAddress(): string {
    // This would typically be provided by the server
    return 'unknown';
  }

  private async getLocation(): Promise<any> {
    try {
      return new Promise((resolve) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            () => resolve(null),
            { timeout: 5000 }
          );
        } else {
          resolve(null);
        }
      });
    } catch (error) {
      return null;
    }
  }

  private isBiometricSupported(type: BiometricOptions['type']): boolean {
    // Check WebAuthn support
    if (type === 'fingerprint' || type === 'face') {
      return 'credentials' in navigator && 'create' in navigator.credentials;
    }
    return false;
  }

  private async captureBiometric(type: BiometricOptions['type']): Promise<any> {
    if (type === 'fingerprint' || type === 'face') {
      // Use WebAuthn API
      try {
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: { name: APP_NAME },
            user: {
              id: new TextEncoder().encode(this.currentUser?.id || ''),
              name: this.currentUser?.email || '',
              displayName: this.currentUser?.name || ''
            },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              userVerification: 'required'
            },
            timeout: 60000,
            attestation: 'direct'
          }
        } as any);

        return credential;
      } catch (error) {
        throw new Error('Biometric capture failed');
      }
    }

    throw new Error('Unsupported biometric type');
  }

  // Event Handlers

  private handleStorageChange(event: StorageEvent): void {
    if (event.key === this.config.tokenKey && !event.newValue) {
      // Token was removed (logout in another tab)
      this.clearSession();
      this.emit('logout');
    } else if (event.key === this.config.userKey && event.newValue) {
      // User was updated
      try {
        this.currentUser = JSON.parse(event.newValue);
        this.emit('profileUpdated', this.currentUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }

  private handleOnline(): void {
    this.emit('online');
    // Try to sync pending operations
    this.syncPendingOperations();
  }

  private handleOffline(): void {
    this.emit('offline');
  }

  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      // Check token expiry when tab becomes visible
      this.checkTokenExpiry();
      this.resetSessionTimer();
    }
  }

  private handleUserActivity(): void {
    if (this.currentSession) {
      this.currentSession.lastActivity = new Date();
      this.resetSessionTimer();
    }
  }

  private handleSessionTimeout(): void {
    this.logSecurityEvent('session_timeout', 'Session timed out due to inactivity', 'medium');
    this.logout();
    this.emit('sessionTimeout');
  }

  private async syncPendingOperations(): Promise<void> {
    // Implement sync logic for offline operations
  }

  // API Request Helper

  private async apiRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.config.apiUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: error.message || 'API request failed'
      };
    }
  }

  // Event Emitter

  private emit(event: string, data?: any): void {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(listener => listener(data));
  }

  public on(event: string, listener: Function): () => void {
    const listeners = this.listeners.get(event) || [];
    listeners.push(listener);
    this.listeners.set(event, listeners);

    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  public off(event: string, listener: Function): void {
    const listeners = this.listeners.get(event) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  // Cleanup

  public destroy(): void {
    // Clear timers
    if (this.refreshTokenTimer) {
      clearInterval(this.refreshTokenTimer);
    }
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }

    // Remove event listeners
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Clear data
    this.listeners.clear();
    this.loginAttempts.clear();
    this.activeSessions.clear();
    this.securityLogs = [];
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export class for testing
export { AuthService };

// Export types
export type {
  AuthConfig,
  LoginOptions,
  RegisterOptions,
  PasswordResetOptions,
  TwoFactorOptions,
  OAuthOptions,
  BiometricOptions,
  SessionInfo,
  LoginAttempt,
  SecurityLog
};