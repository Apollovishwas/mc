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
	 console.log("All Courses called");
   firebase.initializeApp(firebaseConfig);
}
  firebase.analytics();
    
}



$(document).ready(function () {
//fetchingData
    
    console.log("Document Ready");
    //configuringFirebase
	configFirebase();
    //calling cheking auth()
    
    checkAuth();
    //calling a function to fetch Data from the database
    
    fetchAllCoursesData();
	

});


//function to Fetch Courses Data from DataBase

function fetchAllCoursesData() {
    var i = 0;
    console.log("Called Once")
    
      var db = firebase.firestore();
	db.collection("Courses").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        
        if(i == 0) {
        $(".lds-ellipsis").hide();
            i = 1;

        }
        
        var logo ="";
       
        var coursesData = doc.data();
        var courseName = coursesData.courseTitle;
        var attribute = coursesData.attribute;
        var backgroundImage = coursesData.bgImage;
        var courseID = coursesData.courseID;
       
       // console.log(coursesData);


        updateUI(courseName,attribute,backgroundImage,courseID);
    });
});
	

}



//function to add course cards on the Page
function updateUI(courseName,attribute,backgroundImage,courseID) {
    
   var modBackgroundImage = "\'" + backgroundImage + "\'";


   // console.log(courseName,lecturerName,backgroundImage);
    
    var cardsHTML =[
        
        '<li>',
        '<a  href="course.html?courseID='+courseID+'">',
         '<span class="number">'+courseID+'</span>',
        '<span class="categorie">'+attribute+'</span>',
       
        '<h1 class="title">'+courseName+'</h1>',
        '<div class="image" style="background-image: url('+modBackgroundImage+');"></div>',
        '</a>',
        '</li>'].join("\n");

   // console.log(cardsHTML);

   $(".cardsAppend").append(cardsHTML);
    
    
}





//function to changeDashboard in the icon

function checkAuth() {
    console.log("CheckAuth called");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("User logged in");


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
