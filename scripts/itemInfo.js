var hikeDocID = localStorage.getItem("itemDocID");    //visible to all functions on this page

function getHikeName(id) {
    db.collection("records")
      .doc(id)
      .get()
      .then((thisItem) => {
        var itemName = thisItem.data().name;
        document.getElementById("itemName").innerHTML = itemName;
          });
}

getHikeName(hikeDocID);

function writeReview() {
    console.log("updating item")
    let Name = document.getElementById("name").value;
    let Type = document.getElementById("type").value;
    let Cost = document.getElementById("cost").value;
    let Brand = document.getElementById("brand").value;
    let Status = document.querySelector('input[name="status"]:checked').value;
    
    console.log(Name, Type, Cost, Brand, Status);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    db.collection("records").add({
                        itemDocID: itemDocID,
                        userID: userID,
                        name: Name,
                        type: Type,
                        cost: Cost,
                        brand: Brand,
                    }).then(() => {
                        window.location.href = "thanks.html"; //new line added
                    })
                })
        } else {
            console.log("No user is signed in");
            window.location.href = 'itemInfo.html';
        }
    });
}

