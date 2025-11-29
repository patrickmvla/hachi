/**
 * AES-256-GCM encryption/decryption utilities for workspace credentials
 * 
 * Uses Web Crypto API for secure encryption with:
 * - AES-256-GCM algorithm
 * - Random IV (Initialization Vector) for each encryption
 * - Base64 encoding for storage
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM

/**
 * Get or create encryption key from environment
 */
const getEncryptionKey = async (): Promise<CryptoKey> => {
  const keyString = process.env.ENCRYPTION_KEY;
  
  if (!keyString) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }

  // Convert hex string to ArrayBuffer
  const keyData = Buffer.from(keyString, "hex");
  
  if (keyData.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex characters) for AES-256");
  }

  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
};

/**
 * Encrypt plaintext using AES-256-GCM
 * Returns base64-encoded string: IV + ciphertext + auth tag
 */
export const encrypt = async (plaintext: string): Promise<string> => {
  const key = await getEncryptionKey();
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  // Encrypt
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  // Combine IV + ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  // Encode to base64
  return Buffer.from(combined).toString("base64");
};

/**
 * Decrypt ciphertext using AES-256-GCM
 * Expects base64-encoded string: IV + ciphertext + auth tag
 */
export const decrypt = async (ciphertext: string): Promise<string> => {
  try {
    const key = await getEncryptionKey();
    
    // Decode from base64
    const combined = Buffer.from(ciphertext, "base64");
    
    // Extract IV and ciphertext
    const iv = combined.slice(0, IV_LENGTH);
    const data = combined.slice(IV_LENGTH);

    // Decrypt
    const plaintext = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );

    // Decode to string
    const decoder = new TextDecoder();
    return decoder.decode(plaintext);
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

/**
 * Generate a random encryption key (32 bytes for AES-256)
 * Use this to generate ENCRYPTION_KEY for .env file
 */
export const generateEncryptionKey = (): string => {
  const key = crypto.getRandomValues(new Uint8Array(32));
  return Buffer.from(key).toString("hex");
};
