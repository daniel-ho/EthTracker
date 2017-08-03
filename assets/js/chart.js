var url = "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=1440&e=CCCAGG"

var plot = function(input) {
	var data = input["Data"];
	var timeFrom = input["timeFrom"];
	var timeTo = input["timeTo"];
	var timeToPrice = {};
	for (var i = 0; i < data.length; i++) {
		time = timeConverter(data[i]["time"]);
		timeToPrice[time] = data[i]["close"].toFixed(2);
	}
	console.log(timeToPrice.length);
	console.log(timeToPrice);
}

var timeConverter = function(timestamp) {
	var date = new Date(timestamp * 1000);
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var year = date.getFullYear();
	var month = months[date.getMonth()];
	var day = date.getDate();
	var hour = addZero(date.getHours());
	var minute = addZero(date.getMinutes());
	var time = hour + ":" + minute;
	return time;
}

var addZero = function(n) {
	if n < 10 {
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