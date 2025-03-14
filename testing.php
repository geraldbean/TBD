<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    foreach ($_POST as $email => $email) {
        echo htmlspecialchars($email) . " = " . htmlspecialchars($email) . "<br>";
    }
} else {
    echo "No form data submitted.";
}

?>