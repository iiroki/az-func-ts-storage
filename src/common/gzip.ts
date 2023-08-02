import { gunzip, gzip } from 'zlib'

export const toGzipBuffer = (source: string): Promise<Buffer> => new Promise((res, rej) => {
  gzip(source, (err, result) => {
    if (err) {
      rej(err)
    }

    res(result)
  })
})

export const fromGzipBuffer = (source: Buffer): Promise<string> => new Promise((res, rej) => {
  gunzip(source, (err, result) => {
    if (err) {
      rej(err)
    }

    res(result.toString('utf-8'))
  })
})
