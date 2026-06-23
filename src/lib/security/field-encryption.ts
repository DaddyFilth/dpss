import 'server-only'
import { encrypt, decrypt } from './encryption';
import logger from '@/lib/logger';

/**
 * Fields that should be encrypted when stored in the database.
 * Maps model name to sensitive field names.
 */
const SENSITIVE_FIELDS: Record<string, string[]> = {
  PrintingSource: ['apiKey', 'apiSecret'],
  SocialAccount: ['accessToken', 'refreshToken'],
};

/**
 * Encrypts sensitive fields before writing to the database.
 */
export async function encryptFields(
  model: string,
  data: Record<string, any>
): Promise<Record<string, any>> {
  const fields = SENSITIVE_FIELDS[model];
  if (!fields) return data;

  const encrypted = { ...data };
  for (const field of fields) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      try {
        encrypted[field] = await encrypt(encrypted[field]);
      } catch (error) {
        logger.error({ model, field, err: error }, 'Failed to encrypt field');
        throw new Error(`Failed to encrypt sensitive field ${field} on ${model}`);
      }
    }
  }
  return encrypted;
}

/**
 * Decrypts sensitive fields after reading from the database.
 */
export async function decryptFields(
  model: string,
  data: Record<string, any> | null
): Promise<Record<string, any> | null> {
  if (!data) return data;

  const fields = SENSITIVE_FIELDS[model];
  if (!fields) return data;

  const decrypted = { ...data };
  for (const field of fields) {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      try {
        decrypted[field] = await decrypt(decrypted[field]);
      } catch (error) {
        // If decryption fails, the value might not be encrypted yet (migration)
        logger.warn({ model, field }, 'Failed to decrypt field - may not be encrypted yet');
      }
    }
  }
  return decrypted;
}

/**
 * Returns the list of sensitive fields for a given model.
 */
export function getSensitiveFields(model: string): string[] {
  return SENSITIVE_FIELDS[model] || [];
}
