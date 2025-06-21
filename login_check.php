<?php
// include 'db_connection.php';

$sid = 0;
$uid = 0;
$login_flag = 0;

if(!isset($_COOKIE["session_id"])) {
    // echo "Cookie named session id is not set!";
  } else {
    // echo "Cookie  session id is set!<br>";
    $sid = $_COOKIE["session_id"];
    // echo "Value is: " .$sid;
  }

if(!isset($_COOKIE["user_id"])) {
    // echo "Cookie named user id is not set!";
  } else {
    // echo "Cookie  user id is set!<br>";
    $uid = $_COOKIE["user_id"];
    // echo "Value is: " .$uid;
  }

  if ($sid >0 && $uid > 0){
    $sql = "SELECT session_id, datetime, user_id FROM sessions WHERE session_id = $sid and user_id = $uid";
    $result = $con->query($sql);
    while($row = $result->fetch_assoc()) {
        $login_flag = 1;

    }

  }


  if($login_flag == 0){
    header ("Location: signin.php");
    exit();
  }
  

?>
