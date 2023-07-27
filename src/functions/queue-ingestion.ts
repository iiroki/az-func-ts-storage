import { Readable } from 'stream'
import { FunctionResult, InvocationContext, app } from '@azure/functions'
import { BlobServiceClient } from '@azure/storage-blob'
import { parseISO } from 'date-fns'
import { divideByDay } from '../common/date'
import { StorageWriteParams, append, createBlobPath } from '../common/storage'
import { zDataIngestion } from '../common/validation'
import {
  STORAGE_CONNECTION,
  STORAGE_CONNECTION_ENV,
  STORAGE_DATA_CONTAINER,
  STORAGE_INGESTION_QUEUE
} from '../configuration'
import { DataTypeService } from '../services/data-type'

// Setup singletons for the instance:
const dataTypeService = DataTypeService.create()
const storageContainerClient = BlobServiceClient
  .fromConnectionString(STORAGE_CONNECTION)
  .getContainerClient(STORAGE_DATA_CONTAINER)

// Dummy message for development:
// {"type":"Development","tag":"Tag","data":[["2023-07-26T15:55:00.000Z", 1.23],["2023-07-26T15:56:00.000Z", 3.21]]}
const handler = async (message: unknown, _ctx: InvocationContext): Promise<FunctionResult<void>> => {
  const payload = zDataIngestion.parse(message)
  const dataType = await dataTypeService.get(payload.type)
  if (!dataType) {
    return // TODO: Handle this case
  }

  const { config, validator, dataTimestampIndex } = dataType
  const includeMinutes = config.timestampPrecision === 'minute'
  const { type, tag, data } = validator.parse(payload)

  // TODO: Divide by minute if defined so
  const dataByDay = divideByDay(data, i => parseISO(i[dataTimestampIndex] as string))

  const writeParams: StorageWriteParams[] = dataByDay.map(day => ({
    containerClient: storageContainerClient,
    content: new Readable(),
    blobPath: createBlobPath({
      type,
      tag,
      includeMinutes,
      timestamp: day[0],
      dataFileName: config.dataFileName,
      fileExtension: 'csv.gz'
    })
  }))

  const promises = writeParams.map(append)
  await Promise.all(promises)
}

app.storageQueue(
  'QueueIngestion',
  { connection: STORAGE_CONNECTION_ENV, queueName: STORAGE_INGESTION_QUEUE, handler }
)
