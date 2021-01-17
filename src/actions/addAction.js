export const addAction = (stamp) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firestore = getFirestore()
    firestore.collection('userData').doc(stamp.authorId).collection('timestamps').add({
      ...stamp,
      channelTitle: stamp.channelTitle,
      videoId: stamp.videoId,
      videoDescr: stamp.videoDescr,
      time: stamp.time,
      authorId: stamp.authorId,
      stampDescr: stamp.stampDescr,
      createdAt: new Date()
    }).then(() => {
      console.log("Document successfully added!");
    }).catch((error) => {
      console.error("Error adding document: ", error);
    })
  }
}