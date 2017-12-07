<?php
date_default_timezone_set('America/New_York');

class User
{

  public static function connect() {
    return new mysqli("classroom.cs.unc.edu", 
          "marclane", 
          "marc426", 
		      "marclanedb");
  }

  public static function createUser($fname,$lname,$email,$username,$password,$race,$gender,$religion,$birthday,$country,$pic) {
    $mysqli = User::connect();
    $query = "INSERT INTO `Final_User`(`id`, `fname`, `lname`, `email`, `username`, `password`, `race`, `gender`, `religion`, `birthday`, `country`,`pro_pic`) VALUES (0,'".$fname."','".$lname."','".$email."','".$username."','".$password."','".$race."','".$gender."','".$religion."','".$birthday."','".$country."','".$pic."')";
    $result = $mysqli->query($query);
    if($result) {
      return $mysqli->query("SELECT * from Final_User u where u.username = '".$username."'")->fetch_array();
    } else {
      return false;
    }
  }

  public static function updateUser($fname, $lname, $email, $username, $user_id) {
    $mysqli = User::connect();
    $query = "UPDATE Final_User SET ";

    if($fname != null) {
      $query = $query."fname = '".$fname."',";
    }
    if($lname != null) {
      $query = $query."lname = '".$lname."',";
    }
    if($email != null) {
      $query = $query."email = '".$email."',";
    }
    if($username != null) {
      $query = $query."username = '".$username."',";
    }
    $query = substr($query, 0, strlen($query)-1);
    $query = $query." where id = ".$user_id;
     return $mysqli->query($query);
  }

  public static function getUserInfo($id) {
    $mysqli = User::connect();
    $query = "SELECT * from Final_User where id=".$id;
    $response = $mysqli->query($query);
    if($response) {
      return $response->fetch_array();
    } else {
      return false;
    }
  }

  public static function checkUnique($type,$value) {
    $mysqli = User::connect();
    $query = "SELECT * from Final_User where ".$type." = '".$value."'";
    $response = $mysqli->query($query);
    if($response->fetch_array() != null) {
      return array(
        "status"=>false
      );
    } else {
      return array(
        "status"=>true
      );
    }
  }
}
?>
