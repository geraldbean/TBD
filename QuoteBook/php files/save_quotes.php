<?php
//file receives a new quote from the frontend and inserts it into the database.

//for assistance in debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db_connection.php';


header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json"); //sending back json data
header("Access-Control-Allow-Origin: http://localhost:8080"); //change this to certain ports you are using(IMPORTANT for TESTING)


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}


$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['quote_entered'], $data['who_said_it'])) {
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$quote = $data['quote_entered'];
$author = $data['who_said_it'];
//need saved time to match user timezones
date_default_timezone_set('UTC'); //save time in UTC, universal time zone, no offset
$timestamp = gmdate("c"); // ISO 8601 format which includes date, time, and time zone offset
//gmdate gurantees UTC

$stmt = $con->prepare("INSERT INTO quote (quote_entered, who_said_it, date) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $quote, $author, $timestamp);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "quote_id" => $con->insert_id,
        "quote_entered" => $quote,
        "who_said_it" => $author,
        "date" => $timestamp
    ]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$con->close();
