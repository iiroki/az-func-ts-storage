import { HttpHandler, app } from '@azure/functions'
import { parseISO } from 'date-fns'
import { fromCsvString } from '../common/csv'
import { splitTimespanIntoHours } from '../common/date'
import { fromGzipBuffer } from '../common/gzip'
import { createBadRequestResponse } from '../common/http'
import { createDataBlobPath, createDataClient, dataBlobExists, readDataBlob } from '../common/storage'
import { zDataRequestParams } from '../common/validation'
import { API_TYPE_PARAM } from '../model'
import { DataTypeService } from '../services/data-type'

const dataTypeService = DataTypeService.create()
const dataClient = createDataClient()

const handler: HttpHandler = async (req, _ctx) => {
  const { query } = req
  const validation = zDataRequestParams.safeParse({
    from: query.get('from') ?? undefined,
    to: query.get('to') ?? undefined,
    tag: query.get('tag') ?? undefined
  })

  if (!validation.success) {
    return createBadRequestResponse(validation.error.issues)
  }

  const type = req.params[API_TYPE_PARAM]
  const dataType = await dataTypeService.get(type)
  if (!dataType) {
    return { status: 404 }
  }

  console.log('!!! Data type:', dataType)
  const { from, to, tag } = validation.data
  if (dataType.config.useTags && !tag) {
    return createBadRequestResponse([`"tag" query parameter is required for data type: ${dataType.type}`])
  }

  const blobDates = dataType.config.blobPathTimestamp === 'hour'
    ? splitTimespanIntoHours(parseISO(from), parseISO(to))
    : [] // TODO: Day

  const existingDataBlobPromises = blobDates
    .map(timestamp => createDataBlobPath({
      tag,
      timestamp,
      type: dataType.type,
      includeHours: dataType.config.blobPathTimestamp === 'hour',
      fileExt: '.csv.gz'
    }))
    .map(path => ({ path, exists: dataBlobExists(dataClient, path) }))

  const dataPaths: string[] = []
  for (const dataBlob of existingDataBlobPromises) {
    if (await dataBlob.exists) {
      dataPaths.push(dataBlob.path)
    }
  }

  const dataPromises = dataPaths.map(path => readDataBlob(dataClient, path))
  const data = await Promise.all(dataPromises)

  // TODO: Handle with streams
  const result = []
  for (const test of data) {
    const testStr = await fromGzipBuffer(test)
    result.push(...await fromCsvString(testStr))
  }

  return { jsonBody: result }
}

app.http(
  'DataApi',
  { route: `data/{${API_TYPE_PARAM}:alpha}`, methods: ['GET'], handler }
)
