import { UPDATE_CWD, SHOW_REMOTE_BRANCHES } from './actions'

const initialState = {
  cwd: '',

  // Show data from remotes
  showRemoteBranches: true,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CWD: {
      const { cwd } = action

      return {
        ...state,
        cwd,
      }
    }
    case SHOW_REMOTE_BRANCHES: {
      return {
        ...state,
        showRemoteBranches: action.show,
      }
    }
    default: {
      return state
    }
  }
}
