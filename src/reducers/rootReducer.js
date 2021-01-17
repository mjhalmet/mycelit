import authReducer from './authReducer.js'
import { firestoreReducer } from 'redux-firestore'
import { combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'

//rootReducer to combine all reducers and other stuff so we can send it to our application in index.js
const rootReducer = combineReducers ({
  authReducer: authReducer,
  //Used in Library.js mapStateToProps() to get user auth uid and to attach firestore data to component
  firestore: firestoreReducer,
  firebase: firebaseReducer
})

export default rootReducer
