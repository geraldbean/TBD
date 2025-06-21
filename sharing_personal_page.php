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
    <center><h2>Who would you like to share with?</h2></center><BR>
<!--     
    <form action="share_quote.php" method="POST">
       <center><input type="text" id="friend_user_name" name="friend_user_name" placeholder="your friend's user name"><br></center>
       <br>
        <center><button class="ang_button" type="submit" value="Submit" >Share</button></center>
    </form>
    <br><br><br> -->

<CENTER>
<p><b>Your current connections</b></p><br>
<?php

//when you were the one who initially sent the friend request
$sql = "SELECT c.friend_id fid, c.confirmed, c.id cid, c.friend_user_name fun, p.id id, p.user_name us, p.email FROM connections AS c INNER JOIN people AS p ON c.owner_id = p.id WHERE c.owner_id = ".$uid." AND c.confirmed = 1";
$result = $con->query($sql);
if ($result -> num_rows > 0){
    while( $row = $result->fetch_assoc()){
        $id = $row ['id'];
        $friend_id = $row ['fid'];
        $qid = $_GET ['qid'];
        $fun = $row ['fun'];
        echo "<a href=/share_quote.php?fid=".$friend_id."&qid=".$qid.">" . $fun . "</a><br>";
    }
}

//when they sent you the friend request.
$sql2 = "SELECT c.friend_id fid, c.confirmed, c.id cid, c.friend_user_name fun, p.id id, p.user_name us, p.email FROM connections AS c INNER JOIN people AS p ON c.owner_id = p.id WHERE c.friend_id = ".$uid." AND c.confirmed = 1";
$result2 = $con->query($sql2);
if ($result2 -> num_rows > 0){
    while ($row = $result2->fetch_assoc()){
        $id = $row ['id'];
        $friends = $row['us'];
        $id = $row ['id'];
        $friend_id = $row ['fid'];
        $qid = $_GET ['qid'];
        echo "<a href=/share_quote.php?fid=".$id."&qid=".$qid.">" . $friends . "</a><br>";
    }
}

?>
</CENTER>

</body>
</html>
