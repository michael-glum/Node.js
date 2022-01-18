/*
 * Assignment 14 Web Sockets
 * cse270e
 * Copyright Michael Glum January 17, 2022
 */

const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = 3014;
app.listen(port, () => {
    console.log('server listening on port ' + port);
});

const socketServer = new WebSocket.Server({port: 3030});

const messages = ['Welcome to message board 1!1', 'Welcome to message board 2!2'];

socketServer.on('connection', (socketClient) => {
    console.log('connected');
    console.log('Number of clients: ', socketServer.clients.size);
    socketClient.send(JSON.stringify(messages));
    
    socketClient.on('message', (message) => {
        messages.push(message);
	socketServer.clients.forEach((client) => {
	    if (client.readyState === WebSocket.OPEN) {
		client.send(JSON.stringify([message]));
	    }
	});
    });

    socketClient.on('close', (socketClient) => {
	console.log('closed');
	console.log('Number of clients: ', socketServer.clients.size);
    });
});
