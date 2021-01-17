import React, { PureComponent } from 'react';
import lottie from 'lottie-web';
import { Link } from 'react-router-dom';

class LandingPage extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      animation: {}
    };
  }

  componentDidMount() {
    this.setState({
      animation: lottie.loadAnimation({
        container: document.getElementById('lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'hud.json',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      })
    })
  }

  componentWillUnmount() {
    this.state.animation.destroy()
  }

  render() {
    const animationWrapper = {
      width: '450px'
    }

    return (
      <div className="d-flex flex-column justify-content-center mt-5 pt-5">
        <div className="p-2 d-flex row justify-content-center">
          <Link to="/NotFound">
            <div
              id="lottie"
              style={animationWrapper}
              className="animationPic"
            />
          </Link>
          <div className="d-flex flex-column justify-content-center mt-5 pt-5"/>
        </div>
      </div>
    )
  }
  
}

export default LandingPage;
