<?php
// session_start();

include 'db_connection.php';
//this checks to see if it connected properly to the database.

//checks id the password and email fields are both set.
if ( !isset($_POST['email'], $_POST['password']) ) {
    exit('Please fill both the username and password fields!');
} //good practice.


$email = $_POST['email'];
$password = $_POST['password'];
$hash = md5($password);
$un = $_POST['user_name'];

$user_id = 0;

//ensures that passwords and usernames are at least three characters long.
if (strlen($un) < 3 || strlen($password) < 3){
    echo "<h2>Sorry, passwords and usernames must be at least three characters long</h2>"
    ."<a href=signin.html>return to sign up page</a>";
    exit;
}

//checking if the user name they gave already exits.
$stmt = $con->prepare("SELECT user_name FROM people WHERE user_name = ?");
$stmt->bind_param("s", $un);
$stmt->execute();
$result = $stmt->get_result();

//checking if this user name already exits
if($result->num_rows > 0){
    echo "Sorry, this user name is already taken";
//if it does not exist then save it to the database.
} else{
    $sql = "INSERT INTO people(email, user_name,  password) VALUES ('$email', '$un', '$hash')";
    $register = $con->query($sql);

    if($register == FALSE){
        echo "failed to execute";
    }else{
    header("Location:/signin.html?message=thank+you+for+registering");
    // echo "Thank you for registering";
    }
}



$con->close(); 

?>