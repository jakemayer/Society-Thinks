$( document ).ready(function() {
	mdc.autoInit();
	$("#overlay").css("display","block");
	$.ajax({
	  url: "http://localhost:8000/php/questions.php/search",
	  method: "GET",
	  dataType: "json"
	}).done(function(response) {
		for(let i = 0; i < response.length; i++) {
			createQuestionCard(response[i]['id'], response[i]['question'], response[i]['username'], response[i]['pro_pic'], response[i]['country'], response[i]['asked_time'], response[i]['is_yours']);
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
				createQuestionCard(response[i]['id'], response[i]['question'], response[i]['username'], response[i]['pro_pic'], response[i]['country'], response[i]['asked_time'], response[i]['is_yours']);
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
  <div id="` + "Q" + id + `" class="mdc-card">
  	<div class="mdc-card__horizontal-block">
      <section class="mdc-card__primary">
        <h1 class="mdc-card__title mdc-card__title--large">` + question + `</h1>
        <h2 class="mdc-card__subtitle">` + "Asked by " + asker + `</h2>
      </section>
      <img class="mdc-card__media-item" src="` + picture + `">
    </div>
    <section class="mdc-card__actions">
      <button class="mdc-button mdc-button--compact mdc-card__action">Answer Question</button>
      <button class="mdc-button mdc-button--compact mdc-card__action">View Results</button>
    </section>
  </div>`;

  $("#question-content").append(html_string);

}