var userID;
var courseIDs;


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
        fetchAllUsersData();
            
            
            
            
            
            
            
            
            var html = ['<ul class = "appendDashboard">',
			'<li><a href="../AllStudents/index.html">Home</a></li>',
			'<li><a href="#">All Teachers</a></li>',
            '<li><a  href="../addCourse/index.html">Add courses</a></li>',
            '<li><a  href="../EnrollStudent/index.html">Enroll a student</a></li>',
            '<li><a  href="../AddAnnouncement/index.html">Add Announcement</a></li>',
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


function fetchAllUsersData() {
    
    
      var db = firebase.firestore();
db.collection("Teachers")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            var userData = doc.data();
            
            
            var userName = userData.Details[1];
            var userEmail = userData.Details[5];
            var userDes = userData.Details[2];

            
            var courseTitle = userData.courseDetails[0];
            var courseHoursPerWeek = userData.courseDetails[1];
            var lastEnrollmentDate = userData.courseDetails[2];
            var courseDuration = userData.courseDetails[3];
            var courseDescription = userData.courseDetails[4]

            var userID = doc.id;
             updateUI(userName,userEmail,userDes,userID,courseTitle,courseHoursPerWeek,lastEnrollmentDate,courseDuration,courseDescription);
            
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    
    
    
    
    
		

}



//function to add course cards on the Page
function updateUI(userName,userEmail,userDes,userID,courseTitle,courseHoursPerWeek,lastEnrollmentDate,courseDuration,courseDescription){
    
  var colorsArray = ["e43f5a","#29c7ac","#3282b8","#ff6464","#b030b0","#a7d129","#62a388","#5454c5"];
  var selectedColor = colorsArray[Math.floor(Math.random() * colorsArray.length) + 0 ];


    
    
    
    
    var cardsHTML =[
        
        '<li>',
        '<a  href="#">',
        '<span class="categorie">Teacher ID : '+userID+'</span>',
        ' <div class="space30"></div>',
         
        '<h1 class="title">'+userName+'</h1>',
        ' <div class="space30"></div>',
        '<span class="number details">Email : '+userEmail+'</span>',
        ' <div class="space30"></div>',
        '<span class="number details">current designation : '+userDes+'</span>',
' <div class="space30"></div>',
         ' <div class="space30"></div>',
            '<span class="categorie">Course Details</span>',
                 ' <div class="space30"></div>',

         '<span class="number details">Course Title : '+courseTitle+'</span>',
        ' <div class="space30"></div>',
        '<span class="number details">Learning hours / week : '+courseHoursPerWeek+'</span>',
        ' <div class="space30"></div>',
        '<span class="number details">Last Enrollment Date : '+lastEnrollmentDate+'</span>',
        ' <div class="space30"></div>',
        '<span class="number details">Course Duration : '+courseDuration+'</span>',
        ' <div class="space30"></div>',
        '<span class="number details">Course Description : '+courseDescription+'</span>',
        ' <div class="space30"></div>',
        ' <div class="space30"></div>',



        '<div class="image" style="background-color: '+selectedColor+';"></div>',
        '</a>',
        '</li>'].join("\n");

   // console.log(cardsHTML);

   $(".cardsAppend").append(cardsHTML);
    
}



  