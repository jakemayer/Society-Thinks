$( document ).ready(function() {
	mdc.autoInit();
    const MDCDialog = mdc.dialog.MDCDialog;
	const MDCDialogFoundation = mdc.dialog.MDCDialogFoundation;
	const util = mdc.dialog.util;
	var login_dialog = new mdc.dialog.MDCDialog(document.querySelector('#login-dialog'));

	$("#login-btn").click(function() {
		login_dialog.show();
	})

});