import { ContainerClient } from '@azure/storage-blob'

export type StorageParams = {
  readonly containerClient: ContainerClient
  readonly blobPath: string
}

export type StorageWriteParams =  StorageParams & {
  readonly content: NodeJS.ReadableStream
}

export type BlobPathParams = {
  readonly type: string
  readonly timestamp: Date
  readonly dataFileName: string
  readonly fileExtension: string
  readonly tag?: string
  readonly includeMinutes?: boolean
}

export const append = async (params: StorageWriteParams): Promise<void> => {
  const { containerClient, blobPath } = params
  const client = containerClient.getAppendBlobClient(blobPath)
  await client.createIfNotExists()
  // TODO: Append to blob
}

export const createBlobPath = (params: BlobPathParams): string => {
  const { type, tag, timestamp, includeMinutes, dataFileName, fileExtension } = params
  const parts = [`type=${type}`]
  if (tag) {
    parts.push(`tag=${tag}`)
  }

  // TODO: Is UTC correct here?
  parts.push(...[
    `year=${timestamp.getUTCFullYear()}`,
    `month=${timestamp.getUTCMonth()}`,
    `day=${timestamp.getUTCDate()}`,
    `hour=${timestamp.getUTCHours()}`
  ])

  if (includeMinutes) {
    parts.push(`minute=${timestamp.getUTCMinutes()}`)
  }

  parts.push(`${dataFileName}.${fileExtension}`)
  return parts.join('/')
}
