<?php
session_start();
include 'db_connection.php';
include 'login_check.php';

if (isset($_GET['fid']) && isset($_GET['qid'])){
    $fid = $_GET ['fid'];
    $qid = $_GET ['qid'];

    $sql = "INSERT INTO sharing ( friend_id, owner_id, quoting_id) VALUES (".$fid.", ".$uid.", ".$qid.")";
    $result = $con->query($sql);

    header("Location:/personal_page.php?qid=".$qid."");

}   
else
{
    echo"error";
}

?>