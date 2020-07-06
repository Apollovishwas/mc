var userID;
var courseIDs;

//an cariable to hide the loaing animation once;

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
            fetchCourseIDS();
            checkIfItsATeacher() ;
            
            
            
            
            
            
            
            
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


function fetchAllCoursesData(courseID) {
    
    console.log("Called Once")
    
      var db = firebase.firestore();

    
     var docRef = db.collection("Courses").doc(courseID);

docRef.get().then(function(doc) {
    if (doc.exists) {
        
       
        var coursesData = doc.data();
        var courseName = coursesData.courseTitle;
        var attribute = coursesData.attribute;
        var backgroundImage = coursesData.bgImage;
        var courseID = coursesData.courseID;
       
       // console.log(coursesData);
        
     
              if(i == 0) {
             $(".cardsAppend").show();
             $(".lds-ellipsis").hide();
                  i = 1;

        }
      

        
        updateUI(courseName,attribute,backgroundImage,courseID);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
		

}



//function to add course cards on the Page
function updateUI(courseName,attribute,backgroundImage,courseID) {
    
   var modBackgroundImage = "\'" + backgroundImage + "\'";


   // console.log(courseName,lecturerName,backgroundImage);
    
    var cardsHTML =[
        
        '<li>',
        '<a  href="../CourseDashboard/index.html?courseID='+courseID+'">',
        '<span class="number">'+attribute+'</span>',
        '<span class="categorie">'+courseID+'</span>',
        
        '<h1 class="title">'+courseName+'</h1>',
        '<div class="image" style="background-image: url('+modBackgroundImage+');"></div>',
        '</a>',
        '</li>'].join("\n");

   // console.log(cardsHTML);

   $(".cardsAppend").append(cardsHTML);
    
}



async function fetchCourseIDS() {
    var db = firebase.firestore();
    console.log("This one called");
    console.log(userID);
    

 var docRef = db.collection("Users").doc(userID);

docRef.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        var userData = doc.data();
        courseIDs = userData.enrolledCourses;
        //callingthisFunction
        callFunctionToFetchDetails() ;
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});


    
                            
                              

}




function callFunctionToFetchDetails() {
    for(var i = 0;i<=courseIDs.length;i++) {
        if(courseIDs[i] != undefined){
        console.log(courseIDs[i]);
            fetchAllCoursesData(courseIDs[i]);
        }
    }
}




//check if its a teacher

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