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
    fetchUpdate() ;

    
	

});


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


function fetchUpdate() {
     var db = firebase.firestore();
    var docRef = db.collection("announcement").doc("announcementDoc");

docRef.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        var announcementDoc = doc.data();
        var update = announcementDoc.update;
        $("#theAnouncementText").text(update);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
}