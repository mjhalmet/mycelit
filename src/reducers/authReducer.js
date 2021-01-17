//Redux needs an initial state.
const initState = {
  accessToken: "",
  isSignedIn: false,
  user: "",
}
//Actions to deal with the state. Also checks if localStorage already has a saved and not expired access token in it. If so, reducer uses data straight from localStorage.
const authReducer = (state = initState, action) => {
  const localStorageAccessToken = window.localStorage.getItem('accessToken')
  const localStorageExpires_at = window.localStorage.getItem('expires_at')
  const userName = window.localStorage.getItem('userName')
  
  if (window.localStorage.getItem('accessToken') && new Date() <= new Date(Number(localStorageExpires_at))) {
    return {
      ...state,
      accessToken: localStorageAccessToken,
      isSignedIn: true,
      user: userName,
    }
  } else if (action.type === 'ADD_ACCESSTOKEN') {
    return {
      ...state,
      accessToken: action.token
    }
  } else if (action.type === 'IS_SIGNED_IN') {
    return {
      ...state,
      isSignedIn: action.isSignedIn
    }
  } else if (action.type === 'ADD_USER') {
    return {
      ...state,
      user: action.user
    }
  } else if (action.type === 'ADD_UID') {
    return {
      ...state,
      userUID: action.userUID
    }
  }
  return state
}

export default authReducer