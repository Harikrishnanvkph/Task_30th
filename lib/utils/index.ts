import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { 
  UNITS_TO_POINTS, 
  VALIDATION_PATTERNS,
  LOCAL_STORAGE_PREFIX,
  SESSION_STORAGE_PREFIX,
  CACHE_DURATION
} from '@/lib/constants/index';

// Class name utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// UUID generation
export function generateId(): string {
  return uuidv4();
}

// Timestamp generation
export function generateTimestamp(): Date {
  return new Date();
}

// Deep clone utility
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) {
    const clonedArr: any[] = [];
    for (const item of obj) {
      clonedArr.push(deepClone(item));
    }
    return clonedArr as any;
  }
  if (obj instanceof Object) {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

// Deep merge utility
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as any, source[key] as any);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

// Check if value is an object
export function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Format date
export function formatDate(date: Date | string, format = 'full'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString();
    case 'long':
      return d.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'time':
      return d.toLocaleTimeString();
    case 'full':
    default:
      return d.toLocaleString();
  }
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(d, 'short');
}

// Validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // Basic validation - at least 8 characters
  return password.length >= 8;
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateCreditCard(cardNumber: string): boolean {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Check if it's a number and has valid length
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

export function validatePostalCode(postalCode: string, country: string = 'US'): boolean {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    UK: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    IT: /^\d{5}$/,
    ES: /^\d{5}$/,
    NL: /^\d{4}\s?[A-Z]{2}$/i,
    BE: /^\d{4}$/,
    AT: /^\d{4}$/,
    CH: /^\d{4}$/,
    AU: /^\d{4}$/,
    NZ: /^\d{4}$/,
    JP: /^\d{3}-?\d{4}$/,
    CN: /^\d{6}$/,
    IN: /^\d{6}$/,
    BR: /^\d{5}-?\d{3}$/,
    MX: /^\d{5}$/,
    RU: /^\d{6}$/,
    ZA: /^\d{4}$/
  };
  
  const pattern = patterns[country];
  return pattern ? pattern.test(postalCode) : true;
}

export function validateDate(date: string, format: string = 'YYYY-MM-DD'): boolean {
  const formats: Record<string, RegExp> = {
    'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
    'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
    'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
    'DD-MM-YYYY': /^\d{2}-\d{2}-\d{4}$/,
    'MM-DD-YYYY': /^\d{2}-\d{2}-\d{4}$/
  };
  
  const pattern = formats[format];
  if (!pattern || !pattern.test(date)) {
    return false;
  }
  
  // Additional validation for actual date
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
}

export function validateTime(time: string, format: string = '24'): boolean {
  const patterns: Record<string, RegExp> = {
    '24': /^([01]\d|2[0-3]):([0-5]\d)$/,
    '12': /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM|am|pm)$/
  };
  
  const pattern = patterns[format];
  return pattern ? pattern.test(time) : false;
}

export function validateIPAddress(ip: string): boolean {
  // IPv4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }
  
  // IPv6
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/;
  return ipv6Regex.test(ip);
}

export function validateMACAddress(mac: string): boolean {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function validateHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

export function validateUsername(username: string): boolean {
  // Alphanumeric, underscore, dash, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

export function validateSSN(ssn: string): boolean {
  // US Social Security Number
  const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/;
  return ssnRegex.test(ssn);
}

export function validateIBAN(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  
  // Check basic format
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleaned)) {
    return false;
  }
  
  // Check length for specific countries
  const lengths: Record<string, number> = {
    AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16,
    BG: 22, BH: 22, BR: 29, CH: 21, CR: 22, CY: 28,
    CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
    FI: 18, FO: 18, FR: 27, GB: 22, GE: 22, GI: 23,
    GL: 18, GR: 27, GT: 28, HR: 21, HU: 28, IE: 22,
    IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20,
    LB: 28, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27,
    MD: 24, ME: 22, MK: 19, MR: 27, MT: 31, MU: 30,
    NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25,
    QA: 29, RO: 24, RS: 22, SA: 24, SE: 24, SI: 19,
    SK: 24, SM: 27, TN: 24, TR: 26, AE: 23, XK: 20
  };
  
  const countryCode = cleaned.substring(0, 2);
  const expectedLength = lengths[countryCode];
  
  if (expectedLength && cleaned.length !== expectedLength) {
    return false;
  }
  
  // IBAN checksum validation
  const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, char => (char.charCodeAt(0) - 55).toString());
  const remainder = BigInt(numeric) % 97n;
  
  return remainder === 1n;
}

