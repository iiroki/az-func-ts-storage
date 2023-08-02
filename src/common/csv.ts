import csv from 'csv'
import { DataBatch } from '../model'

const CSV_DELIMITER = '|'

export const toCsvString = (data: DataBatch): Promise<string> => new Promise((res, rej) => {
  const stringifier = csv.stringify({ header: false, delimiter: CSV_DELIMITER }, (err, data) => {
    if (err) {
      rej(err)
    }

    res(data)
  })

  data.forEach(d => stringifier.write(d))
  stringifier.end()
})

export const fromCsvString = (data: string): Promise<DataBatch> => new Promise((res, rej) => {
  const parser = csv.parse({ delimiter: CSV_DELIMITER }, (err, data) => {
    if (err) {
      rej(err)
    }

    res(data)
  })

  parser.write(data)
  parser.end()
})
