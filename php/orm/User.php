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

  public static function createUser($fname,$lname,$email,$username,$password,$race,$gender,$religion,$birthday,$country) {
    $mysqli = User::connect();
    $query = "INSERT INTO `Final_User`(`id`, `fname`, `lname`, `email`, `username`, `password`, `race`, `gender`, `religion`, `birthday`, `country`) VALUES (0,'".$fname."','".$lname."','".$email."','".$username."','".$password."','".$race."','".$gender."','".$religion."','".$birthday."','".$country."')";
    $result = $mysqli->query($query);
    if($result) {
      return $mysqli->query("SELECT * from Final_User u where u.username = '".$username."'")->fetch_array();
    } else {
      return false;
    }
  }
}
?>
