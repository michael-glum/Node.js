/*
 * Assignment 10 Weather/Temperature Application
 * cse270e
 * Copyright Michael Glum Januaray 12, 2022
 */

var path = require("path");
var express = require("express");
var zipdb = require("zippity-do-dah");
var openweather = require("./openweather");

var app = express();
let ow = new openweather("848c2dc508b0c5d6b6d26950eccd53c7");

var cache = {};

app.use(express.static(path.resolve(__dirname, "public")));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine","ejs");

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/forecast", function(req, res) {
    res.render("forecast");
});

app.get("/forecast:zip", function(req, res, next) {
    var zipcode = req.params.zip;
    zipcode = zipcode.slice(1);
    var location = zipdb.zipcode(zipcode);
    if(!location.zipcode) {
        next();
	return;
    }

    var latitude = location.latitude;
    var longitude = location.longitude;

    ow.forecast(latitude, longitude, function(err, data) {
        if (err) {
            next();
            return;
        }
	var hourlyForecast = [];
	for (let i = 0; i < 5; i++) {
	    var hourObj = {};
	    hourObj['time'] = (new Date(new Date().getTime() + (3600 * (i - 5) * 1000)).toString()).slice(0,24);
            hourObj['weather'] = data.hourly[i].weather[0].main;
	    hourObj['temp'] = data.hourly[i].temp;
	    hourlyForecast.push(hourObj);
	}
        res.json({
            zipcode: zipcode,
	    hourlyForecast: hourlyForecast
        });
    });
});

app.get(/^\/(\d{5})$/, function(req, res, next) {
    var zipcode = req.params[0];
    var location = zipdb.zipcode(zipcode);
    if (!location.zipcode) {
        next();
        return;
    }
    
    if (cache[zipcode]) {
        if ((new Date().getTime() - cache[zipcode].ms) <= 10000) {
            res.json({
                zipcode: zipcode,
		temperature: cache[zipcode].data,
		cache: cache[zipcode].ms,
		forecast: cache[zipcode].forecast
	    })
	    console.log("Retrieved cached temperature data from time value: " + cache[zipcode].ms);
	    return;
	}
    }

    var latitude = location.latitude;
    var longitude = location.longitude;

    ow.onecall(latitude, longitude, function(err, data) {
        if (err) {
            next();
            return;
        }
	console.log(data);
	var timeVal = new Date().getTime();
        res.json({
            zipcode: zipcode,
            temperature: data.current.temp,
	    cache: timeVal,
        });
	var obj = {};
	obj['data'] = data.current.temp;
	obj['ms'] = timeVal;
	cache[zipcode] = obj;
    });
});

app.get(/^\/([a-zA-Z])(\d{2})([a-zA-Z])$/, function (req, res) {
    res.setHeader('content-type', 'text/plain');
    res.send(req.url);
});

app.get(/^\/test\/([a-zA-Z0-9]+)\/test$/, function (req, res) {
    res.setHeader('content-type', 'text/plain');
    res.send(req.params[0]);
});

app.use(function(req, res) {
    res.status(404).render("404");
});

app.listen(3010);
