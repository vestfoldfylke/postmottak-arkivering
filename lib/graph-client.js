const { APPREG } = require('../config')
const { ChainedTokenCredential, ManagedIdentityCredential, ClientSecretCredential, useIdentityPlugin, serializeAuthenticationRecord } = require('@azure/identity')
const { Client } = require('@microsoft/microsoft-graph-client')
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials')
const { cachePersistencePlugin } = require('@azure/identity-cache-persistence')
const { name } = require('../package.json')

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

  // Use the cachePersistencePlugin to persist the token cache to disk - must be used  to be able to set tokenCachePersistenceOptions
  useIdentityPlugin(cachePersistencePlugin)

  // Create a new ChainedTokenCredential by passing an array of credentials
  const managedIdentityCredential = new ManagedIdentityCredential({ }) // If running in Azure Henter den dette selv mon tro?? Trenger ingen caching her
  const clientSecretCredential = new ClientSecretCredential(APPREG.TENANT_ID, APPREG.CLIENT_ID, APPREG.CLIENT_SECRET, { tokenCachePersistenceOptions: { enabled: true, name },  }) // Token cache persistence options - uses keychain on macOS, DPAPI on Windows, and keyring on Linux, set enabled false to user in-memory cache

  const credential = new ChainedTokenCredential(
    managedIdentityCredential, // If running in Azure
    clientSecretCredential // If running locally
  )

  const authenticationProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: ['https://graph.microsoft.com/.default'] })

  client = Client.initWithMiddleware({
    debugLogging: true,
    authProvider: authenticationProvider
  })

  return client
}

module.exports = { getGraphClient }
