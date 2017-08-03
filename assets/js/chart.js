/* Helper Functions for Parsing Input Data */

var reformatData = function(data) {
	var timeFrom = data["timeFrom"];
	var timeTo = data["timeTo"];
	for (var i = 0; i < data.length; i++) {
		data[i]["time"] = timeConverter(data[i]["time"]);
		data[i]["close"] = data[i]["close"].toFixed(2);
	}
	return data;
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
	var svg = dimple.newSvg("section#charts", "100%", "100%");

	ethChart = new dimple.chart(svg, data);
	var x = ethChart.addTimeAxis("x", "time", "%Y %b %d %H:%M", "%H:%M");
	var y = ethChart.addMeasureAxis("y", "close");
	y.overrideMin = 150;
	var series = ethChart.addSeries(null, dimple.plot.line);
	ethChart.draw();
}

// Callback function for plotting input data
var plot = function(input) {
	var data = reformatData(input["Data"]);
	if (ethChart === undefined) {
		createChart(data);
	} else {
		ethChart.data = data;
		//ethChart.draw(2000);
	}
}

// Update plot every minute
var updatePlot = function() {
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
setInterval(updatePlot, 60000);