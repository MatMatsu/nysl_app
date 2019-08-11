var signInButtonGoogle = document.getElementById('sign-in-button-google');
var signInButtonAnonymous = document.getElementById('sign-in-button-anonymous');
var signOutButton = document.getElementById("sign-out-button");
var logIn = document.getElementById("logIn");
var logOut = document.getElementById("logOut");
var chat = document.getElementById("chat");
var formPost = document.getElementById("formulario-post");
var newPostTitle = document.getElementById("new-post-title");
var newPostMessage = document.getElementById("new-post-message");
var posteos = document.getElementById("posteos");
var listeningFirebaseRefs = [];
var currentUID;

/*
Modificar formato fecha
*/
function addZero(fecha) {
  if (fecha < 10) {
    fecha = "0" + fecha;
  }
  return fecha;
}

/*
Obtener fecha
*/
function getFecha() {
  let d = new Date();
  let fecha = addZero(d.getDate()) + "/" + addZero((d.getMonth()+1)) + "/" + d.getFullYear() + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes());
  return fecha;
}

/*
Insertar comentarios
*/
function addComment(element, id, msg, nombre, fecha) {
  let comment = document.createElement("div");
  comment.setAttribute("class", "posteo-comentario");
  let html = "<h4>" + nombre + " - " + fecha + "</h4>" +
             "<p>" + msg + "</p>";

  comment.innerHTML = html;

  element.appendChild(comment);
}

/*
Traer todos los mensajes
*/
function getAllPost() {
  var post = firebase.database().ref('post');

  post.on("child_added", (datos) => {
    // console.log(datos.val());
    var div = document.createElement("div");
    div.setAttribute("class", "posteo");
    var html =  "<div class='posteo-msj'>" + 
                  "<h3>" + datos.val().titulo + "</h3>" +
                  "<h4>" + datos.val().nombre + " - " + datos.val().fechaYhora + "</h4>" +
                  "<p>" + datos.val().mensaje + "</p>" +
                "</div>" + 
                "<div class='nuevo-comentario'>" +
                  "<form action='#' class='d-flex justify-content-around comentario-post'>" +
                    "<textarea name='comment' rows='2' class='new-comment' placeholder='Write your comment...'></textarea>" +
                    "<button type='submit'>POST</button>" +
                  "</form>" +
                "</div>";

    div.innerHTML = html;
    posteos.appendChild(div);

    var addCommentForm = div.getElementsByClassName("comentario-post")[0];
    var commentInput = div.getElementsByClassName("new-comment")[0];
    var commentsRef = firebase.database().ref("post-comment/" + datos.key);

    commentsRef.on("child_added", (data)=>{
      addComment(div, data.key, data.val().msg, data.val().nombre, data.val().fecha);
    })

    addCommentForm.onsubmit = (e)=> {
      e.preventDefault();
      commentsRef.push({
        msg: commentInput.value,
        nombre: firebase.auth().currentUser.displayName || "Anonymous",
        fecha: getFecha(),
        uid: firebase.auth().currentUser.uid
      });
      commentInput.value = '';
      //commentInput.parentElement.MaterialTextfield.boundUpdateClassesHandler();
    }

  }, (errorObject) => {
    console.log("La Lectura Falla: " + errorObject.code);
  });

  // Guardo referencia a firebase db
  listeningFirebaseRefs.push(post);
}

/*
Crear post
*/
function createPost(title, text) {
  let userId = firebase.auth().currentUser;
  // console.log(userId);
  // console.log(fecha);
  firebase.database().ref('post').push({
    titulo: title,
    mensaje: text,
    nombre: userId.displayName || "Anonymous",
    fechaYhora: getFecha(),
    uid: userId.uid
  });
}

/*
Crear usuario en base de datos
*/
function writeUserData(usuarioID, name, email) {
  firebase.database().ref('usuario/' + usuarioID).set({
    usuario: name || "anonymous",
    mail: email
  });
}

/*
Eventos al cargar la página
*/
window.addEventListener('load', function() {
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
  firebase.auth().onAuthStateChanged(function(usuario) {
    // We ignore token refresh events.
    if (usuario && currentUID === usuario.uid) {
      console.log(usuario);
      return;
    }

    posteos.innerHTML = ""; // Elimina todos los posteos antes de volver a cargarlos

    // Detengo referencia a firebase db
    listeningFirebaseRefs.forEach(function(ref) {
      ref.off();
    });
    listeningFirebaseRefs = [];

    if (usuario) {
      // User is signed in.
      // console.log("if");
      currentUID = usuario.uid;
      logIn.style.display = 'none';
      logOut.style.display = 'block';
      chat.style.display = "block";
      writeUserData(usuario.uid, usuario.displayName, usuario.email);
      
      getAllPost();
    } else {
      // No user is signed in.
      // console.log("else");
      currentUID = null;
      logIn.style.display = 'block';
      logOut.style.display = 'none';
      chat.style.display = "none";
    }
  });

  // Saves message on form submit.
  formPost.onsubmit = function(e) {
    e.preventDefault();
    var text = newPostMessage.value;
    var title = newPostTitle.value;
    if (text && title) {
      createPost(title, text);
      newPostMessage.value = '';
      newPostTitle.value = '';
    }
  };

}, false);