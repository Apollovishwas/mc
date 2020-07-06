
//Declaration of ID Variable foe savong users's user ID

var teacherID;
var teacherEmail;

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
    
$( ".form-inp").click(function() { $(this).focus(); });
    
    
    
     $(".contact-form").hide();

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
            
            checkIfDetailsAreEntered();
            setFields(user.displayName,user.uid);
            
            
            //appending the burger menu
            var html = ['<ul class = "appendDashboard">',
		 '<li><a href="../yourStudents/index.html">Home</a></li>',
            '<li><a  href="#">Your Profile</a></li>',
			'<li><a  href="../addAssignment/index.html">Add Assignment</a></li>',
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
              window.location = "../Login/index.html";
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


//function to save all the details 

function saveTeacherData() {
    
    var teacherName = $('#teacherName').val() ;
    var teacherDesignation = $('#teacherDesignation').val() ;
    var teacherImageURL = $('#teacherImageURL').val() ;
    var teacherLinkedInProfile =$('#teacherLinkedInProfile').val() ;
    
    var courseName = $('#courseName').val();
    var timePerWeek = $('#timePerWeek').val();
    var lastEnrollmentDate = $('#lastEnrollmentDate').val();
    var duration = $('#duration').val();
    var courseDetail = $('#courseDetail').val();

    

    
        var user = firebase.auth().currentUser;
    user.updateProfile({
  displayName: teacherName,
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
            message: "<span uk-icon='icon: check'></span> Error Saving Document!",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });
});
    
   
      var  Details  = ["teacher",teacherName,teacherDesignation,teacherImageURL,teacherLinkedInProfile,teacherEmail,teacherID];
      var courseDetails = [courseName,timePerWeek,lastEnrollmentDate,duration,courseDetail];
    
        var db = firebase.firestore();

var docRef = db.collection('Teachers').doc(teacherID);
var setWithMerge = docRef.set({
    Details,courseDetails}, { merge: true });
    
    
    
  
}



//automatically sets Fields
function setFields(name,uid) {
    $("#teacherName").val(name);
    
    
    
                 var db = firebase.firestore();
            var docRef = db.collection("Teachers").doc(uid);
           

docRef.get().then(function(doc) {
    if (doc.exists) {
       var userData = doc.data();
       var teacherDesignation = userData.Details[2];
        $("#teacherDesignation").val(teacherDesignation);
         var teacherImageURL = userData.Details[3];
        $("#teacherImageURL").val(teacherImageURL);
          var teacherLinkedInProfile = userData.Details[4];
        $("#teacherLinkedInProfile").val(teacherLinkedInProfile);

        
        
        
        
         $('#courseName').val(userData.courseDetails[0])
     $('#timePerWeek').val(userData.courseDetails[1]);
    $('#lastEnrollmentDate').val(userData.courseDetails[2]);
    $('#duration').val(userData.courseDetails[3]);
    $('#courseDetail').val(userData.courseDetails[4]);
        
             $(".contact-form").show();
                     $(".lds-ellipsis").hide();
        $( ".form-inp").click(function() { $(this).focus(); });


        
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



//checks details entered are correct

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
       UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Please Enter All Details",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });
            }
        
            
            else {
                console.log("Not null");
            }
    }
    
    else {
        console.log("First Time");
        
        UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Please Enter All Details",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });
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
  
    
    
    
    




