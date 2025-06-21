<?php
session_start();
include 'db_connection.php';
include 'login_check.php';
include 'connections.php';

//uid is already defined and can be used because of the sessions I think.
//friend id has to be found from the search.

$f_username = $_POST['friend_id'];

$f = $con->prepare("SELECT id FROM people WHERE user_name = ?");
$f->bind_param("s",$f_username);

$id_found = $f->execute();

$fid = $row['id'];

//adding the fid and uid to the connections table. Establishing the connection.
$sql = $con->prepare("INSERT INTO connections(owner_id, friend_id) VALUES(?, ?)");
$sql->bind_param("ii",$uid, $fid);

//executing 
$quote_added = $sql->execute();


$sql->close();
$con->close(); 

?>
