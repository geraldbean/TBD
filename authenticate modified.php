<?php
session_start();

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
} 

if (isset($_POST['email'], $_POST['password'])) { //this adds the password hashed function so when
    //you add a password it can record it.
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql_query_checkuserexists = "SELECT id FROM people WHERE email like '".$email."'";

    if ($stmt = $con->prepare($sql_query_checkuserexists)) { //checks to see if the email exists yet.
        $stmt->execute();
//        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo 'This email already has an account. Please use a different one.';

        }else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $sql_query_insertuser = "INSERT INTO people (email, password) VALUES ('".$email."','".$hashedPassword."')";
            echo $sql_query_insertuser;
            echo "<BR>";

            if ($stmt = $con->prepare($sql_query_insertuser)) {
                $stmt->execute();
                $stmt->close();
        
                echo 'Registration successful! You can now log in.';
            }else {
                echo 'error during registration!';
            }
         }
     }
}


if($stmt = $con->prepare('SELECT id, password From people Where email = ?')) {
    $stmt->bind_param('s', $_POST['email']);
    $stmt->execute();
    $stmt->store_result();

        if($stmt->num_rows > 0) {
            $stmt->bind_result($id, $password);
            $stmt->fetch();

            if(password_verify($_POST['password'], $password)) {
//this compares the password you added earlier so it can properly log you into the account.
                session_regenerate_id();
                $_SESSION['loggedin'] = TRUE;
                $_SESSION['name'] = $_POST['email'];
                $_SESSION['id'] = $id;

                header ('Location: /website_layout/main.html');
                echo 'Welcome Back, ' . htmlspecialchars($_SESSION['name'], ENT_QUOTES) . '!';
                exit;
            }else {

                echo 'Whoops :(';
            } 
        } else {
                echo 'No entry.';
            }
    

    $stmt->close();
}

?>