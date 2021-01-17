import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';

class NotFound extends PureComponent {

  constructor(props) {
    super(props);
    this.timer = this.timer.bind(this)

  }

  componentDidMount() {
    this.timer()
  }

  timer() {
    setTimeout(()=>{       
      this.props.history.push({
      pathname: '/LandingPage',
    })}, 3000);
  }

  render() {

    return (
      <div className="d-flex flex-column justify-content-center mt-5 pt-5">
        <div className="p-2 d-flex row justify-content-center">
            <div id="not-found-main-text">Public space is under maintenance. Redirecting back to homepage...</div>
          <div className="d-flex flex-column justify-content-center mt-5 pt-5 landingpagestretch"/>
        </div>
      </div>
    )
  }
  
}
//Export default with withRouter for redirect to LandingPage.
export default withRouter(NotFound)