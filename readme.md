## p-all-limit

```ts
import { promiseAllLimit } from 'p-all-limit'

promiseAllLimit(
  [1, 2, 3, 4],
  async (n) => {
    console.log(n)
    await sleep(1000)
  },
  2
)
```

outputs:

```sh
1
2
# first batch finishes after 1000ms
3
4
# second batch finishes
```

### Why is it needed

For when you are constrained by either memory or some other external constraint(eg. database connections) you must ensure that an array too big won't consume all available resources.

### Why yet another package?

There is a lot of similar packages, for example:

- https://www.npmjs.com/package/p-limit
- https://www.npmjs.com/package/promise-parallel-limit
- https://www.npmjs.com/package/promises-all-limit
- https://www.npmjs.com/package/promise-limit

but none of them had the API I wished for, also typescript types were lacking for most of these. For example p-limit of them forces you to create a limit function and call it for each promise. This package lets you just call the
