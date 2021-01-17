import React, { PureComponent } from 'react'
import Playlist from './Playlist.js'
import YouTube from './YouTube.js'

const NoChosenVideo = (props) => {
  return ( <div className="landingpagestretch">
    <div className="container">
      <div className="row">
        <div className="col-8 text-center text-light"  id="videoContainer">
          <p>Choose a video from the playlist</p>
        </div>
        <Playlist changeVideo={props.changeVideo}/>
      </div>
    </div>
  </div>)
}

const ChosenVideo = (props) => {
  return ( <div className="landingpagestretch">
    <div className="container">
      <div className="row">
        <div className="col-8" id="videoContainer">
          <div className="videoItem">
            <YouTube videoId={props.state.videoId} 
              videoDescr={props.state.videoDescr} 
              channelTitle={props.state.channelTitle} 
              addAction={props.state.addAction} 
              userUID={props.state.userUID}/>
          </div>
        </div>
          <Playlist changeVideo={props.changeVideo}/>
      </div>
    </div>
  </div>)
}

class EditPage extends PureComponent {
  //State tänne jota vaihetaan funktiolla ja tunget sen funktion sitten <Playlist/>:iin propertynä
  constructor(props){
    super(props)
    this.changeVideo = this.changeVideo.bind(this)
    this.state = {
      videoId: "",
      videoDescr: "",
      channelTitle: "",
      addAction: this.props.addAction,
      userUID: this.props.userUID,
    }
  }

  changeVideo(props) {
    this.setState({
      videoId: props.videoId,
      videoDescr: props.videoDescr,
      channelTitle: props.channelTitle
    })
  }
  

  render() { 
    if (this.state.videoId === "") {
      return <NoChosenVideo state={this.state} changeVideo={this.changeVideo}/>
    } else {
      return <ChosenVideo state={this.state} changeVideo={this.changeVideo}/>
    }
  }

}

//Export default with redux connection.
export default EditPage
