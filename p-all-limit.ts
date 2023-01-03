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


      if (array.length === 0 && inFlight === 0) {
        return resolve(results)
      }

      while (inFlight < limit && array.length > 0) {
        inFlight++
        const nextItem = array.shift() as T
        itemIndex += 1
        const currentIndexForThisClosure = itemIndex
        iterator(nextItem)
          .then((singleResult) => {
            results[currentIndexForThisClosure] = singleResult
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
