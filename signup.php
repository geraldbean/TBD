<?php
// session_start();

$DATABASE_HOST = 'localhost';
$DATABASE_USER = 'root';
$DATABASE_PASS = 'Welcome!2250';
$DATABASE_NAME = 'quote_testing';

$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if( mysqli_connect_error() ) {
    exit('Failed to connect to MySQL: '. mysqli_connect_error());
//this checks to see if it connected properly to the database.
}

if ( !isset($_POST['email'], $_POST['password']) ) {
    exit('Please fill both the username and password fields!');
} //good practice.


$email = $_POST['email'];
$password = $_POST['password'];
$hash = md5($password);

$user_id = 0;

$sql = "INSERT INTO people(email, password) VALUES ('$email', '$hash')";
$result = $con->query($sql);

if($result == FALSE){
    echo "failed to execute";
}else{
header("Location: thank_you.html");
// echo "Thank you for registering";
}

$con->close(); 

?>