// Convert units to points
export function convertToPoints(value: number, unit: keyof typeof UNITS_TO_POINTS): number {
  return value * UNITS_TO_POINTS[unit];
}

// Convert points to units
export function convertFromPoints(value: number, unit: keyof typeof UNITS_TO_POINTS): number {
  return value / UNITS_TO_POINTS[unit];
}

// Convert RGB to Hex
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Convert Hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate contrast ratio
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Get luminance
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Linear interpolation
export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount;
}

// Map value from one range to another
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Round to decimal places
export function roundTo(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Get distance between two points
export function getDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Get angle between two points
export function getAngle(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

// Rotate point around center
export function rotatePoint(
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number
): { x: number; y: number } {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = cos * (x - cx) + sin * (y - cy) + cx;
  const ny = cos * (y - cy) - sin * (x - cx) + cy;
  return { x: nx, y: ny };
}

// Check if point is inside rectangle
export function isPointInRect(
  px: number,
  py: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

// Check if rectangles overlap
export function doRectsOverlap(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): boolean {
  return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
}

// Get bounding box of points
export function getBoundingBox(points: { x: number; y: number }[]): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  if (points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

// Smooth points for drawing
export function smoothPoints(
  points: { x: number; y: number }[],
  tension = 0.5
): { x: number; y: number }[] {
  if (points.length < 3) return points;
  
  const smoothed: { x: number; y: number }[] = [];
  
  for (let i = 0; i < points.length - 2; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i === points.length - 3 ? points[points.length - 1] : points[i + 2];
    
    for (let t = 0; t <= 1; t += 0.1) {
      const x = catmullRom(p0.x, p1.x, p2.x, p3.x, t, tension);
      const y = catmullRom(p0.y, p1.y, p2.y, p3.y, t, tension);
      smoothed.push({ x, y });
    }
  }
  
  return smoothed;
}

// Catmull-Rom spline interpolation
function catmullRom(
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number,
  tension: number
): number {
  const t2 = t * t;
  const t3 = t2 * t;
  
  const v0 = (p2 - p0) * tension;
  const v1 = (p3 - p1) * tension;
  
  return (
    p1 +
    v0 * t +
    (3 * (p2 - p1) - 2 * v0 - v1) * t2 +
    (2 * (p1 - p2) + v0 + v1) * t3
  );
}

// Simplify path (Douglas-Peucker algorithm)
export function simplifyPath(
  points: { x: number; y: number }[],
  tolerance = 1
): { x: number; y: number }[] {
  if (points.length <= 2) return points;
  
  const sqTolerance = tolerance * tolerance;
  
  function getSqDist(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy;
  }
  
  function getSqSegDist(
    p: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ): number {
    let x = p1.x;
    let y = p1.y;
    let dx = p2.x - x;
    let dy = p2.y - y;
    
    if (dx !== 0 || dy !== 0) {
      const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
      
      if (t > 1) {
        x = p2.x;
        y = p2.y;
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }
    
    dx = p.x - x;
    dy = p.y - y;
    
    return dx * dx + dy * dy;
  }
  
  function simplifyDPStep(
    points: { x: number; y: number }[],
    first: number,
    last: number,
    sqTolerance: number,
    simplified: { x: number; y: number }[]
  ): void {
    let maxSqDist = sqTolerance;
    let index = 0;
    
    for (let i = first + 1; i < last; i++) {
      const sqDist = getSqSegDist(points[i], points[first], points[last]);
      
      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }
    
    if (maxSqDist > sqTolerance) {
      if (index - first > 1) {
        simplifyDPStep(points, first, index, sqTolerance, simplified);
      }
      
      simplified.push(points[index]);
      
      if (last - index > 1) {
        simplifyDPStep(points, index, last, sqTolerance, simplified);
      }
    }
  }
  
  const simplified: { x: number; y: number }[] = [points[0]];
  simplifyDPStep(points, 0, points.length - 1, sqTolerance, simplified);
  simplified.push(points[points.length - 1]);
  
  return simplified;
}

// Local Storage utilities with prefix
export const localStorage = {
  getItem: (key: string): any => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(LOCAL_STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      const keys = Object.keys(window.localStorage);
      keys.forEach(key => {
        if (key.startsWith(LOCAL_STORAGE_PREFIX)) {
          window.localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Session Storage utilities with prefix
export const sessionStorage = {
  getItem: (key: string): any => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.sessionStorage.getItem(SESSION_STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to sessionStorage:', error);
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.removeItem(SESSION_STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      const keys = Object.keys(window.sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(SESSION_STORAGE_PREFIX)) {
          window.sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }
};

// Cache utilities
export class Cache<T> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map();
  private duration: number;
  
  constructor(duration = CACHE_DURATION) {
    this.duration = duration;
  }
  
  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.duration) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() - item.timestamp > this.duration) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
}

// Encryption utilities
export const crypto = {
  encrypt: (text: string, key: string): string => {
    return CryptoJS.AES.encrypt(text, key).toString();
  },
  
  decrypt: (ciphertext: string, key: string): string => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  },
  
  hash: (text: string): string => {
    return CryptoJS.SHA256(text).toString();
  },
  
  generateKey: (): string => {
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
  }
};

// Download file utility
export function downloadFile(data: Blob | string, filename: string, type?: string): void {
  const blob = typeof data === 'string' 
    ? new Blob([data], { type: type || 'text/plain' })
    : data;
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Copy to clipboard utility
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// Get file extension
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

// Get file name without extension
export function getFileNameWithoutExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
}

// Generate unique filename
export function generateUniqueFilename(originalName: string): string {
  const nameWithoutExt = getFileNameWithoutExtension(originalName);
  const extension = getFileExtension(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
}

// Check if browser supports feature
export function isFeatureSupported(feature: string): boolean {
  switch (feature) {
    case 'clipboard':
      return !!(navigator.clipboard && window.isSecureContext);
    case 'webgl':
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    case 'indexeddb':
      return 'indexedDB' in window;
    case 'localstorage':
      try {
        const test = 'test';
        window.localStorage.setItem(test, test);
        window.localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    case 'webworker':
      return 'Worker' in window;
    case 'serviceworker':
      return 'serviceWorker' in navigator;
    case 'webassembly':
      return 'WebAssembly' in window;
    default:
      return false;
  }
}

// Get browser info
export function getBrowserInfo(): {
  name: string;
  version: string;
  os: string;
  mobile: boolean;
} {
  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';
  
  if (userAgent.indexOf('Firefox') > -1) {
    name = 'Firefox';
    version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Chrome') > -1) {
    name = 'Chrome';
    version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Safari') > -1) {
    name = 'Safari';
    version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Edge') > -1) {
    name = 'Edge';
    version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
  }
  
  let os = 'Unknown';
  if (userAgent.indexOf('Windows') > -1) os = 'Windows';
  else if (userAgent.indexOf('Mac') > -1) os = 'MacOS';
  else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
  else if (userAgent.indexOf('Android') > -1) os = 'Android';
  else if (userAgent.indexOf('iOS') > -1) os = 'iOS';
  
  const mobile = /Mobile|Android|iPhone|iPad|iPod/.test(userAgent);
  
  return { name, version, os, mobile };
}

// Request animation frame with fallback
export const requestAnimationFrame = 
  (typeof window !== 'undefined' && window.requestAnimationFrame) ||
  ((callback: FrameRequestCallback) => setTimeout(callback, 16));

// Cancel animation frame with fallback
export const cancelAnimationFrame = 
  (typeof window !== 'undefined' && window.cancelAnimationFrame) ||
  ((id: number) => clearTimeout(id));

// Performance monitoring
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }
  
  measure(name: string, startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    if (!start) return 0;
    
    const end = endMark ? this.marks.get(endMark) : performance.now();
    if (!end) return 0;
    
    return end - start;
  }
  
  clear(): void {
    this.marks.clear();
  }
}

// Event emitter
export class EventEmitter<T extends Record<string, any>> {
  private events: Map<keyof T, Set<(data: any) => void>> = new Map();
  
  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);
  }
  
  off<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    this.events.get(event)?.delete(handler);
  }
  
  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.events.get(event)?.forEach(handler => handler(data));
  }
  
  once<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    const onceHandler = (data: T[K]) => {
      handler(data);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }
  
  clear(): void {
    this.events.clear();
  }
}

// Async queue for sequential processing
export class AsyncQueue {
  private queue: (() => Promise<any>)[] = [];
  private processing = false;
  
  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.process();
      }
    });
  }
  
  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
      }
    }
    
    this.processing = false;
  }
  
  clear(): void {
    this.queue = [];
  }
  
  get size(): number {
    return this.queue.length;
  }
}

