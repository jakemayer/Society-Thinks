$( document ).ready(function() {
	mdc.autoInit();
	const MDCDialog = mdc.dialog.MDCDialog;
	const MDCDialogFoundation = mdc.dialog.MDCDialogFoundation;
	const util = mdc.dialog.util;
	var answer_dialog = new mdc.dialog.MDCDialog(document.querySelector('#answer-dialog'));


	$("#overlay").css("display","block");
	$.ajax({
	  url: "http://localhost:8000/php/questions.php/search",
	  method: "GET",
	  dataType: "json"
	}).done(function(response) {
		for(let i = 0; i < response.length; i++) {
			createQuestionCard(response[i][0], response[i]['question'], response[i]['username'], response[i]['pro_pic'], response[i]['country'], response[i]['asked_time'], response[i]['is_yours']);
			$("#Q"+response[i][0]+"-answers").click(function(){
			  	$.ajax({
					 url: "http://localhost:8000/php/questions.php/answers/"+response[i][0],
						  method: "GET",
						  dataType: "json"
				}).done(function(response) {
					$("#question-title").text(response[0]['question']);
					$("#answer-footer").html("");
					for(let i = 0; i < response.length; i++) {
						$("#answer-footer").prepend(`<button style="margin-left:1%;" type="button" 
							class="mdc-button 
							mdc-button mdc-button--raised mdc-ripple-upgraded
							">`+response[i]['answer']+`
							</button>`)
					}
				}).fail(function(error){
					console.log(error);
				});
			  	answer_dialog.show();
			});
		}
		$("#overlay").css("display","none");
	}).fail(function(error) {
		alert("Fail");
		console.log(error); //log them out or something
	});

	$("#responded-tab").click(function() {
		$("#questions-tab").removeClass("mdc-tab--active");
		$(this).addClass("mdc-tab--active");
		$(".mdc-tab-bar__indicator").css("transform", "translateX(160px) scale(0.5, 1)");
	});

	$("#questions-tab").click(function() {
		$("#responded-tab").removeClass("mdc-tab--active");
		$(this).addClass("mdc-tab--active");
		$(".mdc-tab-bar__indicator").css("transform", "translateX(0px) scale(0.5, 1)");
	});

	$("#search-bar").on('change input', function () {
		$("#overlay").css("display","block");
		$.ajax({
		  url: "http://localhost:8000/php/questions.php/search?string="+this.value,
		  method: "GET",
		  dataType: "json"
		}).done(function(response) {
			$("#question-content").html("");
			for(let i = 0; i < response.length; i++) {
				createQuestionCard(response[i][0], response[i]['question'], response[i]['username'], response[i]['pro_pic'], response[i]['country'], response[i]['asked_time'], response[i]['is_yours']);
				  $("#Q"+response[i][0]+"-answers").click(function(){
				  	answer_dialog.show();
				  });
			}
			$("#overlay").css("display","none");
		}).fail(function(error) {
			alert("Fail");
			console.log(error); //log them out or something
		});
	});

});

function createQuestionCard(id, question, asker, picture, country, datetime, is_yours){

  var html_string = `
  <div id="` + "Q" + id + `" class="mdc-card question-card" style="background-color:white">
  	<div class="country-banner"> <div class="banner-flag" style="background-image: url(http://flags.fmcdn.net/data/flags/w580/`+country+`.png);"></div></div>
  	<div class="mdc-card__horizontal-block">
      <section class="mdc-card__primary">
        <h1 class="mdc-card__title mdc-card__title--large">` + question + `</h1>
        <h2 class="mdc-card__subtitle">` + "Asked by " + asker + `</h2>
      </section>
      <div class="pic-row" style="width:10%;"><img class="circle" style="background-image:url(`+picture+`)"/> </div>
    </div>
    <section class="mdc-card__actions">
      <button id="Q`+id+`-answers" class="mdc-button mdc-button--compact mdc-card__action">Answer Question</button>
      <button id="Q`+id+`-results" class="mdc-button mdc-button--compact mdc-card__action">View Results</button>
    </section>
  </div>`;

  $("#question-content").append(html_string);
}