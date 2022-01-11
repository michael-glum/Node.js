/*
 * Assigment 9 Contact App
 * cse270e
 * Copyright Michael Glum January 11, 2022
 */

var http = require("http");
var path = require("path");
var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var fs = require("fs");
var serveStatic = require("serve-static");
var responseTime = require("response-time");
var favicon = require('serve-favicon');
const p = require("./Person");
const contacts = require("./Contacts");

var app = express();
app.use(cookieParser());

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('short', { stream:accessLogStream }));

app.use(responseTime(function(req, res, time) {
    console.log("Response time for " + req.url + ": " + time);
}));

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico'))); 

var entries = new contacts.Contacts();
app.locals.entries = entries;
generateEntries();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: false}));

app.get("/", function(req,res) {
    if (!req.cookies.name) {
        res.render("index");
    }
    res.render("index", {"username" : req.cookies.name});
});

app.post("/", function(req, res) {
    res.cookie('name', req.body.username);
    res.redirect("/contacts");
});

app.get("/contacts", function(req,res) {
    if (!req.cookies.name) {
        res.redirect("/");
    }
    res.render("contacts", {"username" : req.cookies.name});
});

app.get("/about", function(req,res) {
    res.render("about");
});

app.get("/clear", function(req,res) {
    entries.clear();
    res.redirect("/contacts");
});

app.get("/add", function(req,res) {
    let body = new p.Person();
    body.name = req.body.name;
    body.phone = req.body.phone;
    body.email = req.body.email;
    res.render("add", {"body": body, "errorCode": 3});
});

app.post("/add", function(req,res) {
    if (!validPhone(req.body.phone) || !req.body.email.includes("@")) {
	let body = new p.Person();
	let errorCode = 0; // Error code of 0 means just the email is invalid
	if (!validPhone(req.body.phone)) { // Error code of 1 means just the phone is invalid
            errorCode++;
	    if (!req.body.email.includes("@")) { // Error code of 2 means both email and phone are invalid
	        errorCode++;
            }
	}
	body.name = req.body.name;
	body.phone = req.body.phone;
	body.email = req.body.email;
        res.render("add", {"body": body, "errorCode": errorCode});
    } else {
        var newP = new p.Person();
        newP.name = req.body.name;
        newP.phone = req.body.phone;
        newP.email = req.body.email;
        entries.add(newP);
        res.redirect("/contacts");
    }
});

app.use(serveStatic('public', { index: ['index.html', 'index.htm']}));

app.use(function(req,res) {
    res.status(404).render("404");
});

http.createServer(app).listen(3009, function() {
    console.log("Contact app started on port 3009");
});

function validPhone(phone) {
    if (phone.length != 12) {
        return false;
    }
    for (let i = 0; i < phone.length; i++) {
        if (i == 3 || i == 7) {
            if (phone.charAt(i) !== "-") {
	        return false;
	    }
        } else if (isNaN(phone.charAt(i))) {
	    return false;
	}
    }
    return true;
}

function generateEntries() {
    for (let i = 0; i < 5; i++) {
        entries.add(randPerson());
    }
}

function randPerson() {
    let rP = new p.Person();
    let name = randName();
    let phone = randPhone();
    rP.name = name;
    rP.phone = phone;
    rP.email = name + "@gmail.com";
    return rP;
}

function randName() {
    let c = "bcdfghjklmnpqrstvwxz";
    let v = "aeiouy";
    let cLength = c.length;
    let vLength = v.length;
    let length = Math.floor(Math.random() * 7) + 2;
    let name = "";
    for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
	    name += c.charAt(Math.floor(Math.random() * cLength));
	} else {
            name += v.charAt(Math.floor(Math.random() * vLength));
        }
    }
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return name;
}

function randPhone() {
    let phone = "";
    for (let i = 0; i < 12; i++) {
        if (i === 3 || i === 7) {
	    phone += "-";
	} else {
	    phone += Math.floor(Math.random() * 10);
	}
    }
    return phone;
}
        
