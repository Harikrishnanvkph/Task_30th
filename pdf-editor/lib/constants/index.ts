// Application Constants
export const APP_NAME = 'PDF Editor Pro';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Professional PDF Editing Solution';

// API Endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const API_TIMEOUT = 30000;
export const API_RETRY_ATTEMPTS = 3;

// File Constants
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_FILE_SIZE_FREE = 10 * 1024 * 1024; // 10MB for free users
export const ALLOWED_FILE_TYPES = ['application/pdf'];
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
export const SUPPORTED_EXPORT_FORMATS = ['pdf', 'png', 'jpg', 'svg'];

// Page Constants
export const DEFAULT_PAGE_WIDTH = 595; // A4 width in points
export const DEFAULT_PAGE_HEIGHT = 842; // A4 height in points
export const MAX_PAGES = 1000;
export const MAX_PAGES_FREE = 100;
export const THUMBNAIL_WIDTH = 150;
export const THUMBNAIL_HEIGHT = 200;
export const PAGE_MARGIN = 20;

// Zoom Constants
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 5;
export const DEFAULT_ZOOM = 1;
export const ZOOM_STEP = 0.25;
export const FIT_TO_WIDTH = -1;
export const FIT_TO_PAGE = -2;
export const ZOOM_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 5];

// Tool Constants
export const DEFAULT_TOOL = 'select';
export const DEFAULT_COLOR = '#000000';
export const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_FONT_SIZE = 14;
export const DEFAULT_FONT_FAMILY = 'Arial';
export const DEFAULT_LINE_HEIGHT = 1.2;
export const DEFAULT_OPACITY = 1;

// Drawing Constants
export const MIN_STROKE_WIDTH = 0.5;
export const MAX_STROKE_WIDTH = 50;
export const STROKE_WIDTH_STEP = 0.5;
export const ERASER_SIZES = [5, 10, 20, 40, 60];

// Text Constants
export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 144;
export const FONT_SIZE_STEP = 1;
export const FONT_FAMILIES = [
  'Arial',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Comic Sans MS',
  'Impact',
  'Trebuchet MS',
  'Helvetica',
  'Palatino',
  'Garamond',
  'Bookman',
  'Avant Garde',
];

// Color Constants
export const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#800000', '#008000',
  '#000080', '#808000', '#800080', '#008080', '#C0C0C0',
  '#808080', '#FFA500', '#A52A2A', '#800080', '#FFC0CB',
];

export const HIGHLIGHT_COLORS = [
  '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFA500',
  '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C',
];

// Annotation Constants
export const ANNOTATION_TYPES = {
  HIGHLIGHT: 'highlight',
  UNDERLINE: 'underline',
  STRIKETHROUGH: 'strikethrough',
  NOTE: 'note',
  FREETEXT: 'freetext',
  INK: 'ink',
  SQUARE: 'square',
  CIRCLE: 'circle',
  LINE: 'line',
  ARROW: 'arrow',
  STAMP: 'stamp',
} as const;

// Form Field Constants
export const FORM_FIELD_TYPES = {
  TEXT: 'text',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  DROPDOWN: 'dropdown',
  SIGNATURE: 'signature',
  DATE: 'date',
  NUMBER: 'number',
  EMAIL: 'email',
  PHONE: 'phone',
} as const;

// Signature Constants
export const SIGNATURE_TYPES = {
  DRAW: 'drawn',
  TYPE: 'typed',
  UPLOAD: 'uploaded',
  DIGITAL: 'digital',
} as const;

export const SIGNATURE_FONTS = [
  'Dancing Script',
  'Great Vibes',
  'Pacifico',
  'Satisfy',
  'Kaushan Script',
  'Allura',
  'Sacramento',
];

// Watermark Constants
export const WATERMARK_POSITIONS = {
  CENTER: 'center',
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  MIDDLE_LEFT: 'middle-left',
  MIDDLE_RIGHT: 'middle-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right',
  DIAGONAL: 'diagonal',
} as const;

export const DEFAULT_WATERMARK_OPACITY = 0.3;
export const DEFAULT_WATERMARK_ROTATION = 45;

// History Constants
export const MAX_HISTORY_SIZE = 100;
export const MAX_HISTORY_SIZE_FREE = 20;
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
export const DEBOUNCE_DELAY = 300;

// Grid and Snap Constants
export const DEFAULT_GRID_SIZE = 10;
export const MIN_GRID_SIZE = 5;
export const MAX_GRID_SIZE = 100;
export const GRID_SIZE_STEP = 5;
export const DEFAULT_SNAP_DISTANCE = 5;
export const RULER_HEIGHT = 20;
export const GUIDE_COLOR = '#4A90E2';

