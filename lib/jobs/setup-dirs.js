const { logger } = require("@vtfk/logger")
const { mkdirSync, existsSync } = require('fs')
const { QUEUE_DIRECTORIES } = require("../../config")

const setupDirectiories =  () => {
  // Sjekk at vi har alle lokale mapper vi trenger
  const dirs = [QUEUE_DIRECTORIES.ROOT, QUEUE_DIRECTORIES.QUEUE, QUEUE_DIRECTORIES.FAILED, QUEUE_DIRECTORIES.FINISHED, QUEUE_DIRECTORIES.ON_HOLD]

  for (const dir of dirs) {
    if (typeof dir !== 'string' || dir.length === 0) {
      throw new Error(`dir is not set correctly in .env: ${dir}. Must be a string`)
    }
    if (!existsSync(dir)) {
      logger("info", ["setup-directories", `${dir} does not exist - creating`])
      mkdirSync(dir)
    }
  }
}

module.exports = { setupDirectiories }
