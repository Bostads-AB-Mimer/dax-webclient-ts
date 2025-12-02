import CryptoJS from 'crypto-js';
import { HttpSigner, SignedHttpRequest } from '../models';

export class DaxHttpSigner implements HttpSigner {
  private privateKey: string;

  constructor(privateKey: string) {
    this.privateKey = privateKey;
  }

  async sign(request: SignedHttpRequest): Promise<string> {
    const canonicalRequest = this.buildCanonicalRequest(request);
    const signature = CryptoJS.HmacSHA256(canonicalRequest, this.privateKey).toString(CryptoJS.enc.Base64);
    return signature;
  }

  async verify(request: SignedHttpRequest, signature: string): Promise<boolean> {
    const expectedSignature = await this.sign(request);
    return signature === expectedSignature;
  }

  private buildCanonicalRequest(request: SignedHttpRequest): string {
    const parts = [
      request.method.toUpperCase(),
      new URL(request.url).pathname + new URL(request.url).search,
      this.buildCanonicalHeaders(request.headers),
      request.body || ''
    ];
    return parts.join('\n');
  }

  private buildCanonicalHeaders(headers: Record<string, string>): string {
    const sortedHeaders = Object.keys(headers)
      .map(key => key.toLowerCase())
      .sort()
      .map(key => `${key}:${headers[key]}`)
      .join('\n');
    return sortedHeaders;
  }

  addSignatureHeaders(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: string
  ): Record<string, string> {
    const timestamp = new Date().toISOString();
    const signedRequest: SignedHttpRequest = {
      method,
      url,
      headers: { ...headers },
      body,
      timestamp,
      signature: ''
    };

    const signature = this.buildSignature(method, url, headers, body, timestamp);

    return {
      ...headers,
      'X-Dax-Timestamp': timestamp,
      'X-Dax-Signature': signature,
      'X-Dax-Algorithm': 'hmac-sha256'
    };
  }

  private buildSignature(
    method: string,
    url: string,
    headers: Record<string, string>,
    body: string | undefined,
    timestamp: string
  ): string {
    const canonicalString = [
      method.toUpperCase(),
      new URL(url).pathname,
      this.getSortedHeaders(headers),
      body || '',
      timestamp
    ].join('\n');

    return CryptoJS.HmacSHA256(canonicalString, this.privateKey).toString(CryptoJS.enc.Base64);
  }

  private getSortedHeaders(headers: Record<string, string>): string {
    return Object.keys(headers)
      .sort()
      .map(key => `${key.toLowerCase()}:${headers[key].trim()}`)
      .join('\n');
  }
}