import { FunctionResult, InvocationContext, app } from '@azure/functions'
import { z } from 'zod'
import { STORAGE_CONNECTION_ENV, STORAGE_INGESTION_QUEUE } from '../configuration'
import { createValidatorForData } from '../ingestion/validation'
import { DataIngestion } from '../model'
import { ConfigManager } from '../services/config-manager'

const configManager = ConfigManager.create()

const zDataIngestion: z.ZodType<DataIngestion> = z.object({
  type: z.string(),
  tag: z.string().optional(),
  data: z.array(z.array(z.unknown()))
})

// Dummy message for development:
// {"type":"Development","tag":"Tag","data":[["2023-07-26T15:55:00.000Z", 1.23],["2023-07-26T15:56:00.000Z", 3.21]]}
const handler = async (message: unknown, _ctx: InvocationContext): Promise<FunctionResult<void>> => {
  console.log('!!! Message:', message)
  const payload = zDataIngestion.parse(message)
  console.log('!!! Payload:', payload)
  const config = await configManager.getConfigForType(payload.type)
  console.log('!!! Config:', config)
  if (config) {
    const validator = createValidatorForData(config)
    const batch = validator.parse(payload)
    console.log('!!! Batch:', batch)
  }
}

app.storageQueue(
  'QueueIngestion',
  { connection: STORAGE_CONNECTION_ENV, queueName: STORAGE_INGESTION_QUEUE, handler }
)
