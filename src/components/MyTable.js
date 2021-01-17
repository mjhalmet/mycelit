import React, { PureComponent } from 'react'
//import { deleteStamp } from '../actions/deleteAction.js'

class MyTable extends PureComponent {
  //Map items to JSX objects and return as a table.
  render() {
    //Check if the data has been loaded and return JSX accordingly
    //sort this.props.data here
    const stillLoading = this.props.data;
    if(stillLoading !== true){
      let items = [].concat(this.props.data)
      .sort((a, b) => a.time - b.time)
      .map((stamp) => 
      <tr key={stamp.id}>
        <td className="timeTd">
          {new Date(Math.floor(stamp.time * 1000)).toISOString().substr(11, 8)}
        </td>
        <td className="stampDescrTd">
          {stamp.stampDescr}
        </td>
        <td className="tableButtonsTd">
          <button type="button" className="noselect btn btn-outline-light text-dark myTablePickupButton" id={"button"+stamp.id} onClick={() => {
            let listItem = {"id": stamp.id, "videoDescr": stamp.videoDescr, "videoId": stamp.videoId, "time": stamp.time, "channelTitle": stamp.channelTitle, "stampDescr": stamp.stampDescr}
              this.props.pickup(listItem)
          }}>Pickup</button>
          <button type="button" className="noselect btn btn-outline-light text-dark myTableDeleteButton" id={"button"+stamp.id} onClick={() => {
            this.props.deleteAction(stamp)
            }}>Delete</button>
        </td>
      </tr>)
      return (
        <div>
        <table>
          <thead>
          <tr>
            
          </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </table>
        </div>
      )   
    } else {
      return (
        <div>Loading...</div>
      )   
    }
  }
}


export default MyTable
