/* Author: Daniel Ho */

/* Maps from zoom level to zoom specific settings */

zoomToURL = {
	'All Time'	: "https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&e=CCCAGG&allData=true",
	'1y'		: "https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&limit=365&e=CCCAGG",
	'3m'		: "https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=USD&limit=1116&aggregate=2&e=CCCAGG",
	'1m'		: "https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=USD&limit=744&e=CCCAGG",
	'1w'		: "https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=USD&limit=168&e=CCCAGG",
	'1d'		: "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=1440&e=CCCAGG",
	'1h'		: "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=60&e=CCCAGG"
}

zoomToTickFormat = {
	'All Time'	: "%b %d %Y",
	'1y'		: "%b %d %Y",
	'3m'		: "%b %d, %H:%M",
	'1m'		: "%b %d, %H:%M",
	'1w'		: "%b %d, %H:%M",
	'1d'		: "%H:%M",
	'1h'		: "%H:%M"
}

zoomToPeriod = {
	'All Time'	: d3.time.months,
	'1y'		: d3.time.months,
	'3m'		: d3.time.weeks,
	'1m'		: d3.time.days,
	'1w'		: d3.time.hours,
	'1d'		: d3.time.hours,
	'1h'		: d3.time.minutes
}

zoomToInterval = {
	'All Time'	: 1,
	'1y'		: 1,
	'3m'		: 1,
	'1m'		: 2,
	'1w'		: 12,
	'1d'		: 1,
	'1h'		: 5
}

/* Main Plotting Code */

var url = "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=1440&e=CCCAGG"
var ethChart = {value : undefined};
var curr_zoom = "1d";

// Create SVG for chart if doesn't exist
var createChart = function(chart, id, data) {
	var width = $("section#charts").select().width();
	var height = $("section#charts").select().height() - $("ul.actions").select().outerHeight(true);
	var svg = dimple.newSvg(id, "100%", "40%");
	svg.attr("viewBox", "0 0 " + width + " " + height);

	chart.value = new dimple.chart(svg, data);
	var x = chart.value.addTimeAxis("x", "time", "%Y %b %d %H:%M", "%H:%M");
	var y = chart.value.addMeasureAxis("y", "close");
	y.tickFormat = ",.2f";
	var series = chart.value.addSeries(null, dimple.plot.area);
}

var drawChart = function(chart, high, low, zoom, delay) {
	// Retrieve axes of chart
	x = chart.value.axes[0];
	y = chart.value.axes[1];

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
	chart.value.draw(delay);
}

// Callback function for plotting input data
var plot = function(chart, id, input, zoom) {
	var formatted = reformatData(input["Data"]);
	var data = formatted[0];
	var high = formatted[1];
	var low = formatted[2];
	var delay = 2000;
	if (chart.value === undefined) {
		createChart(chart, id, data);
		delay = 0;
	} else {
		chart.value.data = data;
	}
	drawChart(chart, high, low, zoom, delay);
}

// Update plot once per minute
var updatePlot = function(chart, id, zoom) {
	curr_zoom = zoom;
	url = zoomToURL[zoom];

	// Make request for data
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var data = JSON.parse(this.responseText);
			plot(chart, id, data, zoom);
		}
	}
	xhr.open("GET", url, true);
	xhr.send();
}

updatePlot(ethChart, "section#charts", curr_zoom);
// For future, implement feature to stop timer for higher zoom levels
setInterval(function() {updatePlot(ethChart, "section#charts", curr_zoom);}, 60000);