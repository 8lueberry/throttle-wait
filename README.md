# Run a function at max once per x milliseconds. Subsequent calls will wait.

## Quick start

```typescript
const run = throttle(5 * 1000, async () => {
  // 5 seconds
  return new Date()
})

//
console.log(await run())

//
console.log(await run())

//
console.log(await run())
```

## Typescript decorators

```typescript
class MyClass {
  @Throttle(5 * 1000) // 5 seconds
  public async run() {
    return new Date()
  }
}
const myClass = new MyClass()

//
console.log(await myClass.run())

//
console.log(await myClass.run())

//
console.log(await myClass.run())
```
