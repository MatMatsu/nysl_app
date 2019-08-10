function handleResize() {
	  	if(window.innerWidth > window.innerHeight) {
	  		if (document.querySelectorAll(".modal-open").length>0) {
	  			let modales = document.querySelectorAll(".modal");

		  		modales.forEach((modal)=>{
		  			modal.classList.add("cerrar");
		  			//modal.classList.remove("show");
		  		})
		  		document.querySelector("body").classList.remove("modal-open");
		  		document.querySelector(".modal-backdrop").classList.remove("show");
		  		document.querySelector(".modal-backdrop").classList.remove("modal-backdrop");
		  	}
	  		app.portrait = false;
	  		app.landscape = true;
	  	} else {
	  		if (document.querySelectorAll(".cerrar").length>0) {
		  		let modales = document.querySelectorAll(".modal");
		  		modales.forEach((modal)=>{
		  			modal.classList.remove("cerrar");
		  		});
		  	}
	  		app.portrait = true;
	  		app.landscape = false;
	  	}
	  	//console.log("HOLA");
	  	
	  }

$(window).on("load", function() {
	handleResize();
  window.addEventListener("resize", handleResize);
  $("main").css("display", "block");
  $(".loader").fadeOut("slow");
  
	$(document).ready(function () {
	  $("li:first-child").addClass("active");
	  $(".carousel-item:first-child").addClass("active");
	});

});