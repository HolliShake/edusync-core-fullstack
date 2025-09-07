const SECRET_KEY = 'your-secret-key-here';

/**
 * Simple hash function for string input
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Simple XOR cipher for encryption/decryption
 */
function xorCipher(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const textChar = text.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode(textChar ^ keyChar);
  }
  return result;
}

/**
 * Converts string to base64
 */
function toBase64(str: string): string {
  return btoa(str);
}

/**
 * Converts base64 to string
 */
function fromBase64(base64: string): string {
  return atob(base64);
}

/**
 * Encrypts an ID using simple XOR cipher and base64 encoding
 * @param id - The ID to encrypt (string or number)
 * @returns Encrypted string
 */
export function encryptId(id: string | number): string {
  const idString = String(id);
  const encrypted = xorCipher(idString, SECRET_KEY);
  return toBase64(encrypted);
}

/**
 * Decrypts an encrypted ID
 * @param encryptedId - The encrypted ID string
 * @returns Decrypted ID as string
 */
export function decryptId(encryptedId: string): number {
  try {
    const decoded = fromBase64(encryptedId);
    const decrypted = xorCipher(decoded, SECRET_KEY);
    return parseInt(decrypted);
  } catch (error) {
    throw new Error('Failed to decrypt ID');
  }
}

/**
 * Creates a URL-safe encrypted ID
 * @param id - The ID to encrypt
 * @returns URL-safe encrypted string
 */
export function encryptIdForUrl(id: string | number): string {
  const encrypted = encryptId(id);
  return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decrypts a URL-safe encrypted ID
 * @param urlSafeEncryptedId - The URL-safe encrypted ID
 * @returns Decrypted ID as string
 */
export function decryptIdFromUrl(urlSafeEncryptedId: string): number {
  try {
    // Restore base64 padding and characters
    let base64 = urlSafeEncryptedId.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return decryptId(base64);
  } catch (error) {
    throw new Error('Failed to decrypt URL-safe ID');
  }
}

/**
 * Generates a hash-based encrypted ID (one-way)
 * @param id - The ID to hash
 * @returns Hashed ID as string
 */
export function hashId(id: string | number): string {
  const idString = String(id);
  const hash = simpleHash(idString + SECRET_KEY);
  return hash.toString(36); // Convert to base36 for shorter string
}
