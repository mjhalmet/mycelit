import React, { PureComponent } from 'react'
//Created youtube object is set onto this object so it can be referenced later on.
var YTube

class YouTube extends PureComponent {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state={
      stampTextInputValue: "",
    }
  }

  componentDidMount = () => {
    //On mount, check to see if the API script is already loaded
    if (!window.YT) { 
      //If not, load the script asynchronously
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      //onYouTubeIframeAPIReady will load the video after the script is loaded
      window.onYouTubeIframeAPIReady = this.loadVideo
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      console.log("Ei ollut valmis YT")
    } else { 
      console.log("Valmis YT")
      //If script is already there, load the video directly
      this.loadVideo()
    }
  }

  //Check if the redux state item has changed, and if so, change the video in the player as well.
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.videoId !== this.props.videoId) {
      YTube.cueVideoById(this.props.videoId, 0, 'large')
    }
  }

  componentWillUnmount() {
    YTube.destroy()
  }

  loadVideo = () => {
    console.log("loadVideo()")
    //Create a new youtube player object with an according videoID and other properties
    YTube = new window.YT.Player("iframePlayer", {
      videoId: this.props.videoId,
      host: `${window.location.protocol}//www.youtube.com`,
      playerVars: { 'origin': 'https://mycelit2.web.app'},
    })
  }
  //Method for saving current playtime in seconds, calls /actions/addAction.js to deal with asynchrohous call to firebase.
  add = () => {
    let item = {authorId: this.props.userUID, videoDescr: this.props.videoDescr, videoId: this.props.videoId, channelTitle: this.props.channelTitle, time: Math.round(YTube.getCurrentTime()), stampDescr: this.state.stampTextInputValue}
    console.log(item)
    this.props.addAction(item)
  }

  handleChange(event) {
    this.setState({
      stampTextInputValue: event.target.value
    })
  }

  render() {
    return (
        <div>
          <div className="embed-responsive embed-responsive-16by9">
            <div id="iframePlayer" />
          </div>
          <div className="details">
          </div>
          <textarea id="stampText" value={this.state.stampTextInputValue} placeholder="Describe the timestamp here..." onChange={this.handleChange}/>
          <div id="youtubeVideoButtonArea" className="d-flex editButtons mt-2">
            <div className="mr-auto"></div>
            <button type="button" className="btn btn-primary" onClick={this.add}>Save a timestamp</button>
        </div>
      </div>
    )
  }
}

//Export default with redux connection.
export default YouTube