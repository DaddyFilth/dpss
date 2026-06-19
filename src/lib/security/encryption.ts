import { EncryptJWT, jwtDecrypt } from 'jose';

// Security utilities for encryption/decryption
// Uses AES-256-GCM for secure encryption

const getEncryptionKey = async (): Promise<Uint8Array> => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  
  // Ensure key is 32 bytes (256 bits) for AES-256
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(key);
  
  if (keyBytes.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 characters long for AES-256');
  }
  
  return keyBytes;
};

export const encrypt = async (text: string): Promise<string> => {
  try {
    const key = await getEncryptionKey();
    const encrypted = await new EncryptJWT({ data: text })
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(key);
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decrypt = async (encryptedText: string): Promise<string> => {
  try {
    const key = await getEncryptionKey();
    const { payload } = await jwtDecrypt(encryptedText, key);
    return payload.data as string;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Hash sensitive data (one-way)
export const hashSensitiveData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Generate secure random token
export const generateSecureToken = async (length: number = 32): Promise<string> => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 1000); // Limit length
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate strong password
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
