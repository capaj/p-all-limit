export const promiseAllLimit = <T>(
  array: any[],
  iterator: (item: any) => Promise<T>,
  limit: number
): Promise<T[]> => {
  let inFlight = 0

  return new Promise((resolve, reject) => {
    let results = [] as T[]
    let itemIndex = -1
    const next = () => {
      itemIndex++

      if (array.length === 0 && inFlight === 0) {
        return resolve(results)
      }

      while (inFlight < limit && array.length > 0) {
        inFlight++
        const nextItem = array.shift() as T

        iterator(nextItem)
          .then((singleResult) => {
            results[itemIndex] = singleResult
            inFlight--
            next()
          })
          .catch((error) => {
            reject(error)
          })
      }
    }

    next()
  })
}
