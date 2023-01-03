import { describe, it, expect } from 'vitest'
import { promiseAllLimit } from './p-all-limit'

describe('promiseAllLimit', () => {
  it('should resolve all promises', async () => {
    const res = await promiseAllLimit(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (n) => Promise.resolve(n),
      3
    )
    expect(res).toMatchInlineSnapshot(`
      [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `)
  })

  it('should reject if one promise rejects', async () => {
    const res = await promiseAllLimit(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      (n) =>
        n === 5 ? Promise.reject(new Error('some error')) : Promise.resolve(n),
      3
    ).catch((e) => e)
    expect(res).toMatchInlineSnapshot('[Error: some error]')
  })

  it('should only work on 2 task at a time with limit 2', async () => {
    const getTime = () => {
      {
        const hrTime = process.hrtime()
        return hrTime[0] * 1000 + hrTime[1] / 1000000
      }
    }

    const res = await promiseAllLimit<number>(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      async (n) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(getTime())
          }, 500)
        })
      },
      2
    )
    expect(res[0]).toBeLessThan(res[1])
    expect(res[9] - res[0]).toBeGreaterThan(2000) // the difference between end of first batch and end of last batch should be more than 2 seconds, not 2.5 seconds, there are only 4 batches after the first one
  })
})
