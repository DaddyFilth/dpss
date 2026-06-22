import 'server-only'
import { EncryptJWT, jwtDecrypt } from 'jose';
import { sanitizeDisplayName } from './sanitize';

const getEncryptionKey = async (): Promise<Uint8Array> => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(key);

  if (keyBytes.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 characters long for AES-256');
  }

  return keyBytes;
};

export const encrypt = async (text: string): Promise<string> => {
  const key = await getEncryptionKey();
  const encrypted = await new EncryptJWT({ data: text })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(key);
  return encrypted;
};

export const decrypt = async (encryptedText: string): Promise<string> => {
  const key = await getEncryptionKey();
  const { payload } = await jwtDecrypt(encryptedText, key);
  return payload.data as string;
};

export const hashSensitiveData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const generateSecureToken = async (length: number = 32): Promise<string> => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const sanitizeInput = (input: string): string => {
  return sanitizeDisplayName(input);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
