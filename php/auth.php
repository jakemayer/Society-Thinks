<?php
header("Access-Control-Allow-Origin: *");
date_default_timezone_set('America/New_York');
require_once('orm/Tokens.php');
require_once('orm/User.php');
$path_components = explode('/', $_SERVER['PATH_INFO']);

if ($_SERVER['REQUEST_METHOD'] == "GET") {
	if(count($path_components) > 0 && $path_components[1] == "logout") {
		if(count($_GET == 1) && $_GET['user'] != null) {
			$response = Token::logout($_GET['user']);
			if($response) {
				header("Content-Type: application/json");
				print(json_encode(array(
					'response' => "logged out"
				)));	
				exit();
			} else {
				header("HTTP/1.0 Bad Request");
				header("Content-Type: application/json");		
				print(json_encode(array(
					'error' => "error when logging out"
				)));
				exit();		
			}
		} else {
			header("HTTP/1.0 Bad Request");
			header("Content-Type: application/json");		
			print(json_encode(array(
				'error' => "error when logging out"
			)));
		exit();			
		}
	}
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
	if(count($_POST >= 10)) {
		$response = User::createUser(
			$_POST["fname"],
			$_POST["lname"],
			$_POST["email"],
			$_POST["username"],
			$_POST["password"],
			$_POST["race"],
			$_POST["gender"],
			$_POST["religion"],		
			$_POST["birthday"],
			$_POST["country"]
		);
		if($response == false) {
			header("HTTP/1.0 400 Bad Request");
			header("Content-Type: application/json");
			print(json_encode(array(
				'error' => "I'll loop through the individual fields eventually"
			)));
			exit();
		}
		header("Content-Type: application/json");
		print(json_encode($response));
		exit();
	} else {
		header("HTTP/1.0 Bad Request");
		header("Content-Type: application/json");		
		print(json_encode(array(
			'error' => "Expected at least 10 parameters, got ".count($_POST)
		)));		
	}
}

header("HTTP/1.0 400 Bad Request");
print("Did not understand URL");
exit();

?>