// Retry utility
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    attempts?: number;
    delay?: number;
    backoff?: number;
    onError?: (error: any, attempt: number) => void;
  } = {}
): Promise<T> {
  const {
    attempts = 3,
    delay = 1000,
    backoff = 2,
    onError
  } = options;
  
  let lastError: any;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (onError) {
        onError(error, i + 1);
      }
      
      if (i < attempts - 1) {
        await sleep(delay * Math.pow(backoff, i));
      }
    }
  }
  
  throw lastError;
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Parse query string
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

// Build query string
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

// Check if running in browser
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// Check if running in development
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

// Check if running in production
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

// Safe JSON parse
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

// Safe JSON stringify
export function safeJsonStringify(value: any, fallback = '{}'): string {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

// Group array by key
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// Chunk array
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Flatten array
export function flatten<T>(array: T[][]): T[] {
  return array.reduce((flat, item) => flat.concat(item), []);
}

// Unique array
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// Shuffle array
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Pick properties from object
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// Omit properties from object
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result as Omit<T, K>;
}

// Compare versions
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  
  return 0;
}

// String manipulation
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^./, char => char.toLowerCase());
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^./, char => char.toUpperCase());
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function escapeHtml(str: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'\/]/g, char => escapeMap[char]);
}

export function unescapeHtml(str: string): string {
  const unescapeMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/'
  };
  
  return str.replace(/&[#\w]+;/g, entity => unescapeMap[entity] || entity);
}

export function padStart(str: string, length: number, char: string = ' '): string {
  return str.padStart(length, char);
}

export function padEnd(str: string, length: number, char: string = ' '): string {
  return str.padEnd(length, char);
}

export function repeat(str: string, count: number): string {
  return str.repeat(count);
}

export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

export function shuffleString(str: string): string {
  const chars = str.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

// Array utilities
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

export function difference<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter(item => !set2.has(item));
}

export function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter(item => set2.has(item));
}

