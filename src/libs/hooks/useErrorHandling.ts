import { useEffect } from 'react'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

const useErrorHandling = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: Record<keyof T, string | undefined> | null,
  keysToUse: Array<keyof T>
) => {
  useEffect(() => {
    if (errors) {
      keysToUse.forEach((key) => {
        if (errors[key]) {
          setError(key as Path<T>, { message: errors[key]!, type: 'manual' })
        }
      })
    }
  }, [errors, keysToUse, setError])
}

export default useErrorHandling
