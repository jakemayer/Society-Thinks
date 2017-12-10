$( document ).ready(function() {
	mdc.autoInit();

	$.ajax({
		  url: "home.html",
		  method: "GET",
		  dataType: "text",
		  success: function(response) {
		  	$("#content").html(response);
		  } ,
		  error: function(error) {

		  }
	});

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
		$("#overlay").css("display","block");
		$.ajax({
		  url: "http://localhost:8000/php/user.php/"+$.cookie("uid"),
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
			$("#overlay").css("display","none");
		}).fail(function(error) {
			console.log(error); //log them out or something
		});

	}

	$("#change-pic-form").submit(function(e) {
		e.preventDefault();
		$("#overlay").css("display","block");
		var formdata = new FormData();
		let picLink = "";
		formdata.append("image",$("#pro-pic-input").prop("files")[0]);
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
				$.ajax({
 				  url: "http://localhost:8000/php/user.php/update/"+$.cookie("uid"),
				  method: "POST",
				  data: {
				  	pro_pic: response.data['link']
				  },
				  dataType: "json"
				}).done(function(response) {
  					location.reload();
				}).fail(function(error) {
					console.log(error);
				});
			}).fail(function(error) {
				console.log(error);
			});
	});

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
		  url: "http://localhost:8000/php/auth.php/logout?user="+$.cookie("uid"),
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
		router(page,this);
	});

	function router(page,_this) {
		$(".router").removeClass("mdc-permanent-drawer--selected");
		$(_this).addClass("mdc-permanent-drawer--selected");
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