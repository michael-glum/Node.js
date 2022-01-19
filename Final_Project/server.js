/*
 * Final Project, Web Socket Chat Rooms
 * cse270e
 * Copyright Michael Glum January 19, 2022
 */

const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(session({secret:'WADFGJEWFGDE', resave: true, saveUninitialized: false}));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.render('index.ejs', {username: req.session.name});
});

app.post("/", function (req, res) {
    req.session.name = req.body.username;
    let room = req.body.room;
    room = room.charAt(room.length - 1);
    res.render('room.ejs', {username: req.session.name, room: room});
});

app.use(function(req, res) {
    res.status(404).render("404");
});


const port = 3015;
app.listen(port, () => {
    console.log('server listening on port ' + port);
});

const socketServer = new WebSocket.Server({port: 3031});

const messages = [];
messages.push(['Welcome to chat room 1!']);
messages.push(['Welcome to chat room 2!']);
messages.push(['Welcome to chat room 3!']);
messages.push(['Welcome to chat room 4!']);

socketServer.on('connection', (socketClient) => {
    console.log('connected');
    console.log('Number of clients: ', socketServer.clients.size);
    socketClient.send(JSON.stringify(messages));
    
    socketClient.on('message', (message) => {
	let roomNum = message.charAt(message.length - 1);
	message = message.slice(0, -1);
        messages[roomNum].push(message);
	let returnArray = [];
	for (let i = 0; i < roomNum; i++) {
            returnArray.push([]);
	}
	returnArray.push([message]);
	socketServer.clients.forEach((client) => {
	    if (client.readyState === WebSocket.OPEN) {
		client.send(JSON.stringify(returnArray));
	    }
	});
    });

    socketClient.on('close', (socketClient) => {
	console.log('closed');
	console.log('Number of clients: ', socketServer.clients.size);
    });
});
