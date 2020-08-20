import { Throttle, throttle } from './throttle'

const callAmount = 10
const throttleTime = 100 // 100ms

describe('throttle', () => {
  test('throttle should not call more than x per time', async () => {
    // arrange
    const result = []
    const run = throttle(throttleTime, async () => {
      result.push(new Date().getTime())
    })

    // act
    for (let i = 0; i < callAmount; i++) {
      await run()
    }

    // assert
    expect(result.length).toEqual(callAmount)
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i + 1] - result[i]).toBeGreaterThanOrEqual(throttleTime)
    }
  })

  test('function is not async should throw', async () => {
    // arrange
    const run = throttle(throttleTime, () => 'Not a promise' as any)

    // act

    // assert
    expect(run()).rejects.toThrowError(`throttle expects your function to be async`)
  })
})

describe('Throttle decorator', () => {
  test('throttle should not call more than x per time', async () => {
    // arrange
    const result = []
    class Test {
      @Throttle(throttleTime)
      public async run() {
        result.push(new Date().getTime())
      }
    }
    const instance = new Test()

    // act
    for (let i = 0; i < callAmount; i++) {
      await instance.run()
    }

    // assert
    expect(result.length).toEqual(callAmount)
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i + 1] - result[i]).toBeGreaterThanOrEqual(throttleTime)
    }
  })

  test('function is not async should throw', async () => {
    // arrange
    class Test {
      @Throttle(throttleTime)
      public run() {
        return 'Not a promise'
      }
    }
    const instance = new Test()

    // act

    // assert
    expect(instance.run()).rejects.toThrowError(`throttle expects your function to be async`)
  })
})
