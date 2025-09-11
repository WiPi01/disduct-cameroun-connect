// Security utilities for input sanitization and password validation

import DOMPurify from 'dompurify';

// Password strength validation
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isStrong: boolean;
}

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Au moins 8 caractères');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Au moins une majuscule');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Au moins une minuscule');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Au moins un chiffre');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Au moins un caractère spécial');
  }

  // Additional length bonus
  if (password.length >= 12) {
    score += 1;
  }

  return {
    score: Math.min(score, 4),
    feedback,
    isStrong: score >= 3
  };
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }
  
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  }).trim();
};

// Rate limiting utility
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }
  
  getRemainingTime(key: string, windowMs: number): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;
    
    const oldest = Math.min(...attempts);
    const remaining = windowMs - (Date.now() - oldest);
    return Math.max(0, remaining);
  }
}

export const rateLimiter = new RateLimiter();

// Security logging
export const logSecurityEvent = (event: string, details: Record<string, any> = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown'
  };
  
  console.log('[SECURITY]', logEntry);
  
  // In production, you might want to send this to an external logging service
  // await fetch('/api/security-logs', { method: 'POST', body: JSON.stringify(logEntry) });
};

// Email validation with security considerations
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
};

// Common passwords check (basic implementation)
const commonPasswords = [
  'password', '123456', 'password123', 'admin', 'qwerty',
  'letmein', 'welcome', 'monkey', '1234567890', 'abc123'
];

export const isCommonPassword = (password: string): boolean => {
  return commonPasswords.includes(password.toLowerCase());
};