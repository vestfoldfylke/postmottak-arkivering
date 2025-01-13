require('dotenv').config()

const emailsRootDirectory = process.env.QUEUE_DIRECTORIES_ROOT || './emails'

module.exports = {
  MOCK_GRAPH: process.env.MOCK_GRAPH === 'true' || false,
  APPREG: {
    CLIENT_ID: process.env.APPREG_CLIENT_ID,
    CLIENT_SECRET: process.env.APPREG_CLIENT_SECRET,
    TENANT_ID: process.env.APPREG_TENANT_ID
  },
  MAILBOX: {
    UPN: process.env.MAILBOX_UPN,
    ROOT_FOLDER_ID: process.env.MAILBOX_ROOT_FOLDER_ID || 'inbox',
    ROBOT_INPUT_FOLDER: process.env.MAILBOX_ROBOT_INPUT_FOLDER || 'Robot-input (ikke rør e-post her)',
    AUTOMATICALLY_HANDLED_FOLDER: process.env.MAILBOX_AUTOMATICALLY_HANDLED_FOLDER || 'Automatisk behandlet',
    MANUAL_FOLDER: process.env.MAILBOX_MANUAL_FOLDER || 'Til manuell behandling'
  },
  QUEUE_DIRECTORIES: {
    ROOT: emailsRootDirectory,
    QUEUE: process.env.QUEUE_DIRECTORIES_INCOMING || `./${emailsRootDirectory}/queue`,
    FAILED: process.env.QUEUE_DIRECTORIES_FAILED || `./${emailsRootDirectory}/failed`,
    FINISHED: process.env.QUEUE_DIRECTORIES_FINISHED || `./${emailsRootDirectory}/finished`,
    ON_HOLD: process.env.QUEUE_DIRECTORIES_ON_HOLD || `./${emailsRootDirectory}/on-hold`,
  },
  LOCAL_CONFIGURATION_CACHE_PATH: process.env.LOCAL_CONFIGURATION_CACHE_PATH || './.configuration-cache',
}
