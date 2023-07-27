import { FunctionResult, InvocationContext, app } from '@azure/functions'
import { zDataIngestion } from '../common/validation'
import { STORAGE_CONNECTION_ENV, STORAGE_INGESTION_QUEUE } from '../configuration'
import { DataTypeService } from '../services/data-type'

const dataTypeService = DataTypeService.create()

// Dummy message for development:
// {"type":"Development","tag":"Tag","data":[["2023-07-26T15:55:00.000Z", 1.23],["2023-07-26T15:56:00.000Z", 3.21]]}
const handler = async (message: unknown, _ctx: InvocationContext): Promise<FunctionResult<void>> => {
  console.log('!!! Message:', message)
  const payload = zDataIngestion.parse(message)
  console.log('!!! Payload:', payload)
  const dataType = await dataTypeService.get(payload.type)
  console.log('!!! Data type:', dataType)
}

app.storageQueue(
  'QueueIngestion',
  { connection: STORAGE_CONNECTION_ENV, queueName: STORAGE_INGESTION_QUEUE, handler }
)
