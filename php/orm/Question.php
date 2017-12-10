<?php
date_default_timezone_set('America/New_York');

class Question
{

  public static function connect() {
    return new mysqli("classroom.cs.unc.edu", 
          "marclane", 
          "marc426", 
		      "marclanedb");
  }

  
  public static function getRecentActivity($id) {
    $mysqli = Question::connect();
    $query = "SELECT q.id, q.question,q.asked_time,1 as is_response
              from Final_Response r
              join Final_Question q ON
              q.id = r.question
              where r.responded_by = ".$id."
              UNION
              SELECT q.id, q.question, q.asked_time, 0 as is_response
              from Final_Question q
              where q.asked_by = ".$id."
              ORDER BY `asked_time`  desc limit 10";
    $result = $mysqli->query($query);

    $array = array();
    if($result) {
      while($next_row = $result->fetch_array()) {
        $array[] = $next_row;
      }
    }
    return $array;
  }

  public static function filterQuestions($user_id,$string,$date) {
     $mysqli = Question::connect();
     $query = "Select *, CASE WHEN q.asked_by = ".$user_id." THEN 1 ELSE 0 END as is_yours from Final_Question q";
     if($string != null) {
      
     } 
     $result = $mysqli->query($query);
     $array = array();
      if($result) {
        while($next_row = $result->fetch_array()) {
          $array[] = $next_row;
        }
      }
      return $array;
     }
}
?>