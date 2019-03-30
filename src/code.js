window.onload = buildPage;

window.addEventListener("beforeunload", logout);

function buildPage() {
	if (sessionStorage.getItem('username')) {
		buildChatPage();
	}
	else {
		buildLoginPage();
	}
}

function buildLoginPage() {
	// creates a div for the labels and inputs
	var loginDiv = document.createElement("div");
	loginDiv.setAttribute("class", "container");

	// creates the form element
	var form = document.createElement("form");
	form.setAttribute("name", "loginForm");
	form.setAttribute("id", "loginForm");

	// creates the username label
	var label = document.createElement("label");
	label.appendChild(document.createTextNode("User Name"));

	var input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("name", "username");

	var passLabel = document.createElement("label");
	passLabel.appendChild(document.createTextNode("Password"));

	var pass = document.createElement("input");
	pass.setAttribute("type", "text");
	pass.setAttribute("name", "password");

	var submit = document.createElement("input");
	submit.setAttribute("type", "submit");
	submit.setAttribute("value", "Submit");

	loginDiv.appendChild(label);
	loginDiv.appendChild(input);
	loginDiv.appendChild(passLabel);
	loginDiv.appendChild(pass);
	loginDiv.appendChild(submit);
	form.appendChild(loginDiv);

	form.addEventListener("submit", function(e) {
		if (e.preventDefault) e.preventDefault();
		var username = document.forms.loginForm.username.value;
		var password = document.forms.loginForm.password.value;
		if (!username) {
			buildLoginPage();
		}
		//this will send the data to data.js for transport to the php file
		else if (data.login(username, password)) {
			console.log("test3");
			//sets the username and password session variable
			sessionStorage.setItem('username', username);
			sessionStorage.setItem('password', password);
			
			buildChatPage();
		}
		else {
			buildLoginPage(true);
		}
	});

	// add the form to the page
	document.body.appendChild(form);

	// give the text field focus
	input.focus();
}

function buildChatPage() {
    removeChildren(document.body);

    document.body.appendChild(buildChatRoomList());
    document.body.appendChild(buildChatTitle());
    document.body.appendChild(buildChatLog());
    document.body.appendChild(buildMessageForm());
    updateChatLog();
    //setInterval(updateChatLog, 3000);
}

function buildChatRoomList() {
	var list = document.createElement("ul");
	list.setAttribute("id", "rooms");

	var wrapper = document.createElement("div");
	wrapper.setAttribute("class", "wrapper");

	var divrooms = document.createElement("div");
	divrooms.setAttribute("class", "divrooms");

	var userchats = document.createElement("div");
	userchats.setAttribute("class", "userchats");

	var rooms = data.getChatRooms();

	for (var i = 0; i < rooms.length; i++) {
		var listItem = document.createElement("li");
		var text = document.createTextNode(rooms[i]);
		listItem.appendChild(text);
		listItem.addEventListener("click", function(event) {
			var text = event.target.innerText;
			sessionStorage.setItem('currentRoom', text);
			updateChatLog();
		});
		list.appendChild(listItem);
	}

	var cform = document.createElement("form");
	cform.setAttribute("name", "customchatform");
	cform.setAttribute("id", "customchatform");

	var label = document.createElement("label");
	label.appendChild(document.createTextNode("Create chatroom  "));

	var input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("name", "chatname");

	var submit = document.createElement("input");
	submit.setAttribute("type", "submit");
	submit.setAttribute("value", "Create a room");

	cform.appendChild(label);
	cform.appendChild(input);
	cform.appendChild(submit);

	cform.addEventListener("submit", function(s) {
		//i feel it would be better to refresh the page right away once the chat room is created..
		//if (s.preventDefault) s.preventDefault();
		var newchat = document.forms.customchatform.chatname.value;
		var username = sessionStorage.getItem('username');
		// if they actually enter something in..
		if (newchat) {
			//creates a new chatroom
			data.createroom(username, newchat);	
		}
	});

	var dform = document.createElement("form");
	dform.setAttribute("name", "deletechatform");
	dform.setAttribute("id", "deletechatform");

	var dlabel = document.createElement("label");
	dlabel.appendChild(document.createTextNode("Delete chatroom  "));

	var dinput = document.createElement("input");
	dinput.setAttribute("type", "text");
	dinput.setAttribute("name", "deletechat");

	var dsubmit = document.createElement("input");
	dsubmit.setAttribute("type", "submit");
	dsubmit.setAttribute("value", "Delete a room");

	dform.appendChild(dlabel);
	dform.appendChild(dinput);
	dform.appendChild(dsubmit);
	//listenter for the delete room function
	dform.addEventListener("submit", function(d) {
		
		//if (d.preventDefault) d.preventDefault();
		var chatroom = document.forms.deletechatform.deletechat.value;
		var username = sessionStorage.getItem('username');
		if (chatroom) {
			data.deleteroom(username, chatroom);	
		}
	});


	userchats.appendChild(cform);
	userchats.appendChild(dform);
	divrooms.appendChild(list);

	wrapper.appendChild(divrooms);
	wrapper.appendChild(userchats);
	
	return wrapper;
}

