<?php
$con = new mysqli("localhost", "root", "", "quotebook"); //"quotebook" name of DB
//quotebook is DB
if ($con->connect_error) {
    die("Database connection failed: " . $con->connect_error);
}
?>
