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
} from '@/lib/constants';

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
  return VALIDATION_PATTERNS.EMAIL.test(email);
}

// Validate phone
export function validatePhone(phone: string): boolean {
  return VALIDATION_PATTERNS.PHONE.test(phone);
}

// Validate URL
export function validateUrl(url: string): boolean {
  return VALIDATION_PATTERNS.URL.test(url);
}

// Validate password
export function validatePassword(password: string): boolean {
  return VALIDATION_PATTERNS.PASSWORD.test(password);
}

// Validate hex color
export function validateHexColor(color: string): boolean {
  return VALIDATION_PATTERNS.HEX_COLOR.test(color);
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

// Export all utilities
export default {
  cn,
  generateId,
  generateTimestamp,
  deepClone,
  deepMerge,
  isObject,
  debounce,
  throttle,
  formatFileSize,
  formatDate,
  formatRelativeTime,
  validateEmail,
  validatePhone,
  validateUrl,
  validatePassword,
  validateHexColor,
  convertToPoints,
  convertFromPoints,
  rgbToHex,
  hexToRgb,
  getContrastRatio,
  clamp,
  lerp,
  mapRange,
  roundTo,
  getDistance,
  getAngle,
  rotatePoint,
  isPointInRect,
  doRectsOverlap,
  getBoundingBox,
  smoothPoints,
  simplifyPath,
  localStorage,
  sessionStorage,
  Cache,
  crypto,
  downloadFile,
  copyToClipboard,
  getFileExtension,
  getFileNameWithoutExtension,
  generateUniqueFilename,
  isFeatureSupported,
  getBrowserInfo,
  requestAnimationFrame,
  cancelAnimationFrame,
  PerformanceMonitor,
  EventEmitter,
  AsyncQueue,
  retry,
  sleep,
  parseQueryString,
  buildQueryString,
  isBrowser,
  isDevelopment,
  isProduction,
  safeJsonParse,
  safeJsonStringify,
  groupBy,
  chunk,
  flatten,
  unique,
  shuffle,
  pick,
  omit,
  compareVersions,
};