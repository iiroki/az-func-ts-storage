import { HttpHandler, app } from '@azure/functions'
import { createBadRequestResponse } from '../common/http'
import { ingest } from '../common/ingestion'
import { createDataClient } from '../common/storage'
import { zDataIngestion } from '../common/validation'
import { DataTypeService } from '../services/data-type'

const dataTypeService = DataTypeService.create()
const dataContainerClient = createDataClient()

export const handler: HttpHandler = async (req, _ctx) => {
  const validation = zDataIngestion.safeParse(await req.json())
  if (!validation.success) {
    return createBadRequestResponse(validation.error.issues)
  }

  await ingest(validation.data, { dataTypeService, dataClient: dataContainerClient })
  return { status: 201 }
}

app.http(
  'IngestionApi',
  { route: 'ingestion', methods: ['POST'], handler }
)