function buildChatTitle() {
	var h1 = document.createElement("h1");
	h1.setAttribute("id", "roomName");
	var h1Text = document.createTextNode("No Room Selected");
	h1.appendChild(h1Text)
	return h1;
}

/**
 * Construct a div to contain the chat log
 */
function buildChatLog() {
	var result = document.createElement("div");
	result.setAttribute("id", "log");
	return result;
}

function updateChatLog() {
	var chatLog = data.getChatLog(sessionStorage.getItem('currentRoom'));
	if (chatLog) {

		// update the room name
		var title = document.getElementById("roomName");
		if (title) removeChildren(title);
		if (sessionStorage.getItem('currentRoom')) {
			var h1Text = document.createTextNode(sessionStorage.getItem('currentRoom'));
		}
		else {
			var h1Text = document.createTextNode("No Room Selected");
		}
		title.appendChild(h1Text);

		// update the chat log
		var node = document.getElementById("log");
		if (node) removeChildren(node);
		for (var i = 0; i < chatLog.length; i++) {
			var p = document.createElement("p");
			var text = document.createTextNode(
					"[ " + new Date(chatLog[i].timestamp) + " ]" +
					chatLog[i].username + ": " +
					chatLog[i].content);
			p.appendChild(text);
			node.appendChild(p);
		}
	}
	document.getElementById('messageField').focus();
}

function buildMessageForm() {
	// create the form
	var form = document.createElement("form");
	form.setAttribute("name", "messageForm");

	var msgDiv = document.createElement("div");
	msgDiv.setAttribute("class", "msgcontainer");

	// create a label
	var label = document.createElement("label");
	label.appendChild(document.createTextNode(sessionStorage.getItem('username')));

	// create a text field
	var input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("name", "message");
	input.setAttribute("id", "messageField");

	// create a submit button
	var submit = document.createElement("input");
	submit.setAttribute("type", "submit");
	submit.setAttribute("id", "submitmsg");
	submit.setAttribute("value", "Send");

	// add an event listener to intercept the submit event
	form.addEventListener("submit", function(e) {
		if (e.preventDefault) e.preventDefault();

		if (!sessionStorage.getItem('currentRoom')) {
			document.getElementById('messageField').value = '';
			document.getElementById('messageField').focus();
			return;
		}

		// get the value of the text field
		var message = document.forms.messageForm.message.value;
		if (message) {
			// construct a new chatlog message
			var logItem = {
				username: sessionStorage.getItem('username'),
				timestamp: Date.now(),
				content: message
			}

			data.appendMessageToChatLog(sessionStorage.getItem('currentRoom'), logItem);

			// clear the text field
			document.getElementById('messageField').value = '';

			updateChatLog();
		}
	});

	msgDiv.appendChild(label);
	msgDiv.appendChild(input);
	msgDiv.appendChild(submit);
	form.appendChild(msgDiv);
	
	return form;
}

function logout() {
	if (sessionStorage.getItem('username')) {
		var chk = sessionStorage.getItem('password')
		//Makes sure that the user logged in only gets deleted from the DB when they do not have a password
		if(!chk) {
			data.logout(sessionStorage.getItem('username'));
		}
	}
}

function removeChildren(node) {
	if (node !== null) {
		while (node.hasChildNodes()) {
			node.removeChild(node.lastChild);
		}
	}
}