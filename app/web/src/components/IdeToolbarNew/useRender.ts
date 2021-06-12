import { makeCodeStoreKey } from 'src/helpers/hooks/useIdeState'
import { requestRender } from 'src/helpers/hooks/useIdeState'
import { useContext } from 'react'
import { IdeContext } from 'src/pages/DevIdePage/DevIdePage'

export const useRender = () => {
  const { state, thunkDispatch } = useContext(IdeContext)
  return () => {
    thunkDispatch((dispatch, getState) => {
      const state = getState()
      dispatch({ type: 'setLoading' })
      requestRender({
        state,
        dispatch,
        code: state.code,
        viewerSize: state.viewerSize,
        camera: state.camera,
      })
    })
    localStorage.setItem(makeCodeStoreKey(state.ideType), state.code)
  }
}

