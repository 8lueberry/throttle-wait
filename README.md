# throttle-wait

Run a function at max once per x milliseconds. Subsequent calls will wait.

## Installation

```bash
$ npm install throttle-wait
```

or

```bash
$ yarn add throttle-wait
```

## Simple usage

```typescript
import { throttle } from 'throttle-wait'

function myFn() {
  console.log(new Date())
}

const myFnThrottled = throttle(5 * 1000, myFn) // 5s

// 2020-01-01T00:00:00.114Z
await myFnThrottled()

// 2020-01-01T00:00:05.120Z
await myFnThrottled()

// 2020-01-01T00:00:10.125Z
await myFnThrottled()
```

## Typescript decorator usage

```typescript
import { Throttle } from 'throttle-wait'

class MyClass {
  @Throttle(5 * 1000) // 5s
  public async myFn() {
    console.log(new Date())
  }
}
const myClass = new MyClass()

// 2020-01-01T00:00:00.114Z
await myClass.myFn()

// 2020-01-01T00:00:05.120Z
await myClass.myFn()

// 2020-01-01T00:00:10.125Z
await myClass.myFn()
```

IMPORTANT: Make your function async. The decorator will return an async function. This will ensure that the intellisense of your IDE tells you that your function is async.
