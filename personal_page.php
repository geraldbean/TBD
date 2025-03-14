<?php
include 'db_connection.php';
include 'login_check.php';
// session_start();


// $DATABASE_HOST = 'localhost';
// $DATABASE_USER = 'root';
// $DATABASE_PASS = 'Welcome!2250';
// $DATABASE_NAME = 'quote_testing';

// $con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
// if( mysqli_connect_error() ) {
//     exit('Failed to connect to MySQL: '. mysqli_connect_error());
//this checks to see if it connected properly to the database.
// }

// me trying to post only my content to my page. This has to be verified against some email or smth.

// $email = $_POST['email'];
// $password = $_POST['password'];
// $sql = "SELECT id, email FROM people WHERE email like '".$email."' and password = '".$password."' ";

// $result = $con->query($sql);
// if($result-> num_rows > 0) {
//         while($row = $result->fetch_assoc()) {
//             echo "id: " . $row["id"]. " : " .$row["email"]. "<br>";
//             $user_id = $row["id"];
//         }
// }
// else {
   
//     echo "No account has been found";
//     return;
// }

// $user_id = 0;

// $sql = "SELECT quote_id, quote_entered FROM quote WHERE user_id = ".$user_id; 
// $result = $con->query($sql); 
// if ($result->num_rows > 0) { 
//       while($row = $result->fetch_assoc()) { 
    
//         echo "id: " . $row["quote_id"]. " : " .$row["quote_entered"]. "<br>"; 
//       } 
// }  
// else { 
//       echo "No records has been found"; 
// } 
// $con->close(); 

// echo $email;
// echo "<BR>";
// echo $password;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote User Page</title>
    <link rel="stylesheet" href="personal_styles.css">
    
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css">
</head>
<body>
    <div class="popupBox">
        <div class="popupShow">
            <div class="content">
                <header>
                    <p>Add a new Quote</p>
                    <i class="uil uil-times"></i>
                </header>
                <!-- <form action="#"> -->
                <form action="adding_quotes.php" method = "POST">
                    <div class="row title">
                        <label>Title</label>
                        <input type="text" id="titleInput" name="quote_entered">
                    </div>
                    <div class="row description">
                        <label>Description</label>
                        <textarea id="descriptionInput" name="description"></textarea>  
                    </div>
                    <button class="addQuote">Add Quote</button>
                </form>
            </div>
        </div>
    </div>

    <div class="wrapper">
        <ul>
            <li class="addBox">
                <div class="icon"><i class="uil uil-plus"></i></div>
                <p>Add new Quote</p>
            </li>

            <li class="quote">
                <div class="details">
                    <p>Title</p>
                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit.</span>
                </div>
            </li>
        </ul>
    </div>

    <form action="adding_quotes.php" method="POST">
    <div class="login-container" id="login">
            <div class="input-box">
                <input name="quote_entered" type="text" class="input-field" placeholder="quote">
                <i class="bx bx-user"></i>
            </div>
            <div class="input-box">
                <input type="submit" class="submit" value="add quote">
            </div>
           
            </div>
        </div>
        </form>

    <script src="index.js"></script>
</body>
</html>
