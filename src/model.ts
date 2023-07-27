import z from 'zod'

/**
 * Wraps everything data type related inside a single type.
 */
export type DataTypeContainer = {
  readonly type: string
  readonly config: DataTypeConfiguration
  readonly validator: DataTypeSchemaValidator
  readonly dataTimestampIndex: number
}

export type DataIngestion = {
  readonly type: string
  readonly tag?: string
  readonly data: DataBatch
}

export type DataBatch = unknown[][]

export type DataTypeConfiguration = {
  readonly useTags: boolean
  readonly timestampPrecision: 'hour' | 'minute'
  readonly dataFileName: string
  readonly schema: DataTypeSchema
}

export type DataTypeSchema = DataTypeSchemaItem[]

export type DataTypeSchemaItem = {
  readonly key: string
  readonly type: DataTypeSchemaItemType
  readonly isRequired: boolean
  readonly isTimestamp: boolean
}

export type DataTypeSchemaItemType = 'int' | 'float' | 'string' | 'timestamp'

export type DataTypeSchemaValidator = z.ZodType<DataIngestion>