export function union<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}

export function zip<T>(...arrays: T[][]): T[][] {
  const minLength = Math.min(...arrays.map(arr => arr.length));
  const result: T[][] = [];
  
  for (let i = 0; i < minLength; i++) {
    result.push(arrays.map(arr => arr[i]));
  }
  
  return result;
}

export function sortBy<T>(array: T[], key: keyof T | ((item: T) => any)): T[] {
  return [...array].sort((a, b) => {
    const aValue = typeof key === 'function' ? key(a) : a[key];
    const bValue = typeof key === 'function' ? key(b) : b[key];
    
    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0;
  });
}

export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  
  array.forEach(item => {
    (predicate(item) ? pass : fail).push(item);
  });
  
  return [pass, fail];
}

export function sample<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

export function sampleSize<T>(array: T[], size: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, size);
}

export function range(start: number, end?: number, step: number = 1): number[] {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  
  return result;
}

// Object utilities
export function merge<T extends object>(...objects: Partial<T>[]): T {
  return Object.assign({}, ...objects) as T;
}

export function mapKeys<T extends object>(obj: T, fn: (key: string, value: any) => string): Record<string, any> {
  const result: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    const newKey = fn(key, value);
    result[newKey] = value;
  });
  
  return result;
}

export function mapValues<T extends object>(obj: T, fn: (value: any, key: string) => any): Record<string, any> {
  const result: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    result[key] = fn(value, key);
  });
  
  return result;
}

export function invert<T extends Record<string, string | number>>(obj: T): Record<string | number, string> {
  const result: Record<string | number, string> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    result[value] = key;
  });
  
  return result;
}

export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === 'boolean') return false;
  if (typeof value === 'number') return false;
  if (typeof value === 'string') return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Date) return false;
  if (value instanceof Set || value instanceof Map) return value.size === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  
  if (a == null || b == null) return false;
  
  if (typeof a !== typeof b) return false;
  
  if (typeof a !== 'object') return false;
  
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => isEqual(a[key], b[key]));
}

