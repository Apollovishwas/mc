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


function signUp() {
    var email= $('#email').val();
    userEmail = email;
    var password = $('#password').val();
    var repeatPassword = $('#repeatPassword').val();
   
    console.log(email,password);

    if(password == repeatPassword) {
        

  
        
        
        
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
            
            checkAuth();

}).catch(function(error) {
  // An error happened.
                   UIkit.notification({
    message: "<span uk-icon='icon: close'></span>"+error,
    status: 'Danger',
    pos: 'top-right',
    timeout: 5000
});
          
});
        
        
    }
    else {
        
               
               UIkit.notification({
    message: "<span uk-icon='icon: close'></span> Password Dont Match",
    status: 'Danger',
    pos: 'top-right',
    timeout: 5000
});
    
        
    

    }
    
    
}









function checkAuth() {
    
    var user = firebase.auth().currentUser;

if (user) {
    window.location.href = "../UserProfile/index.html";
  // User is signed in.
    console.log("User is SignedIn");
} else {
  // No user is signed in.
    console.log("User is not Signed In updated");
}
}






