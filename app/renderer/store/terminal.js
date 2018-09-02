export const SET_AUTO_TERMINAL_FULLSCREEN =
  'config/set_auto_terminal_fullscreen'
export const setAutoTerminalFullscreen = (fullscreen) => ({
  type: SET_AUTO_TERMINAL_FULLSCREEN,
  fullscreen,
})

export const FLIP_USER_TERMINAL_FULLSCREEN =
  'config/flip_user_terminal_fullscreen'
export const flipUserTerminalFullscreen = () => ({
  type: FLIP_USER_TERMINAL_FULLSCREEN,
})

const initialState = {
  // Calculated field based on user/auto properties
  fullscreen: false,

  // For the user toggle: takes precedence
  userTerminalFullscreen: false,

  // For auto changes: over-rides small panel, but not user fullscreen
  autoTerminalFullscreen: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FLIP_USER_TERMINAL_FULLSCREEN: {
      const userNext = !state.fullscreen
      const autoNext = state.autoTerminalFullscreen
        ? userNext
        : state.autoTerminalFullscreen
      return {
        ...state,
        userTerminalFullscreen: userNext,
        autoTerminalFullscreen: autoNext,
        fullscreen: userNext || autoNext,
      }
    }
    case SET_AUTO_TERMINAL_FULLSCREEN: {
      const autoNext = action.fullscreen
      return {
        ...state,
        autoTerminalFullscreen: autoNext,
        fullscreen: state.userTerminalFullscreen || autoNext,
      }
    }
    default: {
      return state
    }
  }
}
