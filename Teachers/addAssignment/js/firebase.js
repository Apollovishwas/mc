
//Declaration of ID Variable foe savong users's user ID

var teacherID;
var teacherEmail;
var enrolledStudensIDArray;
var teacherCourseCode;



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
           

            //setting value to the teacherID and teacherEmail
            teacherID = user.uid;
            teacherEmail = user.email;
            checkIfItsStudent();
            retriveStudentsID();
            retrieveCourseCode();

            
            
            
            
            
            
            //appending the burger menu
            var html = [
            '<ul class = "appendDashboard">',
			 '<li><a href="../yourStudents/index.html">Home</a></li>',
            '<li><a  href="../Profile/index.html">Your Profile</a></li>',
			'<li><a  href="#">Add Assignment</a></li>',
            '<li><a  href="../addVideo/index.html">Add Video</a></li>',
                  ' <li><a  href="../liveChat/index.html">Chat With Students</a></li>',
            '</ul>'].join("\n");
            console.log(html);

            $(".appendDashboard").remove();

            $(".page-menu").append(html);
            pagemenu();
            // User is signed in.
        } else {
            // No user is signed in.
            console.log("nope");

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




//function to retrieve to student ID
function retriveStudentsID() {

            var db = firebase.firestore();
            var docRef = db.collection("Teachers").doc(teacherID);
           

docRef.get().then(function(doc) {
    if (doc.exists) {
       var userData = doc.data();
    enrolledStudensIDArray = userData.enrolledStudents;
        console.log(enrolledStudensIDArray);
    }
    
    else {
        console.log("First Time");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
   
})
    
}


//function to call another function that writes the details
function funcToCallAssignForEachUser() {
    for(var i=0;i<=enrolledStudensIDArray.length;i++) {
        if(enrolledStudensIDArray[i] != undefined){
         writeAssignmentForStudent(enrolledStudensIDArray[i]); 
        }
    }
}


//an actual unction that writes the students assignment
function writeAssignmentForStudent(uid) {
    
    
    var assignmentTitle = $('#assignmentTitle').val();
    var backgroundImageURl = $('#backgroundImageURl').val();
    
    if(backgroundImageURl == "" || backgroundImageURl == undefined || backgroundImageURl == null) {
        backgroundImageURl = "https://images.unsplash.com/photo-1429892494097-cccc61109f58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80";
    }
    var detailsAboutAssignment = $('#detailsAboutAssignment').val();
    
    var assignmentSubmission = ["", ""];
        
        
        
            var db = firebase.firestore();

    db.collection("Users").doc(uid).collection("enrolledCourses").doc(teacherCourseCode).collection("assignments").add({
    assignmentTitle : assignmentTitle,
    backgroundImageURl : backgroundImageURl,
    detailsAboutAssignment : detailsAboutAssignment,
    assignmentSubmission : assignmentSubmission,
    verified : false
        
        
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
        
          UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Assignment uploaded Successfully!",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });
})
.catch(function(error) {
    console.error("Error adding document: ", error);
        
          UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Upload Error! Reload to continue ",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });
});
}


//function that retrieves Course code
function retrieveCourseCode(){
    
            var db = firebase.firestore();
            var docRef = db.collection("Teachers").doc(teacherID);
           
console.log(teacherID);
docRef.get().then(function(doc) {
    if (doc.exists) {
       var userData = doc.data();
    teacherCourseCode = userData.courseID;
        console.log(teacherCourseCode);
        
        $(".contact-form").show();
        $( ".form-inp").click(function() { $(this).focus(); });

        $(".lds-ellipsis").hide();

        
    }
    
    else {
        console.log("First Time");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
    
})
}


//function to check if everyDetail is entered correctly

function checkIfDetailsAreEntered() {
    console.log("Check called");
    
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
           var teacherDesignation;
           var teacherImageURL;
           var teacherLinkedInProfile;
            //checking the "Details" are entered
              var db = firebase.firestore();
            var docRef = db.collection("Teachers").doc(user.uid);
           

docRef.get().then(function(doc) {
    if (doc.exists) {
       var userData = doc.data();
       
        teacherDesignation = userData.Details[2];
        teacherImageURL = userData.Details[3];
       teacherLinkedInProfile = userData.Details[4];
        console.log(teacherLinkedInProfile);
        
          var enteredUserName = user.displayName;
            
 if(enteredUserName == null ||  teacherDesignation == "" || teacherImageURL == "" || teacherLinkedInProfile == "" 
    || teacherDesignation == null || teacherImageURL == null || teacherLinkedInProfile == null ||  teacherDesignation == undefined|| teacherImageURL == undefined || teacherLinkedInProfile == undefined) {
                
                
                
                
                
                
                console.log("Something is null");
                alert("Some of your info in missing.Please fill it to continue");
                window.location = "../Profile.html";
            }
        
            
            else {
                console.log("Not null");
                //alert("All Details are okay");
            }
    }
    
    else {
        console.log("First Time");
         console.log("Something is null");
                alert("Some of your info in missing.Please fill it to continue");
                window.location = "../Profile.html";
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






//signout

function signout() {
    firebase.auth().signOut().then(function() {
  console.log('Signed Out');
        alert("signout successfull");
        window.location = "../Login/index.html";
}, function(error) {
  console.error('Sign Out Error', error);
});
}





//check if its a teacher

function checkIfItsStudent() {
    
    var db = firebase.firestore();
    const usersRef = db.collection('Users').doc(teacherID)

usersRef.get()
  .then((docSnapshot) => {
    if (docSnapshot.exists) {
      usersRef.onSnapshot((doc) => {
        // do stuff with the data
          
         signout();
      });
    } else {
      console.log("It's just a Teaacher");
    }
});
}

