import { ContainerClient } from '@azure/storage-blob'
import { parseISO } from 'date-fns'
import { toCsvString } from '../common/csv'
import { divideByTimestampHour } from '../common/date'
import { toGzipBuffer } from '../common/gzip'
import { StorageWriteParams, appendToDataBlob, createDataBlobPath } from '../common/storage'
import { DataIngestion } from '../model'
import { DataTypeService } from '../services/data-type'

export type DataIngestionContext = {
  readonly dataTypeService: DataTypeService
  readonly dataClient: ContainerClient
}

export const ingest = async (payload: DataIngestion, ctx: DataIngestionContext): Promise<void> => {
  const { dataTypeService, dataClient } = ctx
  const dataType = await dataTypeService.get(payload.type)
  if (!dataType) {
    return // TODO: Handle this case
  }

  const { config, validator, dataTimestampIndex } = dataType
  const includeMinutes = config.blobPathTimestamp === 'minute'
  const { type, tag, data } = validator.parse(payload)

  // TODO: Divide by minute if defined so
  const dataByDay = divideByTimestampHour(data, i => parseISO(i[dataTimestampIndex] as string))

  const storageWriteParamPromises: Promise<StorageWriteParams>[] = dataByDay.map(async day => ({
    dataClient: dataClient,
    content: await toGzipBuffer(await toCsvString(day[1])),
    blobPath: createDataBlobPath({
      type,
      tag,
      includeMinutes,
      timestamp: day[0],
      dataFileName: config.dataFileName,
      fileExtension: 'csv.gz'
    })
  }))

  const storageWriteParams = await Promise.all(storageWriteParamPromises)
  const appendPromises = storageWriteParams.map(appendToDataBlob)
  await Promise.all(appendPromises)

  // TODO: Return something to indicate how the execution went
}
