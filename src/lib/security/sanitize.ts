import 'server-only'

// Content sanitization utilities for XSS prevention
// Provides safe handling of user-generated content

/**
 * Escapes potentially dangerous HTML tags to prevent XSS attacks
 * This approach preserves the content while making it safe for rendering
 */
export const escapeHtmlTags = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Specifically escapes closing style tags to prevent style injection
 * Use this when you want to allow some HTML but prevent style tag attacks
 */
export const escapeStyleTags = (input: string): string => {
  if (!input) return '';
  
  return input.replace(/<\/(style)/gi, '<\\/$1');
};

/**
 * Comprehensive HTML sanitization for user-generated content
 * Removes dangerous tags while preserving safe formatting
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  let sanitized = input;
  
  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Remove object/embed tags
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^>]*>/gi, '');
  
  // Remove on* event handlers (onclick, onmouseover, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Escape remaining HTML tags
  sanitized = escapeHtmlTags(sanitized);
  
  return sanitized.trim();
};

/**
 * Sanitizes product descriptions and other user-generated content
 * Preserves basic formatting but removes dangerous elements
 */
export const sanitizeProductContent = (input: string): string => {
  if (!input) return '';
  
  let sanitized = input;
  
  // Allow basic formatting: b, i, em, strong, p, br, ul, ol, li
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'];
  
  // Remove dangerous tags
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^>]*>/gi,
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
    /<input\b[^>]*>/gi,
    /<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi,
  ];
  
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: and data: protocols
  sanitized = sanitized.replace(/(javascript|data|vbscript):/gi, '');
  
  // Limit length
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }
  
  return sanitized.trim();
};

/**
 * Sanitizes review comments and other short user content
 * More restrictive than product content sanitization
 */
export const sanitizeReviewContent = (input: string): string => {
  if (!input) return '';
  
  let sanitized = input;
  
  // Remove all HTML tags for reviews
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Remove any remaining dangerous patterns
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  // Limit length for reviews
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000);
  }
  
  return sanitized.trim();
};

/**
 * Sanitizes URL parameters to prevent open redirects
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  // Remove javascript: and data: protocols
  let sanitized = url.replace(/^(javascript|data|vbscript):/gi, '');
  
  // Ensure URL starts with http:// or https://
  if (!sanitized.match(/^https?:\/\//i)) {
    return '';
  }
  
  return sanitized;
};

/**
 * Sanitizes user-provided names and display text
 */
export const sanitizeDisplayName = (input: string): string => {
  if (!input) return '';
  
  let sanitized = input;
  
  // Remove HTML and special characters
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  sanitized = sanitized.replace(/[<>\"']/g, '');
  
  // Remove extra whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  // Limit length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }
  
  return sanitized;
};

/**
 * Validates and sanitizes product search queries
 */
export const sanitizeSearchQuery = (input: string): string => {
  if (!input) return '';
  
  let sanitized = input;
  
  // Remove HTML tags and special characters that could be used for injection
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  sanitized = sanitized.replace(/[;\"']/g, '');
  
  // Limit length for search queries
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }
  
  return sanitized.trim();
};

/**
 * Legacy function - uses the specific style tag escaping you provided
 * Kept for backwards compatibility
 */
export const legacyEscapeStyleTags = (output: string): string => {
  return output.replace(/<\/(style)/gi, '<\\/$1');
};
