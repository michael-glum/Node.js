/*
 * Assignment 10
 * cse270e
 * Copyright Michael Glum January 12, 2022
 */

$(function() {
 
    var $h1 = $("h1");
    var $zip = $("input[name='zip']");

    $("#indexForm").on("submit", function(event) {

        event.preventDefault();

	var zipCode = $.trim($zip.val());
	$h1.text("Loading...");

	var request = $.ajax({
	    url: "/" + zipCode,
	    dataType: "json"
	});

	request.done(function(data) {
	    var temperature = data.temperature;
	    $h1.html("It is " + temperature + "&#176; in " + zipCode + ".");
	});
	request.fail(function() {
	    $h1.text("Error!");
	});
    });
    
    $("#forecastForm").on("submit", function(event) {

        event.preventDefault();

        var zipCode = $.trim($zip.val());
        $h1.text("Loading...");

        var request = $.ajax({
	    url: "/forecast:" + zipCode,
            dataType: "json"
        });

        request.done(function(data) {
            var timeStr = "<b>Time</b><br>";
	    var tempStr = "<b>Temperature</b><br>";
	    var weatherStr = "<b>Weather</b><br>";
	    for (let i = 0; i < 5; i++) {
                var time = data.hourlyForecast[i].time;
		var temp = data.hourlyForecast[i].temp;
		var weather = data.hourlyForecast[i].weather;
		timeStr += time + "<br>";
		tempStr += temp + "<br>";
		weatherStr += weather + "<br>";
            }
            $h1.html("The next several hours forecast for " + zipCode + " is:");
	    $("#time").html(timeStr);
	    $("#temperature").html(tempStr);
	    $("#weather").html(weatherStr);
        });
        request.fail(function() {
            $h1.text("Error!");
        });
    });
});
