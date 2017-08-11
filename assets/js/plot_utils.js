/* Author: Daniel Ho */

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

var getChartWidth = function(id) {
	return $("section#charts").select().width();
}

var getChartHeight = function(id) {
	var base = $(id).select().height();
	if (id === "section#charts") {
		base -= $("ul.actions").select().outerHeight(true);
	}
	return base;
}
