
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
            '<li><a  href="#">Add courses</a></li>',
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







//an actual unction that writes the students assignment
function writeAssignmentForStudent(uid) {
    
    
    var assignmentTitle = $('#assignmentTitle').val();
    var backgroundImageURl = $('#backgroundImageURl').val();
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

function writeCourse() {
     var CourseTitle = $('#CourseTitle').val();
     var courseDescription = $('#courseDescription').val();
     var enrollmentLastDate = $('#enrollmentLastDate').val();
     var estimatedTime = $('#estimatedTime').val();
     var Duration = $('#Duration').val();
     var teacherID = $('#teacherID').val();
     var courseID = $('#courseID').val();
     var cost = $('#cost').val();
     var bgImageURL = $('#bgImageURL').val();
     var Tag = $('#Tag').val();
    var chapters = [];
    for(var i = 1;i <=20;i++) {
         var title = $('#title'+i).val();
     var desc = $('#desc'+i).val(); 
        var chaptObj = {
                        "title" : title,
                        "desc" : desc
                       };
        
        if(title != "" || desc != ""){
       // console.log(chaptObj);
            chapters.push(chaptObj);
            
        }
        
    }
    
    console.log(chapters);
    

        
            var db = firebase.firestore();

    db.collection("Courses").doc(courseID).set({
  EstimatedTime : Duration,
  attribute : Tag,
  bgImage : bgImageURL,
  chapters : chapters,
  cost:cost,
  courseDescription : courseDescription,
  courseID : courseID,
  courseTitle : CourseTitle,
  enrollmentLastDate:enrollmentLastDate,
  estimatedTimeQuote : estimatedTime,
  teacherID : teacherID
  
        
        
})
.then(function(docRef) {
    console.log("Document written ");
        
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
    
    
    
    var teacherRef = db.collection("Teachers").doc(teacherID);

var setWithMerge = teacherRef.set({
   courseID : courseID
}, { merge: true });

   
}






