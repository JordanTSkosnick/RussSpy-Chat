/*
JORDAN SKOSNICK, CSC 342, Assignment 4, Spring 2017
*/
data = {
	/**
	* sends a post request to chatserver.php for the login username and password inputted
	*/
    login: function(username, password) {
		var query = "";
        query += "login=";
        query += username;
        query += "&password=";
        query += password;
	
        var req = new XMLHttpRequest();
        req.open('POST', 'chatserver.php', false);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(encodeURI(query));

        var response = JSON.parse(req.responseText);
	console.log(response);
console.log("^^^");
        return response['login'];
    },
	
	/**
	* sends query to create a room.
	*/
	createroom: function(username, newchat) {
		var query = "";
        query += "user=";
        query += username;
        query += "&newchat=";
        query += newchat;
		
		var req = new XMLHttpRequest();
        req.open('POST', 'chatserver.php', false);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(encodeURI(query));
		
	},
	
	/**
	* logs out the user by sending a post request to chatserver.php
	*/
    logout: function(username) {
        var query = "logout=" + username;

        var req = new XMLHttpRequest();
        req.open('POST', 'chatserver.php', false);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(encodeURI(query));
    },
	
	
	/**
	* sends a query that deletes a room
	*/
	deleteroom: function(username, chatroom) {
		var query = "";
        query += "creator=";
        query += username;
        query += "&deleteroom=";
        query += chatroom;
		
		var req = new XMLHttpRequest();
        req.open('POST', 'chatserver.php', false);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(encodeURI(query));
	},

    /**
     * Returns an array of strings where each string is a chat room name
     * @returns {Array} a list of chat room name strings
     */
    getChatRooms: function() {
        var req = new XMLHttpRequest();
        req.open('GET', 'chatserver.php?rooms=true', false);
        req.send();
        return JSON.parse(req.responseText);
    },

    /**
     * Returns the chat log for a given room name
     * @param {string} the chat room name
     * @returns {Array} an array of message objects where each object
     * has the properties username, timestamp, and content
     */
    getChatLog: function(roomName) {
        var req = new XMLHttpRequest();
        req.open('GET', 'chatserver.php?log=' + roomName, false);
        req.send();
        console.log(req.responseText);
        return JSON.parse(req.responseText);
    },

    /**
     * Sends a message to be stored on the server
     * @param {string} roomName the chat room name
     * @param {Object} the message object with the properties username,
     * timestamp, and content
     */
    appendMessageToChatLog: function(roomName, message) {
        var query = "";
        query += "room=";
        query += roomName;
        query += "&username=";
        query += message.username;
        query += "&content=";
        query += message.content;

        var req = new XMLHttpRequest();
        req.open('POST', 'chatserver.php', true);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(encodeURI(query));
    }
};

