/*
CREAR POST
*/
firebase.database().ref('post').push({
    mensaje:"prueba"
});

/*
GET ALL POST
*/
firebase.database().ref('post').on("value", function(datos) {
  console.log(datos.val());
}, function (errorObject) {
  console.log("La Lectura Falla: " + errorObject.code);
});

/*
CREATE USER
*/
firebase.database().ref('usuario').push({
    usuario:"Gustavo",
});

/*
CREATE POST WITH USER
*/
firebase.database().ref('post').push({
  mensaje:"prueba",
  usuario:"-LlOS0XzeBIZgLWo53EB"
});

/*
CREATE COMMENT
*/
firebase.database().ref('comentario').push({
    post:"-LlN4yYyLycLOvacid55",
    usuario:"-LlORXO9FbzmqXm-PYOc",
    comentario:"Prueba Comentario"
});

/*
GET POST FROM USER
*/
firebase.database().ref('post')
  .orderByChild("usuario")
  .equalTo("-LlOS0XzeBIZgLWo53EB")
  .on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

/*
GET COMENTARIO FROM POST
*/
firebase.database().ref('comentario')
  .orderByChild("post")
  .equalTo("-LlN4yYyLycLOvacid55")
  .on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

/*
SIGN IN ANONYMOUSLY
*/
firebase.auth().signInAnonymously();

/*
SIGN OUT
*/
firebase.auth().signOut();

/*
SIGN IN WITH GOOGLE
*/
var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithPopup(provider);

/*
IF IS SIGN IN OR NOT
*/
firebase.auth().onAuthStateChanged(function(usuario) {
  if (usuario) {
    // User is signed in.
  } else {
    // No user is signed in.
  }
});




/*
INICIO DE SESION
*/
function startDatabaseQueries() {
  // [START my_top_posts_query]
  var myUserId = firebase.auth().currentUser.uid;
  var topUserPostsRef = firebase.database().ref('user-posts/' + myUserId).orderByChild('starCount');
  // [END my_top_posts_query]
  // [START recent_posts_query]
  var recentPostsRef = firebase.database().ref('posts').limitToLast(100);
  // [END recent_posts_query]
  var userPostsRef = firebase.database().ref('user-posts/' + myUserId);

  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var author = data.val().author || 'Anonymous';
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
        createPostElement(data.key, data.val().title, data.val().body, author, data.val().uid, data.val().authorPic),
        containerElement.firstChild);
    });
    postsRef.on('child_changed', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var postElement = containerElement.getElementsByClassName('post-' + data.key)[0];
      postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = data.val().title;
      postElement.getElementsByClassName('username')[0].innerText = data.val().author;
      postElement.getElementsByClassName('text')[0].innerText = data.val().body;
      postElement.getElementsByClassName('star-count')[0].innerText = data.val().starCount;
    });
    postsRef.on('child_removed', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var post = containerElement.getElementsByClassName('post-' + data.key)[0];
      post.parentElement.removeChild(post);
    });
  };

  // Fetching and displaying all posts of each sections.
  fetchPosts(topUserPostsRef, topUserPostsSection);
  fetchPosts(recentPostsRef, recentPostsSection);
  fetchPosts(userPostsRef, userPostsSection);

  // Keep track of all Firebase refs we are listening to.
  listeningFirebaseRefs.push(topUserPostsRef);
  listeningFirebaseRefs.push(recentPostsRef);
  listeningFirebaseRefs.push(userPostsRef);
}

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('usuario/' + userId).set({
    username: name,
    email: email,
  });
}

function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }

  if (user) {
    currentUID = user.uid;
    writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    startDatabaseQueries();
  } else {
    // Set currentUID to null.
    currentUID = null;
  }
}

window.addEventListener('load', function() {
  var signInButtonGoogle = document.getElementById('sign-in-button-google');
  var signInButtonAnonymous = document.getElementById('sign-in-button-an');

  // Bind Sign in button with Google.
  signInButtonGoogle.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  });
  // Bind Sing in button with Anonymous
  signInButtonAnonymous.addEventListener('click', function() {
    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error: " + error.code + " - " + error.message);
    });
  });

  // Bind Sign out button.
  signOutButton.addEventListener('click', function() {
    firebase.auth().signOut();
  });

  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);

  // Saves message on form submit.
  messageForm.onsubmit = function(e) {
    e.preventDefault();
    var text = messageInput.value;
    var title = titleInput.value;
    if (text && title) {
      newPostForCurrentUser(title, text).then(function() {
        myPostsMenuButton.click();
      });
      messageInput.value = '';
      titleInput.value = '';
    }
  };
  
}, false);