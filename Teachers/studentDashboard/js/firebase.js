//defualt Variables

var courseID;
var userID;
var univStudentID;



//variable to check the status of the Loadr animation 

var loaderAnimStat = 0; 



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
         $(".all-projects").hide();
setBannerColor() ;
	configFirebase();
    
    checkAuth();
    
 
    
	

});


//function to changeDashboard in the icon

function checkAuth() {
    console.log("CheckAuth called");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("User logged in");
            userID = user.uid;
            extractUserID();
            checkIfDetailsAreEntered();
            
            var html = ['<ul class = "appendDashboard">',
		 '<li><a href="../yourStudents/index.html">Home</a></li>',
            '<li><a  href="../Profile/index.html">Your Profile</a></li>',
			'<li><a  href="../addAssignment/index.html">Add Assignment</a></li>',
            '<li><a  href="../addVideo/index.html">Add Video</a></li>',
                        '<li><a  href="../liveChat/index.html">Chat With Students</a></li>',
            '</ul>'].join("\n");
            console.log(html);

            $(".appendDashboard").remove();

            $(".page-menu").append(html);
            pagemenu();
            // User is signed in.
        } else {
            // No user is signed in.
            window.location = "../Login/index.html"
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


function fetchuserDetail() {
    
    var db = firebase.firestore();

    console.log("user Detail called",univStudentID);
     var docRef = db.collection("Users").doc(univStudentID);

docRef.get().then(function(doc) {
    if (doc.exists) {
       
        var studentData = doc.data();
        var studentName = studentData.Details[2];
     console.log("Inside Called",studentData)
       $("#theNameHeading").text(studentName);
        var studentPhonenumber = studentData.Details[1];
        $(".phoneNumber").text(studentPhonenumber);
        
       // console.log(coursesData);
        
        
        if(loaderAnimStat == 0) {
            $(".all-projects").show();
            $(".lds-ellipsis").hide();
            loaderAnimStat= 1;
            
        }
        getCourseID();

        
       // updateUI(courseName,attribute,backgroundImage,courseID);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
		

})
         
         }



//function to add course cards on the Page
function updateUI(assignmentTitle,assignmentBackgroudImage,assignmentID,stat) {
    
   var modBackgroundImage = "\'" + assignmentBackgroudImage + "\'";


   // console.log(courseName,lecturerName,backgroundImage);
    
    var cardsHTML =[
        
        '<li>',
        '<a  href="../editAssignment/index.html?courseID='+courseID+'&assignmentID='+assignmentID+'&userID='+univStudentID+'">',
        '<span class="categorie">'+stat+'</span>',
        ' <div class="space30"></div>',
        '<h1 class="title">'+assignmentTitle+'</h1>',
        '<div class="image" style="background-image: url('+modBackgroundImage+');"></div>',
        '</a>',
        '</li>'].join("\n");

   // console.log(cardsHTML);

   $(".cardsAppend").append(cardsHTML);
    
}




//function to extract studentID from the URL
function extractUserID() {
       console.log("hello");
    var GET = {};
var query = window.location.search.substring(1).split("&");
for (var i = 0, max = query.length; i < max; i++)
{
    if (query[i] === "") // check for trailing & with no param
        continue;

    var param = query[i].split("=");
    //console.log(decodeURIComponent(param[1] || ""));
    var studentID = decodeURIComponent(param[1] || "");
    //console.log(userID);
    univStudentID = studentID;
    fetchuserDetail();
   // extractAllAssignmentsCard();

    //GET[decodeURIComponent(param[0])] ;
 
}
    
}



function extractAllAssignmentsCard() {
    console.log("extract card called");
    console.log(univStudentID,courseID);
      var db = firebase.firestore();

    
     var docRef = db.collection("Users").doc(univStudentID).collection("enrolledCourses").doc(courseID).collection("assignments");

docRef.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            var assignmentData = doc.data();
            var assignmentTitle= assignmentData.assignmentTitle;
            var assignmentBackgroudImage = assignmentData.backgroundImageURl;
            var assignmentID = doc.id;
            var assignmentStat = assignmentData.verified;
            var stat;
            if(assignmentStat == false) {
                stat = "Yet to be Reviewed";
            }
            else {
                stat = "Reviewed";
            }
            updateUI(assignmentTitle,assignmentBackgroudImage,assignmentID,stat)
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
   
}

//function to extract course ID
function getCourseID() {
        var db = firebase.firestore();

    
     var docRef = db.collection("Teachers").doc(userID);

docRef.get().then(function(doc) {
    if (doc.exists) {
       
        var teacherData = doc.data();
        var theID = teacherData.courseID;
     
       courseID = theID;
        extractAllAssignmentsCard();
       // console.log(coursesData);

        
       // updateUI(courseName,attribute,backgroundImage,courseID);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
		

})
}



function setBannerColor() {
      var colorsArray = ["e43f5a","#29c7ac","#3282b8","#ff6464","#b030b0","#a7d129","#62a388","#5454c5"];
    var selectedColor = colorsArray[Math.floor(Math.random() * colorsArray.length) + 0 ]
    $(".theBanner").css('background-color', selectedColor);

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


