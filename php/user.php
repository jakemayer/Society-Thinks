<?php
header("Access-Control-Allow-Origin: *");
date_default_timezone_set('America/New_York');
require_once('orm/Tokens.php');
require_once('orm/User.php');
$path_components = explode('/', $_SERVER['PATH_INFO']);

if ($_SERVER['REQUEST_METHOD'] == "GET") {
	if(count($path_components) >=2 && $path_components[1] != "") {
		
	}



} else if ($_SERVER['REQUEST_METHOD'] == "POST") {

}

header("HTTP/1.0 400 Bad Request");
print("Did not understand URL");
exit();

?>
