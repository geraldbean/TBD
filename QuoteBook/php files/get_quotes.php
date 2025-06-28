<?php
//this file fetches all quotes from the database and sends them to the frontend as JSON.
include 'db_connection.php';
//for assitance in debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


header("Content-Type: application/json"); //sending back json data
header("Access-Control-Allow-Origin: http://localhost:8080"); //change this to certain port numbers(IMPORTANT for testing)

$result = $con->query("SELECT * FROM quote ORDER BY quote_id DESC");

$quotes = []; //array of quotes

while ($row = $result->fetch_assoc()) {
    $quotes[] = [
        "quote_id" => $row['quote_id'],
        "quote_entered" => $row['quote_entered'],
        "who_said_it" => $row['who_said_it'],
        "date" => $row['date']
        "backgroundColor" => $row['background_color'] ?? '#ffffff'
    ];
}

echo json_encode($quotes);
$con->close();
?>
