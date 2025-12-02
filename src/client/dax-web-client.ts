import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DaxHttpSigner } from '../crypto/http-signer';
import {
  DaxConfiguration,
  DaxResponse,
  DaxError,
  DaxUser,
  DaxOrganization,
  DaxProject,
  DaxConnection,
  DaxMessage,
  CreateConnectionRequest,
  UpdateConnectionRequest,
  SendMessageRequest,
  ListConnectionsOptions,
  ListMessagesOptions,
  PaginatedResponse,
  HttpRequestHeaders
} from '../models';

export class DaxWebClient {
  private httpClient: AxiosInstance;
  private signer: DaxHttpSigner;
  private apiKey: string;

  constructor(config: DaxConfiguration) {
    this.apiKey = config.apiKey;
    
    if (!config.privateKey) {
      throw new Error('Private key is required for DAX client');
    }

    this.signer = new DaxHttpSigner(config.privateKey);

    this.httpClient = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Dax-Api-Key': this.apiKey
      }
    });

    this.setupRequestInterceptor();
  }

  private setupRequestInterceptor(): void {
    this.httpClient.interceptors.request.use(
      async (config) => {
        const body = config.data ? JSON.stringify(config.data) : undefined;
        const signedHeaders = this.signer.addSignatureHeaders(
          config.method?.toUpperCase() || 'GET',
          config.url || '',
          config.headers || {},
          body
        );

        config.headers = signedHeaders as any;
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  private async handleResponse<T>(response: AxiosResponse): Promise<DaxResponse<T>> {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as HttpRequestHeaders
    };
  }

  private async handleError(error: any): Promise<never> {
    const daxError: DaxError = {
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.message || error.message,
      details: error.response?.data?.details
    };
    throw daxError;
  }

  // User management
  async getCurrentUser(): Promise<DaxResponse<DaxUser>> {
    try {
      const response = await this.httpClient.get('/api/v1/users/me');
      return this.handleResponse<DaxUser>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUserById(userId: string): Promise<DaxResponse<DaxUser>> {
    try {
      const response = await this.httpClient.get(`/api/v1/users/${userId}`);
      return this.handleResponse<DaxUser>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Organization management
  async getOrganizationById(organizationId: string): Promise<DaxResponse<DaxOrganization>> {
    try {
      const response = await this.httpClient.get(`/api/v1/organizations/${organizationId}`);
      return this.handleResponse<DaxOrganization>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Project management
  async getProjectById(projectId: string): Promise<DaxResponse<DaxProject>> {
    try {
      const response = await this.httpClient.get(`/api/v1/projects/${projectId}`);
      return this.handleResponse<DaxProject>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async listProjects(organizationId?: string): Promise<DaxResponse<PaginatedResponse<DaxProject>>> {
    try {
      const params = organizationId ? { organizationId } : {};
      const response = await this.httpClient.get('/api/v1/projects', { params });
      return this.handleResponse<PaginatedResponse<DaxProject>>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Connection management
  async createConnection(request: CreateConnectionRequest): Promise<DaxResponse<DaxConnection>> {
    try {
      const response = await this.httpClient.post('/api/v1/connections', request);
      return this.handleResponse<DaxConnection>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getConnectionById(connectionId: string): Promise<DaxResponse<DaxConnection>> {
    try {
      const response = await this.httpClient.get(`/api/v1/connections/${connectionId}`);
      return this.handleResponse<DaxConnection>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async listConnections(options?: ListConnectionsOptions): Promise<DaxResponse<PaginatedResponse<DaxConnection>>> {
    try {
      const response = await this.httpClient.get('/api/v1/connections', { params: options });
      return this.handleResponse<PaginatedResponse<DaxConnection>>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateConnection(connectionId: string, request: UpdateConnectionRequest): Promise<DaxResponse<DaxConnection>> {
    try {
      const response = await this.httpClient.put(`/api/v1/connections/${connectionId}`, request);
      return this.handleResponse<DaxConnection>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteConnection(connectionId: string): Promise<DaxResponse<void>> {
    try {
      const response = await this.httpClient.delete(`/api/v1/connections/${connectionId}`);
      return this.handleResponse<void>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Message management
  async sendMessage(request: SendMessageRequest): Promise<DaxResponse<DaxMessage>> {
    try {
      const response = await this.httpClient.post('/api/v1/messages', request);
      return this.handleResponse<DaxMessage>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getMessageById(messageId: string): Promise<DaxResponse<DaxMessage>> {
    try {
      const response = await this.httpClient.get(`/api/v1/messages/${messageId}`);
      return this.handleResponse<DaxMessage>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async listMessages(options?: ListMessagesOptions): Promise<DaxResponse<PaginatedResponse<DaxMessage>>> {
    try {
      const response = await this.httpClient.get('/api/v1/messages', { params: options });
      return this.handleResponse<PaginatedResponse<DaxMessage>>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Health check
  async healthCheck(): Promise<DaxResponse<{ status: string; timestamp: string }>> {
    try {
      const response = await this.httpClient.get('/api/v1/health');
      return this.handleResponse<{ status: string; timestamp: string }>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}