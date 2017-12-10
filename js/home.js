$( document ).ready(function() {
	mdc.autoInit();
	$("#overlay").css("display","block");
	$.ajax({
	  url: "http://localhost:8000/php/questions.php/recent-activity/"+$.cookie("uid"),
	  method: "GET",
	  dataType: "json"
	}).done(function(response) {
		$("#overlay").css("display","none");
	}).fail(function(error) {
		console.log(error); //log them out or something
	});
});