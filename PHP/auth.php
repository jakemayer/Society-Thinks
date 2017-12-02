<?php
date_default_timezone_set('America/New_York');
require_once('orm/Tokens.php');
$path_components = explode('/', $_SERVER['PATH_INFO']);

if ($_SERVER['REQUEST_METHOD'] == "GET") {
	if(count($_GET) != 2) {
		header("HTTP/1.0 Bad Request");
		header("Content-Type: application/json");		
		print(json_encode(array(
			'error' => "Expected 2 parameters, got ".count($_GET)
		)));
		exit();
	} else {
		$response = Token::getToken($_GET['username'],$_GET['password']);
		if($response == false) {
			header("HTTP/1.0 400 Bad Request");
			header("Content-Type: application/json");
			print(json_encode(array(
				'error' => "Username or password is incorrect"
			)));
			exit();
		} else {
		header("Content-Type: application/json");
		print(json_encode($response));
		exit();
		}
	}


} else if ($_SERVER['REQUEST_METHOD'] == "POST") {
	header("HTTP/1.0 400 Bad Request");
	print("Endpoint does not support POST");
	exit();
}


header("HTTP/1.0 400 Bad Request");
print("Did not understand URL");
exit();

?>
