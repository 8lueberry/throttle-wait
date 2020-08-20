interface Options {
  max: number
}

const defaultOptions: Options = {
  max: 100,
}

/**
 * Wraps a function into a function that checks and wait until the time has passed before calling the original function
 * @param time The time to wait in milliseconds
 * @param cb The function to call
 */
export function throttle<T>(
  time: number,
  cb: () => T | Promise<T>,
  options = defaultOptions,
): (context?: any, args?: any) => Promise<T> {
  const opt = {
    ...defaultOptions,
    ...options,
  }

  const throttleInfo = {
    next: new Date().getTime(),
    queue: 0,
    bump: () => {
      const now = new Date().getTime()
      const next = throttleInfo.next - now

      throttleInfo.next = throttleInfo.next + time + 50 // because of setTimeout inaccuracy, adding some buffer to be sure
      throttleInfo.queue += 1

      if (throttleInfo.queue > opt.max) {
        throw new Error(
          `Throttle backpressure error: Throttle is being called faster than it can run (queue=${throttleInfo.queue} max=${opt.max} throttle=${time} wait=${next})`,
        )
      }

      return next
    },
  }

  return (context?: any, args?: any) => {
    const go = () => {
      const result = cb.apply(context, args)
      throttleInfo.queue -= 1
      return result
    }

    const nextRun = throttleInfo.bump()

    if (nextRun > 0) {
      return new Promise((resolve, reject) =>
        setTimeout(() => {
          try {
            resolve(go())
          } catch (err) {
            reject(err)
            return
          }
        }, nextRun),
      )
    }

    return go()
  }
}

/**
 * Ensures that a funciton is not called more than once per specified time
 * @param time The time to wait in milliseconds
 */
export const Throttle = (time: number, options?: Options) => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): any => {
  const method = descriptor.value
  const methodT = throttle(time, method, options)

  descriptor.value = function (...args: any[]) {
    return methodT(this, args)
  }
}
