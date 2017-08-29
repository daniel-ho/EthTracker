/* Author: Daniel Ho */

/* Main Plotting Code */

var ethChart = {value 	  : undefined,
				url 	  : "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=1440&e=CCCAGG",
				curr_zoom : "1d"};

// Create SVG for chart if doesn't exist
var createChart = function(chart, id, data, overlay_callback) {
	var width = getChartWidth(id);
	var height = getChartHeight(id);
	var svg = dimple.newSvg(id, "100%", "100%");
	svg.attr("viewBox", "0 0 " + width + " " + height);

	chart.value = new dimple.chart(svg);
	var x = chart.value.addTimeAxis("x", "time", "%Y %b %d %H:%M", "%H:%M");
	var y = chart.value.addMeasureAxis("y", "close");
	y.title = "Closing Price";
	y.tickFormat = ",.2f";
	var series = chart.value.addSeries(null, dimple.plot.area);
	series.data = data;
	if (overlay_callback !== null) {
		overlay_callback();
	}
}

var drawChart = function(chart, high, low, zoom, delay) {
	// Retrieve axes of chart
	var x = chart.value.axes[0];
	var y = chart.value.axes[1];

	// Retrieve necessary zoom settings
	var label = zoomToLabel[zoom];
	var tickFormat = zoomToTickFormat[zoom];
	var period = zoomToPeriod[zoom];
	var interval = zoomToInterval[zoom];

	// Edit time axis format if necessary
	x.title = label;
	x.tickFormat = tickFormat;
	x.timePeriod = period;
	x.timeInterval = interval;

	// Edit measure axis min and max if necessary
	var diff = high - low;
	var buffer = diff/4;
	var lowerBound = low - buffer;
	var tick_scale = getTickStep(diff);

	if (lowerBound < 0) {
		y.overrideMin = 0;
		y.overrideMax = high + buffer/2;
	} else {
		y.overrideMin = Math.floor(lowerBound/tick_scale) * tick_scale;
		y.overrideMax = high + buffer;
	}

	// Draw chart with delay
	chart.value.draw(delay);
	reformatTimeTicks(chart, zoom);
}

// Callback function for plotting input data
var plot = function(chart, id, input, zoom, overlay_callback) {
	var formatted = reformatData(input["Data"]);
	var data = formatted[0];
	var high = formatted[1];
	var low = formatted[2];
	var delay = 2000;
	if (chart.value === undefined) {
		createChart(chart, id, data, overlay_callback);
		delay = 0;
	} else {
		chart.value.series[0].data = data;
	}
	drawChart(chart, high, low, zoom, delay);
}

// Function to request current data and update plot
var updatePlot = function(chart, id, zoom, overlay_callback) {
	chart.curr_zoom = zoom;
	chart.url = zoomToURL[zoom];

	// Make request for data
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var data = JSON.parse(this.responseText);
			plot(chart, id, data, zoom, overlay_callback);
		}
	}
	xhr.open("GET", chart.url, true);
	xhr.send();
}

// Initialize plot at 1d zoom and update every minute
updatePlot(ethChart, "section#charts", '1d', null);
setInterval(function() {updatePlot(ethChart, "section#charts", ethChart.curr_zoom, null);}, 60000);


// Window resize event handler
window.onresize = function() {
	var id = "section#charts"
	var width = getChartWidth(id);
	var height = getChartHeight(id);
	ethChart.value.svg[0][0].setAttribute("viewBox", "0 0 " + width + " " + height);
	ethChart.value.draw(0, true);
	reformatTimeTicks(ethChart, ethChart.curr_zoom);
}