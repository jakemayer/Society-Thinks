$( document ).ready(function() {
	mdc.autoInit();

    const MDCDialog = mdc.dialog.MDCDialog;
	const MDCDialogFoundation = mdc.dialog.MDCDialogFoundation;
	const util = mdc.dialog.util;
	var picture_dialog = new mdc.dialog.MDCDialog(document.querySelector('#picture-dialog'));

	var request_done = false;
	let user_menu = new mdc.menu.MDCSimpleMenu(document.querySelector("#user-menu"));
	if($.cookie("uuid") == null) {
		console.log("you're unauthorized!");
		window.location.replace("index.html");
	} else {
		$.ajax({
		  url: "http://0.0.0.0:8000/user.php/"+$.cookie("uid"),
		  method: "GET",
		  dataType: "json"
		}).done(function(response) {
			request_done = true;
			$("#user-menu-btn").prepend("Hey "+response['fname']+"!");

			if(response['pro_pic'] != null && response['pro_pic'] != "") {
				$("#user-pro-pic").css('background-image', 'url(' + response['pro_pic'] + ')');
			} else {
				$("#user-pro-pic").css('background-image', 'url(http://via.placeholder.com/350x150?text=Add+Profile+Picture)');
			}

		}).fail(function(error) {
			console.log(error); //log them out or something
		});

	}

	$("#cancel-pic-change").click(function() {
		$("#preview").html("");
	});

	$("#user-pro-pic").click(function() {
		picture_dialog.show();
	})
	$("#user-menu-btn").click(function() {
		user_menu.open = !user_menu.open;
	});

	$("#logout-btn").click(function() {
		$("#overlay").css("display","block");
		$.ajax({
		  url: "http://0.0.0.0:8000/auth.php/logout?user="+$.cookie("uid"),
		  method: "GET",
		  dataType: "json"
		}).done(function(response) {
			$.removeCookie('uuid', {path:'/'}); //delete cookie
			window.location.replace("index.html");
			$("#overlay").css("display","none");
		}).fail(function(error) {

		});
	});

	$(".router").click(function(e) {
		e.preventDefault();
		page = $(this).attr('href');
		router(page);
	});

	function router(page) {
		$.ajax({
		  url: page,
		  method: "GET",
		  dataType: "text",
		  success: function(response) {
		  	$("#content").html(response);
		  } ,
		  error: function(error) {

		  }
		});
	}
	
});