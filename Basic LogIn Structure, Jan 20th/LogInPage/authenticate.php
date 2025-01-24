<?php
session_start();

$DATABASE_HOST = 'localhost';
$DATABASE_USER = 'root';
$DATABASE_PASS = 'Welcome!2250';
$DATABASE_NAME = 'quote_testing';

$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if( mysqli_connect_error() ) {
    exit('Failed to connect to MySQL: '. mysqli_connect_error());

}

if ( !isset($_POST['username'], $_POST['password']) ) {
    exit('Please fill both the username and password fields!');
}

include 'dbparameters.php';

$conn = OpenCon();

if($stmt = $con->prepare('SELECT id, password From accounts Where username = ?')) {
    $stmt->bind_param('s', $_POST['email']);
    $stmt->execute();
    $stmt->store_result();
        if($stmt->num_rows > 0) {
            $stmt->bind_result($id, $password);
            $stmt->fetch();

            if(password_verify($_POST['password'], $password)) {

                session_regenerate_id();
                $_SESSION['loggedin'] = TRUE;
                $_SESSION['name'] = $_POST['email'];
                $_SESSION['id'] = $id;
                echo 'Welcome Back, ' . htmlspecialchars($_SESSION['name'], ENT_QUOTES) . '!';

            }else {

                echo 'Incorrect username and/or password!';
            } 
        } else {
                echo 'Incorrect username and/or password!';
            }

    $stmt->close();
}

?>