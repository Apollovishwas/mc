var userID;
var courseID;

var studentName;

var lastDocID = 0;


//vaiable to track the loader animation
var loaderAnimStat = 0;

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
    $( ".theTextInput").click(function() { 
        //console.log("clicked");
        $(this).focus();
    });


    

    //fetchAllCoursesData();
    
    
    
	

});


//function to changeDashboard in the icon

function checkAuth() {
    console.log("CheckAuth called");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("User logged in");
            userID = user.uid;
          //  fetchCourseIDS();
           
            
            extractCourseID();
            
            
            
            
            
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





                
                
           

//function to add course cards on the Page
function updateUI(messageText,name,timestamp) {
    


   // console.log(courseName,lecturerName,backgroundImage);
    
 

   // console.log(cardsHTML);

    
    
    

    
    
    
    
    
    
    
    
    

    
}


function writeMessage() {
    
    
   var message = $(".theTextInput").val();
    
    console.log(courseID,studentName);

  return firebase.firestore().collection('liveChat').doc(courseID).collection("messages").add({
    message: message,
    userID: userID,
    name:studentName,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(error) {
    console.error('There was an error uploading a file to Cloud Storage:', error);
  });

}


function getMessages(){
    
     var query = firebase.firestore().collection('liveChat').doc(courseID).collection("messages").orderBy('timestamp');
  
  // Start listening to the query.
  query.onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
        
        
        if(loaderAnimStat == 0) {
             $("#loader").hide();
            loaderAnimStat=1;

        }
      if(lastDocID == 0){
            lastDocID = change.doc.id;
               console.log("first doc");
       var message = change.doc.data();
       var messageText = message.message;
       var name = message.name;
       var timestamp = message.timestamp;
        
        console.log(lastDocID,messageText);
            
     var messageContainer = $('.theMessageContainer');
    
    
   
     $('<div class="themessageCard">'+
        '<p id="theMessage">'+messageText+'</p>'+
        '<p id="theName" style="color: #141414;">'+name+'</p>'+
        ' </div>').appendTo(messageContainer);
 
            messageContainer.scrollTop(messageContainer.prop('scrollHeight'));
            
            
       
            
            
            
            
           
        }
        else {
          
            if(lastDocID == change.doc.id){
                return;
                
            }
            
            else {
                        console.log("get messages called inside once");
       var message = change.doc.data();
       var messageText = message.message;
       var name = message.name;
       var timestamp = message.timestamp;
        
        console.log(lastDocID,messageText);
            
     var messageContainer = $('.theMessageContainer');
    
    
   
     $('<div class="themessageCard">'+
        '<p id="theMessage">'+messageText+'</p>'+
        '<p id="theName" style="color: #141414;">'+name+'</p>'+
        ' </div>').appendTo(messageContainer);
 
            messageContainer.scrollTop(messageContainer.prop('scrollHeight'));
            
            
              lastDocID = change.doc.id;
            
            }
      
            
        }
        
   
      
    });
  });
    
}

  



console.log("The outside executes too");



configFirebase();
checkAuth();






function saveAndRedirect() {

    
    var db = firebase.firestore();

     var docRef = db.collection("Users").doc(userID);

docRef.get().then(function(doc) {
    if (doc.exists) {
       
        var studentData = doc.data();
        studentName = studentData.Details[2];
        var enrolledCourseArray = studentData.enrolledCourses;
        var enrolledStat = $.inArray(courseID, enrolledCourseArray);
        if(enrolledStat == -1) {
            window.location = "../index.html";
        }
    else {
        console.log("NAme and id", courseID,studentName);
        getMessages();
        return;
    }
     

        
       // updateUI(courseName,attribute,backgroundImage,courseID);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
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
    //console.log(decodeURIComponent(param[1] || ""));
    var course= decodeURIComponent(param[1] || "");
    courseID = course;
    //console.log(userID);
    saveAndRedirect();
   // extractAllAssignmentsCard();

    //GET[decodeURIComponent(param[0])] ;
 
}
    
}
