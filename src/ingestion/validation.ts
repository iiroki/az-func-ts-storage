import { z } from 'zod'
import { DataIngestion, DataTypeConfiguration } from '../model'

// TODO
export const createDataValidator = (configuration: DataTypeConfiguration): z.ZodType<DataIngestion> => {
  const zTag = configuration.useTags ? z.string() : z.string().optional()
  const zod = z.object({
    type: z.string(),
    tag: zTag,
    data: z.array(z.unknown())
  })

  return zod
}
