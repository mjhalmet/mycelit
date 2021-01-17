import React from "react";
import { connect } from "react-redux";
import { Route, Redirect, withRouter } from "react-router-dom";

const PrivateRoute = ({ component, auth, ...rest }) => {
  let ComponentToRender = component
  
  return (
    <Route
      render={props =>
        //Check if auth is true or false (the isSignedIn state object can be found from authReducer) and return the wanted path or redirect accordingly.
        auth
          ? (
              <ComponentToRender {...props} {...rest}/>
            )
          : (
              <Redirect
                to={{ pathname: "/", state: { from: props.location } }}
              />
            )
      }
    />
  )
}
//Bring in redux state to component
const mapStateToProps = (state, ownProps) => ({ auth: state.authReducer.isSignedIn })
//Export default with withRouter (for redirecting to LandingPage if the auth-check returned false
export default withRouter(connect(mapStateToProps)(PrivateRoute))