// Core PDF Types
export interface PDFDocument {
  id: string;
  name: string;
  url?: string;
  file?: File;
  pages: PDFPage[];
  metadata: PDFMetadata;
  annotations: Annotation[];
  forms: FormField[];
  signatures: Signature[];
  watermarks: Watermark[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  isModified: boolean;
  originalSize: number;
  currentSize: number;
  version: string;
}

export interface PDFPage {
  id: string;
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  annotations: Annotation[];
  forms: FormField[];
  text: TextElement[];
  images: ImageElement[];
  drawings: DrawingElement[];
  isVisible: boolean;
  isLocked: boolean;
  thumbnail?: string;
}

export interface PDFMetadata {
  title: string;
  author: string;
  subject: string;
  keywords: string[];
  creator: string;
  producer: string;
  creationDate: Date;
  modificationDate: Date;
  pageCount: number;
  fileSize: number;
  encrypted: boolean;
  permissions: PDFPermissions;
}

export interface PDFPermissions {
  printing: boolean;
  modifying: boolean;
  copying: boolean;
  annotating: boolean;
  fillingForms: boolean;
  contentAccessibility: boolean;
  documentAssembly: boolean;
  highQualityPrinting: boolean;
}

// Annotation Types
export interface Annotation {
  id: string;
  type: AnnotationType;
  pageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  content?: string;
  author?: string;
  createdAt: Date;
  modifiedAt: Date;
  replies?: AnnotationReply[];
  isLocked: boolean;
  isHidden: boolean;
  zIndex: number;
}

export type AnnotationType = 
  | 'highlight'
  | 'underline'
  | 'strikethrough'
  | 'squiggly'
  | 'note'
  | 'freetext'
  | 'ink'
  | 'square'
  | 'circle'
  | 'line'
  | 'polygon'
  | 'polyline'
  | 'stamp'
  | 'caret'
  | 'fileattachment'
  | 'sound'
  | 'movie'
  | 'widget'
  | 'screen'
  | 'printermark'
  | 'trapnet'
  | 'watermark'
  | '3d'
  | 'redact';

export interface AnnotationReply {
  id: string;
  annotationId: string;
  author: string;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
}

// Form Field Types
export interface FormField {
  id: string;
  type: FormFieldType;
  name: string;
  pageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: any;
  defaultValue: any;
  options?: FormFieldOption[];
  required: boolean;
  readOnly: boolean;
  maxLength?: number;
  multiline?: boolean;
  password?: boolean;
  fileSelect?: boolean;
  spellCheck?: boolean;
  scrollable?: boolean;
  validation?: FormFieldValidation;
  tooltip?: string;
  tabIndex?: number;
  fieldFlags?: number;
  borderStyle?: BorderStyle;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: TextAlign;
  richText?: boolean;
}

export type FormFieldType = 
  | 'text'
  | 'checkbox'
  | 'radio'
  | 'dropdown'
  | 'listbox'
  | 'button'
  | 'signature'
  | 'date'
  | 'number'
  | 'email'
  | 'phone'
  | 'url'
  | 'currency'
  | 'percentage'
  | 'time'
  | 'file';

export interface FormFieldOption {
  label: string;
  value: string;
  selected?: boolean;
}

export interface FormFieldValidation {
  pattern?: string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface BorderStyle {
  width: number;
  style: 'solid' | 'dashed' | 'beveled' | 'inset' | 'underline';
  color: string;
  radius?: number;
}

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

// Text Element Types
export interface TextElement {
  id: string;
  pageId: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: FontWeight;
  fontStyle: FontStyle;
  textDecoration: TextDecoration;
  color: string;
  backgroundColor?: string;
  opacity: number;
  rotation: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: TextAlign;
  verticalAlign: VerticalAlign;
  isEditable: boolean;
  isSelectable: boolean;
  zIndex: number;
}

export type FontWeight = 'normal' | 'bold' | 'lighter' | 'bolder' | number;
export type FontStyle = 'normal' | 'italic' | 'oblique';
export type TextDecoration = 'none' | 'underline' | 'overline' | 'line-through';
export type VerticalAlign = 'top' | 'middle' | 'bottom';

// Image Element Types
export interface ImageElement {
  id: string;
  pageId: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  filters: ImageFilters;
  cropArea?: CropArea;
  isLocked: boolean;
  preserveAspectRatio: boolean;
  zIndex: number;
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  grayscale: number;
  sepia: number;
  invert: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Drawing Element Types
export interface DrawingElement {
  id: string;
  pageId: string;
  type: DrawingType;
  points: Point[];
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  fillColor?: string;
  opacity: number;
  lineCap: LineCap;
  lineJoin: LineJoin;
  closed: boolean;
  smooth: boolean;
  tension?: number;
  isLocked: boolean;
  zIndex: number;
}

export type DrawingType = 
  | 'pen'
  | 'pencil'
  | 'brush'
  | 'line'
  | 'arrow'
  | 'rectangle'
  | 'circle'
  | 'ellipse'
  | 'polygon'
  | 'star'
  | 'triangle'
  | 'diamond'
  | 'hexagon'
  | 'cloud'
  | 'callout';

export type StrokeStyle = 'solid' | 'dashed' | 'dotted' | 'dashdot';
export type LineCap = 'butt' | 'round' | 'square';
export type LineJoin = 'miter' | 'round' | 'bevel';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

// Signature Types
export interface Signature {
  id: string;
  type: SignatureType;
  pageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: string; // Base64 or SVG data
  author: string;
  timestamp: Date;
  verified: boolean;
  certificate?: SignatureCertificate;
  isLocked: boolean;
  zIndex: number;
}

export type SignatureType = 'drawn' | 'typed' | 'uploaded' | 'digital';

export interface SignatureCertificate {
  issuer: string;
  subject: string;
  serialNumber: string;
  validFrom: Date;
  validTo: Date;
  fingerprint: string;
  algorithm: string;
  publicKey: string;
}

// Watermark Types
export interface Watermark {
  id: string;
  type: WatermarkType;
  content: string;
  pages: number[] | 'all' | 'odd' | 'even';
  position: WatermarkPosition;
  rotation: number;
  opacity: number;
  color: string;
  fontSize?: number;
  fontFamily?: string;
  scale?: number;
  xOffset: number;
  yOffset: number;
  behind: boolean;
}

export type WatermarkType = 'text' | 'image';
export type WatermarkPosition = 
  | 'center'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'diagonal';

// Tool Types
export interface Tool {
  id: string;
  name: string;
  icon: string;
  category: ToolCategory;
  shortcut?: string;
  isActive: boolean;
  isEnabled: boolean;
  settings?: ToolSettings;
}

export type ToolCategory = 
  | 'select'
  | 'text'
  | 'draw'
  | 'shape'
  | 'annotation'
  | 'form'
  | 'image'
  | 'signature'
  | 'measure'
  | 'navigation';

export interface ToolSettings {
  [key: string]: any;
}

// Editor State Types
export interface EditorState {
  currentTool: Tool | null;
  selectedElements: string[];
  clipboard: ClipboardData | null;
  history: HistoryState;
  zoom: number;
  currentPage: number;
  viewMode: ViewMode;
  gridEnabled: boolean;
  snapToGrid: boolean;
  rulersEnabled: boolean;
  guidesEnabled: boolean;
  guides: Guide[];
  isDirty: boolean;
  isSaving: boolean;
  isLoading: boolean;
}

export type ViewMode = 
  | 'single'
  | 'continuous'
  | 'two-page'
  | 'two-page-continuous'
  | 'thumbnail'
  | 'outline';

export interface ClipboardData {
  type: 'elements' | 'pages' | 'text' | 'image';
  data: any;
  timestamp: Date;
}

export interface HistoryState {
  past: EditorAction[];
  present: EditorAction | null;
  future: EditorAction[];
  maxSize: number;
}

export interface EditorAction {
  id: string;
  type: ActionType;
  timestamp: Date;
  data: any;
  description: string;
}

export type ActionType = 
  | 'add'
  | 'delete'
  | 'modify'
  | 'move'
  | 'resize'
  | 'rotate'
  | 'reorder'
  | 'group'
  | 'ungroup'
  | 'lock'
  | 'unlock'
  | 'hide'
  | 'show';

export interface Guide {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number;
  isLocked: boolean;
  color: string;
}

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  subscription: SubscriptionPlan;
  preferences: UserPreferences;
  createdAt: Date;
  lastLogin: Date;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

export type UserRole = 'user' | 'premium' | 'admin' | 'superadmin';

export interface SubscriptionPlan {
  type: 'free' | 'basic' | 'pro' | 'enterprise';
  startDate: Date;
  endDate?: Date;
  features: string[];
  limits: SubscriptionLimits;
}

export interface SubscriptionLimits {
  maxFileSize: number;
  maxPages: number;
  maxDocuments: number;
  storageQuota: number;
  monthlyExports: number;
  watermarkEnabled: boolean;
  advancedFeatures: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  defaultTool: string;
  autoSave: boolean;
  autoSaveInterval: number;
  keyboardShortcuts: KeyboardShortcut[];
  recentColors: string[];
  recentFonts: string[];
  defaultExportFormat: ExportFormat;
  measurementUnit: MeasurementUnit;
  gridSize: number;
  snapDistance: number;
}

export interface KeyboardShortcut {
  action: string;
  keys: string[];
  enabled: boolean;
}

export type ExportFormat = 'pdf' | 'png' | 'jpg' | 'svg' | 'docx' | 'pptx';
export type MeasurementUnit = 'px' | 'pt' | 'mm' | 'cm' | 'in';

// File Management Types
export interface PDFFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnailUrl?: string;
  userId: string;
  folderId?: string;
  tags: string[];
  isShared: boolean;
  sharedWith: SharedUser[];
  permissions: FilePermissions;
  version: number;
  versions: FileVersion[];
  createdAt: Date;
  modifiedAt: Date;
  lastAccessedAt: Date;
  isStarred: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
}

export interface SharedUser {
  userId: string;
  email: string;
  permissions: FilePermissions;
  sharedAt: Date;
  expiresAt?: Date;
}

export interface FilePermissions {
  read: boolean;
  write: boolean;
  delete: boolean;
  share: boolean;
  download: boolean;
  print: boolean;
}

export interface FileVersion {
  id: string;
  version: number;
  size: number;
  url: string;
  changes: string;
  createdBy: string;
  createdAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  userId: string;
  files: string[];
  subfolders: string[];
  color?: string;
  icon?: string;
  isShared: boolean;
  permissions: FilePermissions;
  createdAt: Date;
  modifiedAt: Date;
}

// Export and Import Types
export interface ExportOptions {
  format: ExportFormat;
  quality: number;
  pages: number[] | 'all' | 'current' | 'range';
  pageRange?: { start: number; end: number };
  includeAnnotations: boolean;
  includeForms: boolean;
  includeWatermark: boolean;
  flatten: boolean;
  compress: boolean;
  password?: string;
  permissions?: PDFPermissions;
  metadata?: Partial<PDFMetadata>;
  resolution?: number;
  colorSpace?: 'rgb' | 'cmyk' | 'grayscale';
  embedFonts: boolean;
  optimizeForWeb: boolean;
}

export interface ImportOptions {
  mergeWithExisting: boolean;
  insertAtPage?: number;
  extractText: boolean;
  extractImages: boolean;
  preserveFormatting: boolean;
  ocrEnabled: boolean;
  ocrLanguage?: string;
  removePassword?: string;
}

// Collaboration Types
export interface CollaborationSession {
  id: string;
  documentId: string;
  hostId: string;
  participants: Participant[];
  startedAt: Date;
  endedAt?: Date;
  isActive: boolean;
  settings: CollaborationSettings;
}

export interface Participant {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: CursorPosition;
  selection?: Selection;
  isActive: boolean;
  joinedAt: Date;
  leftAt?: Date;
  permissions: CollaborationPermissions;
}

export interface CursorPosition {
  x: number;
  y: number;
  pageId: string;
}

export interface Selection {
  pageId: string;
  elementIds: string[];
}

export interface CollaborationSettings {
  allowChat: boolean;
  allowVoice: boolean;
  allowVideo: boolean;
  recordSession: boolean;
  requireApproval: boolean;
  maxParticipants: number;
}

export interface CollaborationPermissions {
  canEdit: boolean;
  canComment: boolean;
  canShare: boolean;
  canExport: boolean;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail: string;
  previewUrl: string;
  pages: number;
  size: number;
  downloads: number;
  rating: number;
  tags: string[];
  isPremium: boolean;
  price?: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateCategory = 
  | 'business'
  | 'education'
  | 'legal'
  | 'medical'
  | 'personal'
  | 'creative'
  | 'government'
  | 'real-estate'
  | 'finance'
  | 'other';

// Plugin Types
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon: string;
  enabled: boolean;
  settings: PluginSettings;
  permissions: PluginPermissions;
  hooks: PluginHook[];
  commands: PluginCommand[];
}

export interface PluginSettings {
  [key: string]: any;
}

export interface PluginPermissions {
  accessFiles: boolean;
  modifyDocument: boolean;
  accessNetwork: boolean;
  accessStorage: boolean;
}

export interface PluginHook {
  event: string;
  handler: string;
}

export interface PluginCommand {
  id: string;
  name: string;
  description: string;
  shortcut?: string;
  handler: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  stack?: string;
}

// Event Types
export interface EditorEvent {
  type: EditorEventType;
  data: any;
  timestamp: Date;
  userId?: string;
}

export type EditorEventType = 
  | 'document:loaded'
  | 'document:saved'
  | 'document:exported'
  | 'page:added'
  | 'page:deleted'
  | 'page:reordered'
  | 'element:added'
  | 'element:modified'
  | 'element:deleted'
  | 'tool:changed'
  | 'zoom:changed'
  | 'page:changed'
  | 'selection:changed'
  | 'history:undo'
  | 'history:redo';

// Performance Types
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  cpuUsage: number;
  fps: number;
  networkLatency: number;
}

// Analytics Types
export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  actions?: NotificationAction[];
  timestamp: Date;
  read: boolean;
  priority: NotificationPriority;
}

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'collaboration'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationAction {
  label: string;
  action: string;
  style?: 'default' | 'primary' | 'danger';
}

