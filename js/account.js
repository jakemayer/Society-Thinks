$( document ).ready(function() {
	mdc.autoInit();
	var user_info = {}
	if($.cookie("uuid") == null) {
		console.log("you're unauthorized!");
		window.location.replace("index.html");
	} else {
		$.ajax({
		  url: "http://localhost:8000/php/user.php/"+$.cookie("uid"),
		  method: "GET",
		  dataType: "json"
		}).done(function(response) {
			user_info = response;
			$("#fname + label").text(response['fname']);
			$("#lname + label").text(response['lname']);
			$("#email + label").text(response['email']);
			$("#username + label").text(response['username']);

		}).fail(function(error) {
			console.log(error); //log them out or something
		});

	}

	$("#register-form").submit(function(e) {
		e.preventDefault();
		let fname = e.target[0].value;
		let lname = e.target[1].value;
		let email = e.target[2].value;
		let username = e.target[3].value;
		$.ajax({
		  url: "http://localhost:8000/php/user.php/update/"+$.cookie("uid"),
		  method: "POST",
		  data: {
		  	fname:fname,
		  	lname:lname,
		  	email:email,
		  	username:username,
		  	uuid: $.cookie("uuid")
		  },
		  dataType: "json"
		}).done(function(response) {
			location.reload();
		}).fail(function(error) {
			console.log(error); //log them out or something
		});
	});

	function check_register() {
		if($(".green").length > 0) {
			$("#update-button").prop("disabled",false);
		} else {
			$("#update-button").prop("disabled",true);
		}
	}
	$("#fname").on('change textInput input', function () {
		if(this.value.length != 0) {
			$("#fname ~ i").text("check_circle");
			$("#fname ~ i").css("color","green");
			$("#fname ~ i").removeClass("red").addClass("green");
		} else {
			$("#fname ~ i").text("mood_bad");
			$("#fname ~ i").css("color","red");
			$("#fname ~ i").removeClass("green").addClass("red");		
		}
		check_register();
	});
	$("#lname").on('change textInput input', function () {
		if(this.value.length != 0) {
			$("#lname ~ i").removeClass("red").addClass("green");
			$("#lname ~ i").text("check_circle");
			$("#lname ~ i").css("color","green");	
		} else {
			$("#lname ~ i").text("mood_bad");
			$("#lname ~ i").css("color","red");
			$("#lname ~ i").removeClass("green").addClass("red");		
		}
		check_register();

	});
	$('#email').on('change textInput input', function () {
		let value = this.value;
		$.ajax({
			  url: "http://localhost:8000/php/user.php/unique-check",
			  method: "GET",
			  data: { type: "email",
			  		  value: this.value
			  		},
			  dataType: "json"
		}).done(function(response) {
			if(response['status'] && value.length != 0 && value.indexOf("@") != -1 && (value.indexOf(".com") != -1 || value.indexOf(".net") != -1 || value.indexOf(".edu") != -1)) 
			{
				$("#email-status").text("check_circle");
				$("#email-status").css("color","green");
				$("#email-error-txt").css("display","none");
				$("#email-status").removeClass("red").addClass("green");

			} else{
				$("#email-status").text("mood_bad");
				$("#email-status").css("color","red");
				$("#email-error-txt").css("display","block");
				if(!response['status']) {
					$("#email-error-txt").text("Email already used");
				} else {
					$("#email-error-txt").text("Invalid email");					
				}
				$("#email-status").removeClass("green").addClass("red");
			}
		});
		check_register();
    });

    $('#username').on('change textInput input', function () {
		let value = this.value;
		$.ajax({
			  url: "http://localhost:8000/php/user.php/unique-check",
			  method: "GET",
			  data: { type: "username",
			  		  value: this.value
			  		},
			  dataType: "json"
		}).done(function(response) {
			if(response['status'] && value.length != 0) {
				$("#username-status").removeClass("red").addClass("green");
				$("#username-status").text("check_circle");
				$("#username-status").css("color","green");
				$("#username-error-txt").css("display","none");
			} else{
				$("#username-status").text("mood_bad");
				$("#username-status").css("color","red");
				$("#username-error-txt").css("display","block");

				if(!response['status']) {
					$("#username-error-txt").text("Username not available");
				} else {
					$("#username-error-txt").text("Invalid username");					
				}
				$("#username-status").removeClass("green").addClass("red");
			}
		});
		check_register();
    });
});