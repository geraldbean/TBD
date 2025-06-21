<?php
session_start();
include 'db_connection.php';
include 'login_check.php';

$quote = $_POST['quote_entered'];
$source = $_POST['who_said_it'];

//adding the quote to the person's indivdual account
$sql = $con->prepare("INSERT INTO quote(quote_entered, who_said_it, user_id) VALUES(?, ?, ?)");
$sql->bind_param("ssi", $quote, $source, $uid);

//executing 
$quote_added = $sql->execute();


//running the statement and displaying on people's personal page.
if ($quote_added) {
    header("Location: personal_page.php");
    exit();
}else{
    echo "Error". $sql->error;
}


$sql->close();
$con->close(); 

?>