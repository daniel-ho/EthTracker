/* Author: Daniel Ho */

/* Maps from zoom level to zoom specific settings */

zoomToURL = {
	'1y'		: "https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&limit=365&e=CCCAGG",
	'3m'		: "https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=USD&limit=1116&aggregate=2&e=CCCAGG",
	'1m'		: "https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=USD&limit=744&e=CCCAGG",
	'1w'		: "https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=USD&limit=168&e=CCCAGG",
	'1d'		: "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=1440&e=CCCAGG",
	'1h'		: "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=60&e=CCCAGG"
}

zoomToTickFormat = {
	'1y'		: "%b %d %Y, %H:%M",
	'3m'		: "%b %d, %H:%M",
	'1m'		: "%b %d, %H:%M",
	'1w'		: "%b %d, %H:%M",
	'1d'		: "%H:%M",
	'1h'		: "%H:%M"
}

zoomToPeriod = {
	'1y'		: d3.time.months,
	'3m'		: d3.time.weeks,
	'1m'		: d3.time.days,
	'1w'		: d3.time.hours,
	'1d'		: d3.time.hours,
	'1h'		: d3.time.minutes
}

zoomToInterval = {
	'1y'		: 1,
	'3m'		: 1,
	'1m'		: 2,
	'1w'		: 12,
	'1d'		: 1,
	'1h'		: 5
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

var drawChart = function(high, low, zoom, delay) {
	// Retrieve axes of ethChart
	x = ethChart.axes[0];
	y = ethChart.axes[1];

	// Retrieve necessary zoom settings
	tickFormat = zoomToTickFormat[zoom];
	period = zoomToPeriod[zoom];
	interval = zoomToInterval[zoom];

	// Edit time axis format if necessary
	x.tickFormat = tickFormat;
	x.timePeriod = period;
	x.timeInterval = interval;

	// Edit measure axis min and max if necessary
	// TODO: Configure so that y axis not cutoff on other zoom levels
	var diff = high - low;
	var buffer = Math.round(diff/30) * 10;
	y.overrideMax = Math.round((high + buffer)/5) * 5;
	y.overrideMin = Math.round((low - buffer)/5) * 5;

	// Draw chart with delay
	ethChart.draw(delay);
}

// Callback function for plotting input data
var plot = function(input, zoom) {
	var formatted = reformatData(input["Data"]);
	var data = formatted[0];
	var high = formatted[1];
	var low = formatted[2];
	var delay = 2000;
	if (ethChart === undefined) {
		createChart(data);
		delay = 0;
	} else {
		ethChart.data = data;
	}
	drawChart(high, low, zoom, delay);
}

// Update plot once per minute
var updatePlot = function(zoom) {
	url = zoomToURL[zoom];

	// Make request for data
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var data = JSON.parse(this.responseText);
			plot(data, zoom);
		}
	}
	xhr.open("GET", url, true);
	xhr.send();
}

updatePlot("1d");
// For future, implement feature to stop timer for higher zoom levels
setInterval(updatePlot, 60000);