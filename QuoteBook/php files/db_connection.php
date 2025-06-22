<?php
$con = new mysqli("localhost", "root", "", "quotebook");
//quotebook is DB
if ($con->connect_error) {
    die("Database connection failed: " . $con->connect_error);
}
?>
