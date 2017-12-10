$( document ).ready(function() {
	mdc.autoInit();
	$("#overlay").css("display","block");
	$.ajax({
	  url: "http://localhost:8000/php/questions.php/search/",
	  method: "GET",
	  dataType: "json"
	}).done(function(response) {
		for(let i = 0; i < response.length; i++) {
			createQuestionCard(response[i]['id'], response[i]['question'], response[i]['username'], response[i]['pro_pic'], response[i]['country'], response[i]['asked_time'], response[i]['is_yours']);
		}
		$("#overlay").css("display","none");
	}).fail(function(error) {
		alert(error.responseText);
		console.log(error); //log them out or something
	});
});

function createQuestionCard(id, question, asker, picture, country, datetime, is_yours){

  var html_string = `
  <div id="` + "Q" + id + `" class="mdc-card demo-card">
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

  $("#question_body").append(html_string);

}