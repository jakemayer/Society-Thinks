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
    $query = "SELECT username,password,id FROM Final_User where username = '".$username."'";
    $response = $mysqli->query($query);
    $user_info = $response->fetch_array();
    if($response) {
      if($user_info['password']==$password) {
        $user_id = $user_info['id'];
        $token = Token::generateToken($username,$user_id);
        return array(
          'token'=>$token
        );
      }
    } else {
      return false;
    }
  }
  
  public static function generateToken($username,$user_id) {
    $token = md5(uniqid($username, true));
    $expiry = date('Y-m-d H:i:s');
    $expiry = date('Y-m-d H:i:s', strtotime($expiry. ' + 10 days'));
    $mysqli = Token::connect();
    $mysqli->query("INSERT into Final_Tokens VALUES (0,'".$token."' ,".$user_id.", '".$expiry."')");
    return $token;
  }

  public static function logout($username) {
    $mysqli = Token::connect();
    $user_response = $mysqli->query("SELECT id from Final_User f where f.username = '".$username."'");
    if($user_response) {
      $user_id = $user_response->fetch_array()['id'];
    } else {
      return false;
    }
    $query = "DELETE FROM Final_Tokens ft where ft.user = ".$user_id;
    $response = $mysqli->query($query);
    return $response;
  }
}
?>