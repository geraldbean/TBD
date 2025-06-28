<?php
include 'db_connection.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:8080");

//Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

//Parse request JSON
$data = json_decode(file_get_contents("php://input"), true);

//Validate input
if (!isset($data['quote_id'])) {
    echo json_encode(["error" => "Missing quote_id"]);
    exit;
}

$quote_id = intval($data['quote_id']);

//Prepare optional fields
$fields = [];
$params = [];
$types = "";

//Text
if (isset($data['quote_entered'])) {
    $fields[] = "quote_entered = ?";
    $params[] = $data['quote_entered'];
    $types .= "s";
}

//Author
if (isset($data['who_said_it'])) {
    $fields[] = "who_said_it = ?";
    $params[] = $data['who_said_it'];
    $types .= "s";
}

if (count($fields) === 0) {
    echo json_encode(["error" => "No fields to update"]);
    exit;
}

//Build dynamic SQL query
$setClause = implode(", ", $fields);
$query = "UPDATE quote SET $setClause WHERE quote_id = ?";
$params[] = $quote_id;
$types .= "i";

$stmt = $con->prepare($query);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$con->close();
