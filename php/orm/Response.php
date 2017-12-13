<?php
date_default_timezone_set('America/New_York');

class Response
{

  public static function connect() {
    return new mysqli("classroom.cs.unc.edu", 
          "marclane", 
          "marc426", 
		      "marclanedb");
  }

  
  public static function getRecentActivity($id) {
    $mysqli = Question::connect();
    $query = "SELECT q.id, q.question,q.asked_time, r.responded_time, 1 as is_response
              from Final_Response r
              join Final_Question q ON
              q.id = r.question
              where r.responded_by = ".$id."
              UNION
              SELECT q.id, q.question, q.asked_time, null as responded_time, 0 as is_response
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

  public static function createResponse($user_id, $question_id, $answer_id) {
     $mysqli = Response::connect();
     $datetime = date("Y-m-d H:i:s");
     $return = $mysqli->query("Insert into Final_Response values (0, " . $user_id . ", " . $question_id . ", '" . $datetime . "', " . $answer_id . ");");
     return $return;
  }
}
?>