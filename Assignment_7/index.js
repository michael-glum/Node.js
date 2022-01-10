/*
 * Assignment 7 -> Simple Express
 * cse270e
 * Copyright Michael Glum January 9, 2022
 */

var express = require("express");

var app = express();
var pathBegin = "/home/ubuntu/glummb-270e-node/Assignment_7/";

app.get("/", function(req, res) {
    res.setHeader('content-type', 'text/html');
    res.sendFile(pathBegin + "helloworld.html", function (err) {
        if (err) {
            return res.end("404 Not Found");
        } else {
	    console.log('url: /');
	}
    });
});

app.get("/about", function(req, res) {
    res.setHeader('content-type', 'text/plain');
    res.send("Hello, my name is Michael Glum.");
    console.log('url: /about');
});

app.get("/images", function (req, res) {
    res.setHeader('content-type', 'text/html');
    res.sendFile(pathBegin + "images.html", function (err) {
        if (err) {
	    return res.end("404 Not Found");
	} else {
	    console.log('url: /images');
	}
    });
});

app.get("/site1", function (req, res) {
    res.setHeader('content-type', 'text/html');
    res.sendFile(pathBegin + "site1.html", function (err) {
        if (err) {
            return res.end("404 Not Found");
        } else {
            console.log('url: /site1');
        }
    });
});

app.get("/site1/page1", function (req, res) {
    res.setHeader('content-type', 'text/plain');
    res.sendFile(pathBegin + "page1.txt", function (err) {
        if (err) {
            return res.end("404 Not Found");
        } else {
            console.log('url: /site1/page1');
        }
    });
});

app.get("/site1/page2", function (req, res) {
    res.setHeader('content-type', 'text/html');
    res.sendFile(pathBegin + "page2.html", function (err) {
        if (err) {
            return res.end("404 Not Found");
        } else {
            console.log('url: /site1/page2');
        }
    });
});

app.get("/site1/page3", function (req, res) {
    res.setHeader('content-type', 'text/html');
    res.sendFile(pathBegin + "page3.html", function (err) {
        if (err) {
            return res.end("404 Not Found");
        } else {
            console.log('url: /site1/page3');
        }
    });
});

app.get("/site2", function (req, res) {
    res.setHeader('content-type', 'text/html');
    res.sendFile(pathBegin + "site2.html", function (err) {
        if (err) {
            return res.end("404 Not Found");
        } else {
            console.log('url: /site2');
        }
    });
});

app.get("/variable/*", function (req, res) {
    res.setHeader('content-type', 'text/plain');
    res.send(req.params['0']);
});

app.get("/ip", function (req, res) {
	    res.setHeader('content-type', 'text/plain');
	    console.log(req);
	    res.send("Your ip is " + req.socket.remoteAddress + " port 3007");
});

app.listen(3007, function() {
    console.log("Express app started on port 3007.");
});
