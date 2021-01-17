import React, { PureComponent } from 'react';
import Library from './components/Library';
import { Route, BrowserRouter, NavLink, Switch} from 'react-router-dom';
import PrivateRoute from "./PrivateRoute";
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import LandingPage from './components/LandingPage.js';
import Login from './components/Login.js'
import EditPage from './components/EditPage.js'
import NotFound from './components/NotFound.js'
import smallLogo from './images/navbar/bluestat.png';
import { addAction } from './actions/addAction.js'
import { deleteAction } from './actions/deleteAction.js'

//Navigation elements/JSX
const Navi = () => {

  return (
    <nav id="Nav" className="navbar navbar-default fixed-top navbar-color">
      <div className="d-flex mx-auto nav-width">
        <NavLink className="nav-item nav-link" to="/LandingPage">
          <img src={smallLogo} width="30" height="20" alt="logo" />
        </NavLink>
        <NavLink className="nav-item nav-link" to="/LandingPage">
          Mycelit
        </NavLink>
        <NavLink
          id="showLibraryNav"
          className="nav-item nav-link shownWhenLoggedIn"
          to="/Library"
        >
          Library
        </NavLink>
        <NavLink
          id="showEditPageNav"
          className="nav-item nav-link shownWhenLoggedIn"
          to="/EditPage"
        >
          Edit
        </NavLink>
        <div className="mr-auto" />
        <div id="navBarUserName" className="welcomeText" />
        <div id="logoutWrapper">
          <NavLink
            id="logoutButton"
            className="logout-style"
            to="/LandingPage"
            onClick={signOut}
          >
            <span className="logout-icon" />
            <span className="logout-text">Logout</span>
          </NavLink>
        </div>
        <Login/>
      </div>
    </nav>
  )

}

//Execute a sign out and hide navbar elements.
const signOut = () => {
  var auth2 = window.gapi.auth2.getAuthInstance()
  window.localStorage.removeItem('accessToken')
  auth2.signOut().then(function() {
    document.getElementById('logoutButton').style.display = 'none'
    document.getElementById('signedInWrapper').style.display = 'inline-block'
    document.getElementById('showLibraryNav').style.display = 'none'
    document.getElementById('showEditPageNav').style.display = 'none'
    document.getElementById('navBarUserName').innerText = ''
  });
};

class App extends PureComponent {
  //On load check from redux if the user is already signed in and if so, show navbar elements.
  componentDidMount() {
    if(this.props.isSignedIn) {
      document.getElementById('logoutButton').style.display = 'inline-block'
      document.getElementById('signedInWrapper').style.display = 'none'
      document.getElementById('showLibraryNav').style.display = 'inline-block'
      document.getElementById('showEditPageNav').style.display = 'inline-block'
      document.getElementById('navBarUserName').innerText = 'Signed in: ' + this.props.user
    }
  }

  render() {
    return (
      <div className="w-100 background">
        <BrowserRouter>
          <div>
            <Navi />
            <Switch>
              <Route path="/(|LandingPage)" component={LandingPage} />
              <Route path="/NotFound" component={NotFound} />
              <PrivateRoute path="/Library" component={Library} 
                firestoreTimestamps={this.props.firestoreTimestamps} 
                deleteAction={this.props.deleteAction} 
               />
              <PrivateRoute path="/EditPage" component={EditPage} 
                addAction={this.props.addAction}
                userUID={this.props.userUID}
              />
              <Route component={LandingPage}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
//Bring in redux state to component
const mapStateToProps = (state) => {
  console.log(JSON.stringify(state))
  var a = `${state.firebase.auth.uid}-timestamps`
  if(state.firestore.ordered[a]){
    return{
      firestoreTimestamps: state.firestore.ordered[a],
      userUID: state.firebase.auth.uid,
      isSignedIn: state.authReducer.isSignedIn,
      user: state.authReducer.user,
    }
  } else {
    return{
      firestoreTimestamps: true,
      userUID: state.firebase.auth.uid,
      isSignedIn: state.authReducer.isSignedIn,
      user: state.authReducer.user,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
    addAction: (stamp) => dispatch(addAction(stamp)),
    deleteAction: (stamp) => dispatch(deleteAction(stamp)),
	}
}

//Export default with connection to redux.
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    return [
    { 
      collection: 'userData',
      doc: `${props.userUID}`,
      subcollections: [{ collection: 'timestamps' }],
      storeAs: `${props.userUID}-timestamps`,
      orderBy: [
        ['channelTitle'],
        ['videoDescr'],
        ['createdAt', 'desc'],
        ['time', 'asc'],
      ]
    }
  ]})
)(App);
