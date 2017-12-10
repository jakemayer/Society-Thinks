$( document ).ready(function() {
	mdc.autoInit();
	$("#overlay").css("display","block");
	$.ajax({
	  url: "http://localhost:8000/php/questions.php/search/",
	  method: "GET",
	  dataType: "json"
	}).done(function(response) {
		console.log(response);
		$("#overlay").css("display","none");
	}).fail(function(error) {
		console.log(error); //log them out or something
	});


});