// Math utilities
export function round(num: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export function ceil(num: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.ceil(num * factor) / factor;
}

export function floor(num: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
}

export function random(min: number = 0, max: number = 1, integer: boolean = false): number {
  const num = Math.random() * (max - min) + min;
  return integer ? Math.floor(num) : num;
}

export function sum(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

export function average(numbers: number[]): number {
  return numbers.length > 0 ? sum(numbers) / numbers.length : 0;
}

export function median(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  
  return sorted[mid];
}

export function mode(numbers: number[]): number | undefined {
  const counts = new Map<number, number>();
  let maxCount = 0;
  let modeValue: number | undefined;
  
  numbers.forEach(num => {
    const count = (counts.get(num) || 0) + 1;
    counts.set(num, count);
    
    if (count > maxCount) {
      maxCount = count;
      modeValue = num;
    }
  });
  
  return modeValue;
}

export function standardDeviation(numbers: number[]): number {
  const avg = average(numbers);
  const squaredDiffs = numbers.map(num => Math.pow(num - avg, 2));
  const avgSquaredDiff = average(squaredDiffs);
  return Math.sqrt(avgSquaredDiff);
}

export function percentile(numbers: number[], p: number): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  
  if (lower === upper) {
    return sorted[lower];
  }
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

// Date utilities
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

export function startOfWeek(date: Date, startOn: number = 0): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day < startOn ? 7 : 0) + day - startOn;
  result.setDate(result.getDate() - diff);
  return startOfDay(result);
}

export function endOfWeek(date: Date, startOn: number = 0): Date {
  const result = startOfWeek(date, startOn);
  result.setDate(result.getDate() + 6);
  return endOfDay(result);
}

export function startOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  return startOfDay(result);
}

export function endOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  return endOfDay(result);
}

export function startOfYear(date: Date): Date {
  const result = new Date(date);
  result.setMonth(0);
  result.setDate(1);
  return startOfDay(result);
}

export function endOfYear(date: Date): Date {
  const result = new Date(date);
  result.setMonth(11);
  result.setDate(31);
  return endOfDay(result);
}

