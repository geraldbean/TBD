 <?php
include 'db_connection.php';

if ( !isset($_POST['email'], $_POST['password']) ) {
    exit('Please fill both the username and password fields!');
} //good practice.


$email = $_POST['email'];
$password = $_POST['password'];
$hash = md5($password);

$user_id = 0;


$sql = "SELECT id, email FROM people WHERE email like '".$email."' and password = '".$hash."' ";

$result = $con->query($sql);
if($result-> num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo "id: " . $row["id"]. " : " .$row["email"]. "<br>";
            $user_id = $row["id"];
            $session_sql = "INSERT INTO sessions (datetime, user_id) VALUES (NOW(), $user_id)";
            $session_result = $con->query($session_sql);
            $session_id = $con->insert_id;
            setcookie("session_id", $session_id); //can adjust time here.
            setcookie("user_id", $user_id); 

            header("Location: http://192.0.0.2:8081/");
            exit();
        }
}
else {
   
    echo "No account has been found";
    return;
}

$sql = "SELECT quote_id, quote_entered FROM quote WHERE user_id = ".$user_id; 
$result = $con->query($sql); 
if ($result->num_rows > 0) { 
      while($row = $result->fetch_assoc()) { 
        echo "id: " . $row["quote_id"]. " : " .$row["quote_entered"]. "<br>"; 
      } 
}  
else { 
      echo "No records has been found"; 
} 
$con->close(); 

// echo $email;
// echo "<BR>";
// echo $password;
?>