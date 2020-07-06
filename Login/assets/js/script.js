$(document).ready(function () {


    configFirebase();
   
   


});

//configuringFireBase
function configFirebase() {
    var firebaseConfig = {
     apiKey: "AIzaSyByObANKnCoVmkb_iy9n0VHRko8PMpqR-g",
    authDomain: "microcollege-7f868.firebaseapp.com",
    databaseURL: "https://microcollege-7f868.firebaseio.com",
    projectId: "microcollege-7f868",
    storageBucket: "microcollege-7f868.appspot.com",
    messagingSenderId: "784926788444",
    appId: "1:784926788444:web:d1ea9394e28ad9087c4f99",
    measurementId: "G-W9SGTZ4PPE"
    };
    // Initialize Firebase



    if (!firebase.apps.length) {
        console.log("called");
        firebase.initializeApp(firebaseConfig);
    }
    firebase.analytics();
     
}


function signIn() {
    
    var email = $('#email').val();
    var password = $('#password').val();

    console.log(email, password)


    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
      
        window.location.href = "../UserProfile/index.html";
        console.log("yess!")
        checkAuth();
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
              console.log(error);
        
         UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Signin Failed : "+ error.code,
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });

        checkAuth();
    });






}


function checkAuth() {
    
    firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
     console.log("yup");
    // User is signed in.
window.location.href = "../UserProfile/index.html";   
       UIkit.notification({
            message: "<span uk-icon='icon: check'></span> signin Successfull",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });
  } else {
    // No user is signed in.
       UIkit.notification({
            message: "<span uk-icon='icon: check'></span> signin failed",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });
      console.log("nope");
      
  }
});

}


