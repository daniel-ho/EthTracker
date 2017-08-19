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
	'All Time'	: 2,
	'1y'		: 1,
	'3m'		: 1,
	'1m'		: 2,
	'1w'		: 12,
	'1d'		: 2,
	'1h'		: 5
}

zoomToLabel = {
	'All Time'	: "Date",
	'1y'		: "Date",
	'3m'		: "Date",
	'1m'		: "Date",
	'1w'		: "Time",
	'1d'		: "Time",
	'1h'		: "Time"
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

/* Helper functions to properly set svg dimensions */

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

/* Helper functions to format x and y axes ticks of charts */

var getTickStep = function(diff) {
	if (diff > 100) {
		return 50;
	} else if (diff > 40) {
		return 10;
	} else if (diff > 15) {
		return 5;
	} else if (diff > 8) {
		return 2;
	} else if (diff > 4) {
		return 1;
	} else if (diff > 1.5) {
		return 0.5;
	} else {
		return 0.2;
	}
}

var reformatTimeTicks = function(chart, zoom) {
	var x = chart.value.axes[0];
	var zoomToSlice = {
		"All Time" : function(string) {return string.slice(0,-4)+"'"+string.slice(-2)},
		"1y" 	   : function(string) {return string.slice(0,-4)+"'"+string.slice(-2)},
		"3m"	   : function(string) {return string.slice(0,6)},
		"1m"	   : function(string) {return string.slice(0,6)},
		"1w"	   : function(string) {if (string.slice(8,10)==="00") {
										   return string.slice(0,6);
									   } else {
									   	   return string.slice(-5);
									   }}
	}
	if (zoom === "1d" || zoom === "1h") {
		return
	} else {
		x.shapes.selectAll("text").each(function() {
		curr = d3.select(this).html();
		d3.select(this).text(zoomToSlice[zoom](curr));
		})
	}
}