export function daysBetween(date1: Date, date2: Date): number {
  const diff = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function monthsBetween(date1: Date, date2: Date): number {
  const months = (date2.getFullYear() - date1.getFullYear()) * 12;
  return months + date2.getMonth() - date1.getMonth();
}

export function yearsBetween(date1: Date, date2: Date): number {
  return date2.getFullYear() - date1.getFullYear();
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isTomorrow(date: Date): boolean {
  const tomorrow = addDays(new Date(), 1);
  return date.toDateString() === tomorrow.toDateString();
}

export function isYesterday(date: Date): boolean {
  const yesterday = addDays(new Date(), -1);
  return date.toDateString() === yesterday.toDateString();
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isWeekday(date: Date): boolean {
  return !isWeekend(date);
}

export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getDaysInYear(date: Date): number {
  const year = date.getFullYear();
  return isLeapYear(year) ? 366 : 365;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Color utilities
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function lighten(color: string, amount: number): string {
  const hsl = hexToHsl(color);
  if (!hsl) return color;
  
  hsl.l = Math.min(100, hsl.l + amount);
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

export function darken(color: string, amount: number): string {
  const hsl = hexToHsl(color);
  if (!hsl) return color;
  
  hsl.l = Math.max(0, hsl.l - amount);
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

export function saturate(color: string, amount: number): string {
  const hsl = hexToHsl(color);
  if (!hsl) return color;
  
  hsl.s = Math.min(100, hsl.s + amount);
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

export function desaturate(color: string, amount: number): string {
  const hsl = hexToHsl(color);
  if (!hsl) return color;
  
  hsl.s = Math.max(0, hsl.s - amount);
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

export function getContrastColor(background: string): string {
  const rgb = hexToRgb(background);
  if (!rgb) return '#000000';
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function mixColors(color1: string, color2: string, weight: number = 0.5): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  const r = Math.round(rgb1.r * (1 - weight) + rgb2.r * weight);
  const g = Math.round(rgb1.g * (1 - weight) + rgb2.g * weight);
  const b = Math.round(rgb1.b * (1 - weight) + rgb2.b * weight);
  
  return rgbToHex(r, g, b);
}

export function getColorPalette(baseColor: string, count: number = 5): string[] {
  const palette: string[] = [];
  const hsl = hexToHsl(baseColor);
  
  if (!hsl) return [baseColor];
  
  for (let i = 0; i < count; i++) {
    const lightness = 90 - (i * (80 / (count - 1)));
    palette.push(hslToHex(hsl.h, hsl.s, lightness));
  }
  
  return palette;
}

// URL utilities
export function parseUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export function getQueryParams(url: string): Record<string, string> {
  const parsed = parseUrl(url);
  if (!parsed) return {};
  
  const params: Record<string, string> = {};
  parsed.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

export function buildUrl(base: string, params?: Record<string, any>): string {
  const url = new URL(base);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  
  return url.toString();
}

export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

export function isRelativeUrl(url: string): boolean {
  return !isAbsoluteUrl(url);
}

export function joinPaths(...paths: string[]): string {
  return paths
    .map((path, index) => {
      if (index === 0) {
        return path.replace(/\/$/, '');
      }
      return path.replace(/^\/|\/$/g, '');
    })
    .filter(Boolean)
    .join('/');
}

export function getFilenameWithoutExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
}

export function getMimeType(filename: string): string {
  const ext = getFileExtension(filename);
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    bmp: 'image/bmp',
    
    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    odt: 'application/vnd.oasis.opendocument.text',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    odp: 'application/vnd.oasis.opendocument.presentation',
    
    // Text
    txt: 'text/plain',
    csv: 'text/csv',
    html: 'text/html',
    htm: 'text/html',
    xml: 'text/xml',
    json: 'application/json',
    
    // Code
    js: 'application/javascript',
    jsx: 'application/javascript',
    ts: 'application/typescript',
    tsx: 'application/typescript',
    css: 'text/css',
    scss: 'text/x-scss',
    sass: 'text/x-sass',
    less: 'text/x-less',
    py: 'text/x-python',
    java: 'text/x-java',
    c: 'text/x-c',
    cpp: 'text/x-c++',
    cs: 'text/x-csharp',
    php: 'text/x-php',
    rb: 'text/x-ruby',
    go: 'text/x-go',
    rs: 'text/x-rust',
    swift: 'text/x-swift',
    kt: 'text/x-kotlin',
    scala: 'text/x-scala',
    r: 'text/x-r',
    sql: 'text/x-sql',
    sh: 'text/x-sh',
    bash: 'text/x-sh',
    ps1: 'text/x-powershell',
    yaml: 'text/yaml',
    yml: 'text/yaml',
    toml: 'text/toml',
    ini: 'text/plain',
    cfg: 'text/plain',
    conf: 'text/plain',
    
    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
    bz2: 'application/x-bzip2',
    xz: 'application/x-xz',
    
    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    flac: 'audio/flac',
    wma: 'audio/x-ms-wma',
    
    // Video
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv',
    webm: 'video/webm',
    mkv: 'video/x-matroska',
    m4v: 'video/x-m4v',
    mpg: 'video/mpeg',
    mpeg: 'video/mpeg',
    
    // Fonts
    ttf: 'font/ttf',
    otf: 'font/otf',
    woff: 'font/woff',
    woff2: 'font/woff2',
    eot: 'application/vnd.ms-fontobject',
    
    // Other
    exe: 'application/x-msdownload',
    msi: 'application/x-msi',
    apk: 'application/vnd.android.package-archive',
    deb: 'application/x-debian-package',
    rpm: 'application/x-rpm',
    dmg: 'application/x-apple-diskimage',
    iso: 'application/x-iso9660-image'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}

// Browser utilities
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function scrollToElement(element: HTMLElement, options?: ScrollIntoViewOptions): void {
  element.scrollIntoView(options || { behavior: 'smooth', block: 'center' });
}

export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
}

export function setScrollPosition(x: number, y: number): void {
  window.scrollTo(x, y);
}

export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  };
}

export function getDocumentSize(): { width: number; height: number } {
  return {
    width: Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    ),
    height: Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    )
  };
}

export function isElementVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

export function getElementOffset(element: HTMLElement): { top: number; left: number } {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
}

export function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className);
}

export function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className);
}

export function toggleClass(element: HTMLElement, className: string): void {
  element.classList.toggle(className);
}

export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

export function setAttribute(element: HTMLElement, name: string, value: string): void {
  element.setAttribute(name, value);
}

export function removeAttribute(element: HTMLElement, name: string): void {
  element.removeAttribute(name);
}

export function getAttribute(element: HTMLElement, name: string): string | null {
  return element.getAttribute(name);
}

export function setStyle(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
  Object.assign(element.style, styles);
}

export function getStyle(element: HTMLElement, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes?: Record<string, any>,
  children?: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key === 'className') {
        element.className = value;
      } else if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.substring(2).toLowerCase();
        element.addEventListener(eventName, value);
      } else {
        element.setAttribute(key, String(value));
      }
    });
  }
  
  if (children) {
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }
  
  return element;
}

