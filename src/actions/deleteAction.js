export const deleteAction = (stamp) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
      const firestore = getFirestore()
      firestore.collection('userData').doc(stamp.authorId).collection('timestamps').doc(stamp.id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
    }
  }