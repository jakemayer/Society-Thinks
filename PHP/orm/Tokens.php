<?php
date_default_timezone_set('America/New_York');

class Token
{
  private $id;
  private $token;
  private $user;
  private $expiry;

  public static function connect() {
    return new mysqli("classroom.cs.unc.edu", 
          "marclane", 
          "marc426", 
		      "marclanedb");
  }


  public static function getToken($username, $password) {
    $mysqli=Token::connect();
    $query = "SELECT username,password FROM Final_User where username = '".$username."'";
    $response = $mysqli->query($query);
    $user_info = $response->fetch_array();
    if($response) {
      if($user_info['password']==$password) {
        $token = Token::generateToken($username);
        return array(
          'token'=>$token
        )
      }
    } else {
      return false;
    }
  }
}
?>
