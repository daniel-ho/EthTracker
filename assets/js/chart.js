var url = "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=1440&e=CCCAGG"

function plot(data) {
	console.log(data);
}

function updatePlot() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var data = JSON.parse(this.responseText);
			plot(data);
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

setInterval(updatePlot, 30000);