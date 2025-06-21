<?php
session_start();
include 'db_connection.php';
include 'login_check.php';


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
     <br>
    <center><h2>Have a quote to add?</h2></center>
    <br><br>
    
    <form action="adding_quotes.php" method="POST">
       <center><div class="textbox"><input type="text" id="quote_id" name="quote_entered" placeholder="Something Quirky"><br></div></center>
       <br>
       <center><div class="textbox"><input type="text" id="quote_id" name="who_said_it" placeholder="Who said it?"><br></div></center>
       <br>
        <center><button class="ang_button" type="submit" value="Submit" >Add Quote</button></center>
    </form>
    <br><br><br>
<?php


$get_quote = "SELECT quote_id, quote_entered FROM quote WHERE user_id = ".$uid; 
$result = $con->query($get_quote); 

$con->close();
?>

</body>
</html>
