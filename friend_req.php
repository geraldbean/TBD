<?php
include 'db_connection.php';
include 'login_check.php';

      //if the value is set.
      if (isset($_GET['action'])) { 

            //creating a variable to store the value. 
            $a = $_GET ['action'];

            $connectionrequest_id = $_GET ['id'];

            //if button pressed for 'yes' then record connection
            if ($a == 1)
            {
                  //changes the confirmed cell of the table to have value of 1 or true.
                  $sql="UPDATE connections SET confirmed = 1 WHERE id =".$connectionrequest_id;
                  $accepted = $con->query($sql);
                  header("Location:personal_page.php");
            }
            //if button pressed for 'no' then delete connection
            else if ($a == 0)
            {
                  //Deletes the row and the friend request from the database.
                  $sql2="DELETE FROM connections WHERE id = ".$connectionrequest_id;
                  $rejected = $con->query($sql2);
                  header("Location:personal_page.php");
            }



      }

?>
