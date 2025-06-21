<?php
session_start();
include 'db_connection.php';
include 'login_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['quote_id'])) {
    $quote_id = intval($_POST['quote_id']);
    $uid = $_COOKIE["user_id"];

    // Ensure the quote belongs to the current user
    $sql = "DELETE FROM quote WHERE quote_id = ? AND user_id = ?";
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

// session_start();
// include 'db_connection.php';
// include 'login_check.php';

// if (!isset($_POST['quote_entered']) || empty($_POST['quote_entered'])) {
//     die("No quote was submitted.");
// }else{


// $quote = $_POST['quote_entered'];

// $stmt = $con->prepare("SELECT quote_id FROM quote WHERE quote_entered = ?");
// $stmt->bind_param("s", $quote);
// $stmt->execute();
// $result = $stmt->get_result();

// if ($row = $result->fetch_assoc()) {
//     $quote_id = $row['quote_id'];


//     $del_stmt = $con->prepare("DELETE FROM quote WHERE quote_id = ?");
//     $del_stmt->bind_param("i", $quote_id);
//     $del_stmt->execute();

//     if ($del_stmt->affected_rows > 0) {
//         header("Location: personal_page.php");
//         exit();
//     } else {
//         echo "Quote not deleted.";
//     }
// }
// }

// $con->close(); 
?>