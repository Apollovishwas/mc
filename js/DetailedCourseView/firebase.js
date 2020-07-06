var userID;
var univCourseID;

var linkedInURL;



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
	 //console.log("All Courses called");
   firebase.initializeApp(firebaseConfig);
}
  firebase.analytics();
    
}



$(document).ready(function () {
//fetchingData
    $("#smooth-scroll").hide();
    //console.log("Document Ready");
    //configuringFirebase
	configFirebase();
    //calling cheking auth()
    
    checkAuth();
  
    
    //calling a function to update the Offer Details
    
    updateOffer();
    
    //calling a function to extract a id from url 
    
   extractCourseID();
	

});


//function to Fetch Courses Data from DataBase

function fetchData(courseID) {
   // console.log("fetchDataCalled");
 
	var db = firebase.firestore();
	db.collection("Courses").doc(courseID).onSnapshot(function(doc) {
    if (doc.exists) {
		 
		var courseData = doc.data();
        var courseTitle = courseData.courseTitle;
        var EstimatedTime = courseData.EstimatedTime;
        var estimatedTimeQuote = courseData.estimatedTimeQuote;
        var enrollmentLastDate = courseData.enrollmentLastDate;
        var cost = courseData.cost;
        var bgImage = courseData.bgImage;
        var courseDescription = courseData.courseDescription;
       // console.log(courseData.chatpers);
        var chapters = courseData.chapters;
        var teacherID = courseData.teacherID;
        //console.log(chapters.length);
//        var offer = companyData.offer;
//        var headingOfTopic = companyData.headingOfTopic;
//        var Learningparagraph = companyData.Learningparagraph;
//        var instructorImage = companyData.instructorImage;
//        var theDesignation = companyData.theDesignation;
//        var instructorName = companyData.instructorName;
     
       
        updateChapters(chapters,chapters.length);

updateUI(courseTitle,courseDescription,EstimatedTime,estimatedTimeQuote,enrollmentLastDate,cost,bgImage);
         //calling a function to update the teacher's Details
    
    updateTeacherDetails(teacherID);
		
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
		return;
    }
});
		

}




//courseTitle
//courseDescription
//EstimatedTime
//estimatedTimeQuote
//enrollmentLastDate
//cost
//offer
//cardAppend
//headingOfTopic
//Learningparagraph
//instructorImage
//theDesignation
//instructorName



//function to update Chapters 
function updateChapters(chapters,lengthOfArray) {
    for(var i = 0;i<lengthOfArray;i++){
        var title = chapters[i].title;
        var desc = chapters[i].desc;
       // console.log("theLoop");
           
        var html = [
            
            '<div class="row cardOne">',
            '<div class="col-md-12">',
            '<span class="categorie" id = "headingOfTopic">'+title+'</span>',
            '   <p class="theLearningPara" id = "Learningparagraph">'+desc+'</p>',
            '</div>',
            '</div>'
        
    ].join("\n");
    $("#cardAppend").append(html);
    }
}



//function to update all other UI
function updateUI(courseTitle,courseDescription,EstimatedTime,estimatedTimeQuote,enrollmentLastDate,cost,bgImage)
         {
  
 //  console.log("updateUI clled",lastDate);
 //   console.log(companyName,aboutInternship,designation,stipend,skills,eligibility,duration);
    $('#courseTitle').text(courseTitle);
             //console.log(courseDescription);
            // console.log(EstimatedTime);
    $('#courseDescription').text(courseDescription);
    $('#EstimatedTime').text(EstimatedTime);
    $('#estimatedTimeQuote').text(estimatedTimeQuote);
    $('#enrollmentLastDate').text(enrollmentLastDate);
    $('#cost').text(cost);
    $(".theBanner").css("background-image",'url(' + bgImage + ')');
//    $('#offer').text(offer);
//    $("#instructorImage").attr("src",instructorImage)
//  
//    $('#theDesignation').text(theDesignation);
//    $('#instructorName').text(instructorName);
//                
    
    
    
      
                
                   
                 
                
            
  $("#smooth-scroll").show();
  $(".lds-ellipsis").hide();

    


    
}




//function to changeDashboard in the icon

function checkAuth() {
    //console.log("CheckAuth called");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("User logged in");

            userID = user.uid;
             $('.yourID').text("Your ID Number : " + userID);
            
             checkIfItsATeacher();

            var html = ['<ul class = "appendDashboard">',
			'<li><a href="index.html">Home</a></li>',
			'<li><a  class = "dashboardTab" href="EnrolledCourses/index.html">Dashboard</a></li>',
            '<li><a  href="all-courses.html">Browse Courses</a></li>',
			'<li><a  href="../UserProfile/index.html">Profile</a></li>',
            '</ul>'].join("\n");
            console.log(html);

            $(".appendDashboard").remove();

            $(".page-menu").append(html);
            pagemenu();
            // User is signed in.
        } else {
            // No user is signed in.
            
            
            alert("Please log in to continue!");
            window.location = "../Login/index.html";
            console.log("not logged in");

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



//function to update offer
function updateOffer() {
    
    var db = firebase.firestore();
    var docRef = db.collection("offer").doc("theOfferDesc");

docRef.get().then(function(doc) {
    if (doc.exists) {

        
        var offerData = doc.data();
        var offerDesc = offerData.desc;
        $('#offer').text(offerDesc);
        
    } else {
       
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
})
}




//function to update lecturer's Data


function updateTeacherDetails(teacherID) {
    console.log(teacherID);
    var db = firebase.firestore();
    
    
    
    
                 var db = firebase.firestore();
            var docRef = db.collection("Teachers").doc(teacherID);
           

docRef.get().then(function(doc) {
    if (doc.exists) {
       var userData = doc.data();
        
         var teacherName = userData.Details[1];
         $('#instructorName').text(teacherName);
        
         var teacherImageURL = userData.Details[3];
        $('#instructorImage').attr('src', teacherImageURL);        
           
        
       var teacherDesignation = userData.Details[2];
        $('#theDesignation').text(teacherDesignation);
        
        
        var linkedIn = userData.Details[4];
        linkedInURL= linkedIn;
         
    }
    
    else {
        console.log("First Time");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
})
    
  
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
    fetchData(courseID);
    univCourseID = courseID;
                $('.courseID').text("Course ID Number : " + courseID);


    //GET[decodeURIComponent(param[0])] ;
 
}
    
}


function enrollCourse() {
    
    var alertString = "Your user ID is :" + userID + " and the course ID is "+univCourseID+". copy these! We'll need them to approve your payment.";
    alert(alertString);
}


function makePayment() {
    alert("Payment link not connected yet!");
}

function openTeacherLinkedIn() {
    window.location = linkedInURL;
}




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


