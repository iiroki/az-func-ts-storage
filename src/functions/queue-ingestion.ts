import { FunctionResult, InvocationContext, app } from '@azure/functions'
import { z } from 'zod'
import { STORAGE_CONNECTION_ENV, STORAGE_INGESTION_QUEUE } from '../configuration'
import { DataIngestion } from '../model'
import { ConfigManager } from '../services/config-manager'

const configManager = ConfigManager.create()

const zDataIngestion: z.ZodType<DataIngestion> = z.object({
  type: z.string(),
  tag: z.string().optional(),
  data: z.array(z.unknown())
})

const handler = async (message: unknown, _ctx: InvocationContext): Promise<FunctionResult<void>> => {
  console.log('!!! Message:', message)
  const payload = zDataIngestion.parse(message)
  console.log('!!! Payload:', payload)
  const config = await configManager.getConfigForType(payload.type)
  console.log('!!! Config:', config)
}

app.storageQueue(
  'QueueIngestion',
  { connection: STORAGE_CONNECTION_ENV, queueName: STORAGE_INGESTION_QUEUE, handler }
)
