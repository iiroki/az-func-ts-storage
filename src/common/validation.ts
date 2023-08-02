import { z } from 'zod'
import { DataIngestion, DataRequestParams } from '../model'

export const zInt = z.number().int()
export const zFloat = z.number()
export const zString = z.string()
export const zTimestamp = z.string().datetime({ offset: true })

export const zDataRequestParams: z.ZodType<DataRequestParams> = z.object({
  from: zTimestamp,
  to: zTimestamp,
  tag: z.string().optional()
})

export const zDataIngestion: z.ZodType<DataIngestion> = z.object({
  type: z.string(),
  tag: z.string().optional(),
  data: z.array(z.array(z.unknown()))
})

export const zDataTypeConfiguration = z.object({
  useTags: z.boolean().default(false),
  blobPathTimestamp: z.union([z.literal('day'), z.literal('hour')]).default('day'),
  schema: z.array(z.object({
    key: z.string(),
    type: z.union([z.literal('int'), z.literal('float'), z.literal('string'), z.literal('timestamp')]),
    isRequired: z.boolean().default(true),
    isTimestamp: z.boolean().default(false)
  }))
})
