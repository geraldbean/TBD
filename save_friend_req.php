<?php
include 'db_connection.php';
include 'login_check.php';

      if (isset($_GET['fid']) ) {
            $fid = $_GET['fid'];
            $fun = $_GET['fun'];
            // $fun = $_GET['fun'];
            // echo "UID = ".$uid."<BR>";
            // echo "FID = ".$fid."<BR>";
            // echo "FUSER = ".$fun."<BR>";
            // && isset($_GET['fun'])

            $check_record = "SELECT owner_id, friend_id, id, confirmed, friend_user_name FROM connections WHERE (owner_id = ".$uid." AND friend_id = ".$fid.") OR (owner_id = ".$fid." AND friend_id = ".$uid.")";
            $result = $con->query($check_record);
                  if ($result->num_rows > 0)
                  {
                        //if you already made a friend request to this account.
                        header("Location:/personal_page.php?message=This+request+was+already+made");
                  }
                   else
                  {

            //to make a record with a request if one does not already exist.
            $sqlquery = "INSERT INTO connections (owner_id, friend_id, friend_user_name) VALUES (".$uid.",".$fid.", '".$fun."')";
            if($con->query($sqlquery))
                  {
#                        echo "Record inserted";
                        header("Location:/personal_page.php?message=Connection+request+sent");

                  }
                  else
                  {
                          echo "Error: " . $sqlquery . "<br>" . $con->error;
                  }
                  }          
      }
      else
      {
            echo "No friend id submitted.";
      }






?>

