<?php
/*
JORDAN SKOSNICK, CSC 342, Assignment 4, Spring 2017
#########################################################################################################
If you want to append the message, you must type it in and press enter, then click the room name again.##
It will then reload the log with the new message in it.                                                ##
#########################################################################################################
*/


//establishes connection to the DB
header('Content-Type: application/json');
$path = "sqlite:data.db";
$db = new PDO($path) or die("cannot open database");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

//if statement for when you will GET the rooms that are currently available
if (isset($_GET['rooms'])){

  $query = "SELECT name FROM rooms";
  $result = $db->query($query);
  $records = $result->fetchall();
  $arr = array();
  //this loops through the array of room names and pushes the room names into a new array
  for ($i = 0; $i < count($records); $i++){
    array_push($arr,$records[$i][0]);
  }
  $result = json_encode($arr);
  echo $result;
}

//else if for when the program is GETting the log.
elseif (isset($_GET['log'])){

  //query for selecting the logs in the DB
  $log = $_GET['log'];
  $query = "SELECT *, user AS username FROM logs WHERE room = '$log'";
  $result = $db->query($query);
  $records = $result->fetchall();
  //json encodes the result and echoes it.
  echo json_encode($records);
}

//when its recieves a post request for login and password
elseif (isset($_POST['login'], $_POST['password'])){
  
  $login = $_POST['login'];
  $pass = $_POST['password'];
  
  //IF there is NO password that the user entered
  if($pass == "") {
	$query = "SELECT name FROM users WHERE name = '$login'";
	$result = $db->query($query);
	$records = $result->fetchall();
	//if there is a username already in the DB with that username, it wont log you in
	if ($records){
	
		$a = array("login" => false);
		$result = json_encode($a);
		echo $result;
	}
	//this gets run only if the username inputted into the form is unique and not already in the DB
	else {
		$query = "INSERT INTO users (name) VALUES ('$login')";
		$loggedin = $db->exec($query);
		$a = array("login" => true);
		$result = json_encode($a);
		echo $result;
	}
	}
  //if there IS a password that the user entered
  elseif($pass != "") {
	$query = "SELECT name FROM users WHERE name = '$login'";
	$result = $db->query($query);
	$records = $result->fetchall();
	//if the username already exists in the db. this can mean they are creating an account with
	//a name that already exists, or they are setting up a new account.
	if($records) {
		$query = "SELECT name FROM users WHERE name = '$login' AND password = '$pass'";
		$result = $db->query($query);
		$records = $result->fetchall();
		//if the user inputted a correct username and corresponding password to the account. ie. logging in
		if($records) {
			$a = array("login" => true);
			$result = json_encode($a);
			echo $result;
		}
		//if the username exists in the table AND the password inputted does not match the username
		else {
			$a = array("login" => false);
			$result = json_encode($a);
			echo $result;
		}
	}
	//if they put a unique username and also a pass into the form, creates a new account for them
	else {
		$query = "INSERT INTO users (name, password) VALUES ('$login', '$pass')";
		$result = $db->exec($query);
		$a = array("login" => true);
		$result = json_encode($a);
		echo $result;
	}
  }
}
  

//deletes a room but only if the person who created it does it
elseif (isset($_POST['creator'], $_POST['deleteroom'])){
  $creator = $_POST['creator'];
  $deleteroom = $_POST['deleteroom'];
  $query = "DELETE FROM rooms WHERE name = '$deleteroom' AND creator = '$creator'";
  $result = $db->exec($query); 
}
//creates a new chat with creator
elseif (isset($_POST['user'], $_POST['newchat'])){
  $user = $_POST['user'];
  $chatname = $_POST['newchat'];
  $query = "INSERT INTO rooms (name, creator) VALUES ('$chatname', '$user')";
  $result = $db->exec($query);
  if ($records){

    $a = array("chkpass" => false);
    $result = json_encode($a);
    echo $result;
  }
}


//Logs the user out by deleting the user from the user from the users table in the DB
elseif (isset($_POST['logout'])){
  //$logout is the username to be logged out
  $logout = $_POST['logout'];
  $query = "DELETE FROM users WHERE name = '$logout'";
  $result = $db->exec($query);
  
}

//Inserts a message that contains the room #, username and message content into the database logs table.
elseif (isset($_POST['room'], $_POST['username'], $_POST['content'])){
  $room = $_POST['room'];
  $username = $_POST['username'];
  $content = $_POST['content'];
  $query = "INSERT INTO logs (room, user, content) VALUES ('$room','$username','$content')";
  $result = $db->exec($query);
}


