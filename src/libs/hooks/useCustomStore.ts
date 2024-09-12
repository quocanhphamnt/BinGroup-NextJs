export type ActionType<T> = {
  type: 'ADD_OR_UPDATE_OBJECT' | 'DELETE_OBJECT' | 'UPDATE_TRIP_COST'
  payload: T
}

export const useCustomStore = <T extends { id?: number; trip_cost?: number | null }>(
  state: T[],
  action: ActionType<T>
) => {
  const objectToAddOrUpdate = action.payload
  const objectIndex = state.findIndex((obj) => obj?.id === objectToAddOrUpdate?.id)
  const filteredState = state.filter((obj) => obj?.id !== action.payload?.id)

  switch (action.type) {
    case 'ADD_OR_UPDATE_OBJECT':
      if (objectIndex !== -1) {
        const newState = [...state]
        newState[objectIndex] = objectToAddOrUpdate

        return newState
      }

      return [...state, objectToAddOrUpdate]
    case 'DELETE_OBJECT':
      return filteredState
    case 'UPDATE_TRIP_COST':
      // eslint-disable-next-line no-case-declarations
      const updatedState = state.map((obj) => ({
        ...obj,
        trip_cost: action.payload.trip_cost
      }))

      return updatedState
    default:
      return state
  }
}
