//c30a265d598a06a client id	
//912ff8c75f015c2a171f8990130c5849398ea969 client secret
//imgur ^

$( document ).ready(function() {
	mdc.autoInit();

	const MDCSelect = mdc.select.MDCSelect;

	$(".mdc-select").each(function(el) {
		let select = new MDCSelect(document.querySelector(".mdc-select"+el));
		select.listen('MDCSelect:change', () => {
			$(".mdc-select"+el+" + i").text("check_circle");
			$(".mdc-select"+el+" + i").addClass("green");
			check_register();
		});
	});

	function calculateAge(dob) { // birthday is a date
		dob = new Date(dob);
		var today = new Date();
		return Math.floor((today-dob) / (365.25 * 24 * 60 * 60 * 1000));
	}
	
	function check_register() {
		if($(".green").length == 10) {
			$("#register-button").prop("disabled",false);
		} else {
			$("#register-button").prop("disabled",true);
		}
	}

	$("#birthday").on('change input', function () {
		if(calculateAge(this.value) > 6 && calculateAge(this.value) < 110) {
			$("#birthday + i").text("check_circle");
			$("#birthday + i").css("color","green");
			$("#birthday-error-txt").css("display","none");
			$("#birthday + i").removeClass("red").addClass("green");
		} else {
			$("#birthday + i").text("mood_bad");
			$("#birthday + i").css("color","red");
			$("#birthday-error-txt").css("display","block");
			$("#birthday-error-txt").text("Come on be realistic");	
			$("#birthday + i").removeClass("green").addClass("red");		
		}
		check_register();
	});

	$("#fname").on('change textInput input', function () {
		if(this.value.length != 0 && $("#lname")[0].value.length !=0) {
			$("#lname ~ i").text("check_circle");
			$("#lname ~ i").css("color","green");
			$("#lname ~ i").removeClass("red").addClass("green");
		} else {
			$("#lname ~ i").text("mood_bad");
			$("#lname ~ i").css("color","red");
			$("#lname ~ i").removeClass("green").addClass("red");		
		}
		check_register();
	});
	$("#lname").on('change textInput input', function () {
		if(this.value.length != 0 && $("#fname")[0].value.length !=0) {
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
			  url: "http://0.0.0.0:8000/php/user.php/unique-check",
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
			  url: "http://0.0.0.0:8000/php/user.php/unique-check",
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

    $('#password2').on('change textInput input', function () {
		let value = this.value;
		if(value != $("#password")[0].value) {
			$("#password-status").removeClass("green").addClass("red");
			$("#password-status").text("mood_bad");
			$("#password-status").css("color","red");
		} else {
			$("#password-status").text("check_circle");
			$("#password-status").css("color","green");
			$("#password-status").removeClass("red").addClass("green");		
		}
		check_register();
    });

    $('#password').on('change textInput input', function () {
		let value = this.value;
		if(value.length < 5) {
			$("#password1-status").removeClass("green").addClass("red");
			$("#password1-status").text("mood_bad");
			$("#password1-status").css("color","red");
		} else {
			$("#password1-status").text("check_circle");
			$("#password1-status").css("color","green");
			$("#password1-status").removeClass("red").addClass("green");		
		}
		check_register();
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
		var formdata = new FormData();
		let picLink = "";
		formdata.append("image",$("#pro-pic").prop("files")[0]);
		$.ajax({
			  url: "https://api.imgur.com/3/image",
			  method: "POST",
			  headers: {
			  	Authorization:"Client-ID c30a265d598a06a",
			  },
			  processData: false,
			  contentType: false,
			  data:formdata,
			  dataType: "json"
			}).done(function(response) {
				if(password !== password2) {
					console.log("nope");
				} else {
					$.ajax({
					  url: "http://0.0.0.0:8000/php/auth.php",
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
					  	country:country,
					  	pro_pic: response.data['link']
					  },
					  dataType: "json"
					}).done(function(response) {
						$.ajax({
						  url: "http://0.0.0.0:8000/php/auth.php",
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
			}).fail(function(error) {
				if(password !== password2) {
					console.log("nope");
				} else {
					$.ajax({
					  url: "http://0.0.0.0:8000/php/auth.php",
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
					  	country:country,
					  	pro_pic:null
					  },
					  dataType: "json"
					}).done(function(response) {
						$.ajax({
						  url: "http://0.0.0.0:8000/php/auth.php",
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

});