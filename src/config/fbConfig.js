import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import keys from '../keys'
//Set up firebase configuration.
var config = {
  apiKey: keys.apiKey,
  authDomain: "mycelit.firebaseapp.com",
  databaseURL: "https://mycelit.firebaseio.com",
  projectId: "mycelit",
  storageBucket: "mycelit.appspot.com",
  messagingSenderId: "419423787890",
  appId: "1:419423787890:web:cd166a94ea0f1fd75e9beb"
}

firebase.initializeApp(config);
firebase.firestore();


export default firebase