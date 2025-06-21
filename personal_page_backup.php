<?php
session_start();
include 'db_connection.php';
include 'login_check.php';


header("Content-Type: application/json");

if ($con->connect_error) {
    echo json_encode(["error" => "Connection failed"]);
    exit;
}

$result = $con->query("SELECT * FROM quotes"); // Adjust to your table
$quotes = [];

while ($row = $result->fetch_assoc()) {
    $quotes[] = $row;
}

echo json_encode($quotes);

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
    <center><h2>Welcome to Your Quote Archive</h2></center>
    <center><a href="adding_personal_page.php" class="add_quote"><img src="images/+.png" class="add_quote_icon"></a></center>
    <br><br><br>
    <form action="connections.php" method="POST">
    <center><div class="textbox"><input type="text" id="user_name" name="user_name" placeholder="Finding Friends"><br></div></center>
      </form>

      <?php
      // Display search results if redirected from search
      if (isset($_SESSION['search_results'])) {
            echo '<center><div class="friend_button">';
      foreach ($_SESSION['search_results'] as $result) {
                  echo '<form action="add_friend.php" method="POST">';
                  echo '<div class="friend_button"><button>' .htmlspecialchars($result) . '</button></div>';
                  echo '</form>';
      }
            echo '</div></center><br>';
            unset($_SESSION['search_results']);
      }
      ?>
    <br><br>
<?php



//displaying the quotes that belong to your account.
$get_quote = "SELECT quote_id, who_said_it, quote_entered FROM quote WHERE user_id = ".$uid; 
$result = $con->query($get_quote);
if ($result->num_rows > 0) { 
      while($row = $result->fetch_assoc()) { 
        echo '<div class="quote_boxes">'
        .'"'.$row["quote_entered"].'"'. '<br> -'.$row["who_said_it"]
         //button to delete quotes.
        .'<form action="delete_quote.php" method="POST" style="display:inline;">'
        .'<input type="hidden" name="quote_id" value="'.$row["quote_id"].'">'
        .'<button class="quote_box_delete"><img src="images/x.png" alt="delete" class="delete_icon"></button>'
        .'</form></div><br><br>';
        //button to share the quote
      //   .'<a href="sharing_personal_page.php" class="add_friend"><img src="images/share.png" class="add_friend_icon"></a>'
      //   .'</div><br><br>';
      } 
}  
else { 
      echo '<span class="new_acc"> Time to start making memories in word form :) <span>'; 
} 


$con->close();
?>

</body>
</html>
