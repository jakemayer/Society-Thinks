$( document ).ready(function() {
	mdc.autoInit();


    const MDCDialog = mdc.dialog.MDCDialog;
	const MDCDialogFoundation = mdc.dialog.MDCDialogFoundation;
	const util = mdc.dialog.util;
	var login_dialog = new mdc.dialog.MDCDialog(document.querySelector('#login-dialog'));

	$("#login-btn").click(function() {
		if($.cookie("uuid") != null && $.cookie("uid") !=null) {
			window.location.replace("app.html");
		} 
		login_dialog.show();
	});

	$("#login-form").submit(function(e) {
		$("#overlay").css("display","block");
		e.preventDefault();
		let username = e.target[0].value;
		let password = e.target[1].value;
		$.ajax({
		  url: "http://0.0.0.0:8000/php/auth.php",
		  method: "GET",
		  data: { username: username, password:password},
		  dataType: "json"
		}).done(function(response) {
			$.cookie('uuid', response['token'], { expires: 10, path: '/' }); //save cookie
			$.cookie('uid',response['user_id'],{expires:10,path:'/'});
			window.location.replace("app.html");
		}).fail(function(error) {
			$("#overlay").css("display","none");
			login_dialog.show();
			$("#error-txt").text("Oops! Your username or password is incorrect");
		});
	});

});