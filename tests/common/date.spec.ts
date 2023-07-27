import { divideByDay, getTimestampDay, splitTimespanIntoDays } from '../../src/common/date'

describe('Date tests', () => {
  it('getTimestampDay: OK', () => {
    const date = new Date(2023, 1, 28, 18, 45, 12, 123)
    const day = getTimestampDay(date)
    expect(day.getFullYear()).toBe(2023)
    expect(day.getMonth()).toBe(1)
    expect(day.getDate()).toBe(28)
    expect(day.getHours()).toBe(0)
    expect(day.getMinutes()).toBe(0)
    expect(day.getSeconds()).toBe(0)
    expect(day.getMilliseconds()).toBe(0)
  })

  it('splitTimespanIntoDays: OK', () => {
    const from = new Date(2023, 1, 28, 18, 45, 12, 123)
    const to = new Date(2023, 2, 14, 21, 34, 43, 321)
    const days = splitTimespanIntoDays(from, to)
    expect(days).toHaveLength(15)
  })

  it('divideByDay: OK', () => {
    const items = [
      { key: 'Day1_Item1', ts: new Date(2023, 1, 28, 18, 45, 12, 123) },
      { key: 'Day1_Item2', ts: new Date(2023, 1, 28, 19, 44, 12, 123) },
      { key: 'Day1_Item3', ts: new Date(2023, 1, 28, 14, 45, 12, 123) },
      { key: 'Day2_Item1', ts: new Date(2023, 2, 4, 12, 45, 12, 123) },
      { key: 'Day2_Item2', ts: new Date(2023, 2, 4, 15, 45, 12, 123) },
      { key: 'Day3_Item1', ts: new Date(2023, 2, 12, 18, 45, 12, 123) },
      { key: 'Day4_Item1', ts: new Date(2023, 3, 1, 18, 45, 12, 123) },
      { key: 'Day4_Item2', ts: new Date(2023, 3, 1, 18, 45, 12, 123) },
      { key: 'Day5_Item1', ts: new Date(2023, 3, 9, 18, 45, 12, 123) },
      { key: 'Day6_Item1', ts: new Date(2023, 3, 15, 18, 45, 12, 123) }
    ]

    const divided = divideByDay(items, i => i.ts)
    expect(divided).toHaveLength(6)
    expect(divided[0][1]).toHaveLength(3)
    expect(divided[1][1]).toHaveLength(2)
    expect(divided[2][1]).toHaveLength(1)
    expect(divided[3][1]).toHaveLength(2)
    expect(divided[4][1]).toHaveLength(1)
    expect(divided[5][1]).toHaveLength(1)
  })
})
