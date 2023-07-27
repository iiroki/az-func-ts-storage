import { eachHourOfInterval } from 'date-fns'

export interface TimestampExtractor<T> { (item: T): Date }

export const splitTimespanIntoHours = (from: Date, to: Date): Date[] => {
  const start = getTimestampHour(from)
  return eachHourOfInterval({ start, end: to })
}

export const getTimestampHour = (timestamp: Date): Date => {
  return new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate(), timestamp.getHours())
}

export const divideByTimestampHour = <T>(items: T[], timestampExtractor: TimestampExtractor<T>): [Date, T[]][] => {
  const dayMap: Map<number, T[]> = new Map()

  items.forEach(i => {
    const ts = timestampExtractor(i)
    const day = getTimestampHour(ts)
    const existing = dayMap.get(day.getTime())
    if (existing) {
      existing.push(i)
    } else {
      dayMap.set(day.getTime(), [i])
    }
  })

  return [...dayMap.entries()].map(e => [new Date(e[0]), e[1]])
}
