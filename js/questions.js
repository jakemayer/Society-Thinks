$( document ).ready(function() {
	mdc.autoInit();
	const MDCDialog = mdc.dialog.MDCDialog;
	const MDCDialogFoundation = mdc.dialog.MDCDialogFoundation;
	const util = mdc.dialog.util;
	var answer_dialog = new mdc.dialog.MDCDialog(document.querySelector('#answer-dialog'));
	var results_dialog = new mdc.dialog.MDCDialog(document.querySelector("#results-dialog"));


	$("#overlay").css("display","block");
	$.ajax({
	  url: "http://localhost:8000/php/questions.php/search",
	  method: "GET",
	  dataType: "json"
	}).done(function(response) {
		for(let i = 0; i < response.length; i++) {
			createQuestionCard(response[i][0], response[i]['question'], response[i]['username'], response[i]['pro_pic'], response[i]['country'], response[i]['asked_time'], response[i]['is_yours'], response[i]['already_responded']);
			$("#Q"+response[i][0]+"-answers").click(function(){
			  	$.ajax({
					 url: "http://localhost:8000/php/questions.php/answers/"+response[i][0],
						  method: "GET",
						  dataType: "json"
				}).done(function(response) {
					$("#question-title").text(response[0]['question']);
					$("#answer-footer").html("");
					for(let i = 0; i < response.length; i++) {
						$("#answer-footer").prepend(`<button id="B`+i+`" style="margin-left:1%;" type="button" 
							class="mdc-button 
							mdc-button mdc-button--raised mdc-ripple-upgraded
							">`+response[i]['answer']+`
							</button>`);
						$("#B"+i).click(function(){
							handleResponse(response[i][0], response[i][3])
						});
					}
				}).fail(function(error){
					console.log(error);
				});
			  	answer_dialog.show();
			});
			$("#Q"+response[i][0]+"-results").click(function(){
				$("#results-header").text(response[i]['question']);
				$("#results-header").attr("qid",response[i][0]);
				generateAndShowResults(response[i][0],results_dialog);
			});
		}
		$("#overlay").css("display","none");
	}).fail(function(error) {
		alert("Fail");
		console.log(error); //log them out or something
	});

	function handleResponse(answer_id, question_id){
		$("#overlay").css("display","block");
		$.ajax({
	  		url: "http://localhost:8000/php/response.php/"+question_id,
	  		method: "POST",
	  		dataType: "json",
	  		data: {user_id: $.cookie('uid'), answer_id: answer_id}
		}).done(function(response) {
			$("#overlay").css("display","none");
			$("#answer-dialog").removeClass("mdc-dialog--open");
			generateAndShowResults(question_id,results_dialog);
			$("#Q"+question_id+"-answers").attr("disabled", "true");
		}).fail(function(error){
			console.log(error);
		});
	}

	$("#my-tab").click(function() {
		$("#questions-tab").removeClass("mdc-tab--active");
		$("#questions-tab").attr("active","false");
		$(this).addClass("mdc-tab--active");
		$(this).attr("active","true");
		$(".mdc-tab-bar__indicator").css("transform", "translateX(160px) scale(0.5, 1)");

		$(".question-card").each(function(i,card) {
			if($(card).attr("is_yours") == 0) {
				$(card).css("display","none");
			}
		});
	});

	$("#questions-tab").click(function() {
		$("#my-tab").removeClass("mdc-tab--active");
		$("#my-tab").attr("active","false");		
		$(this).addClass("mdc-tab--active");
		$(this).attr("active","true");
		$(".mdc-tab-bar__indicator").css("transform", "translateX(0px) scale(0.5, 1)");
		$(".question-card").each(function(i,card) {
			$(card).css("display","block");
		});
	});

	$("#search-bar").on('change input', function () {
		$("#questions-overlay").css("display","block");
		$.ajax({
		  url: "http://localhost:8000/php/questions.php/search?string="+this.value,
		  method: "GET",
		  dataType: "json"
		}).done(function(response) {
			$("#question-content").html("");
			for(let i = 0; i < response.length; i++) {
				createQuestionCard(response[i][0], response[i]['question'], response[i]['username'], response[i]['pro_pic'], response[i]['country'], response[i]['asked_time'], response[i]['is_yours'], response[i]['already_responded']);
				  $("#Q"+response[i][0]+"-answers").click(function(){
				  	answer_dialog.show();
				 });
			}
			if($("#my-tab").attr("active")=="true"){
				$(".question-card").each(function(i,card) {
					if($(card).attr("is_yours") == 0) {
						$(card).css("display","none");
					}
				});
			}
			$("#questions-overlay").css("display","none");
		}).fail(function(error) {
			alert("Fail");
			console.log(error);
		});
	});
});

