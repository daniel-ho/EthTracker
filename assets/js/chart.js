/* Author: Daniel Ho */

/* Main Plotting Code */

var ethChart = {value 	  : undefined,
				url 	  : "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=1440&e=CCCAGG",
				curr_zoom : "1d"};

// Create SVG for chart if doesn't exist
var createChart = function(chart, id, data) {
	var width = getChartWidth(id);
	var height = getChartHeight(id);
	var svg = dimple.newSvg(id, "100%", "40%");
	svg.attr("viewBox", "0 0 " + width + " " + height);

	chart.value = new dimple.chart(svg);
	var x = chart.value.addTimeAxis("x", "time", "%Y %b %d %H:%M", "%H:%M");
	var y = chart.value.addMeasureAxis("y", "close");
	y.tickFormat = ",.2f";
	var series = chart.value.addSeries(null, dimple.plot.area);
	series.data = data;
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
		chart.value.series[0].data = data;
	}
	drawChart(chart, high, low, zoom, delay);
}

// Update plot once per minute
var updatePlot = function(chart, id, zoom) {
	chart.curr_zoom = zoom;
	chart.url = zoomToURL[zoom];

	// Make request for data
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var data = JSON.parse(this.responseText);
			plot(chart, id, data, zoom);
		}
	}
	xhr.open("GET", chart.url, true);
	xhr.send();
}

updatePlot(ethChart, "section#charts", '1d');
// For future, implement feature to stop timer for higher zoom levels
setInterval(function() {updatePlot(ethChart, "section#charts", ethChart.curr_zoom);}, 60000);