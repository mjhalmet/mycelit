import React, { PureComponent } from 'react';
import '../App.css';
import MyTable from './MyTable';

class Library extends PureComponent {

  constructor(props){
    super(props)
    this.pickup = this.pickup.bind(this)
    this.chooseVideoId = this.chooseVideoId.bind(this)
    this.chooseChannelTitle = this.chooseChannelTitle.bind(this)
    this.deletePickupListItem = this.deletePickupListItem.bind(this)
    this.videoItemSeparator = this.videoItemSeparator.bind(this)
    this.state = {
        timeStampList: [],
        chosenIds: [],
        chosenChannels: [],
    }
  }
  
  pickup(timestamp) {
    let array = this.state.timeStampList
    let testForDuplicate = function(element) {
      return element.id === timestamp.id
    }
    if(array.some(testForDuplicate)) {
      console.log("This item has already been added")
    } else {
      this.setState({
        timeStampList: [...this.state.timeStampList, timestamp]
      })
    }
  }

  chooseVideoId(chosenId) {
    if(this.state.chosenIds.includes(chosenId)) {
      console.log("poistetaan: " + chosenId)
      let filteredArray = this.state.chosenIds.filter(item => item !== chosenId)
      this.setState({chosenIds: filteredArray});
    } else {
      this.setState({
        chosenIds: [...this.state.chosenIds, chosenId]
      })
    }
  }

  chooseChannelTitle(chosenChannel) {
    if(this.state.chosenChannels.includes(chosenChannel)) {
      console.log("poistetaan: " + chosenChannel)
      let filteredArray = this.state.chosenChannels.filter(item => item !== chosenChannel)
      this.setState({chosenChannels: filteredArray});
    } else {
      this.setState({
        chosenChannels: [...this.state.chosenChannels, chosenChannel]
      })
    }
  }

  deletePickupListItem(id)  {
    let filteredArray = this.state.timeStampList.filter(item => item.id !== id)
    this.setState({timeStampList: filteredArray});
  }
  
  videoItemSeparator(array) {
    const uniqueVideoIds = []
    const map = new Map()
    for (const item of array) {
      if(!map.has(item.videoId)){
        map.set(item.videoId, true)
        uniqueVideoIds.push({
          videoId: item.videoId,
          videoDescr: item.videoDescr,
          channelTitle: item.channelTitle,
        })
      }
    }
    return uniqueVideoIds
  }

  generateChannelItems() {
    const uniqueChannelTitles = []
    const map = new Map()
    for (const item of this.props.firestoreTimestamps) {
      if(!map.has(item.channelTitle)){
        map.set(item.channelTitle, true)
        uniqueChannelTitles.push({
          videoId: item.videoId,
          videoDescr: item.videoDescr,
          channelTitle: item.channelTitle,
        })
      }
    }

    if(typeof uniqueChannelTitles !== 'undefined' && uniqueChannelTitles.length > 0) {
      return this.channelItemsConstructor(uniqueChannelTitles)
    } else {
      let LibraryIsEmpty = () => {
        return (
          <div className="libraryIsEmptyDiv">Your library is empty. Go to Edit and add some timestamps for a video.</div>
        )
      }
      return <LibraryIsEmpty/>;
    }
  }

