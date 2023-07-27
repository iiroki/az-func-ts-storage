import { ContainerClient } from '@azure/storage-blob'

export type StorageParams = {
  readonly containerClient: ContainerClient
  readonly blobPath: string
}

export type StorageWriteParams =  StorageParams & {
  readonly content: NodeJS.ReadableStream
}

export const write = async (params: StorageWriteParams): Promise<void> => {
  // TODO
}
