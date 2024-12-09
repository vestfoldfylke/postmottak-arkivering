const { APPREG } = require('../config')
const { ChainedTokenCredential, ManagedIdentityCredential, ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials')

let client = null

// Mellomlagre på et eller annet vis til en kø?
/**
 * 
 * @returns {Client} graph client
 */
const getGraphClient = () => {
  if (client) {
    return client
  } 
  // Create a new ChainedTokenCredential by passing an array of credentials
  const managedIdentityCredential = new ManagedIdentityCredential({  }); // If running in Azure Henter den dette selv??
  const clientSecretCredential = new ClientSecretCredential(APPREG.TENANT_ID, APPREG.CLIENT_ID, APPREG.CLIENT_SECRET);

  const credential = new ChainedTokenCredential(
    managedIdentityCredential, // If running in Azure
    clientSecretCredential // If running locally
  );

  const authenticationProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: [ 'https://graph.microsoft.com/.default' ] } );

  client = Client.initWithMiddleware({
    debugLogging: true,
    authProvider: authenticationProvider
  })

  return client
}

module.exports = { getGraphClient }