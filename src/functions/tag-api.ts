import { HttpHandler, app } from '@azure/functions'
import { parseISO } from 'date-fns'
import { createBadRequestResponse } from '../common/http'
import { zDataRequestParams } from '../common/validation'
import { API_TYPE_PARAM } from '../model'
import { DataTypeService } from '../services/data-type'

const dataTypeService = DataTypeService.create()

const handler: HttpHandler = async (req, _ctx) => {
  // const { query } = req
  // const validation = zDataRequestParams.safeParse({
  //   from: query.get('from') ?? undefined,
  //   to: query.get('to') ?? undefined,
  //   tag: query.get('tag') ?? undefined
  // })

  // if (!validation.success) {
  //   return createBadRequestResponse(validation.error.issues)
  // }

  // const type = req.params[API_TYPE_PARAM]
  // const dataType = await dataTypeService.get(type)
  // console.log('!!! Data type:', dataType)

  // const { from, to, tag } = validation.data
  // const fromDate = parseISO(from)
  // const toDate = parseISO(to)
  // console.log('!!! Params:', validation.data)

  // TODO
  return { jsonBody: [] }
}

app.http(
  'TagApi',
  { route: `tags/{${API_TYPE_PARAM}:alpha}`, methods: ['GET'], handler }
)
