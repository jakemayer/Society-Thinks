$( document ).ready(function() {
	if($.cookie("uuid") == null) {
		console.log("you're unauthorized!");
		window.location.replace("index.html");
	} else {
		console.log("you're good!");
	}
	
});