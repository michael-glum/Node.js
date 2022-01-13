/*
 * Scott Campbell
 * CSE270e Winter 2022
 *
 * Module to make forecast calls to openweather.com
 *
 * You need to register for a FREE account and get an API key to use this package
 * https://openweathermap.org/
 *
 * This module needs the npm module follow-redirects
 *
 * use:
 * var openweather = require("./openweather");
 * let ow = new openweather("YOUR_KEY_HERE");
 *
 * ow.onecall("45056",function(errorMsg,weatherData) {
 *   //if error, errorMsg set, otherewise json data in weatherData
 *       .....
 *       });
 *
 *
 *  This module returns in units of Farenheit (see this.options)
 *
 */

class openweather {
	constructor(key) {
		this.key = key;
		this.https = require('follow-redirects').https;
		this.fs = require('fs');

		this.options = {
			'method': 'GET',
			'hostname': 'api.openweathermap.org',
			'path': '/data/2.5/weather?appid='+key+"&units=imperial",
			'headers': {
			},
			'maxRedirects': 20
		};
	}


	/*
	 * callback(error,data)
	 */
	current(zipcode,cb) {

		this.options.path= '/data/2.5/weather?appid='+this.key+"&units=imperial&zip="+zipcode+",us";
		var req = this.https.request(this.options, function (res,rej) {
			var chunks = [];

			res.on("data", function (chunk) {
				chunks.push(chunk);
			});

			res.on("end", function (chunk) {
				var body = Buffer.concat(chunks);
				let j=JSON.parse(body.toString());
				cb("",j);
			});

			res.on("error", function (error) {
				console.error(error);
				cb(error,"");
			});
		});

		req.end();
	}
	/*
	 * callback(error,data)
	 */
	onecall(latitude,longitude,cb) {

		this.options.path= '/data/2.5/onecall?appid='+this.key+"&units=imperial&exclude=minutely,hourly&lon="+longitude+"&lat="+latitude;
		var req = this.https.request(this.options, function (res,rej) {
			var chunks = [];

			res.on("data", function (chunk) {
				chunks.push(chunk);
			});

			res.on("end", function (chunk) {
				var body = Buffer.concat(chunks);
				let j=JSON.parse(body.toString());
				cb("",j);
			});

			res.on("error", function (error) {
				console.error(error);
				cb(error,"");
			});
		});

		req.end();
	}
        /*
         * callback(error,data)
         */
        forecast(latitude,longitude,cb) {

                this.options.path= '/data/2.5/onecall?appid='+this.key+"&units=imperial&lon="+longitude+"&lat="+latitude;
                var req = this.https.request(this.options, function (res,rej) {
                        var chunks = [];

                        res.on("data", function (chunk) {
                                chunks.push(chunk);
                        });

                        res.on("end", function (chunk) {
                                var body = Buffer.concat(chunks);
                                let j=JSON.parse(body.toString());
                                cb("",j);
                        });

                        res.on("error", function (error) {
                                console.error(error);
                                cb(error,"");
                        });
                });

                req.end();
        }

}

module.exports=openweather;