export function removeElement(element: HTMLElement): void {
  element.parentNode?.removeChild(element);
}

export function emptyElement(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function insertBefore(newElement: HTMLElement, referenceElement: HTMLElement): void {
  referenceElement.parentNode?.insertBefore(newElement, referenceElement);
}

export function insertAfter(newElement: HTMLElement, referenceElement: HTMLElement): void {
  referenceElement.parentNode?.insertBefore(newElement, referenceElement.nextSibling);
}

export function wrapElement(element: HTMLElement, wrapper: HTMLElement): void {
  element.parentNode?.insertBefore(wrapper, element);
  wrapper.appendChild(element);
}

export function unwrapElement(element: HTMLElement): void {
  const parent = element.parentNode;
  if (!parent || parent === document.body) return;
  
  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }
  
  parent.removeChild(element);
}

export function matches(element: HTMLElement, selector: string): boolean {
  return element.matches(selector);
}

export function closest(element: HTMLElement, selector: string): HTMLElement | null {
  return element.closest(selector);
}

export function find(element: HTMLElement, selector: string): HTMLElement | null {
  return element.querySelector(selector);
}

export function findAll(element: HTMLElement, selector: string): NodeListOf<HTMLElement> {
  return element.querySelectorAll(selector);
}

export function siblings(element: HTMLElement): HTMLElement[] {
  const parent = element.parentNode;
  if (!parent) return [];
  
  return Array.from(parent.children).filter(child => child !== element) as HTMLElement[];
}

export function nextSibling(element: HTMLElement): HTMLElement | null {
  return element.nextElementSibling as HTMLElement | null;
}

export function previousSibling(element: HTMLElement): HTMLElement | null {
  return element.previousElementSibling as HTMLElement | null;
}

export function parent(element: HTMLElement): HTMLElement | null {
  return element.parentElement;
}

export function parents(element: HTMLElement, selector?: string): HTMLElement[] {
  const parents: HTMLElement[] = [];
  let current = element.parentElement;
  
  while (current) {
    if (!selector || current.matches(selector)) {
      parents.push(current);
    }
    current = current.parentElement;
  }
  
  return parents;
}

export function children(element: HTMLElement, selector?: string): HTMLElement[] {
  const children = Array.from(element.children) as HTMLElement[];
  
  if (selector) {
    return children.filter(child => child.matches(selector));
  }
  
  return children;
}

// Performance utilities
export function measurePerformance<T>(fn: () => T, label?: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (label) {
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

export async function measureAsyncPerformance<T>(fn: () => Promise<T>, label?: string): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  if (label) {
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
}

export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;
  
  return ((...args: Parameters<T>) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    
    return result;
  }) as T;
}

export function curry<T extends (...args: any[]) => any>(fn: T): any {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    
    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
  };
}

export function compose<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

export function pipe<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}

// Async utilities
export async function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
}

export async function parallel<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number = Infinity
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];
  
  for (const task of tasks) {
    const promise = task().then(result => {
      results.push(result);
    });
    
    executing.push(promise);
    
    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(p => p === promise), 1);
    }
  }
  
  await Promise.all(executing);
  
  return results;
}

export async function series<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
  const results: T[] = [];
  
  for (const task of tasks) {
    results.push(await task());
  }
  
  return results;
}

export async function waterfall<T>(
  tasks: ((prev: T) => Promise<T>)[],
  initialValue: T
): Promise<T> {
  let result = initialValue;
  
  for (const task of tasks) {
    result = await task(result);
  }
  
  return result;
}

export function promisify<T>(
  fn: (callback: (error: Error | null, result?: T) => void) => void
): () => Promise<T> {
  return () => new Promise((resolve, reject) => {
    fn((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result!);
      }
    });
  });
}

export class Semaphore {
  private permits: number;
  private waiters: (() => void)[] = [];
  
  constructor(permits: number) {
    this.permits = permits;
  }
  
  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }
    
    return new Promise(resolve => {
      this.waiters.push(resolve);
    });
  }
  
  release(): void {
    if (this.waiters.length > 0) {
      const waiter = this.waiters.shift()!;
      waiter();
    } else {
      this.permits++;
    }
  }
  
  async withLock<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number;
  
  constructor(maxTokens: number, refillRate: number) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }
  
  async acquire(tokens: number = 1): Promise<void> {
    this.refill();
    
    while (this.tokens < tokens) {
      await sleep(100);
      this.refill();
    }
    
    this.tokens -= tokens;
  }
  
  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = (elapsed / 1000) * this.refillRate;
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}

