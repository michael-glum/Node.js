/*
 * NodeJS HTTP server
 * Assignment 6 - cse270e
 * Copyright Michael Glum January 8, 2022
 */

var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req,res) {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname + '.html';
    console.log("Time of request: " + Date());
    console.log("Remote IP of request: " + req.socket.remoteAddress);
    console.log("URL of request: " + req.url);
    if (q.pathname === '/json') {
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.write(myJson());
        return res.end();
    } else {
        fs.readFile(filename, function(err, data) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
	        return res.end("404 Not Found");
	    }
	    res.writeHead(200, {'Content-Type': 'text/html'});
	    res.write(data)
            return res.end();
        });
    }
}).listen(3000);

function myJson() {
    const rand = [];
    for (let i = 0; i < 10; i++) {
        rand.push(Math.floor(Math.random() * 101));
    }
    return JSON.stringify(rand);
}
