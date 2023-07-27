import { gzip } from 'zlib'

export const toGzipBuffer = (source: string): Promise<Buffer> => new Promise((res, rej) => {
  gzip(source, (err, result) => {
    if (err) {
      rej(err)
    }

    res(result)
  })
})