// Search Types
export interface SearchResult {
  id: string;
  type: 'text' | 'annotation' | 'form' | 'image';
  pageNumber: number;
  context: string;
  highlight: { start: number; end: number };
  score: number;
}

export interface SearchOptions {
  query: string;
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
  searchIn: ('text' | 'annotations' | 'forms' | 'metadata')[];
  pageRange?: { start: number; end: number };
}

// Print Types
export interface PrintOptions {
  pages: number[] | 'all' | 'current' | 'range';
  pageRange?: { start: number; end: number };
  orientation: 'portrait' | 'landscape';
  paperSize: PaperSize;
  margins: Margins;
  scale: number | 'fit' | 'actual';
  copies: number;
  collate: boolean;
  duplex: boolean;
  color: boolean;
  quality: 'draft' | 'normal' | 'high';
  includeAnnotations: boolean;
  includeForms: boolean;
  includeComments: boolean;
}

export type PaperSize = 
  | 'a4'
  | 'a3'
  | 'letter'
  | 'legal'
  | 'tabloid'
  | 'custom';

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
  unit: MeasurementUnit;
}

// Accessibility Types
export interface AccessibilityOptions {
  screenReaderEnabled: boolean;
  highContrast: boolean;
  keyboardNavigation: boolean;
  focusIndicator: boolean;
  reduceMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  cursorSize: 'small' | 'medium' | 'large';
  speechRate: number;
  announcements: boolean;
}

