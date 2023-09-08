// 验证手机号码
export const verifyPhone = (phone: string): boolean => /^1\d{10}$/.test(phone || '')
// 验证数字
export const verifyNumber = (num: number, { minLength = 0, maxLength = 0 } = {}): boolean => {
  if (!num && num !== 0) return false

  const _num = num + ''

  if (!/^[\d]+$/.test(_num)) return false
  if (minLength && _num.length < minLength) return false
  if (maxLength && _num.length > maxLength) return false

  return true
}

// 验证邮箱
export const verifyMail = (mail: string): boolean => /^[\w-]+@(\w+\.)+\w+$/.test(mail || '')

// 验证身份证
export const verifyIDCard = (idCard: string): boolean => /^\d{17}\w$/.test(idCard || '')

// 验证基础类型
export const isUndefined = (data: unknown): data is undefined => data === void 0
export const isNull = (data: unknown): data is null => data === null
export const isBoolean = (data: unknown): data is boolean => typeof data === 'boolean'
export const isNumber = (data: unknown): data is number => typeof data === 'number' && data === data
export const isNaN = (data: unknown): data is number => isNumber(data) && data !== data
export const isString = (data: unknown): data is string => typeof data === 'string'
export const isFunction = (data: unknown): data is Function => typeof data === 'function'
export const isObject = (data: unknown): data is Object =>
  Object.prototype.toString.call(data) === '[object Object]'
export const isArray = (data: unknown): data is Array<any> => Array.isArray(data)
