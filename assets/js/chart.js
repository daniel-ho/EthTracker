/* Author: Daniel Ho */

/* Map from zoom level to url for data */

zoomToURL = {
	'1y'		: "https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&limit=365&e=CCCAGG",
	'3m'		: "https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=USD&limit=1116&aggregate=2&e=CCCAGG",
	'1m'		: "https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=USD&limit=744&e=CCCAGG",
	'1w'		: "https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=USD&limit=168&e=CCCAGG",
	'1d'		: "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=1440&e=CCCAGG",
	'1h'		: "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=60&e=CCCAGG"
}

/* Helper Functions for Parsing Input Data */

var reformatData = function(data) {
	for (var i = 0; i < data.length; i++) {
		data[i]["time"] = timeConverter(data[i]["time"]);
		data[i]["close"] = data[i]["close"].toFixed(2);
	}
	var high = Math.max.apply(null, data.map(function(x){return x.close}));
	var low = Math.min.apply(null, data.map(function(x){return x.close}));
	return [data, high, low];
}

var timeConverter = function(timestamp) {
	var date = new Date(timestamp * 1000);
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var year = date.getFullYear();
	var month = months[date.getMonth()];
	var day = date.getDate();
	var hour = addZero(date.getHours());
	var minute = addZero(date.getMinutes());
	var time = year + " " + month + " " + day + " " + hour + ":" + minute;
	return time;
}

var addZero = function(n) {
	if (n < 10) {
		n = "0" + n;
	}
	return n
}

/* Main Plotting Code */

var url = "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=1440&e=CCCAGG"
var ethChart = undefined;

// Create SVG for chart if doesn't exist
var createChart = function(data) {
	var width = $("section#charts").select().width();
	var height = $("section#charts").select().height() - $("ul.actions").select().outerHeight(true);
	var svg = dimple.newSvg("section#charts", "100%", "40%");
	svg.attr("viewBox", "0 0 " + width + " " + height);

	ethChart = new dimple.chart(svg, data);
	var x = ethChart.addTimeAxis("x", "time", "%Y %b %d %H:%M", "%H:%M");
	var y = ethChart.addMeasureAxis("y", "close");
	y.tickFormat = ",.2f";
	var series = ethChart.addSeries(null, dimple.plot.area);
}

var drawChart = function(high, low, tickFormat, delay) {
	// Retrieve axes of ethChart
	x = ethChart.axes[0];
	y = ethChart.axes[1];

	// Edit time axis format if necessary
	x.tickFormat = tickFormat;

	// Edit measure axis min and max if necessary
	var diff = high - low;
	var buffer = Math.round(diff/30) * 10;
	y.overrideMax = Math.round((high + buffer)/5) * 5;
	y.overrideMin = Math.round((low - buffer)/5) * 5;

	// Draw chart with delay
	ethChart.draw(delay);
}

// Callback function for plotting input data
var plot = function(input) {
	var formatted = reformatData(input["Data"]);
	var data = formatted[0];
	var high = formatted[1];
	var low = formatted[2];
	var delay = 2000;
	var tickFormat = "%H:%M"
	if (ethChart === undefined) {
		createChart(data);
		delay = 0;
	} else {
		ethChart.data = data;
	}
	drawChart(high, low, tickFormat, delay);
}

// Update plot once per minute
var updatePlot = function() {
	// Make request for data
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var data = JSON.parse(this.responseText);
			plot(data);
		}
	}
	xhr.open("GET", url, true);
	xhr.send();
}

updatePlot();
// For future, implement feature to stop timer for higher zoom levels
setInterval(updatePlot, 60000);

var testButton = function(zoom) {
	url = zoomToURL[zoom];
}