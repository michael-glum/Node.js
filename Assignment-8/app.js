/*
 * Assigment 8 Contact App
 * cse270e
 * Copyright Michael Glum January 10, 2022
 */

var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var ejs = require("ejs");
const p = require("./Person");
const contacts = require("./Contacts");

var app = express();

var entries = new contacts.Contacts();
app.locals.entries = entries;
generateEntries();

app.use(logger("dev"));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: false}));

app.get("/", function(req,res) {
    res.render("main");
});

app.get("/about", function(req,res) {
    res.render("about");
});

app.get("/clear", function(req,res) {
    entries.clear();
    res.redirect("/");
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
        res.redirect("/");
    }
});

app.use(function(req,res) {
    res.status(404).render("404");
});

http.createServer(app).listen(3008, function() {
    console.log("Contact app started on port 3008");
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
    rP.email = name + "@email.com";
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
        
