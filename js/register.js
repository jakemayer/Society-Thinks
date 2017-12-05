$( document ).ready(function() {
	mdc.autoInit();

	const MDCSelect = mdc.select.MDCSelect;

	$(".mdc-select").each(function(el) {
		let select = new MDCSelect(document.querySelector(".mdc-select"+el));
		select.listen('MDCSelect:change', () => {
			$(".mdc-select"+el+" + i").text("check_circle");
		});
	});

	function calculateAge(dob) { // birthday is a date
		dob = new Date(dob);
		var today = new Date();
		return Math.floor((today-dob) / (365.25 * 24 * 60 * 60 * 1000));
	}

	$("#birthday").on('change input', function () {
		if(calculateAge(this.value) > 10) {
			$("#birthday + i").text("check_circle");
			$("#birthday + i").css("color","green");
			$("#birthday-error-txt").css("display","none");
	
		} else {
			$("#birthday + i").text("mood_bad");
			$("#birthday + i").css("color","red");
			$("#birthday-error-txt").css("display","block");
			$("#birthday-error-txt").text("You are way too young for this kiddo");			
		}
	});

	$("#fname").on('change textInput input', function () {
		if(this.value.length != 0 && $("#lname")[0].value.length !=0) {
			$("#lname ~ i").text("check_circle");
			$("#lname ~ i").css("color","green");	
		} else {
			$("#lname ~ i").text("mood_bad");
			$("#lname ~ i").css("color","red");				
		}
	});
	$("#lname").on('change textInput input', function () {
		if(this.value.length != 0 && $("#fname")[0].value.length !=0) {
			$("#lname ~ i").text("check_circle");
			$("#lname ~ i").css("color","green");	
		} else {
			$("#lname ~ i").text("mood_bad");
			$("#lname ~ i").css("color","red");				
		}

	});

	$('#email').on('change textInput input', function () {
		let value = this.value;
		$.ajax({
			  url: "http://0.0.0.0:8000/user.php/unique-check",
			  method: "GET",
			  data: { type: "email",
			  		  value: this.value
			  		},
			  dataType: "json"
		}).done(function(response) {
			if(response['status'] && value.length != 0 && value.indexOf("@") != -1) {
				$("#email-status").text("check_circle");
				$("#email-status").css("color","green");
				$("#email-error-txt").css("display","none");
			} else{
				$("#email-status").text("mood_bad");
				$("#email-status").css("color","red");
				$("#email-error-txt").css("display","block");
				if(!response['status']) {
					$("#email-error-txt").text("Email already used");
				} else {
					$("#email-error-txt").text("Invalid email");					
				}
			}
		});
    });

    $('#username').on('change textInput input', function () {
		let value = this.value;
		$.ajax({
			  url: "http://0.0.0.0:8000/user.php/unique-check",
			  method: "GET",
			  data: { type: "username",
			  		  value: this.value
			  		},
			  dataType: "json"
		}).done(function(response) {
			if(response['status'] && value.length != 0) {
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
			}
		});
    });

    $('#password2').on('change textInput input', function () {
		let value = this.value;
		if(value != $("#password")[0].value) {
			$("#password-status").text("mood_bad");
			$("#password-status").css("color","red");
		} else {
			$("#password-status").text("check_circle");
			$("#password-status").css("color","green");			
		}
    });

    // $("#register-form").on('change textInput input', function () {
    // 	let check_count = 0
    // 	$(".material-icons").each(function(el) {
    // 		if($(".material-icons")[el].innerText == "check_circle") {
    // 			check_count++;
    // 		}
    // 	});
    // 	if(check_count == 9) {
    // 		$("form > button").prop("disabled",false)
    // 	}
    // });

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