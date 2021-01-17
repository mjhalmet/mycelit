import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import keys from '../keys';

//apiKey and how many playlist items are shown in the app. Too much overcumbers google API.
const apiKey = keys.apiKey
const maxResults = 30

class Playlist extends PureComponent {

  constructor(props){
    super(props)
    this.fetchPlaylistData = this.fetchPlaylistData.bind(this)
    this.handleCurrentVideoState = this.handleCurrentVideoState.bind(this)
    this.playListId = "";
    this.state = {
      foundPlaylist: false,
      data: [],
    } 
  }

  componentDidMount(){
    this.fetchPlaylistData()
  }
  //Fetch user's youtube playlists and check if there's one called Mycelit, if so, fetch items from that playlist and push them to component state.
  fetchPlaylistData () {
    fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&mine=true&key=${apiKey}`, {headers: { Authorization: `Bearer ${this.props.accessToken}`},})
    .then( playlistsResponse => playlistsResponse.json())
    .then( playlistsResponse => {
      playlistsResponse.items.forEach(item => {
        if (item.snippet.localized.title === 'Mycelit') {
          this.setState ({
            foundPlaylist: true,
          })
          this.playlistId = item.id
          fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails,id&order=date&maxResults=${maxResults}&mine=true&playlistId=${this.playlistId}&key=${apiKey}`, {headers: { Authorization: `Bearer ${this.props.accessToken}`},})
          .then( contentResponse => contentResponse.json())
          .then( contentResponse => {
            const videoId = []
            contentResponse.items.forEach(item => {
              videoId.push(item)
            })
            this.setState({
              data: videoId
            })
          })
          .catch(error => {
            console.error(error)
          })
        }
      })
      if (this.state.foundPlaylist === false) {
        alert('Create a private or public Youtube playlist called Mycelit, add videos to it and load the page again.')
      }
    })
    .catch(error => {
      console.log(error)
    })
  }
  //Dispatch information about the currently chosen video to redux, so we don't lose this choice if the user navigates to another component.
  //This data is also used for in timestamps which are sent from the current playing video to actions/addAction.js
  handleCurrentVideoState (props) {
    //check if access token is still valid
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${props.videoId}&key=${apiKey}`, {headers: { Authorization: `Bearer ${this.props.accessToken}`},})
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.props.changeVideo({videoId: props.videoId, videoDescr: props.videoDescr, channelTitle: data.items[0].snippet.channelTitle})
    });
  }

  render() {
    return ( 
      <div className="col overflow-auto" id="playlistContainer">
        <PlayListToJSX state={this.state} handleCurrentVideoState = {this.handleCurrentVideoState}/>
      </div>
    )
  }
}

const PlayListToJSX = (props) => {
  let jsx = props.state.data.map((item) => {
    if(item.snippet.description === "This video is private." && item.snippet.title === "Private video") {
      return (      
        <div key={item.contentDetails.videoId} className="playlistItem">
          <p className="videoSnippetTitle">{item.snippet.title}</p>
        </div>
      )
    } else {
      return (
        <div key={item.contentDetails.videoId} className="playlistItem itemHover" onClick={() => props.handleCurrentVideoState({videoId: item.contentDetails.videoId, videoDescr: item.snippet.title})}>
          <img className="videoThumbnail" src={item.snippet.thumbnails.medium.url} alt="Smiley face"></img>
          <p className="videoSnippetTitle">{item.snippet.title}</p>
        </div>
      )
    }
  })
  return jsx
}

//Bring in state objects from redux
const mapStateToProps = (state) => {
  return {
    accessToken: state.authReducer.accessToken,
  }
}
//Export default with connect to redux
export default connect(mapStateToProps)(Playlist)