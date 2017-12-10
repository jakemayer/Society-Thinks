<?php
header("Access-Control-Allow-Origin: *");
date_default_timezone_set('America/New_York');
require_once('orm/Tokens.php');
require_once('orm/User.php');
$path_components = explode('/', $_SERVER['PATH_INFO']);

if ($_SERVER['REQUEST_METHOD'] == "GET") {

	if(count($path_components) >=2 && $path_components[1] != "") {
		if($path_components[1] == "unique-check") {
			header("Content-Type: application/json");
			print(json_encode(User::checkUnique($_GET['type'],$_GET['value'])));
			exit();
		}
		else if($path_components[1] == "user-data") {
			header("Content-Type: application/json");
			print(json_encode(User::getUserData($path_components[2])));
			exit();
		}
		else 
		{
			$is_authorized = Token::authorizeRequest($path_components[1],$_COOKIE['uuid']);
			if($is_authorized) {
				header("Content-Type: application/json");
				print(json_encode(User::getUserInfo($path_components[1])));
				exit();
			} else {
				header("HTTP/1.0 401 Unauthorized");
				print("oh no!");
				exit();
			}
		}
	}

} else if ($_SERVER['REQUEST_METHOD'] == "POST") {
	if(count($path_components) >=1 && $path_components[1] == "update" && $path_components[2] != "") {
		$is_authorized = Token::authorizeRequest($path_components[2], $_POST['uuid']);
		if($is_authorized) {
			$response = User::updateUser(
				$_POST["fname"],
				$_POST["lname"],
				$_POST["email"],
				$_POST["username"],
				$_POST["pro_pic"],
				$path_components[2]
			);
			header("Content-Type: application/json");
			print(json_encode($response));
			exit();
		} else {
			header("HTTP/1.0 401 Unauthorized");
			print("oh no!");
			exit();
		}
	}

}
header("HTTP/1.0 400 Bad Request");
print("Did not understand URL");
exit();

?>
