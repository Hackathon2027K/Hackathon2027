/**
 * Security Utilities for SRCAS Hackathon 3.0
 * - Input sanitization
 * - Rate limiting with progressive delay
 * - Generic error messages
 */

// ═══════════════════════════════════════════════════════
// 1. INPUT SANITIZATION
// ═══════════════════════════════════════════════════════

/**
 * Strip HTML tags, script injections, and dangerous characters from user input.
 * Preserves normal text, numbers, spaces, and common punctuation.
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    // Remove HTML tags (including <script>, <img onerror=>, etc.)
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript\s*:/gi, '')
    // Remove on* event handlers (onerror, onclick, etc.)
    .replace(/on\w+\s*=/gi, '')
    // Remove data: protocol (used in some XSS attacks)
    .replace(/data\s*:/gi, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Trim whitespace
    .trim();
}

/**
 * Sanitize all string values in an object (for form data before DB insert).
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Validate email format strictly.
 */
export function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}


// ═══════════════════════════════════════════════════════
// 2. RATE LIMITING + PROGRESSIVE DELAY
// ═══════════════════════════════════════════════════════

const LOGIN_ATTEMPTS_KEY = 'srcas_login_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Progressive delay schedule (in seconds): 0, 2, 5, 10, 30
const DELAY_SCHEDULE = [0, 2, 5, 10, 30];

/**
 * Get the current login attempt record from sessionStorage.
 */
function getAttemptRecord() {
  try {
    const raw = sessionStorage.getItem(LOGIN_ATTEMPTS_KEY);
    if (!raw) return { count: 0, firstAttempt: null, lockedUntil: null };
    const record = JSON.parse(raw);
    
    // If lock has expired, reset
    if (record.lockedUntil && Date.now() > record.lockedUntil) {
      sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
      return { count: 0, firstAttempt: null, lockedUntil: null };
    }
    
    return record;
  } catch {
    return { count: 0, firstAttempt: null, lockedUntil: null };
  }
}

/**
 * Save the login attempt record.
 */
function saveAttemptRecord(record) {
  sessionStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(record));
}

/**
 * Check if user is currently locked out.
 * Returns { locked: boolean, remainingSeconds: number }
 */
export function checkLockout() {
  const record = getAttemptRecord();
  
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const remainingMs = record.lockedUntil - Date.now();
    return {
      locked: true,
      remainingSeconds: Math.ceil(remainingMs / 1000),
      remainingMinutes: Math.ceil(remainingMs / 60000)
    };
  }
  
  return { locked: false, remainingSeconds: 0, remainingMinutes: 0 };
}

/**
 * Get the progressive delay (in ms) for the current attempt count.
 */
export function getProgressiveDelay() {
  const record = getAttemptRecord();
  const idx = Math.min(record.count, DELAY_SCHEDULE.length - 1);
  return DELAY_SCHEDULE[idx] * 1000;
}

/**
 * Record a failed login attempt.
 * Returns { locked: boolean, attemptsLeft: number, delaySeconds: number }
 */
export function recordFailedAttempt() {
  const record = getAttemptRecord();
  record.count += 1;
  record.firstAttempt = record.firstAttempt || Date.now();
  
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    saveAttemptRecord(record);
    return {
      locked: true,
      attemptsLeft: 0,
      delaySeconds: 0,
      lockoutMinutes: Math.ceil(LOCKOUT_DURATION_MS / 60000)
    };
  }
  
  saveAttemptRecord(record);
  const delayIdx = Math.min(record.count, DELAY_SCHEDULE.length - 1);
  
  return {
    locked: false,
    attemptsLeft: MAX_ATTEMPTS - record.count,
    delaySeconds: DELAY_SCHEDULE[delayIdx],
    lockoutMinutes: 0
  };
}

/**
 * Clear all login attempts (call on successful login).
 */
export function clearLoginAttempts() {
  sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY);
}


// ═══════════════════════════════════════════════════════
// 3. GENERIC ERROR MESSAGES
// ═══════════════════════════════════════════════════════

/**
 * Convert Supabase auth errors to generic messages.
 * Never reveals if email exists or which field was wrong.
 */
export function getGenericAuthError(error) {
  const msg = (error?.message || '').toLowerCase();
  
  // Login errors — never reveal if email exists
  if (msg.includes('invalid login credentials') || 
      msg.includes('invalid email') ||
      msg.includes('wrong password') ||
      msg.includes('user not found') ||
      msg.includes('invalid credentials')) {
    return 'Invalid email or password. Please try again.';
  }
  
  // Rate limit from Supabase itself
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }
  
  // Email already registered
  if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('unique constraint')) {
    return 'Unable to create account. Please try with different credentials or sign in.';
  }
  
  // Email not confirmed
  if (msg.includes('email not confirmed')) {
    return 'Please check your email and confirm your account before signing in.';
  }
  
  // Network/server errors
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('timeout')) {
    return 'Connection error. Please check your internet and try again.';
  }
  
  // Fallback: generic message
  return 'Something went wrong. Please try again.';
}
