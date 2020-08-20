/**
 * Wraps a function into a function that checks and wait until the time has passed before calling the original function
 * @param time The time to wait in milliseconds
 * @param cb The function to call
 */
export function throttle<T>(
  time: number,
  cb: () => T | Promise<T>,
): (context?: any, args?: any) => Promise<T> {
  let last = 0

  return async (context?: any, args?: any) => {
    const go = () => {
      last = new Date().getTime()
      const result = cb.apply(context, args)
      return result
    }

    const now = new Date().getTime()
    if (last + time > now) {
      return new Promise((resolve, reject) =>
        setTimeout(() => {
          try {
            resolve(go())
          } catch (err) {
            reject(err)
            return
          }
        }, now - last + time),
      )
    }

    return await go()
  }
}

/**
 * Ensures that a funciton is not called more than once per specified time
 * @param time The time to wait in milliseconds
 */
export const Throttle = (time: number) => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): any => {
  const method = descriptor.value
  const methodT = throttle(time, method)

  descriptor.value = function (...args: any[]) {
    return methodT(this, args)
  }
}
