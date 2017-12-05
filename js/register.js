$( document ).ready(function() {
	mdc.autoInit();

	const MDCSelect = mdc.select.MDCSelect;

	$(".mdc-select").each(function(el) {
		let select = new MDCSelect(document.querySelector(".mdc-select"+el));
	});

	$("#register-form").submit(function(e) {
		e.preventDefault();
		let fname = e.target[0].value;
		let lname = e.target[1].value;
		let email = e.target[2].value;
		let username = e.target[3].value;
		let password = e.target[4].value;
		let password2 = e.target[5].value;
		let birthday = e.target[6].value;
		let race = new MDCSelect(document.querySelector(".mdc-select0")).value;
		let religion = new MDCSelect(document.querySelector(".mdc-select1")).value;
		let gender = new MDCSelect(document.querySelector(".mdc-select2")).value;
		let country = new MDCSelect(document.querySelector(".mdc-select3")).value;

		if(password !== password2) {
			console.log("nope");
		} else {
			$.ajax({
			  url: "http://0.0.0.0:8000/auth.php",
			  method: "POST",
			  data: {
			  	fname:fname,
			  	lname:lname,
			  	email:email,
			  	username:username,
			  	password:password,
			  	race:race,
			  	gender:gender,
			  	religion:religion,
			  	birthday:birthday,
			  	country:country
			  },
			  dataType: "json"
			}).done(function(response) {
				$.ajax({
				  url: "http://0.0.0.0:8000/auth.php",
				  method: "GET",
				  data: { username: response['username'], password:response['password']},
				  dataType: "json"
				}).done(function(response) {
					$.cookie('uuid', response['token'], { expires: 10, path: '/' }); //save cookie
					$.cookie('uid',response['user_id'],{expires:10,path:'/'});
					window.location.replace("app.html");
				});
			}).fail(function(error) {
				console.log(error); //loop through and display fields
			});
		}
	});

});