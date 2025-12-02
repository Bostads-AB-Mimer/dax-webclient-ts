import CryptoJS from 'crypto-js';

export class CryptoUtils {
  static generateApiKey(): string {
    const bytes = CryptoJS.lib.WordArray.random(32);
    return CryptoJS.enc.Hex.stringify(bytes);
  }

  static generatePrivateKey(): string {
    const bytes = CryptoJS.lib.WordArray.random(64);
    return CryptoJS.enc.Hex.stringify(bytes);
  }

  static hashString(input: string): string {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
  }

  static encryptData(data: string, key: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, key).toString();
    return encrypted;
  }

  static decryptData(encryptedData: string, key: string): string {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  static encodeBase64(data: string): string {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
  }

  static decodeBase64(base64Data: string): string {
    return CryptoJS.enc.Base64.parse(base64Data).toString(CryptoJS.enc.Utf8);
  }

  static generateNonce(): string {
    const timestamp = Date.now().toString();
    const random = CryptoJS.lib.WordArray.random(16).toString();
    return CryptoJS.SHA256(timestamp + random).toString(CryptoJS.enc.Hex);
  }
}