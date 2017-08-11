/* Author: Daniel Ho */

url = "https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&e=CCCAGG&allData=true";
timelineChart = undefined;

var createChart = function(data) {
	var width = $("section#timeline").select().width();
	var height = $("section#timeline").select().height();
	var svg = dimple.newSvg("section#timeline", "100%", "40%");
	svg.attr("viewBox", "0 0 " + width + " " + height);

	timelineChart = new dimple.chart(svg, data);
	var x = timelineChart.addTimeAxis("x", "time", "%Y %b %d %H:%M", "%b %d %Y");
	var y = ethChart.addMeasureAxis("y", "close");
	y.tickFormat = ",.2f";
	var series = ethChart.addSeries(null, dimple.plot.area);
}