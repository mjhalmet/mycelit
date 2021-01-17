import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import firebase from 'firebase/app'
import keys from '../keys'

class Login extends PureComponent {
  
  componentWillMount() {
    var startApp = function() {
      window.gapi.load('auth2', function() {
        //Retrieve the singleton for the GoogleAuth library and set up the client.
        window.auth2 = window.gapi.auth2.init({
          client_id: keys.client_id,
          cookiepolicy: 'single_host_origin',
          //Request scopes in addition to 'profile' and 'email'
          scope: 'https://www.googleapis.com/auth/youtube.readonly'
        });
        //Attach the login method to a button.
        attachSignin(document.getElementById('customBtn'))
        window.auth2.attachClickHandler('customBtn', {}, onSuccess, onFailure)
      });
    };

    var onSuccess = (googleUser) => {
       //We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
          unsubscribe()
        //Check if we are already signed-in to Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
        //Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token)
        //Sign in with credential from the Google user.
        firebase.auth().signInWithCredential(credential).catch(function(error) {
        //Handle Errors here.
        /*
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        */
          })
        }
      })
      //On successful login, show navigation elements, push data to localStorage, dispatch to redux and redirect to EditPage.
      var profile = googleUser.getBasicProfile()
      var userName = profile.getName()
      var userEmail = profile.getEmail()

      console.log(googleUser)
      console.log(userEmail)
      //Get the 2nd item in the object, so we don't have to suffer from Youtube always changing the key name
      var token = Object.keys(googleUser)[1];

      document.getElementById('logoutButton').style.display = 'inline-block'
      document.getElementById('signedInWrapper').style.display = 'none'
      document.getElementById('showLibraryNav').style.display = 'inline-block'
      document.getElementById('showEditPageNav').style.display = 'inline-block'
      document.getElementById('navBarUserName').innerText = 'Signed in: ' + userName
      window.localStorage.setItem('expires_at', googleUser[token].expires_at)
      window.localStorage.setItem('accessToken', googleUser[token].access_token)
      window.localStorage.setItem('userName', userName)
      this.props.dispatch({ type: 'ADD_ACCESSTOKEN', token: googleUser[token].access_token})
      this.props.dispatch({ type: 'IS_SIGNED_IN', isSignedIn: true})
      this.props.dispatch({ type: 'ADD_USER', user: userName})
      this.props.history.push({
        pathname: '/EditPage',
      })
    }
    //Method for checking if the user is already logged in to firebase.
    function isUserEqual(googleUser, firebaseUser) {
      if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
          if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
              providerData[i].uid === googleUser.getBasicProfile().getId()) {
            return true;
          }
        }
      }
      return false;
    }

    //Method for debugging if the login failed.
    var onFailure = function(error) {
      console.log(error)
    }
    //Method for attaching sign in to an element.
    function attachSignin(element) {
      window.auth2.attachClickHandler(element, {}, function(error) {
          alert(JSON.stringify(error, undefined, 2))
        }
      )
    }
    //Run the login logic
    startApp()
  }

  render() {
    return <LoginButton />
  }

}

const LoginButton = () => {
  return (
    <div id="signedInWrapper">
      <div id="customBtn">
        <span className="icon" />
        <span className="buttonText">Sign in with Google</span>
      </div>
    </div>)
}
//Export default with withRouter (for redirecting to EditPage) and connection to redux.
export default withRouter(connect()(Login))