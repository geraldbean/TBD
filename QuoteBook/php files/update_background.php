<?php
//updates only the background color of a quote

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db_connection.php';

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['quote_id'], $data['background_color'])) {
    echo json_encode(["error" => "Missing quote_id or background_color"]);
    exit;
}

$quote_id = (int)$data['quote_id'];
$background_color = $data['background_color'];

$stmt = $con->prepare("UPDATE quote SET background_color = ? WHERE quote_id = ?");
$stmt->bind_param("si", $background_color, $quote_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$con->close();
