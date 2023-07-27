import csv from 'csv'
import { DataBatch } from '../model'

export const toCsvString = (data: DataBatch): Promise<string> => new Promise((res, rej) => {
  const stringifier = csv.stringify({ header: false, delimiter: '|' }, (err, data) => {
    if (err) {
      rej(err)
    }

    res(data)
  })

  data.forEach(d => stringifier.write(d))
  stringifier.end()
})
