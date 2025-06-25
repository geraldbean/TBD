<?php
include 'db_connection.php';
//for assitance in debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json"); //sending back json data
header("Access-Control-Allow-Origin: http://localhost:8080"); //change this to certain port numbers(IMPORTANT for testing)

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { //handle preflight request, may send this before POST in CORS situation
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true); //decode json request body

if (!isset($data['quote_id'])) { //if quote_id was provided in the request, if not, send error back
    echo json_encode(["error" => "Missing quote_id"]);
    exit;
}

$quote_id = intval($data['quote_id']); //convert quote_id to int -- safety and SQL binding
//prepare = security, treat input strictly as a value not SQL command
$stmt = $con->prepare("DELETE FROM quote WHERE quote_id = ?"); //find the quote table, where quote_id = provided value, delete
$stmt->bind_param("i", $quote_id);  //quote_id = int ?

if ($stmt->execute()) { //execute
    echo json_encode(["success" => true, "deleted_id" => $quote_id]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$con->close();
