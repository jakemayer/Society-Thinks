$( document ).ready(function() {
	mdc.autoInit();
	const MDCDialog = mdc.dialog.MDCDialog;
	const MDCDialogFoundation = mdc.dialog.MDCDialogFoundation;
	const util = mdc.dialog.util;
	var ask_dialog = new mdc.dialog.MDCDialog(document.querySelector('#ask-dialog'));

	let num_points = 0;
	let answers_count = 2;

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
						dateObject = new Date(Date.parse(response[i]['time']));
						time = dateObject.toDateString();
						icon = "playlist_add_check";
						points = "+25"
						point_color = "green"
					} else {
						text = "You asked ";
						dateObject = new Date(Date.parse(response[i]['time']));
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
				$("#stat_box1 > .inner-stat-circle").empty().append(parseFloat(response['response_rate']).toFixed(2)*100+"%");
				$("#stat_box2 > .inner-stat-circle").empty().append(response['asked_count']);
				$("#stat_box3 > .inner-stat-circle").empty().append(response['responded_count']);
				$(".points-content").empty().append(response['points']);
				num_points = response['points'];
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
	$("#ask-button").click(function() {
		ask_dialog.show();
		if(num_points < 50) {
			$("#ask-header").text("You do not have enough points!");
			$("#ask-description").css("display","none");
			$("#submit-question").css("display","none");
		} else {
			$("#ask-header").text("Ask a Question");
			$("#buy-points").hide();
			$("#ask-description").css("display","block");
			$("#submit-question").css("display","block");		
		}
	});

	$("#add-answer").click(function() {
		if(answers_count >= 5) {
		} else {
		answers_count++;
		$("#ask-answers").append(`<br id="break`+answers_count+`"><div class="mdc-text-field" id="aid`+answers_count+`" data-mdc-auto-init="MDCTextField">
                  <input type="text" class="mdc-text-field__input" id="answer`+answers_count+`">
                  <label for="answer`+answers_count+`" class="mdc-text-field__label">Answer Choice `+answers_count+`</label>
                </div>`);
		mdc.autoInit();
		}
	}); 

	$("#subtract-answer").click(function(){
		if(answers_count > 2) {
			$("#aid"+answers_count).remove();
			$("#break"+answers_count).remove();
			answers_count--;
		}
	});

	$("#ask-form").submit(function(e) {
		e.preventDefault();
		let question = e.target[0].value;
		let answers = "";
		for(let i = 1; i < e.target.length; i++) {
			if(e.target[i].value!="") {
				answers = answers + e.target[i].value + "|";
			}
		}
		answers = answers.slice(0,answers.length-1);
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		var dateTime = date+' '+time;
		$.ajax({
			  url: "http://localhost:8000/php/questions.php/create?question="+question+"&answers="+answers+"&date="+dateTime,
			  method: "POST",
			  dataType: "json"
		}).done(function(response) {
			window.location.reload();
		}).fail(function(err){
			console.log(err);
		});
	});
});