$("#filter-form").change(function(e) {
	var results_dialog = new mdc.dialog.MDCDialog(document.querySelector("#results-dialog"));
	generateAndShowResults($("#results-header").attr("qid"),results_dialog);
});

$( window ).scroll(function(){scroll_handler();});

var question_cards = [];
var viewed_cards = [];

function scroll_handler(){
	question_cards.forEach(function(card){
		if (!viewed_cards.includes(card) && inViewport(document.getElementById(card))){
			viewed_cards.push(card);
			var question_id = parseInt(card.substring(1));
			$.ajax({
				url:"http://localhost:8000/php/questions.php/viewed",
				method: "GET",
				dataType:"json",
				data: {question: question_id, viewed_by: $.cookie('uid')}
			}).done(function(response) {
			}).fail(function(error){
				console.log(error);
			})
		}
	});
};

function createQuestionCard(id, question, asker, picture, country, datetime, is_yours, already_responded){
  var disabled = "";
  if (is_yours + already_responded > 0)
  	disabled = " disabled";
  var html_string = `
  <div id="` + "Q" + id + `" class="mdc-card question-card" style="background-color:white" is_yours=`+is_yours+`>
  	<div class="country-banner"> <div class="banner-flag" style="background-image: url(http://flags.fmcdn.net/data/flags/w580/`+country+`.png);"></div></div>
  	<div class="mdc-card__horizontal-block">
      <section class="mdc-card__primary">
        <h1 class="mdc-card__title mdc-card__title--large">` + question + `</h1>
        <h2 class="mdc-card__subtitle">` + "Asked by " + asker + `</h2>
      </section>
      <div class="pic-row" style="width:10%;"><img class="circle" style="background-image:url(`+picture+`)"/> </div>
    </div>
    <section class="mdc-card__actions">
      <button id="Q`+id+`-answers" class="mdc-button mdc-button--compact mdc-card__action"` + disabled + `>Answer Question</button>
      <button id="Q`+id+`-results" class="mdc-button mdc-button--compact mdc-card__action">View Results</button>
    </section>
  </div>`;

  $("#question-content").append(html_string);
  question_cards.push("Q"+id);
  scroll_handler();
}

function inViewport(el){
    var r, html;
    if ( !el || 1 !== el.nodeType ) { return false; }
    html = document.documentElement;
    r = el.getBoundingClientRect();

    return ( !!r 
      && r.bottom >= 0 
      && r.right >= 0 
      && r.top <= html.clientHeight 
      && r.left <= html.clientWidth 
    );
}

function generateAndShowResults(question_id,results_dialog){
	let genderFilter = [];
	let raceFilter = [];
	let religionFilter = [];
	let countryFilter = [];

	$("#gender-filter input").each(function(i, el) {
		if(el.checked == true) {
			genderFilter.push(el.id);
		}
	});
	$("#race-filter input").each(function(i, el) {
		if(el.checked == true) {
			raceFilter.push(el.id);
		}
	});
	$("#country-filter input").each(function(i, el) {
		if(el.checked == true) {
			countryFilter.push(el.id);
		}
	});
	$("#religion-filter input").each(function(i, el) {
		if(el.checked == true) {
			religionFilter.push(el.id);
		}
	});
	let min_age = $("#age_min").val();
	let max_age = $("#age_max").val();

	let data = {
		genders:genderFilter,
		races:raceFilter,
		religions:religionFilter,
		countries:countryFilter,
		minAge: min_age,
		maxAge:max_age
	}
	$.ajax({
		url:"http://localhost:8000/php/response.php/"+question_id,
		method: "GET",
		dataType:"json",
		data: data
	}).done(function(response) {
		ctx = $("#chart");
		let labels = [];
		let data = [];
		response.forEach(function(obj) {
			labels.push(obj['answer']);
			data.push(obj['count']);
		});
		var myChart = new Chart(ctx, {
		    type: 'doughnut',
		    data: {
		        labels: labels,
		        datasets: [{
		            data: data,
		            backgroundColor: [
		                'rgba(255, 99, 132, 0.2)',
		                'rgba(54, 162, 235, 0.2)',
		                'rgba(255, 206, 86, 0.2)',
		                'rgba(75, 192, 192, 0.2)',
		                'rgba(153, 102, 255, 0.2)',
		                'rgba(255, 159, 64, 0.2)'
		            ],
		            borderColor: [
		                'rgba(255,99,132,1)',
		                'rgba(54, 162, 235, 1)',
		                'rgba(255, 206, 86, 1)',
		                'rgba(75, 192, 192, 1)',
		                'rgba(153, 102, 255, 1)',
		                'rgba(255, 159, 64, 1)'
		            ],
		            borderWidth: 1
		        }]
		    },
		});
		


	}).fail(function(error) {
		console.log(error);
	});
	results_dialog.show();
}