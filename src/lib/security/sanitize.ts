import 'server-only'
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content, removing dangerous tags/attributes while preserving safe formatting.
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  }).trim();
};

/**
 * Sanitizes product descriptions - allows basic formatting tags.
 */
export const sanitizeProductContent = (input: string): string => {
  if (!input) return '';
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
  return sanitized.length > 10000 ? sanitized.substring(0, 10000) : sanitized;
};

/**
 * Sanitizes review comments - strips all HTML.
 */
export const sanitizeReviewContent = (input: string): string => {
  if (!input) return '';
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  return sanitized.length > 2000 ? sanitized.substring(0, 2000) : sanitized;
};

/**
 * Sanitizes user-provided names and display text.
 */
export const sanitizeDisplayName = (input: string): string => {
  if (!input) return '';
  let sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  return sanitized.length > 100 ? sanitized.substring(0, 100) : sanitized;
};

/**
 * Sanitizes search queries.
 */
export const sanitizeSearchQuery = (input: string): string => {
  if (!input) return '';
  let sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  return sanitized.length > 200 ? sanitized.substring(0, 200) : sanitized.trim();
};

/**
 * Sanitizes URL parameters to prevent open redirects and dangerous protocols.
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '';
  }
  if (!trimmed.match(/^https?:\/\//i)) {
    return '';
  }
  return trimmed;
};

/**
 * Cookie security utilities
 */
export const validateCookieName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  const invalidChars = /[()<>@,;:\\"\/\[\]?={}]/;
  if (invalidChars.test(name)) return false;
  if (name.includes(';') || name.includes('=') || name.includes(',')) return false;
  if (name.length > 256) return false;
  return true;
};

export const validateCookiePath = (path: string): boolean => {
  if (!path) return true;
  if (typeof path !== 'string') return false;
  if (!path.startsWith('/')) return false;
  if (path.includes('..')) return false;
  if (/[;=]/.test(path)) return false;
  if (path.length > 256) return false;
  return true;
};

export const validateCookieDomain = (domain: string): boolean => {
  if (!domain) return true;
  if (typeof domain !== 'string') return false;
  if (/[;=]/.test(domain)) return false;
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
  if (!domainRegex.test(domain)) return false;
  if (domain.length > 253) return false;
  return true;
};
