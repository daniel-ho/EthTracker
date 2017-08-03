var url = "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=1440&e=CCCAGG"

var createChart = function(data) {
	/*var svg = d3.select("section#charts")
				.append("div")
					.classed("svg-container", true)
				.append("svg")
					.attr("preserveAspectRatio", "xMinYMin meet")
					.attr("viewBox", "0 0 600 400")
					.classed("svg-content-responsive", true)
				.append("g")
					.attr("class", "chart")*/
	var svg = dimple.newSvg("section#charts", "100%", "100%");

	var ethChart = new dimple.chart(svg, data);
	var x = ethChart.addTimeAxis("x", "time", "%Y %b %d %H:%M", "%H:%M");
	var y = ethChart.addMeasureAxis("y", "close");
	var series = ethChart.addSeries(null, dimple.plot.line);
	series.lineMarkers = true;
	ethChart.draw();

	window.oneresize = function() {
		ethChart.draw(0, true);
	};
}

var plot = function(input) {
	var data = reformatData(input["Data"]);
	if (d3.select("section#charts").select("svg").empty()) {
		createChart(data)
	}
}

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

setInterval(updatePlot, 60000);