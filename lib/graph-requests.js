const { MOCK_GRAPH } = require('../config')
const { getGraphClient } = require('./graph-client')

/**
 * 
 * @param {string} url 
 * @param {*} options 
 * @returns {Object}
 */
const pagedGraphRequest = async (url, options) => {
  if (!url) {
    throw new Error('Missing required parameter: url')
  }
  
  const graphClient = getGraphClient()

  let finished = false
  let nextLink = url
  let result = []
  while (!finished) {
    let currentResponse
    if (options?.headers) {
      currentResponse = await graphClient.api(nextLink).headers(options.headers).get()
    } else {
      currentResponse = await graphClient.api(nextLink).get()
    }
    result = result.concat(currentResponse.value)
    if (currentResponse['@odata.nextLink']) {
      nextLink = currentResponse['@odata.nextLink']
    } else {
      finished = true
    }
  }
  return { value: result, count: result.length }
}


/**
 * @param {string} mailboxId
 * @param {*} options
 * @returns {import('@types/microsoft-graph').MailFolder[]} 
 */
const getEmailFolders = async (mailboxId, options) => {
  if (mailboxId) {
    throw new Error('Missing required parameter: mailboxId')
  }
  const includeHiddenFolders = Boolean(options?.includeHiddenFolders) || false
  const url = `/users/${mailboxId}/mailFolders?includeHiddenFolders=${includeHiddenFolders}`
  const folders = await pagedGraphRequest(url)
  return folders.value
}

/**
 * @param {string} mailboxId
 * @param {string} parentFolderId
 * @param {*} options
 * @returns {import('@types/microsoft-graph').MailFolder[]} 
 */
const getEmailChildFolders = async (mailboxId, parentFolderId, options) => {
  if (!mailboxId) {
    throw new Error('Missing required parameter: mailboxId')
  }
  if (!parentFolderId) {
    throw new Error('Missing required parameter: parentFolderId')
  }
  const includeHiddenFolders = Boolean(options?.includeHiddenFolders) || false
  const url = `/users/${mailboxId}/mailFolders/${parentFolderId}/childFolders?includeHiddenFolders=${includeHiddenFolders}`
  const folders = await pagedGraphRequest(url)
  return folders.value
}

/**
 * @param {string} mailboxId
 * @param {string} displayName
 * @param {*} options 
 * @returns {import('@types/microsoft-graph').MailFolder} created folder
 */
const createEmailFolder = async (mailboxId, displayName, options) => {
  if (!mailboxId) {
    throw new Error('Missing required parameter: mailboxId')
  }
  if (!displayName) {
    throw new Error('Missing required parameter: displayName')
  }
  const isHidden = Boolean(options?.isHidden) || false
  const graphClient = getGraphClient()
  const createdFolder = await graphClient.api(`/users/${mailboxId}/mailFolders`).post({ displayName, isHidden })
  return createdFolder
}

/**
 * @param {string} mailboxId
 * @param {string} parentFolderId
 * @param {string} displayName
 * @param {*} options 
 * @returns {import('@types/microsoft-graph').MailFolder} created folder
 */
const createEmailChildFolder = async (mailboxId, parentFolderId, displayName, options) => {
  if (!mailboxId) {
    throw new Error('Missing required parameter: mailboxId')
  }
  if (!parentFolderId) {
    throw new Error('Missing required parameter: parentFolderId')
  }
  if (!displayName) {
    throw new Error('Missing required parameter: displayName')
  }
  const isHidden = Boolean(options?.isHidden) || false
  const graphClient = getGraphClient()
  const createdFolder = await graphClient.api(`/users/${mailboxId}/mailFolders/${parentFolderId}/childFolders`).post({ displayName, isHidden })
  return createdFolder
}

/**
 * @param {string} mailboxId
 * @param {string} parentFolderId
 * @param {string} displayName
 * @param {*} options 
 * @returns {import('@types/microsoft-graph').MailFolder} updated folder
 */
const updateEmailFolder = async (mailboxId, folderId, displayName) => {
  if (!mailboxId) {
    throw new Error('Missing required parameter: mailboxId')
  }
  if (!folderId) {
    throw new Error('Missing required parameter: folderId')
  }
  if (!displayName) {
    throw new Error('Missing required parameter: displayName')
  }
  const graphClient = getGraphClient()
  const updatedFolder = await graphClient.api(`/users/${mailboxId}/mailFolders/${folderId}`).patch({ displayName })
  return updatedFolder
}

/**
 * 
 * @param {Object} options
 * @returns {import('@types/microsoft-graph').Message[]}
 */
const getEmails = async (options) => {
  if (!options.upn) {
    throw new Error('Missing required parameter: upn')
  }
  if (MOCK_GRAPH) {
    const { mockEmails } = require('../tests/mock-data')
    return mockEmails
  }
  // Spør graph hvis du har nett da vel
  const graphClient = getGraphClient()


  const emails = await graphClient.api(`/users/${options.upn}/messages`).get() // osv osv
  return emails.value
}

/**
 * 
 * @param {*} options 
 * @returns {import('@types/microsoft-graph').Message} updated email
 */
const updateEmail = async (options) => {
  if (!options.mailboxId) {
    throw new Error('Missing required parameter: upn')
  }
  if (!options.mailId) {
    throw new Error('Missing required parameter: id')
  }
  if (!options.body) {
    throw new Error('Missing required parameter: body')
  }
  // Spør graph hvis du har nett da vel
  const graphClient = getGraphClient()
  const updatedEmail = await graphClient.api(`/users/${options.mailboxId}/messages/${options.mailId}`).patch({ body: options.body })

  return updatedEmail
}

module.exports = { getEmails, updateEmail, getEmailFolders, getEmailChildFolders, createEmailFolder, createEmailChildFolder, updateEmailFolder }