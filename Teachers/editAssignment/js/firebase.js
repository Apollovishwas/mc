var studentID;
var couseID;
var assignmentID;
var assignmentFileLink;
var assignmentComment;
var assignmentReview;

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
     $(".all-projects").hide();
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
            extractCourseID();
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
            // No user is signed in
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


function fetchAllCoursesData() {
    
    console.log("Called Once")
    
      var db = firebase.firestore();
	db.collection("AllCourses").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        var logo ="";
       
        var coursesData = doc.data();
        var courseName = coursesData.Name;
        var LecturerName = coursesData.LecturerName;
        var backgroundImage = coursesData.imageURL;
       
       // console.log(coursesData);

        
        updateUI(courseName,LecturerName,backgroundImage);
    });
});
		

}



//function to add course cards on the Page
function updateUI(courseName,lecturerName,backgroundImage) {
    
   var modBackgroundImage = "\'" + backgroundImage + "\'";


   // console.log(courseName,lecturerName,backgroundImage);
    
    var cardsHTML =[
        
        '<li>',
        '<a  href="course.html">',
        '<span class="categorie">'+lecturerName+'</span>',
        '<span class="number">01</span>',
        '<h1 class="title">'+courseName+'</h1>',
        '<div class="image" style="background-image: url('+modBackgroundImage+');"></div>',
        '</a>',
        '</li>'].join("\n");

   // console.log(cardsHTML);

   $(".cardsAppend").append(cardsHTML);
    
}




//function to courseID
function extractCourseID() {
       console.log("hello");
    var GET = {};
    var parameters = [];
var query = window.location.search.substring(1).split("&");
for (var i = 0, max = query.length; i < max; i++)
{
    if (query[i] === "") // check for trailing & with no param
        continue;

    var param = query[i].split("=");
    parameters.push(decodeURIComponent(param[1] || ""));
    console.log(decodeURIComponent(param[1] || ""));
     courseID = decodeURIComponent(param[1] || "");
   //console.log(param);

    //GET[decodeURIComponent(param[0])] ;
 
}
    
    console.log("finsal params", parameters);
    courseID = parameters[0];
    assignmentID = parameters[1];
    studentID = parameters[2];

    retrieveAssignmentDetail(parameters[0],parameters[1],parameters[2]);
    setFieldsAutomatically(userID,courseID,assignmentID);
    
}


//function to extract the details of the particular assignment

function retrieveAssignmentDetail(courseID,assignmentID,studentID) {
    console.log(courseID,)
          var db = firebase.firestore();
var docRef =db.collection("Users").doc(studentID).collection("enrolledCourses").doc(courseID).collection("assignments").doc(assignmentID);

docRef.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        var assignmentData = doc.data();
        var assignmentTitle = assignmentData.assignmentTitle;
        var assignmentCommentData = assignmentData.assignmentSubmission[0];
        var assignmentFile = assignmentData.assignmentSubmission[1];
        var assignmentreviewData = assignmentData.assignmentSubmission[2];
        
        
         assignmentFileLink = assignmentFile;
 assignmentComment  = assignmentCommentData;
 assignmentReview = assignmentreviewData;
        var bgImageURL = assignmentData.backgroundImageURl;
        
        $(".theAssignmentHeading").text(assignmentTitle);
        $("#TheAssignmentSubmission").text(assignmentComment);
        $(".theBanner").css("background-image",'url(' + bgImageURL + ')');
        $(".theFileLink").attr("href", assignmentFile);
        $(".theFileLink").text(assignmentFile);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
}


//function to upload thesubmission

function uploadSubmission() {
    var review = $('#review').val();

 
        
        
        
            var db = firebase.firestore();

  
    
    var assignmentRef =   db.collection("Users").doc(studentID).collection("enrolledCourses").doc(courseID).collection("assignments").doc(assignmentID);

// Set the "capital" field of the city 'DC'
return assignmentRef.update({
    verified : true,
    assignmentSubmission: [assignmentComment,assignmentFileLink,review]
})
.then(function() {
    console.log("Document successfully updated!");
       UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Reviewed Successfully!",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
})
.catch(function(error) {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
              UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Something went Wrong! Reload to Contiue",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
});

})
})
}

//function to fill theFields Automatically

function setFieldsAutomatically(userID,courseID,assignmentID) {
     var db = firebase.firestore();
       var assignmentRef =   db.collection("Users").doc(studentID).collection("enrolledCourses").doc(courseID).collection("assignments").doc(assignmentID);
    
    
    assignmentRef.get().then(function(doc) {
    if (doc.exists) {
       var userData = doc.data();
       var review = userData.assignmentSubmission[2];
        $('#review').val(review);
       $(".all-projects").show();
            $(".lds-ellipsis").hide();
        $( ".form-inp").click(function() { $(this).focus(); });
        
    }
    
    else {
        console.log("First Time");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
           UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Something went Wrong! Reload to continue",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
})
    
})
}


//function openFile
function openFile() {
     var win = window.open(assignmentFileLink);
  win.focus();
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