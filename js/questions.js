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
			answer_dialog.hide();
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
				createQuestionCard(response[i][0], response[i]['question'], response[i]['username'], response[i]['pro_pic'], response[i]['country'], response[i]['asked_time'], response[i]['is_yours']);
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

function createQuestionCard(id, question, asker, picture, country, datetime, is_yours){

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
      <button id="Q`+id+`-answers" class="mdc-button mdc-button--compact mdc-card__action">Answer Question</button>
      <button id="Q`+id+`-results" class="mdc-button mdc-button--compact mdc-card__action">View Results</button>
    </section>
  </div>`;

  $("#question-content").append(html_string);
}