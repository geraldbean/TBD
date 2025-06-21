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

    <CENTER><B>
      <?php
          if (isset($_GET['message'])) 
            {
                  echo "<BR>";
                  echo $_GET['message'];
            }
      ?>
      </B>
      <CENTER>

    <center><a href="adding_personal_page.php" class="add_quote"><img src="images/+.png" class="add_quote_icon"></a></center>
    <br><br><br>
    <form action="personal_page.php" method="POST">
    <center><div class="textbox"><input type="text" id="uname" name="uname" placeholder="Finding Friends"><br></div></center>
      </form>


      <CENTER>
      <?php
      //searching for your friends.
      if (isset($_POST['uname'])) {
            $un = $_POST['uname'];

            //find matching usernames 
            $sql = "SELECT id, user_name FROM people WHERE user_name LIKE '%".($un)."%' OR email LIKE '%".($un)."%'";
            $find = $con->query($sql);

            $result = [];

            if ($find->num_rows > 0) { 
            while($row = $find->fetch_assoc()) { 
                    $user_id_found = $row["id"];
                    $user_name_found = $row["user_name"];
#                    echo $user_id_found.":".htmlspecialchars($user_name_found)."<BR>";
                    //you have to us & signs to link urls as it turns out.
                    echo "<A HREF='/save_friend_req.php?fid=".$user_id_found."&fun=".$user_name_found."' class ='friend_button'>".htmlspecialchars($user_name_found)."</A><BR><BR>";
                   }
                } else{
                   echo "no username matches found";
                }

      }
      ?>
      </CENTER>
    <br><br>
<?php



//displaying the quotes that belong to your account.
$get_quote = "SELECT quote_id, who_said_it, quote_entered FROM quote WHERE user_id = ".$uid; 
$result = $con->query($get_quote);
if ($result->num_rows > 0) { 
      while($row = $result->fetch_assoc()) { 
      $qid = $row ['quote_id'];
        echo '<div class="quote_boxes">'
        .'"'.$row["quote_entered"].'"'. '<br> -'.$row["who_said_it"]
         //button to delete quotes.
        .'<form action="delete_quote.php" method="POST" style="display:inline;">'
        .'<input type="hidden" name="quote_id" value="'.$row["quote_id"].'">'
        .'<button class="quote_box_delete"><img src="images/x.png" alt="delete" class="delete_icon"></button>'
        .'</form>'
        //button to share the quote
        ."<a href=sharing_personal_page.php?qid=".$qid." class=add_friend><img src=images/share.png class= add_friend_icon></a>"
        .'</div><br><br>';
      } 
}  
else 
{ 
      echo '<span class="new_acc"> Time to start making memories in word form :) <span>'; 
} 

?>

<?php
//////////////////////////////////////////////////////////////////////////
      //displaying quotes sent from your friends.
      $squote = "SELECT q.quote_id, q.quote_entered qe, q.date, q.user_id, q.who_said_it wsi, q.public, s.owner_id od , s.quoting_id qid FROM quote AS q INNER JOIN sharing AS s ON q.quote_id = s.quoting_id WHERE s.friend_id = ".$uid."";
      $friend_quotes = $con->query($squote);
      if ($friend_quotes->num_rows > 0) {
            while($row = $friend_quotes->fetch_assoc()) {
                        $qid = $row['qid'];
                        $oid = $row['od'];
                        echo '<div class="squote_boxes">'
                        .'"'.$row["qe"].'"'. '<br> -'.$row["wsi"]
                        .'</div>';

                  //button to delete quotes.
                  // .'<form action="delete_quote_shared.php" method="POST" style="display:inline;">'
                  // .'<input type="hidden" name="quote_id" value="'.$row["quote_id"].'">'
                  // .'<button class="quote_box_delete"><img src="images/x.png" alt="delete" class="delete_icon"></button>'
                  // .'</form></div><br><br>';
                  //share button
                  // .'<a href="sharing_personal_page.php" class="add_friend"><img src="images/share.png" class="add_friend_icon"></a>'
                  // .'</div><br><br>';

                  $from = "SELECT p.user_name pun, p.id FROM people AS p INNER JOIN sharing AS s ON p.id = s.owner_id WHERE s.friend_id = ".$uid." AND s.quoting_id = ".$qid."";
                  $sender = $con->query($from);
                  if ($sender->num_rows > 0) {
                  while($row = $sender->fetch_assoc()) {
                  $pun = $row['pun'];
                  echo "This quote is from ".$pun."<br>";

                  }
            }
      }
}


      
///////////////////////////////////////////////////////////////////////sketchy
?>

<CENTER>
 <br><br><br>
      <h3>pending friend requests:</h3>
      <?php
      //query to see which accounts have sent you a friend request.
      //pay attention to how the alias is defined in this query.
      $sent_req = "SELECT c.owner_id, c.confirmed, c.id cid, p.email, p.user_name pun FROM connections AS c INNER JOIN people AS p ON c.owner_id = p.id WHERE c.friend_id = ".$uid." AND c.confirmed IS NULL";
      $requests = $con->query($sent_req);
      if ($requests->num_rows > 0) {
            while($row = $requests->fetch_assoc()) { 
                  $connectionrequest_id = $row["cid"];
                  $user_name_found = $row["pun"];
                  echo htmlspecialchars($user_name_found);
                  //this will also set up what the url will look like. Can use the GET parametre with such a constructed url.
                  echo "<a href=/friend_req.php?id=" .$connectionrequest_id. "&action=1>" . "   Accept " . "</a><br>";
                  echo "<a href='/friend_req.php?id=".$connectionrequest_id."&action=0'>" . "   Reject " . "</a><br>";
            }
      } else {
    echo "No requests made";
      }

      //Display your current friends and connections
      // "<br><br>"
      // $curr_friends = "" ;

      $con->close();
      ?>

</CENTER>
    <br><br>

    

</body>
</html>
