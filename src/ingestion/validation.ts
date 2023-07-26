import { z } from 'zod'
import { DataIngestion, DataTypeConfiguration, DataTypeSchemaItemType } from '../model'

// Define validators for data schema item types:
const zInt = z.number().int()
const zFloat = z.number()
const zString = z.string()
const zTimestamp = z.string().datetime({ offset: true })

export const createValidatorForData = (configuration: DataTypeConfiguration): z.ZodType<DataIngestion> => {
  const { schema, useTags } = configuration

  const itemValidators: z.ZodTypeAny[] = []
  schema.forEach(s => {
    const typeValidator = getValidatorForType(s.type)
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

const getValidatorForType = (type: DataTypeSchemaItemType): z.ZodType => {
  switch (type) {
    case 'int': return zInt
    case 'float': return zFloat
    case 'string': return zString
    case 'timestamp': return zTimestamp
    default: throw new Error(`Unknown type: ${type}`)
  }
}
