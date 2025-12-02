// DAX Web API TypeScript Interfaces
// Based on AmidoAB.Dax.WebClient NuGet package analysis

export interface DaxConfiguration {
  baseUrl: string;
  apiKey: string;
  privateKey?: string;
  timeout?: number;
}

export interface DaxCredentials {
  apiKey: string;
  privateKey: string;
}

export interface HttpRequestHeaders {
  [key: string]: string;
}

export interface DaxResponse<T = any> {
  data: T;
  status: number;
  headers: HttpRequestHeaders;
}

export interface DaxError {
  code: string;
  message: string;
  details?: any;
}

// Common DAX data models
export interface DaxEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface DaxUser extends DaxEntity {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isActive: boolean;
}

export interface DaxOrganization extends DaxEntity {
  name: string;
  description?: string;
  domain: string;
  settings: Record<string, any>;
}

export interface DaxProject extends DaxEntity {
  name: string;
  description?: string;
  organizationId: string;
  ownerId: string;
  status: 'active' | 'inactive' | 'archived';
  metadata: Record<string, any>;
}

export interface DaxConnection extends DaxEntity {
  name: string;
  type: string;
  sourceSystem: string;
  targetSystem: string;
  configuration: Record<string, any>;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string;
}

export interface DaxMessage extends DaxEntity {
  connectionId: string;
  messageType: string;
  payload: any;
  direction: 'inbound' | 'outbound';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedAt?: string;
  errorDetails?: DaxError;
}

// API request/response types
export interface CreateConnectionRequest {
  name: string;
  type: string;
  sourceSystem: string;
  targetSystem: string;
  configuration: Record<string, any>;
}

export interface UpdateConnectionRequest {
  name?: string;
  configuration?: Record<string, any>;
  status?: 'connected' | 'disconnected' | 'error';
}

export interface SendMessageRequest {
  connectionId: string;
  messageType: string;
  payload: any;
}

export interface ListConnectionsOptions {
  type?: string;
  status?: string;
  sourceSystem?: string;
  targetSystem?: string;
  page?: number;
  pageSize?: number;
}

export interface ListMessagesOptions {
  connectionId?: string;
  messageType?: string;
  direction?: 'inbound' | 'outbound';
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// HTTP signing interface
export interface SignedHttpRequest {
  method: string;
  url: string;
  headers: HttpRequestHeaders;
  body?: string;
  timestamp: string;
  signature: string;
}

export interface HttpSigner {
  sign(request: SignedHttpRequest): Promise<string>;
  verify(request: SignedHttpRequest, signature: string): Promise<boolean>;
}