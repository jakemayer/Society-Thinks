

<?php
header("Access-Control-Allow-Origin: *");
date_default_timezone_set('America/New_York');
require_once('orm/Tokens.php');
require_once('orm/Question.php');
$path_components = explode('/', $_SERVER['PATH_INFO']);

if ($_SERVER['REQUEST_METHOD'] == "GET") {
	if(count($path_components) >=3 && $path_components[1] != "") {
		if($path_components[1] == "recent-activity") {
			$is_authorized = Token::authorizeRequest($path_components[2],$_COOKIE['uuid']);
			if($is_authorized) {
				header("Content-Type: application/json");
				print(json_encode(Question::getRecentActivity($path_components[2])));
				exit();
			} else {
				header("HTTP/1.0 401 Unauthorized");
				print("oh no!");
				exit();
			}
		} else if($path_components[1] == "search") {
			$is_authorized = Token::authorizeRequest($_COOKIE['uid'],$_COOKIE['uuid']);
			if($is_authorized) {
				header("Content-Type: application/json");
				print(json_encode(Question::filterQuestions($_COOKIE['uid'],$_GET['string'],$_GET['date'])));
				exit();
			} else {
				header("HTTP/1.0 401 Unauthorized");
				print("oh no!");
				exit();
			}			
		}
	} 

} else if ($_SERVER['REQUEST_METHOD'] == "POST") {

}
header("HTTP/1.0 400 Bad Request");
print("Did not understand URL");
exit();

?>
