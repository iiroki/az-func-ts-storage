import { ContainerClient } from '@azure/storage-blob'
import z from 'zod'

export const API_TYPE_PARAM = 'type'

export type DataClient = ContainerClient
export type ConfigurationClient = ContainerClient

/**
 * Wraps everything data type related inside a single type.
 */
export type DataTypeContainer = {
  readonly type: string
  readonly config: DataTypeConfiguration
  readonly validator: DataTypeSchemaValidator
  readonly dataTimestampIndex: number
}

export type DataRequestParams = {
  readonly from: string
  readonly to: string
  readonly tag?: string
  // TODO: Filter?
}

export type DataIngestion = {
  readonly type: string
  readonly tag?: string
  readonly data: DataBatch
}

export type DataBatch = unknown[][]

export type DataTypeConfiguration = {
  readonly useTags: boolean
  readonly blobPathTimestamp: DataTypeBlobPathTimestamp
  readonly schema: DataTypeSchema
}

export type DataTypeSchema = DataTypeSchemaItem[]

export type DataTypeSchemaItem = {
  readonly key: string
  readonly type: DataTypeSchemaItemType
  readonly isRequired: boolean
  readonly isTimestamp: boolean
}

export type DataTypeBlobPathTimestamp = 'day' | 'hour'

export type DataTypeSchemaItemType = 'int' | 'float' | 'string' | 'timestamp'

export type DataTypeSchemaValidator = z.ZodType<DataIngestion>
