const { logger } = require("@vtfk/logger")
const { MAILBOX, LOCAL_CONFIGURATION_CACHE_PATH } = require("../../config")
const { getEmailChildFolders, createEmailChildFolder, updateEmailFolder } = require("../graph-requests")
const Cache = require('file-system-cache').default

const configCache = Cache({ basePath: LOCAL_CONFIGURATION_CACHE_PATH }) // NEED to change the entire project to ESM . IMPORT instead of require

/**
 * @returns {Promise<import('@types/microsoft-graph').MailFolder[]>}
 */
const upsertMailFolders = async () => {
  // Hent alle epostmappene som finnes i postkassen
  const rootChildFolders = await getEmailChildFolders(MAILBOX.UPN, MAILBOX.ROOT_FOLDER_ID, { includeHiddenFolders: true })

  // Sjekk om vi har lokale id-er for de mappene vi skal opprette
  // For hver lokal id - sjekk om mappen finnes i postkassen, hvis ikke - opprett med displayName
  // Hvis mappen finnes - sjekk om displayName er lik, hvis ikke - oppdater displayName

  const upsertFolders = {
    ROBOT_INPUT_FOLDER: {
      displayName: MAILBOX.ROBOT_INPUT_FOLDER,
      id: configCache.get('ROBOT_INPUT_FOLDER_ID')
    },
    AUTOMATICALLY_HANDLED_FOLDER: {
      displayName: MAILBOX.AUTOMATICALLY_HANDLED_FOLDER,
      id: configCache.get('AUTOMATICALLY_HANDLED_FOLDER_ID')
    },
    MANUAL_FOLDER: {
      displayName: MAILBOX.MANUAL_FOLDER,
      id: configCache.get('MANUAL_FOLDER_ID')
    }
  }

  for (const [upsertFolderProp, upsertFolder] of Object.entries(upsertFolders)) {
    const existsById = rootChildFolders.find(folder => folder.id === upsertFolder.id)
    if (existsById) {
      if (existsById.displayName !== upsertFolder.displayName) {
        logger("info", ["upsert-mail-folders", "folder", upsertFolder.displayName, `Somebody has changed displayName of folder to ${existsById.displayName}, updating displayName to ${upsertFolder.displayName}`])
        await updateEmailFolder(MAILBOX.UPN, existsById.id, upsertFolder.displayName)
      }
      // Exists by id in cache, and displayName is correct, no need to do anything more with this folder
      continue
    }
    // Does not exist by id in cache, check if it exists by displayName
    const existsByDisplayName = rootChildFolders.find(folder => folder.displayName === upsertFolder.displayName)
    if (existsByDisplayName) {
      // Exists by displayName, but not by id in cache, update cache
      configCache.set(`${upsertFolderProp}_ID`, existsByDisplayName.id)
      // Cache is now updated, and folder has correct displayName, no need to do anything more with this folder
      continue
    }
    // Does not exist by id or displayName, create folder
    logger("info", ["upsert-mail-folders", "folder", upsertFolder.displayName, "does not exist by id or displayName - creating"])
    const newFolder = await createEmailChildFolder(MAILBOX.UPN, MAILBOX.ROOT_FOLDER_ID, upsertFolder.displayName)
    logger("info", ["upsert-mail-folders", "folder", upsertFolder.displayName, "created with id, updating in local config cache", newFolder.id])
    configCache.set(`${upsertFolderProp}_ID`, newFolder.id)
  }
}

module.exports = { upsertMailFolders }