  channelItemsConstructor(uniqueChannelTitles) {
    /**Iterate through uniqueVideoIds and return JSX to libraryItems
     * according to whether any of the id's match the chosenVideo.
     * ChosenVideo is set by clicking on name of the video in the
     * library list. In the UI, the timestamps of a certain youtubevideo are shown
     * if the user has clicked the video's name, and if not, only
     * the video's name is shown.
     */

    //Compare unique videoId array to the array of user-chosen videoId's
    let libraryItems = uniqueChannelTitles.map((item) => {
      if (this.state.chosenChannels.includes(item.channelTitle)) {
        const videosUnderSingleChannelTitle = []
          //Push all matching elements from the backend to an array.
          for (const element of this.props.firestoreTimestamps) {
            if(element.channelTitle === item.channelTitle){
              videosUnderSingleChannelTitle.push(element)
            }
          }
        const singleDescriptions = this.videoItemSeparator(videosUnderSingleChannelTitle)
        let hasTheFirstItemBeenPassed = false;
        let descrItems = singleDescriptions.map((item) => {
          if(this.state.chosenIds.includes(item.videoId)){
            const stampsUnderSingleVideoId = []
            //Push all matching elements from the backend to an array.
            for (const element of this.props.firestoreTimestamps) {
              if(element.videoId === item.videoId){
                stampsUnderSingleVideoId.push(element)
              }
            }
            if(hasTheFirstItemBeenPassed === true){
              return(
                <div key={item.videoId}>
                  <div className="libraryItemButtonVideo" onClick={()=> this.chooseVideoId(item.videoId)}>
                    <p className="noselect">{item.videoDescr}</p>
                  </div>
                  <div className="tableBackground tableBackgroundWrapper">
                    <MyTable pickup={this.pickup} deleteAction={this.props.deleteAction} data={stampsUnderSingleVideoId}/>
                  </div>
                </div>
              )
            } else {
              hasTheFirstItemBeenPassed = true;
              return(
                <div key={item.videoId}>
                  <div className="closedTableBackground closedTableBackgroundWrapper libraryItemButtonChannel" onClick={()=> this.chooseChannelTitle(item.channelTitle)}>
                    <p className="noselect">{item.channelTitle}</p>
                  </div>
                  <div className="libraryItemButtonVideo" onClick={()=> this.chooseVideoId(item.videoId)}>
                    <p className="noselect">{item.videoDescr}</p>
                  </div>
                  <div className="tableBackground tableBackgroundWrapper">
                    <MyTable pickup={this.pickup} deleteAction={this.props.deleteAction} data={stampsUnderSingleVideoId}/>
                  </div>
              </div>
              )
            }
          } else if (hasTheFirstItemBeenPassed === false) {
            hasTheFirstItemBeenPassed = true;
            return (
              <div key={item.videoId} >
                <div className="closedTableBackground closedTableBackgroundWrapper libraryItemButtonChannel" onClick={()=> this.chooseChannelTitle(item.channelTitle)}>
                  <p className="noselect">{item.channelTitle}</p>
                </div>
                <div className="closedTableBackground closedTableBackgroundWrapper libraryItemButtonVideo" onClick={()=> this.chooseVideoId(item.videoId)}>
                  <p className="noselect">{item.videoDescr}</p>
                </div>
              </div>
            )
          } else {
            return (
              <div key={item.videoId} >
                <div className="closedTableBackground closedTableBackgroundWrapper libraryItemButtonVideo" onClick={()=> this.chooseVideoId(item.videoId)}>
                  <p className="noselect">{item.videoDescr}</p>
                </div>
              </div>
            )
          }
        })
        return descrItems;
      } else {
        return (
          <div key={item.channelTitle} className="closedTableBackground closedTableBackgroundWrapper libraryItemButtonChannel" onClick={()=> this.chooseChannelTitle(item.channelTitle)}>
            <p className="noselect">{item.channelTitle}</p>
          </div>
        )
      }
    })
    return libraryItems;
  }

  render() {
    const stillLoading = this.props.firestoreTimestamps
    if(stillLoading !== true) {
      /**Fetch all unique video id's from user's firestore database
       * and set them into an array as objects that have both the id
       * and the name of the video. This way we don't have to iterate through
       * all the elements in the backend every time we need to check what
       * elements to show only their name and which with full list of timestamps, and so on.
       */

      return (
      <div className="landingpagestretch d-flex flex-column mt-3 pt-3">
          <div className="libraryWrapper">
            <div className="d-flex flex-column pickupListWrapper">
              <PickUpList data={this.state.timeStampList} deletePickupListItem={this.deletePickupListItem}/>
            </div>
            <div className="libraryItemsDiv">
              <div className="libraryItemsRoundedDiv">
                {this.generateChannelItems()}
              </div>
            </div>
          </div>
        <footer className="libraryFooter">

        </footer>
      </div>)
    } else {
      return (
        <div className="loadingLibraryDiv">Loading...</div>
      )   
    }
  }
}

const PickUpList = (props) => {
  //Iterate through props.data and create JSX objects of the items which are then returned inside of a table.
  let items = props.data.map((item) => 
    <tr className="pickupListTr" key={item.id}>
      <td className="pickupListTd" key={item.id}>{'https://youtu.be/'}<span className="pickupListSpan">{item.videoId}{'?t='}{item.time}</span></td>
      <td align="right"><button className="noselect btn btn-outline-light text-dark pickupListDelButton" onClick={() => {props.deletePickupListItem(item.id)}}>X</button></td>
    </tr>)
  return (
    <div className="pickupListBackgroundDiv">
      <table className="pickupListTable">
        <thead>
          <tr>
          </tr>
        </thead>
        <tbody>
          <tr className="tableFakePadding"></tr>
            {items}
          <tr className="tableFakePadding"></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Library