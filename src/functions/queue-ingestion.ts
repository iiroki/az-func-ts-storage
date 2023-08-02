import { StorageQueueHandler, app } from '@azure/functions'
import { BlobServiceClient } from '@azure/storage-blob'
import { ingest } from '../common/ingestion'
import { zDataIngestion } from '../common/validation'
import {
  STORAGE_CONNECTION,
  STORAGE_CONNECTION_ENV,
  STORAGE_DATA_CONTAINER,
  STORAGE_INGESTION_QUEUE
} from '../environment'
import { DataTypeService } from '../services/data-type'

const dataTypeService = DataTypeService.create()
const dataClient = BlobServiceClient
  .fromConnectionString(STORAGE_CONNECTION)
  .getContainerClient(STORAGE_DATA_CONTAINER)

// Dummy message for development:
// {"type":"Development","tag":"Tag","data":[["2023-07-26T15:55:00.000Z", 1.23],["2023-07-26T15:56:00.000Z", 3.21]]}
const handler: StorageQueueHandler = async (message, _ctx) => {
  const payload = zDataIngestion.parse(message)
  await ingest(payload, { dataTypeService, dataClient })
}

app.storageQueue(
  'QueueIngestion',
  { connection: STORAGE_CONNECTION_ENV, queueName: STORAGE_INGESTION_QUEUE, handler }
)
