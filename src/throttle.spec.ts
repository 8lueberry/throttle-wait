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

  test('make sure the context of the object is the same', async () => {
    // arrange
    class Test {
      constructor(public id = 'TestID') {}
      @Throttle(throttleTime)
      public async run() {
        return this.id
      }
    }
    const instance = new Test()

    // act
    const result = await instance.run()

    // assert
    expect(result).toEqual('TestID')
  })
})
