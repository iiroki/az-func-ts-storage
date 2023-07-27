import { eachDayOfInterval } from 'date-fns'

export interface TimestampExtractor<T> { (item: T): Date }

export const splitTimespanIntoDays = (from: Date, to: Date): Date[] => {
  const start = getTimestampDay(from)
  return eachDayOfInterval({ start, end: to })
}

export const getTimestampDay = (timestamp: Date): Date => {
  return new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate())
}

export const divideByDay = <T>(items: T[], timestampExtractor: TimestampExtractor<T>): [Date, T[]][] => {
  const dayMap: Map<number, T[]> = new Map()

  items.forEach(i => {
    const ts = timestampExtractor(i)
    const day = getTimestampDay(ts)
    const existing = dayMap.get(day.getTime())
    if (existing) {
      existing.push(i)
    } else {
      dayMap.set(day.getTime(), [i])
    }
  })

  return [...dayMap.entries()].map(e => [new Date(e[0]), e[1]])
}
