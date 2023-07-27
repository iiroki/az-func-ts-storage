import { z } from 'zod'
import { DataIngestion } from '../model'

export const zDataIngestion: z.ZodType<DataIngestion> = z.object({
  type: z.string(),
  tag: z.string().optional(),
  data: z.array(z.array(z.unknown()))
})

export const zDataTypeConfiguration = z.object({
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

export const zInt = z.number().int()
export const zFloat = z.number()
export const zString = z.string()
export const zTimestamp = z.string().datetime({ offset: true })
