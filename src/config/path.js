import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const getDirname = (importMetaUrl) =>
  dirname(fileURLToPath(importMetaUrl))
