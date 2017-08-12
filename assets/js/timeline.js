/* Author: Daniel Ho */

timelineChart = {value 	   : undefined,
				 url 	   : "https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&e=CCCAGG&allData=true",
				 curr_zoom : "All Time"};

timelineData = [{"time" : "2017 Aug 1 00:00", "close" : "218.12", "Event" : "Bitcoin Hard Fork"}]

var overlayEvents = function() {
	eventSeries = timelineChart.value.addSeries(null, dimple.plot.bubble);
	eventSeries.data = timelineData;
}

updatePlot(timelineChart, "section#timeline", "All Time", overlayEvents);