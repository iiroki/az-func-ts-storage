export type DataIngestion = {
  readonly type: string
  readonly tag?: string
  readonly data: unknown[]
}

export type DataTypeConfiguration = {
  readonly useTags: boolean
  readonly timestampPrecision: 'hour' | 'minute'
  readonly dataFileName: string
  readonly schema: DataTypeSchemaItem[]
}

export type DataTypeSchemaItem = {
  readonly key: string
  readonly type: DataTypeSchemaItemType
  readonly isRequired: boolean
  readonly isTimestamp: boolean
}

export type DataTypeSchemaItemType = 'int' | 'float' | 'string' | 'timestamp'
