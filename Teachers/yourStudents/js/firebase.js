

var userID;
var enrolledStudentArray = [];
var courseID;

//variable to stop loader animation 
var statusLoaderAnim = 0;


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
    
     $(".cardsAppend").hide();

	configFirebase();
    
    checkAuth();
    //fetchAllCoursesData();
    
	

});


//function to changeDashboard in the icon

function checkAuth() {
    console.log("CheckAuth called");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("User logged in");

            userID = user.uid;
            fetchAllStudentID();
            
            checkIfItsStudent();
            checkIfDetailsAreEntered() ;
            var html = ['<ul class = "appendDashboard">',
                        
                        
                        '<li><a href="#">Home</a></li>',
            '<li><a  href="../Profile/index.html">Your Profile</a></li>',
			'<li><a  href="../addAssignment/index.html">Add Assignment</a></li>',
           ' <li><a  href="../addVideo/index.html">Add Video</a></li>',
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






//function to add course cards on the Page
function updateUI(name,uid) {
    
  // var modBackgroundImage = "\'" + backgroundImage + "\'";


   // console.log(courseName,lecturerName,backgroundImage);
    
    var colorsArray = ["e43f5a","#29c7ac","#3282b8","#ff6464","#b030b0","#a7d129","#62a388","#5454c5"];
    var selectedColor = colorsArray[Math.floor(Math.random() * colorsArray.length) + 0 ]
    
    var cardsHTML =[
        
        '<li>',
        '<a  href="../studentDashboard/index.html?userID='+uid+'">',
        '<h1 class="title">'+name+'</h1>',
        '<div class="image"  style = "background-color:'+selectedColor+';" ></div>',
        '</a>',
        '</li>'].join("\n");

   // console.log(cardsHTML);

   $(".cardsAppend").append(cardsHTML);
    
}


function fetchAllStudentID() {
    
          var db = firebase.firestore();

    var docRef = db.collection("Teachers").doc(userID);

docRef.get().then(function(doc) {
    if (doc.exists) {
        //console.log("Document data:", doc.data());
        var enrolledStudentData = doc.data();
        enrolledStudentArray = enrolledStudentData.enrolledStudents;
       
        //courseID = enrolledStudentData.Details[7];
        // console.log(enrolledStudentArray,courseID);
        callToData();
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});

}


//function to call other function that Fetches studentDetails
function callToData() {
    for(var i = 0;i<=enrolledStudentArray.length;i++) 
        {
            if(enrolledStudentArray[i] != undefined){
            fetchStudentData(enrolledStudentArray[i]);
            }
        }
    
}

//function to fetch the studentData
function fetchStudentData(uid){
    
            var db = firebase.firestore();
var docRef = db.collection("Users").doc(uid);

docRef.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        var studentData = doc.data();
        var studentName = studentData.Details[2];
        updateUI(studentName,uid);
        
         if(statusLoaderAnim == 0) {
                 $(".cardsAppend").show();
             $(".lds-ellipsis").hide();
            statusLoaderAnim = 1;

        }
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
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
    const usersRef = db.collection('Users').doc(userID)

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