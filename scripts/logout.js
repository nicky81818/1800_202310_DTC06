function logout() {
  // logs out the user
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
}

$(document).ready(
    logout()
)