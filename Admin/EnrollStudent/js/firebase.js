
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
          

            
            
            
            
            
            
            //appending the burger menu
            var html = [
            '<ul class = "appendDashboard">',
			'<li><a href="../AllStudents/index.html">Home</a></li>',
			'<li><a href="../AllTeachers/index.html">All Teachers</a></li>',
            '<li><a  href="../addCourse/index.html">Add courses</a></li>',
            '<li><a  href="#">Enroll a student</a></li>',
            '<li><a  href="../AddAnnouncement/index.html">Add announcement</a></li>',
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







//an actual unction that writes the students assignment


function enrollStudent() {
     var userID = $('#userID').val();
     var teacherID = $('#teacherID').val();
    var courseID = $('#courseID').val();
    
    
     var db = firebase.firestore();
    var enrollStudentRef = db.collection("Users").doc(userID);

// Atomically add a new region to the "regions" array field.
enrollStudentRef.update({
    enrolledCourses: firebase.firestore.FieldValue.arrayUnion(courseID)
});
    
    
    
     var enrollTeacherRef = db.collection("Teachers").doc(teacherID);

// Atomically add a new region to the "regions" array field.
enrollTeacherRef.update({
    enrolledStudents: firebase.firestore.FieldValue.arrayUnion(userID)
});

    
  UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Enrolled Successfully!",
            status: 'Danger',
            pos: 'top-right',
            timeout: 5000
        });
   
}


//HXYX92mErTMqCkozDQAObLWtVpK2
//
//xbeCq5lTcNbksRIcLg95DJ5lGJ92
//
//1002





