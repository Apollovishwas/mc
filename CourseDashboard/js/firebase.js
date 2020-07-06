//defualt Variables

var courseID;
var userID;


//variable to stop loader animation 

var i = 0;

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
            extractCourseID();
             checkIfItsATeacher()
            var html = ['<ul class = "appendDashboard">',
			'<li><a href="../index.html">Home</a></li>',
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


function fetchCourseTitle(courseID) {
    
    var db = firebase.firestore();

    
     var docRef = db.collection("Courses").doc(courseID);

docRef.get().then(function(doc) {
    if (doc.exists) {
       
        var coursesData = doc.data();
        var courseName = coursesData.courseTitle;
     
       $("#theCourseHeading").text(courseName);
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



//function to add course cards on the Page
function updateUI(assignmentTitle,assignmentBackgroudImage,assignmentID,status) {
    
   var modBackgroundImage = "\'" + assignmentBackgroudImage + "\'";


   // console.log(courseName,lecturerName,backgroundImage);
    
    var cardsHTML =[
        
        '<li>',
        '<a  href="../assignment/index.html?courseID='+courseID+'&assignmentID='+assignmentID+'">',
        '<span class="categorie">'+status+'</span>',
        ' <div class="space30"></div>',
        '<h1 class="title">'+assignmentTitle+'</h1>',
        '<div class="image" style="background-image: url('+modBackgroundImage+');"></div>',
        '</a>',
        '</li>'].join("\n");

   // console.log(cardsHTML);

   $(".cardsAppend").append(cardsHTML);
    
}


function extractCourseID() {
       console.log("hello");
    var GET = {};
var query = window.location.search.substring(1).split("&");
for (var i = 0, max = query.length; i < max; i++)
{
    if (query[i] === "") // check for trailing & with no param
        continue;

    var param = query[i].split("=");
    console.log(decodeURIComponent(param[1] || ""));
     courseID = decodeURIComponent(param[1] || "");
    fetchCourseTitle(courseID);
    extractAllAssignmentsCard();
    getVideosCard();

    //GET[decodeURIComponent(param[0])] ;
 
}
    
}

function extractAllAssignmentsCard() {
    console.log(userID,courseID);
      var db = firebase.firestore();

    
     var docRef = db.collection("Users").doc(userID).collection("enrolledCourses").doc(courseID).collection("assignments");

docRef.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            var assignmentData = doc.data();
            var assignmentTitle= assignmentData.assignmentTitle;
            var assignmentBackgroudImage = assignmentData.backgroundImageURl;
            var assignmentID = doc.id;
            var assignmentStatus = assignmentData.verified;
            var status;
            if(assignmentStatus == true) {
                status = "Reviewed";
            }
            
            else {
                status = "Yet to be reviewed"
            }
            updateUI(assignmentTitle,assignmentBackgroudImage,assignmentID,status)
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
   
}


//function to get data about Video Cards
function getVideosCard() {
    
       console.log("Gt Vdeo Card Called");
      var db = firebase.firestore();

    
     var docRef = db.collection("Videos").doc(courseID).collection("videos");

docRef.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            
            
          
            console.log(doc.id, " => ", doc.data());
            var videoData = doc.data();
            var videoTitle= videoData.title;
            var videoBGImage = videoData.backgroundURL;
            var videoURL = videoData.url;
            generateVideoCards(videoTitle,videoBGImage,videoURL);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
      if(i == 0) {
                 $(".all-projects").show();
                 $(".lds-ellipsis").hide();
                i = 1;
            }
}

//function to generate video Cards

function generateVideoCards(videoTitle,videoBGImage,videoURL) {
    var modBackgroundImage = "\'" + videoBGImage + "\'";


   // console.log(courseName,lecturerName,backgroundImage);
    
    var cardsHTML =[
        
        '<div class="card" id="theCardBody" style="background-image: url('+modBackgroundImage+');">',
        '<div class="card-body">',
        
        ' <h4 class="card-title">'+videoTitle+'</h4>',
        
        '<a class = "videoCardLink" href = "'+videoURL+'">',
        '<button class="btn btn-primary theEnrollButton" type="button">Watch Now</button>',
         '</a>',
        '</div>',
        '</div>'
        
        
        
      ].join("\n");

   // console.log(cardsHTML);

   $(".videoCard").append(cardsHTML);
}



function redirectChat() {
    window.location = "../liveChat/index.html?courseID=" + courseID;
}


//function to check if it's a teacher
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
  
    
    
    
    
function signout() {
    firebase.auth().signOut().then(function() {
  console.log('Signed Out');
        
        window.location = "../Login/index.html"
}, function(error) {
  console.error('Sign Out Error', error);
});
}
