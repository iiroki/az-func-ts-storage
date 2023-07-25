const getFromEnv = (key: string, fallback: string | undefined = undefined) => {
  const value = process.env[key] ?? fallback
  if (!value) {
    throw new Error(`Environment variable must be defined: ${key}`)
  }

  return value
}

export const STORAGE_CONNECTION_ENV = 'STORAGE_CONNECTION'
export const STORAGE_CONNECTION = getFromEnv(STORAGE_CONNECTION_ENV)
export const STORAGE_INGESTION_QUEUE = getFromEnv('STORAGE_INGESTION_QUEUE', 'ingestion')
export const STORAGE_CONFIGURATION_CONTAINER = getFromEnv('STORAGE_CONFIGURATION_CONTAINER', 'configuration')
