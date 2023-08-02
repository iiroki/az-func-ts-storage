import { HttpResponseInit } from '@azure/functions'

export const createBadRequestResponse = (errors: (object | string)[]): HttpResponseInit => ({
  status: 400,
  jsonBody: { errors }
})
