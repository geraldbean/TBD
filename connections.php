<?php
session_start();
include 'db_connection.php';
include 'login_check.php';

$un = $_POST['user_name'];

//do the added slashes feature here.
$sql = "SELECT user_name FROM people WHERE user_name LIKE '".($un)."' OR email LIKE '".($un)."'";
$find = $con->query($sql);

$result = [];

    if ($find->num_rows > 0) { 
    while($row = $find->fetch_assoc()) { 
        $results[] = $row["user_name"];
        }
    } else{
        $results[] = "no username matches found";
    }

$_SESSION['search_results'] = $results;

header("Location: personal_page.php");
exit();

?>