// Storage Constants
export const LOCAL_STORAGE_PREFIX = 'pdf_editor_';
export const SESSION_STORAGE_PREFIX = 'pdf_editor_session_';
export const INDEXED_DB_NAME = 'PDFEditorDB';
export const INDEXED_DB_VERSION = 1;
export const CACHE_DURATION = 3600000; // 1 hour

// Authentication Constants
export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'user_data';
export const SESSION_TIMEOUT = 3600000; // 1 hour
export const REFRESH_THRESHOLD = 300000; // 5 minutes

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      'Edit up to 3 PDFs per day',
      'Max 10MB file size',
      'Basic editing tools',
      'Watermark on exports',
    ],
    limits: {
      dailyEdits: 3,
      maxFileSize: 10 * 1024 * 1024,
      maxPages: 10,
      watermark: true,
    },
  },
  BASIC: {
    name: 'Basic',
    price: 9.99,
    features: [
      'Unlimited PDF editing',
      'Max 50MB file size',
      'All editing tools',
      'No watermark',
      'Priority support',
    ],
    limits: {
      dailyEdits: -1,
      maxFileSize: 50 * 1024 * 1024,
      maxPages: 100,
      watermark: false,
    },
  },
  PRO: {
    name: 'Professional',
    price: 19.99,
    features: [
      'Unlimited PDF editing',
      'Max 100MB file size',
      'Advanced features',
      'OCR support',
      'Batch processing',
      'API access',
      'Priority support',
    ],
    limits: {
      dailyEdits: -1,
      maxFileSize: 100 * 1024 * 1024,
      maxPages: 500,
      watermark: false,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Unlimited everything',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'On-premise option',
      'Custom branding',
    ],
    limits: {
      dailyEdits: -1,
      maxFileSize: -1,
      maxPages: -1,
      watermark: false,
    },
  },
} as const;

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  // File operations
  NEW_FILE: ['ctrl+n', 'cmd+n'],
  OPEN_FILE: ['ctrl+o', 'cmd+o'],
  SAVE_FILE: ['ctrl+s', 'cmd+s'],
  SAVE_AS: ['ctrl+shift+s', 'cmd+shift+s'],
  EXPORT: ['ctrl+e', 'cmd+e'],
  PRINT: ['ctrl+p', 'cmd+p'],
  
  // Edit operations
  UNDO: ['ctrl+z', 'cmd+z'],
  REDO: ['ctrl+y', 'cmd+y', 'ctrl+shift+z', 'cmd+shift+z'],
  CUT: ['ctrl+x', 'cmd+x'],
  COPY: ['ctrl+c', 'cmd+c'],
  PASTE: ['ctrl+v', 'cmd+v'],
  DELETE: ['delete', 'backspace'],
  SELECT_ALL: ['ctrl+a', 'cmd+a'],
  DESELECT: ['escape'],
  
  // View operations
  ZOOM_IN: ['ctrl++', 'cmd++', 'ctrl+=', 'cmd+='],
  ZOOM_OUT: ['ctrl+-', 'cmd+-'],
  ZOOM_RESET: ['ctrl+0', 'cmd+0'],
  FIT_WIDTH: ['ctrl+1', 'cmd+1'],
  FIT_PAGE: ['ctrl+2', 'cmd+2'],
  FULLSCREEN: ['f11'],
  
  // Navigation
  NEXT_PAGE: ['pagedown', 'right'],
  PREV_PAGE: ['pageup', 'left'],
  FIRST_PAGE: ['home', 'ctrl+home', 'cmd+home'],
  LAST_PAGE: ['end', 'ctrl+end', 'cmd+end'],
  GO_TO_PAGE: ['ctrl+g', 'cmd+g'],
  
  // Tools
  SELECT_TOOL: ['v'],
  TEXT_TOOL: ['t'],
  DRAW_TOOL: ['d'],
  SHAPE_TOOL: ['s'],
  HIGHLIGHT_TOOL: ['h'],
  ERASER_TOOL: ['e'],
  
  // Formatting
  BOLD: ['ctrl+b', 'cmd+b'],
  ITALIC: ['ctrl+i', 'cmd+i'],
  UNDERLINE: ['ctrl+u', 'cmd+u'],
  
  // Other
  SEARCH: ['ctrl+f', 'cmd+f'],
  REPLACE: ['ctrl+h', 'cmd+h'],
  HELP: ['f1'],
  PREFERENCES: ['ctrl+,', 'cmd+,'],
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a PDF file',
  UPLOAD_FAILED: 'Failed to upload file. Please try again',
  SAVE_FAILED: 'Failed to save changes. Please try again',
  EXPORT_FAILED: 'Failed to export file. Please try again',
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SESSION_EXPIRED: 'Your session has expired. Please login again',
  QUOTA_EXCEEDED: 'You have exceeded your usage quota',
  FEATURE_LOCKED: 'This feature is not available in your plan',
  INVALID_INPUT: 'Invalid input. Please check and try again',
  OPERATION_FAILED: 'Operation failed. Please try again',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'Server error. Please try again later',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully',
  CHANGES_SAVED: 'Changes saved successfully',
  FILE_EXPORTED: 'File exported successfully',
  FILE_DELETED: 'File deleted successfully',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard',
  SETTINGS_UPDATED: 'Settings updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  SUBSCRIPTION_UPDATED: 'Subscription updated successfully',
  SHARED_SUCCESSFULLY: 'File shared successfully',
} as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\s\-\+\(\)]+$/,
  URL: /^https?:\/\/.+/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  NUMBER: /^\d+$/,
  DECIMAL: /^\d+\.?\d*$/,
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Breakpoints for Responsive Design
export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Paper Sizes (in points)
export const PAPER_SIZES = {
  A3: { width: 842, height: 1191 },
  A4: { width: 595, height: 842 },
  A5: { width: 420, height: 595 },
  LETTER: { width: 612, height: 792 },
  LEGAL: { width: 612, height: 1008 },
  TABLOID: { width: 792, height: 1224 },
} as const;

