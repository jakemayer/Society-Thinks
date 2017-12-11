$( document ).ready(function() {
	mdc.autoInit();
	$("#overlay").css("display","block");
			$.ajax({
			  url: "http://localhost:8000/php/questions.php/recent-activity/"+$.cookie("uid"),
			  method: "GET",
			  dataType: "json"
			}).done(function(response) {
				for(let i = 0; i < response.length; i++) {
					let text = "";
					let time = "";
					let icon = "";
					let points = "";
					let point_color = "";
					if(response[i].is_response == 1) {
						text = "You responded to ";
						dateObject = new Date(Date.parse(response[i]['responded_time']));
						time = dateObject.toDateString();
						icon = "playlist_add_check";
						points = "+25"
						point_color = "green"
					} else {
						text = "You asked ";
						dateObject = new Date(Date.parse(response[i]['asked_time']));
						time = dateObject.toDateString();
						icon = "question_answer";
						points = "-50";
						point_color = "red";
					}
					$("#recent_activity_content").append(`
					<div class="mdc-card" style="margin-top:4%;">
			            <div class="mdc-card__horizontal-block">
			              <section class="mdc-card__primary" style="font-size:10px">
			                <h2 class="mdc-card__subtitle" style="font-size:10px;">`+text+`<a href="app.html">`+response[i].question+`</a></h2>
			          		<i class="material-icons" style="font-size:12px;">access_time</i>`+time+`
			              </section>
			              <section>
			              <i class="mdc-card__media-item material-icons">`+icon+`</i>
			              <div style="margin-top:-78%; margin-left:30%; color:`+point_color+`">`+points+`</div>
			              </section>
			            </div>
			          </div>

						`)
				}
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
				$("#stat_box1 > .inner-stat-circle").empty().append(response['response_rate']*100+"%");
				$("#stat_box2 > .inner-stat-circle").empty().append(response['asked_count']);
				$("#stat_box3 > .inner-stat-circle").empty().append(response['responded_count']);
				$(".points-content").empty().append(response['points']);
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