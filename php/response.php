

<?php
header("Access-Control-Allow-Origin: *");
date_default_timezone_set('America/New_York');
require_once('orm/Tokens.php');
require_once('orm/Response.php');
$path_components = explode('/', $_SERVER['PATH_INFO']);

if ($_SERVER['REQUEST_METHOD'] == "GET") {
	
} else if ($_SERVER['REQUEST_METHOD'] == "POST") {
	if(count($path_components) >=2 && $path_components[1] != "") {
		$is_authorized = Token::authorizeRequest($_COOKIE['uid'], $_COOKIE['uuid']);
		if($is_authorized) {
			header("Content-Type: application/json");
			print(json_encode(Response::createResponse($_POST['user_id'], $path_components[1], $_POST['answer_id'])));
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
