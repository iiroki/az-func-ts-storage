import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'
import { z } from 'zod'
import { STORAGE_CONNECTION, STORAGE_CONFIGURATION_CONTAINER } from '../configuration'
import { DataTypeConfiguration } from '../model'

const zDataTypeConfiguration = z.object({
  useTags: z.boolean().default(false),
  timestampPrecision: z.union([z.literal('hour'), z.literal('minute')]).default('minute'),
  dataFileName: z.string().default('data'),
  schema: z.array(z.object({
    key: z.string(),
    type: z.union([z.literal('int'), z.literal('float'), z.literal('string'), z.literal('timestamp')]),
    isRequired: z.boolean().default(true),
    isTimestamp: z.boolean().default(false)
  }))
})

export class ConfigManager {
  private readonly containerClient: ContainerClient
  private readonly cache: Map<string, DataTypeConfiguration> = new Map()

  private constructor(connection: string, container: string) {
    this.containerClient = BlobServiceClient.fromConnectionString(connection).getContainerClient(container)
  }

  async getConfigForType(type: string): Promise<DataTypeConfiguration | null> {
    const cached = this.cache.get(type)
    if (cached) {
      return cached
    }

    const raw = await this.getRawFromStorage(type)
    if (!raw) {
      return null // TODO: Handle not found
    }

    const config: DataTypeConfiguration = zDataTypeConfiguration.parse(raw)
    this.cache.set(type, config)
    return config
  }

  private async getRawFromStorage(type: string): Promise<object | null> {
    const blob = this.containerClient.getBlobClient(this.getBlobPath(type))
    const exists = await blob.exists()
    if (!exists) {
      return null
    }

    const content = await blob.downloadToBuffer()
    const raw = JSON.parse(content.toString('utf-8'))
    return raw
  }

  private getBlobPath(type: string): string {
    return `${type}.json`
  }

  public static create(): ConfigManager {
    return new ConfigManager(STORAGE_CONNECTION, STORAGE_CONFIGURATION_CONTAINER)
  }
}
