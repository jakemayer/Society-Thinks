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

  public static function getResponseData($question_id, $races, $religions, $countries, $genders, $min_age, $max_age){
    $mysqli = Response::connect();
    $race_list = Response::getCommaSeparatedList($races);
    $religion_list = Response::getCommaSeparatedList($religions);
    $country_list = Response::getCommaSeparatedList($countries);
    $gender_list = Response::getCommaSeparatedList($genders);
    $start_date  = date("Y-m-d", mktime(0, 0, 0, date("m"),   date("d"),   date("Y")-$max_age-1));
    $end_date = date("Y-m-d", mktime(0, 0, 0, date("m"),   date("d"),   date("Y")-$min_age));
    $query = "SELECT A.answer, COUNT(*)
              FROM Final_Response R, Final_User U, Final_Answer A
              WHERE R.question = " . $question_id . "
              AND R.answer = A.id
              AND R.responded_by = U.id
              AND U.race IN " . $race_list . "
              AND U.religion IN " . $religion_list . "
              AND U.country IN " . $country_list . "
              AND U.gender IN " . $gender_list . "
              AND U.birthday > '" . $start_date . "'
              AND U.birthday <= '" . $end_date . "'
              GROUP BY A.id";
    return $mysqli->query($query)->fetch_array();
  }

  public static function getCommaSeparatedList($array){
    if (count($array) == 0)
      return "(null)";
    $list = "(";
    for ($i = 0; $i < count($array) - 1; $i++)
      $list .= "'" . $array[$i] . "', ";
    return $list . "'" . $array[count($array)-1] . "')";
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