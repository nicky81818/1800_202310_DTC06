var currentUser;


// Showing user information on the profile page.
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userEmail = userDoc.data().email;
                    var userCity = userDoc.data().city;
                    var provider = userDoc.data().providers;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userEmail != null) {
                        document.getElementById("emailInput").value = userEmail;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    
                })
        } else {
            // No user is signed in.
            console.log ("No user is signed in");
        }
    });
}

//call the function to run it.
populateUserInfo();



//User casn edit their information, except the email address.
function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}



// After editing information, save it to firebase.
function saveUserInfo() {

    // currentUser = db.collection("users").doc(user.uid)

    //enter code here
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("inside")
            currentUser = db.collection("users").doc(user.uid)
            //a) get user entered values
            var userName = document.getElementById("nameInput").value;
            var userEmail = document.getElementById("emailInput").value;
            var userCity = document.getElementById("cityInput").value;
            // get the original email value
            // var ogEmail = currentUser.get("email");
            // console.log(ogEmail);
        
            // check if the user has changed the email address
            
            console.log(userName, userEmail, userCity)
            
            //b) update user's document in Firestore
            currentUser.update({
                name: userName,
                city: userCity
            })
            
            .then(() => {
                console.log("Document successfully updated!");
                
            })
            
            //c) disable edit 
            document.getElementById('personalInfoFields').disabled = true;
            // location.reload();

        }
    })

}


// Count the total number of records user has in the record page.
function loadTotalRecords() {
        firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        var size = 0;
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = user.uid
            //get the document for current user.
            db.collection("records")
            .where("userID", "==", currentUser)
            .onSnapshot(allRecords => {
                    //get the data fields of the user
                    records = allRecords.docs;
                    records.forEach(doc => {
                        size += 1
                        $("#countItems").text(size)
                    }
                    )
            })
        } else {
            // No user is signed in.
            console.log ("No user is signed in");
        }        
    });
    
}
loadTotalRecords()

// $(document).ready(function () {
//     // populateUserInfo();
//     loadTotalRecords()
//     }
// )
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // insertNameFromFirestore();
            getRegister(user)
        } else {
            console.log("No user is signed in");
        }
    });
}

//Run the do all().
doAll();

//----------------------------------------------------------
// Wouldn't it be nice to see User's Name on this page?
// Let's do it!  (Thinking ahead:  This function can be carved out, 
// and put into script.js for other pages to use as well).
//----------------------------------------------------------//----------------------------------------------------------
// function insertNameFromFirestore() {
//     //check if user is logged in
//     firebase.auth().onAuthStateChanged(user => {
//         if (user) { //if user logged in
//             // console.log(user.uid)
//             db.collection("users").doc(user.uid).get().then(userDoc => {
//                 // console.log(userDoc.data().name)
//                 userName = userDoc.data().name;
//                 // console.log(userName)
//                 document.getElementById("name-goes-here").innerHTML = userName;
//             })
//         }
//     })
// }

//----------------------------------------------------------
// This function takes input param User's Firestore document pointer
// and retrieves the "saved" array (of bookmarks) 
// and dynamically displays them in the gallery
//----------------------------------------------------------



// Show the registered provider.
function getRegister(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

					  // Get the Array of bookmarks
            var providers = userDoc.data().providers;
            // console.log(providers);
						
						// Get pointer the new card template
            let newcardTemplate = document.getElementById("savedCardTemplate");

						// Iterate through the ARRAY of bookmarked hikes (document ID's)
            providers.forEach(thisRegisterID => {
                console.log(thisRegisterID);
                db.collection("providers").doc(thisRegisterID).get().then(doc => {
                    var title = doc.data().name; // get value of the "name" key
                    var policy = doc.data().policy_number; //gets the length field
                    // var docID = doc.id;  //this is the autogenerated ID of the document
                    
                    //clone the new card
                    let newcard = newcardTemplate.content.cloneNode(true);

                    //update title and some pertinant information
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-length').innerHTML = policy;
                    

                    //NEW LINE: update to display length, duration, last updated
                    newcard.querySelector('.card-length').innerHTML =
                         doc.data().policy_number
                      

										//Finally, attach this new card to the gallery
                    hikeCardGroup.appendChild(newcard);
                })
            });
        })
}



// Delete Registered provider.
function confirmDelete() {
    // if (confirm("Are you sure you want to delete this provider?")) {
    //   deleteRegister();
    // }
    // console.log("delete")
    swal("Are you sure you want to delete this provider?", {
        buttons: [true, "Delete"]
    })
    $(".swal-button--confirm").click(function () {
        deleteRegister()
    })

}



//Delete registered provider.
function deleteRegister() {
    // Get a reference to the 'providers' subcollection for the current user
    const userRef = firebase.firestore().collection('users').doc('userDoc');
  
    // Get a reference to the 'providers' subcollection for the user
    const providersRef = userRef.collection('providers');
  
    // Delete all documents in the 'providers' subcollection
    providersRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        providersRef.doc(doc.id).delete();
      });
    });

    currentUser.set({
        providers: []
      }, {
        merge: true
      }).then(() => {
        location.reload();
    });
}
