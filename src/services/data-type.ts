import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'
import { z } from 'zod'
import { zDataTypeConfiguration, zFloat, zInt, zString, zTimestamp } from '../common/validation'
import { STORAGE_CONNECTION, STORAGE_CONFIGURATION_CONTAINER } from '../configuration'
import { DataTypeConfiguration, DataTypeContainer, DataTypeSchemaItem, DataTypeSchemaValidator } from '../model'

export class DataTypeService {
  private readonly containerClient: ContainerClient
  private readonly cache: Map<string, DataTypeContainer> = new Map()

  constructor(connection: string, container: string) {
    this.containerClient = BlobServiceClient.fromConnectionString(connection).getContainerClient(container)
  }

  async get(type: string): Promise<DataTypeContainer | null> {
    const cached = this.cache.get(type)
    if (cached) {
      return cached
    }

    const raw = await this.fetchRawConfigFromStorage(type)
    if (!raw) {
      return null // TODO: Handle not found
    }

    const config: DataTypeConfiguration = zDataTypeConfiguration.parse(raw)
    const container = this.createContainer(type, config)
    this.cache.set(container.type, container)
    return container
  }

  private async fetchRawConfigFromStorage(type: string): Promise<object | null> {
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

  private createContainer(type: string, config: DataTypeConfiguration): DataTypeContainer {
    return { type, config, validator: this.createSchemaValidator(config) }
  }

  private createSchemaValidator(config: DataTypeConfiguration): DataTypeSchemaValidator {
    const { schema, useTags } = config

    const itemValidators: z.ZodTypeAny[] = []
    schema.forEach(s => {
      const typeValidator = this.getSchemaItemValidator(s)
      const isRequiredOrTimestamp = s.isRequired || s.isTimestamp
      itemValidators.push(isRequiredOrTimestamp ? typeValidator : typeValidator.nullable())
    })

    const validator = z.object({
      type: z.string(),
      tag: useTags ? z.string() : z.string().optional(),
      data: z.array(z.tuple([itemValidators[0], ...itemValidators.slice(1)]))
    })

    return validator
  }

  private getSchemaItemValidator(item: DataTypeSchemaItem): z.ZodType {
    switch (item.type) {
      case 'int': return zInt
      case 'float': return zFloat
      case 'string': return zString
      case 'timestamp': return zTimestamp
      default: throw new Error(`Unknown type: ${item.type}`)
    }
  }

  public static create(): DataTypeService {
    return new DataTypeService(STORAGE_CONNECTION, STORAGE_CONFIGURATION_CONTAINER)
  }
}
