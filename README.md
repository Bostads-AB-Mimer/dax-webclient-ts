# DAX Web Client TypeScript

> 🚀 **TypeScript-klient för Amido DAX Web API** - Konverterad från .NET NuGet-paketet `AmidoAB.Dax.WebClient`

En modern, typsäker TypeScript-klient för DAX Web API med fullständig HMAC-SHA256-autentisering och omfattande stöd för alla DAX-endpoints.

## ✨ **Funktioner**

- 🔐 **Säker Autentisering**: HMAC-SHA256 signerade HTTP-förfrågningar
- 🚀 **Full Type Safety**: Komplett TypeScript-stöd med omfattande interfaces
- 📡 **Modern HTTP-klient**: Byggd på Axios med automatisk retry-logik
- 🔧 **Crypto-verktyg**: Hjälpfunktioner för nyckelgenerering och kryptering
- 📝 **Komplett API-stöd**: Stöd för alla DAX Web API-endpoints
- 🛠 **Utvecklarvänlig**: Lättanvänd gränssnitt med detaljerad felhantering
- 📦 **Lättviktig**: Minimala dependencies, optimerad för Node.js och webbläsare
- 🔄 **Automatisk signering**: Inbyggd HMAC-SHA256 signering av alla requests

## Installation

```bash
npm install dax-webclient-ts
```

## Quick Start

```typescript
import { DaxWebClient, DaxConfiguration, CryptoUtils } from 'dax-webclient-ts';

// Generate or use existing credentials
const config: DaxConfiguration = {
  baseUrl: 'https://your-dax-instance.com',
  apiKey: 'your-api-key',
  privateKey: 'your-private-key',
  timeout: 30000
};

// Create client instance
const client = new DaxWebClient(config);

// Use the client
async function example() {
  try {
    // Health check
    const health = await client.healthCheck();
    console.log('DAX API Status:', health.data.status);

    // Get current user
    const user = await client.getCurrentUser();
    console.log('Current user:', user.data.username);

    // List connections
    const connections = await client.listConnections();
    console.log('Found connections:', connections.data.totalCount);

  } catch (error) {
    console.error('DAX API Error:', error);
  }
}
```

## Configuration

The `DaxConfiguration` interface accepts the following options:

```typescript
interface DaxConfiguration {
  baseUrl: string;        // DAX API base URL
  apiKey: string;         // Your API key
  privateKey: string;     // Your private key for signing requests
  timeout?: number;       // Request timeout in milliseconds (default: 30000)
}
```

## API Reference

### User Management

```typescript
// Get current user
const user = await client.getCurrentUser();

// Get user by ID
const user = await client.getUserById('user-id');
```

### Connection Management

```typescript
// Create a connection
const connection = await client.createConnection({
  name: 'My Connection',
  type: 'http',
  sourceSystem: 'my-system',
  targetSystem: 'target-system',
  configuration: {
    endpoint: 'https://api.example.com',
    timeout: 5000
  }
});

// List connections with filters
const connections = await client.listConnections({
  type: 'http',
  status: 'connected',
  page: 1,
  pageSize: 20
});

// Get connection by ID
const connection = await client.getConnectionById('connection-id');

// Update connection
const updated = await client.updateConnection('connection-id', {
  name: 'Updated Connection',
  status: 'disconnected'
});

// Delete connection
await client.deleteConnection('connection-id');
```

### Message Management

```typescript
// Send a message
const message = await client.sendMessage({
  connectionId: 'connection-id',
  messageType: 'data-sync',
  payload: {
    records: [...],
    timestamp: new Date().toISOString()
  }
});

// List messages with filters
const messages = await client.listMessages({
  connectionId: 'connection-id',
  messageType: 'data-sync',
  direction: 'outbound',
  status: 'completed',
  page: 1,
  pageSize: 50
});

// Get message by ID
const message = await client.getMessageById('message-id');
```

### Project & Organization Management

```typescript
// Get organization
const org = await client.getOrganizationById('org-id');

// List projects
const projects = await client.listProjects('org-id');

// Get project
const project = await client.getProjectById('project-id');
```

## Security

The client automatically signs all HTTP requests using HMAC-SHA256 authentication. The signing process includes:

1. Canonical string generation from HTTP method, URL, headers, and body
2. HMAC-SHA256 signature using your private key
3. Automatic inclusion of signature headers in requests

## Error Handling

The client provides structured error information:

```typescript
try {
  await client.getCurrentUser();
} catch (error) {
  console.error('Error code:', error.code);
  console.error('Error message:', error.message);
  console.error('Error details:', error.details);
}
```

## Utility Functions

### Crypto Utilities

```typescript
import { CryptoUtils } from 'dax-webclient-ts';

// Generate API key
const apiKey = CryptoUtils.generateApiKey();

// Generate private key
const privateKey = CryptoUtils.generatePrivateKey();

// Hash strings
const hash = CryptoUtils.hashString('sensitive-data');

// Encrypt/decrypt data
const encrypted = CryptoUtils.encryptData('data', 'key');
const decrypted = CryptoUtils.decryptData(encrypted, 'key');
```

### Validation Utilities

```typescript
import { ValidationUtils } from 'dax-webclient-ts';

// Validate API key
const isValidKey = ValidationUtils.isValidApiKey('your-api-key');

// Validate URL
const isValidUrl = ValidationUtils.isValidUrl('https://example.com');

// Validate email
const isValidEmail = ValidationUtils.validateEmail('user@example.com');
```

### Retry Utilities

```typescript
import { RetryUtils } from 'dax-webclient-ts';

// Retry operations with exponential backoff
const result = await RetryUtils.withRetry(
  async () => {
    // Your operation here
    return await someAsyncOperation();
  },
  3, // max retries
  1000 // initial delay in ms
);
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Development Mode

```bash
npm run dev
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions about DAX, visit [Amido DAX Documentation](https://dax-docs.amido.se/) or contact Amido at hej@amido.se.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Changelog

### 1.0.0
- Initial TypeScript implementation
- Full API coverage for DAX Web API
- HMAC-SHA256 authentication
- Comprehensive error handling
- Utility functions for crypto and validation