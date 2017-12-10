$( document ).ready(function() {
	mdc.autoInit();
	$("#overlay").css("display","block");
			$.ajax({
			  url: "http://localhost:8000/php/questions.php/recent-activity/"+$.cookie("uid"),
			  method: "GET",
			  dataType: "json"
			}).done(function(response) {
				console.log(response);
				$("#overlay").css("display","none");
			}).fail(function(error) {
				console.log(error); //log them out or something
			});

	$("#overlay").css("display","block");
			$.ajax({
			  url: "http://localhost:8000/php/user.php/user-data/"+$.cookie("uid"),
			  method: "GET",
			  dataType: "json"
			}).done(function(response) {
				$("#overlay").css("display","none");
				$("#stat_box1").empty().append("Response Rate: " + response['response_rate']);
				$("#stat_box2").empty().append("Questions Asked: " + response['asked_count']);
				$("#stat_box3").empty().append("Questions Answered: " + response['responded_count']);
				$("#stat_box4").empty().append("Points: " + response['points']);
			}).fail(function(error) {
				console.log(error);
			});

	$("#overlay").css("display","block");
			$.ajax({
			  url: "http://localhost:8000/php/questions.php/trending/",
			  method: "GET",
			  dataType: "json"
			}).done(function(response) {
				$("#overlay").css("display","none");
				$("#question_of_day_text").empty().append(response['question']);
			}).fail(function(error) {
				console.log(error);
			});
});