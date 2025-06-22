<?php
include 'db_connection.php';
//for assitance in debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:8080"); //change this to certain port numbers(IMPORTANT for testing)

$result = $con->query("SELECT * FROM quotes ORDER BY id DESC");

$quotes = [];

while ($row = $result->fetch_assoc()) {
    $quotes[] = [
        "id" => $row['id'],
        "quote_entered" => $row['quote_entered'],
        "who_said_it" => $row['who_said_it'],
        "timestamp" => $row['timestamp']
    ];
}

echo json_encode($quotes);
$con->close();
?>
