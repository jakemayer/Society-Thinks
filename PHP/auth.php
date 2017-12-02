<?php
date_default_timezone_set('America/New_York');
require_once('orm/Tokens.php');
$path_components = explode('/', $_SERVER['PATH_INFO']);

if ($_SERVER['REQUEST_METHOD'] == "GET") {
	if(count($_GET) != 2) {
		header("HTTP/1.0 Bad Request");
		print("Incorrect number of parameters");
	}


} else if ($_SERVER['REQUEST_METHOD'] == "POST") {
	header("HTTP/1.0 Bad Request");
	print("Endpoint does not support POST");
}


header("HTTP/1.0 400 Bad Request");
print("Did not understand URL");

?>
