import { DaxWebClient, DaxConfiguration, CryptoUtils } from '../src';

async function main() {
  // Generate credentials for testing
  const apiKey = CryptoUtils.generateApiKey();
  const privateKey = CryptoUtils.generatePrivateKey();

  console.log('Generated API Key:', apiKey);
  console.log('Generated Private Key:', privateKey);

  // Configure the DAX client
  const config: DaxConfiguration = {
    baseUrl: 'https://api.dax.amido.se', // Replace with actual DAX API URL
    apiKey: apiKey,
    privateKey: privateKey,
    timeout: 30000
  };

  // Create client instance
  const client = new DaxWebClient(config);

  try {
    // Test health check
    console.log('Testing health check...');
    const healthResponse = await client.healthCheck();
    console.log('Health check response:', healthResponse.data);

    // Test getting current user
    console.log('Getting current user...');
    const userResponse = await client.getCurrentUser();
    console.log('Current user:', userResponse.data);

    // Test listing connections
    console.log('Listing connections...');
    const connectionsResponse = await client.listConnections();
    console.log('Connections:', connectionsResponse.data);

    // Test creating a connection
    console.log('Creating a connection...');
    const createConnectionRequest = {
      name: 'Test Connection',
      type: 'http',
      sourceSystem: 'test-system',
      targetSystem: 'dax-api',
      configuration: {
        endpoint: 'https://example.com/api',
        timeout: 5000
      }
    };

    const connectionResponse = await client.createConnection(createConnectionRequest);
    console.log('Created connection:', connectionResponse.data);

    // Test sending a message
    if (connectionResponse.data.id) {
      console.log('Sending a message...');
      const sendMessageRequest = {
        connectionId: connectionResponse.data.id,
        messageType: 'test-message',
        payload: {
          message: 'Hello from TypeScript DAX Client!',
          timestamp: new Date().toISOString()
        }
      };

      const messageResponse = await client.sendMessage(sendMessageRequest);
      console.log('Sent message:', messageResponse.data);
    }

  } catch (error) {
    console.error('Error during DAX client operations:', error);
  }
}

// Run the example
main().catch(console.error);