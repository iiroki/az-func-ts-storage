import { AppendBlobClient, BlobServiceClient, ContainerClient } from '@azure/storage-blob'
import { STORAGE_CONNECTION, STORAGE_DATA_CONTAINER } from '../environment'
import { DataClient } from '../model'

export type StorageParams = {
  readonly dataClient: DataClient
  readonly blobPath: string
}

export type StorageWriteParams =  StorageParams & {
  readonly content: string | Buffer
}

export type BlobPathParams = {
  readonly type: string
  readonly timestamp: Date
  readonly tag?: string
  readonly includeHours?: boolean
  readonly fileExt: string
}

export const DATA_FILE_NAME = 'data'

export const createDataClient = (): ContainerClient => BlobServiceClient
  .fromConnectionString(STORAGE_CONNECTION)
  .getContainerClient(STORAGE_DATA_CONTAINER)

export const appendToDataBlob = async (params: StorageWriteParams): Promise<void> => {
  const { dataClient, blobPath, content } = params
  const client = getDataBlobClient(dataClient, blobPath)
  await client.createIfNotExists()
  await client.appendBlock(content, content.length)
}

export const readDataBlob = async (dataClient: DataClient, path: string): Promise<Buffer> =>
  getDataBlobClient(dataClient, path).downloadToBuffer()

export const createDataBlobPath = (params: BlobPathParams): string => {
  const { type, tag, timestamp, includeHours, fileExt } = params
  const parts = [`type=${type}`]
  if (tag) {
    parts.push(`tag=${tag}`)
  }

  // TODO: Is UTC correct here?
  parts.push(...[
    `year=${timestamp.getUTCFullYear()}`,
    `month=${timestamp.getUTCMonth()}`,
    `day=${timestamp.getUTCDate()}`
  ])

  if (includeHours) {
    parts.push(`hour=${timestamp.getUTCHours()}`)
  }

  parts.push(`${DATA_FILE_NAME}.${fileExt.startsWith('.') ? fileExt.slice(1) : fileExt}`)
  return parts.join('/')
}

export const dataBlobExists = async (dataClient: DataClient, path: string): Promise<boolean> =>
  getDataBlobClient(dataClient, path).exists()

const getDataBlobClient = (dataClient: DataClient, path: string): AppendBlobClient =>
  dataClient.getAppendBlobClient(path)
