var userID;
var couseID;
var assignmentID;
var verificationStat;

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
    $(".toHideFeedback").hide();
    
    $(".assignmentDescription").hide();
    
    $(".all-projects").hide();
    
   
    
    
$( ".form-inp").click(function() { $(this).focus(); });
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
			'<li><a href="i../ndex.html">Home</a></li>',
			'<li><a  class = "dashboardTab" href="../EnrolledCourses/index.html">Dashboard</a></li>',
            '<li><a  href="../all-courses.html">Browse Courses</a></li>',
            ' <li><a  href="../UserProfile/index.html">Profile</a></li>',
		
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
    
    retrieveAssignmentDetail(parameters[0],parameters[1]);
    setFieldsAutomatically(userID,courseID,assignmentID);
    
    
}


//function to extract the details of the particular assignment

function retrieveAssignmentDetail(courseID,assignmentID) {
    console.log(courseID,)
          var db = firebase.firestore();
var docRef =db.collection("Users").doc(userID).collection("enrolledCourses").doc(courseID).collection("assignments").doc(assignmentID);

docRef.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        var assignmentData = doc.data();
        var assignmentTitle = assignmentData.assignmentTitle;
        var assignmentDesc = assignmentData.detailsAboutAssignment;
        var bgImageURL = assignmentData.backgroundImageURl;
        var verificationStatus = assignmentData.verified;
        var assignmentReview = assignmentData.assignmentSubmission[2];
        
        verificationStat = verificationStatus;
       
        
        $("#TheReview").text(assignmentReview);
        $(".theAssignmentHeading").text(assignmentTitle);
        $("#assignmentDescription").text(assignmentDesc);
        $(".theBanner").css("background-image",'url(' + bgImageURL + ')');
        
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
    var comments = $('.Comments').val();
    var linkToFile = $('.linkToFile').val();
 
        console.log("Submission");
        console.log(comments,linkToFile,courseID,assignmentID,userID);
        
            var db = firebase.firestore();

  
    
    var assignmentRef =   db.collection("Users").doc(userID).collection("enrolledCourses").doc(courseID).collection("assignments").doc(assignmentID);

// Set the "capital" field of the city 'DC'
return assignmentRef.update({
    assignmentSubmission: [comments,linkToFile]
})
.then(function() {
    console.log("Document successfully updated!");
    
    
      UIkit.notification({
            message: "<span uk-icon='icon: check'></span>Assignment submitted Successfully!",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });
})
.catch(function(error) {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
    
    
       UIkit.notification({
            message: "<span uk-icon='icon: check'></span>Error! Reload to continue!",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });
    
});

}

//function to fill theFields Automatically

function setFieldsAutomatically(userID,courseID,assignmentID) {
    //console.log("set Fields Called",userID,courseID,assignmentID);
    
    
    
     var db = firebase.firestore();
       var assignmentRef =   db.collection("Users").doc(userID).collection("enrolledCourses").doc(courseID).collection("assignments").doc(assignmentID);
    
    
    assignmentRef.get().then(function(doc) {
    if (doc.exists) {
       var userData = doc.data();
      //  console.log("userData", userData);
        //console.log(userData.assignmentSubmission[0]);
       var comment = userData.assignmentSubmission[0];
        var link = userData.assignmentSubmission[1];
        console.log(comment,link);
        $('.Comments').val(comment);
    $('.linkToFile').val(link);
                verificationToggle(verificationStat);
        
         $(".all-projects").show();
                 $(".lds-ellipsis").hide();


         
    }
    
    else {
        console.log("First Time");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
})
    
}



//function to check the verification toggle
function verificationToggle(verificationStatus) {
    if(verificationStatus == true) {
        console.log("If called");
        $(".toHideFeedback").show();
         $("#assignmentDescription").hide();
        $(".theEnrollButton").prop('disabled', true);
    }
    
    else {
        console.log("Else called");
        
         $(".toHideFeedback").hide();
         $("#assignmentDescription").show();
        $(".theEnrollButton").prop('disabled', false);
$("#toDisable").prop('disabled', false);        
    }
}