// Measurement Units Conversion
export const UNITS_TO_POINTS = {
  px: 1,
  pt: 1,
  mm: 2.834645669,
  cm: 28.34645669,
  in: 72,
} as const;

// OCR Languages
export const OCR_LANGUAGES = {
  eng: 'English',
  spa: 'Spanish',
  fra: 'French',
  deu: 'German',
  ita: 'Italian',
  por: 'Portuguese',
  rus: 'Russian',
  jpn: 'Japanese',
  kor: 'Korean',
  chi_sim: 'Chinese (Simplified)',
  chi_tra: 'Chinese (Traditional)',
  ara: 'Arabic',
  hin: 'Hindi',
} as const;

// Export Quality Presets
export const EXPORT_QUALITY = {
  LOW: { dpi: 72, quality: 0.6 },
  MEDIUM: { dpi: 150, quality: 0.8 },
  HIGH: { dpi: 300, quality: 0.95 },
  PRINT: { dpi: 600, quality: 1 },
} as const;

// Collaboration Colors
export const COLLABORATION_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FECA57', '#DA77F2', '#748FFC', '#66D9E8',
  '#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7',
];

// Template Categories
export const TEMPLATE_CATEGORIES = {
  BUSINESS: 'Business',
  EDUCATION: 'Education',
  LEGAL: 'Legal',
  MEDICAL: 'Medical',
  PERSONAL: 'Personal',
  CREATIVE: 'Creative',
  GOVERNMENT: 'Government',
  REAL_ESTATE: 'Real Estate',
  FINANCE: 'Finance',
  OTHER: 'Other',
} as const;

// Plugin Events
export const PLUGIN_EVENTS = {
  BEFORE_LOAD: 'beforeLoad',
  AFTER_LOAD: 'afterLoad',
  BEFORE_SAVE: 'beforeSave',
  AFTER_SAVE: 'afterSave',
  BEFORE_EXPORT: 'beforeExport',
  AFTER_EXPORT: 'afterExport',
  PAGE_CHANGE: 'pageChange',
  SELECTION_CHANGE: 'selectionChange',
  TOOL_CHANGE: 'toolChange',
  ELEMENT_ADD: 'elementAdd',
  ELEMENT_UPDATE: 'elementUpdate',
  ELEMENT_DELETE: 'elementDelete',
} as const;

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  LOAD_TIME: 3000, // 3 seconds
  RENDER_TIME: 100, // 100ms
  INTERACTION_TIME: 50, // 50ms
  MEMORY_WARNING: 500 * 1024 * 1024, // 500MB
  MEMORY_CRITICAL: 1024 * 1024 * 1024, // 1GB
  FPS_WARNING: 30,
  FPS_CRITICAL: 15,
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  API_CALLS_PER_MINUTE: 60,
  UPLOADS_PER_HOUR: 20,
  EXPORTS_PER_DAY: 100,
  SHARES_PER_DAY: 50,
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  RECENT_FILES: 'recent_files',
  TEMPLATES: 'templates',
  FONTS: 'fonts',
  THUMBNAILS: 'thumbnails',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  OCR_ENABLED: true,
  COLLABORATION_ENABLED: true,
  PLUGINS_ENABLED: false,
  ADVANCED_SEARCH: true,
  BATCH_PROCESSING: true,
  CLOUD_STORAGE: true,
  DIGITAL_SIGNATURES: true,
  FORM_BUILDER: true,
  TEMPLATES: true,
  WATERMARKS: true,
} as const;