// Security Types
export interface SecuritySettings {
  encryption: EncryptionSettings;
  authentication: AuthenticationSettings;
  permissions: SecurityPermissions;
  audit: AuditSettings;
}

export interface EncryptionSettings {
  algorithm: 'AES-128' | 'AES-256' | 'RC4-128' | 'RC4-40';
  userPassword?: string;
  ownerPassword?: string;
  encryptMetadata: boolean;
}

export interface AuthenticationSettings {
  requirePassword: boolean;
  requireTwoFactor: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordPolicy: PasswordPolicy;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expirationDays: number;
  preventReuse: number;
}

export interface SecurityPermissions {
  allowPrinting: boolean;
  allowModifying: boolean;
  allowCopying: boolean;
  allowAnnotating: boolean;
  allowFormFilling: boolean;
  allowScreenReaders: boolean;
  allowAssembly: boolean;
  allowHighQualityPrinting: boolean;
}

export interface AuditSettings {
  enabled: boolean;
  logLevel: 'error' | 'warning' | 'info' | 'debug';
  retentionDays: number;
  events: string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: AppError;
  metadata?: ResponseMetadata;
}

export interface ResponseMetadata {
  timestamp: Date;
  version: string;
  requestId: string;
  duration: number;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Configuration Types
export interface AppConfig {
  api: ApiConfig;
  storage: StorageConfig;
  features: FeatureFlags;
  limits: AppLimits;
  ui: UIConfig;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

export interface StorageConfig {
  provider: 'local' | 's3' | 'azure' | 'gcp';
  bucket?: string;
  region?: string;
  credentials?: any;
  maxFileSize: number;
  allowedTypes: string[];
}

export interface FeatureFlags {
  [key: string]: boolean;
}

export interface AppLimits {
  maxFileSize: number;
  maxPages: number;
  maxUndoHistory: number;
  maxZoom: number;
  minZoom: number;
  maxElements: number;
  maxLayers: number;
}

export interface UIConfig {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontFamily: string;
  borderRadius: number;
  animations: boolean;
  compactMode: boolean;
}