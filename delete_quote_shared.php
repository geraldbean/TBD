<?php
session_start();
include 'db_connection.php';
include 'login_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['quote_id'])) {
    $quote_id = intval($_POST['quote_id']);
    $uid = $_COOKIE["user_id"];

    // Ensure the quote belongs to the current user
    $sql = "DELETE FROM sharing WHERE quote_id = ?, owner_id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("ii", $quote_id, $uid);

    if ($stmt->execute()) {
        header("Location: personal_page.php"); // Redirect to the original page
        exit();
    } else {
        echo "Error deleting quote: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Invalid request.";
}

$con->close();
?>