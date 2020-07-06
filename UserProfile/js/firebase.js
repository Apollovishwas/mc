
//Declaration of ID Variable foe savong users's user ID

var userID;
var userEmail;

//coniguringFireBase
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



$(document).ready(function () {
//fetchingData
    
     $(".contact-form").hide();
    
$( ".form-inp").click(function() { $(this).focus(); });

	configFirebase();
    
    checkAuth();
    
    
	

});


//function to changeDashboard in the icon

function checkAuth() {
  
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
           
            //calling a function to check if all the details are entered
            
            //setting value to the teacherID and teacherEmail
            userID = user.uid;
            userEmail = user.email;
            console.log(user);
            checkIfItsATeacher();
            
            setFields(user.displayName,userEmail,user.uid);
            
            
            //appending the burger menu
            var html = ['<ul class = "appendDashboard">',
			'<li><a href="../index.html">Home</a></li>',
			'<li><a  class = "dashboardTab" href="../EnrolledCourses/index.html">Dashboard</a></li>',
            '<li><a  href="../all-courses.html">Browse Courses</a></li>',
			'<li><a  href="#">Profile</a></li>',
            '</ul>'].join("\n");
            console.log(html);

            $(".appendDashboard").remove();

            $(".page-menu").append(html);
            pagemenu();
            checkIfDetailsAreEntered();
            // User is signed in.
        } else {
            // No user is signed in.
            console.log("nope");
             window.location = "../Login/index.html"

        }
    });




}




//function for pagemenu to smooth the animation on the burger menu

function pagemenu() {
console.log("page menu called");
    $('.menu').on('click', function() {
        $('.right-menu').addClass('active invert');
             setTimeout(function () {
        $('.right-menu').removeClass('active');
        }, 1000);
            tl.play();
    });

   
    $('.menu-close').on('click', function() {
            tl.reversed(true); 
        setTimeout( function() {
        $('.right-menu').addClass('passive');
        }, 1000);
             setTimeout(function () {
        $('.right-menu').removeClass('invert passive');
                }, 1800);
    });

    var box = $(".page-menu ul>li");
    var tl = new TimelineMax({
      yoyo: false,
      reversed: true
    });

    tl.staggerFrom(box, .5, {
        y: "50",
        opacity: 0,
        delay: 1,
        ease: Back.easeOut
    },0.1);

}


//function to save all the details 

function saveUserData() {
    
    var userName = $('#userName').val() ;
    var userPhone = $('#userPhone').val();
 
    
 var user = firebase.auth().currentUser;
console.log(userPhone);
    user.updateProfile({
  displayName: userName,
}).then(function() {
  // Update successful.
        console.log("Set Value Successfull");
          UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Details Updated Successfully!",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });
}).catch(function(error) {
  // An error happened.
        
        
          UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Error! Reload to continue",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });
});
    

    
    //settingRole and OtherValues like phone number and Stuff
    
   
      var  Details  = ["student",userPhone,userName];

    
        var db = firebase.firestore();

var docRef = db.collection('Users').doc(userID);
var setWithMerge = docRef.set({Details}, { merge: true });
    
}



//firebase function to signout


function signout() {
    firebase.auth().signOut().then(function() {
  console.log('Signed Out');
        
        window.location = "../Login/index.html"
}, function(error) {
  console.error('Sign Out Error', error);
});
}


//function to check if the Details are entered or noy
function checkIfDetailsAreEntered() {
    console.log("Check called");
    
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
           var phoneNumber;
           var status;
            //checking the "Details" are entered
              var db = firebase.firestore();
            var docRef = db.collection("Users").doc(user.uid);
           

docRef.get().then(function(doc) {
    if (doc.exists) {
       var userData = doc.data();
        console.log(userData.Details[0]);
        phoneNumber = userData.Details[0];
        status = userData.Details[1];
        
          var enteredUserName = user.displayName;
            console.log(enteredUserName,phoneNumber,status);
            if(enteredUserName == null ||  phoneNumber == null || status == null || phoneNumber == undefined || status == undefined ||phoneNumber == "" || status == "") {
                console.log("Something is null");
            }
        
            
            else {
                console.log("Not null");
            }
    }
    
    else {
        console.log("First Time");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
})

            //Checking value to the userID and userEmai
          
            
      
        } else {
            // No user is signed in.
            console.log("nope");

        }
    });
    
}


//function to set the value of fields automatically

function setFields(name, email,uid) {
    $("#userName").val(name);
    $("#MockEmail").val(email);
    
                 var db = firebase.firestore();
            var docRef = db.collection("Users").doc(uid);
           

docRef.get().then(function(doc) {
    if (doc.exists) {
       var userData = doc.data();
       var phone = userData.Details[1];
        $("#userPhone").val(phone);
        
         $(".contact-form").show();
     $(".lds-ellipsis").hide();
         
    }
    
    else {
        console.log("First Time");
           $(".contact-form").show();
     $(".lds-ellipsis").hide();
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
    
})
    
    
   
    
}

//to Check if it's a teacher
function checkIfItsATeacher() {
    
    var db = firebase.firestore();
    const usersRef = db.collection('Teachers').doc(userID)

usersRef.get()
  .then((docSnapshot) => {
    if (docSnapshot.exists) {
      usersRef.onSnapshot((doc) => {
        // do stuff with the data
          
         signout();
      });
    } else {
      console.log("It's just a Student!");
    }
});
}



