/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

type StateFunctionType<S> = Dispatch<SetStateAction<S>>

export type SetStateCallbackGeneric<S> = (x: S | StateFunctionType<S>, cb?: (newState: S) => void) => void

export const useStateCallback = <T>(initialState: T): [T, SetStateCallbackGeneric<T>] => {
  const [state, setState] = useState<T>(initialState)
  const cbRef = useRef<any>(null)

  const setStateCallback: SetStateCallbackGeneric<T> = useCallback((newState, cb) => {
    cbRef.current = cb
    setState(newState as any)
  }, [])

  useEffect(() => {
    if (cbRef?.current instanceof Function) {
      cbRef?.current?.(state)
      cbRef.current = null
    }
  }, [state])

  return [state, setStateCallback]
}
