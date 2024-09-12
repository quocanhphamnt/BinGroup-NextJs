import { useState } from 'react'

export const useFormatDate = (date?: string) => {
  const [dateValue, setDateValue] = useState(date ?? '')

  const checkValue = (str: string, max: number) => {
    if (str.charAt(0) !== '0' || str == '00') {
      let num = parseInt(str)

      if (isNaN(num) || num <= 0 || num > max) num = 1
      str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString()
    }

    return str
  }

  const handleInputChange = (input: string) => {
    if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3)
    const values = input.split('/').map(function (v) {
      return v.replace(/\D/g, '')
    })

    if (values[0]) values[0] = checkValue(values[0], 12)

    if (values[1]) values[1] = checkValue(values[1], 31)

    if (values[2]) values[2] = checkValue(values[2], 9999)

    const output = values.map(function (v, i) {
      return v.length == 2 && i < 2 ? v + '/' : v
    })
    setDateValue(output.join('').substr(0, 14))
  }

  return { dateValue, handleInputChange, setDateValue }
}