// Export everything
export default {
  // Validation
  validateEmail,
  validatePassword,
  validatePhone,
  validateUrl,
  validateCreditCard,
  validatePostalCode,
  validateDate,
  validateTime,
  validateIPAddress,
  validateMACAddress,
  validateUUID,
  validateHexColor,
  validateUsername,
  validateSSN,
  validateIBAN,
  
  // Formatting
  formatPhoneNumber,
  formatCurrency,
  formatNumber,
  formatDate,
  formatTime,
  formatPercentage,
  formatBytes,
  formatDuration,
  formatDistance,
  formatFileSize,
  
  // String manipulation
  truncate,
  capitalize,
  capitalizeWords,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  toPascalCase,
  slugify,
  stripHtml,
  escapeHtml,
  unescapeHtml,
  padStart,
  padEnd,
  repeat,
  reverse,
  shuffle,
  
  // Array utilities
  chunk,
  flatten,
  unique,
  uniqueBy,
  difference,
  intersection,
  union,
  zip,
  sortBy,
  partition,
  sample,
  sampleSize,
  range,
  groupBy,
  pick,
  
  // Object utilities
  omit,
  merge,
  mapKeys,
  mapValues,
  invert,
  isEmpty,
  isEqual,
  deepClone,
  
  // Math utilities
  round,
  ceil,
  floor,
  random,
  sum,
  average,
  median,
  mode,
  standardDeviation,
  percentile,
  clamp,
  
  // Date utilities
  addDays,
  addMonths,
  addYears,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  daysBetween,
  monthsBetween,
  yearsBetween,
  isToday,
  isTomorrow,
  isYesterday,
  isWeekend,
  isWeekday,
  getWeekNumber,
  getQuarter,
  getDaysInMonth,
  getDaysInYear,
  isLeapYear,
  getAge,
  
  // Color utilities
  hexToRgb,
  rgbToHex,
  hexToHsl,
  hslToHex,
  lighten,
  darken,
  saturate,
  desaturate,
  getContrastColor,
  mixColors,
  getColorPalette,
  
  // URL utilities
  parseUrl,
  getQueryParams,
  buildUrl,
  isAbsoluteUrl,
  isRelativeUrl,
  joinPaths,
  getFileExtension,
  getFilenameWithoutExtension,
  getMimeType,
  
  // Browser utilities
  isBrowser,
  isInViewport,
  scrollToElement,
  getScrollPosition,
  setScrollPosition,
  getViewportSize,
  getDocumentSize,
  isElementVisible,
  getElementOffset,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  setAttribute,
  removeAttribute,
  getAttribute,
  setStyle,
  getStyle,
  createElement,
  removeElement,
  emptyElement,
  insertBefore,
  insertAfter,
  wrapElement,
  unwrapElement,
  matches,
  closest,
  find,
  findAll,
  siblings,
  nextSibling,
  previousSibling,
  parent,
  parents,
  children,
  copyToClipboard,
  downloadFile,
  
  // Performance utilities
  measurePerformance,
  measureAsyncPerformance,
  memoize,
  once,
  curry,
  compose,
  pipe,
  debounce,
  throttle,
  
  // Async utilities
  sleep,
  retry,
  timeout,
  parallel,
  series,
  waterfall,
  promisify,
  AsyncQueue,
  Semaphore,
  RateLimiter,
  
  // Event emitter
  EventEmitter,
  
  // Storage
  localStorage,
  
  // Crypto
  crypto,
  
  // ID generation
  generateId,
  
  // Bounding box
  getBoundingBox,
  
  // Path simplification
  simplifyPath,
  
  // Cache
  Cache,
  
  // JSON parsing
  safeJsonParse,
  
  // Canvas to blob
  canvasToBlob,
  
  // Convert to points
  convertToPoints,
  
  // Format time
  formatTime,
  
  // Format number
  formatNumber,
  
  // Format currency
  formatCurrency,
  
  // Format percentage
  formatPercentage,
  
  // Format bytes
  formatBytes,
  
  // Format duration
  formatDuration,
  
  // Format distance
  formatDistance
};