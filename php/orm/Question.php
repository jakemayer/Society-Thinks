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

  public static function filterQuestions($user_id,$string) {
     $mysqli = Question::connect();
     $query = "Select *, CASE WHEN q.asked_by = ".$user_id." THEN 1 ELSE 0 END as is_yours from Final_Question q join Final_User u on u.id = asked_by where 1 = 1 ";
     if($string != null) {
        $query = $query. "AND question LIKE '%".$string."%' ";
     }
     $query = $query. "ORDER BY asked_time desc";
     $result = $mysqli->query($query);
     $array = array();
      if($result) {
        while($next_row = $result->fetch_array()) {
          $array[] = $next_row;
        }
      }
      return $array;
  }

  public static function getTrendingQuestion($user_id) {
    $mysqli = Question::connect();
    $query = "SELECT *, CASE WHEN asked_by = " . $user_id . " THEN 1 ELSE 0 END AS is_yours FROM
              (SELECT Q.*, COUNT(*)
               FROM Final_Question Q, Final_Response R
               WHERE R.question = Q.id
               GROUP BY Q.id
               ORDER BY DATE(Q.asked_time) DESC, COUNT(*) DESC
               LIMIT 2) F";
    return $mysqli->query($query)->fetch_array();
  }

  public static function getQuestionAndAnswers($question_id) {
    $mysqli = Question::connect();
    $query = "SELECT * from Final_Answer a join Final_Question q on a.question = q.id where a.question = ".$question_id;
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