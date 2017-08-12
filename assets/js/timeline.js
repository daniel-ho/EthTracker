/* Author: Daniel Ho */

timelineChart = {value 	   : undefined,
				 url 	   : "https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&e=CCCAGG&allData=true",
				 curr_zoom : "All Time"};

timelineData = [{"time" : , "close" : "218.12", "Event" : "Bitcoin Hard Fork"}]

updatePlot(timelineChart, "section#timeline", "All Time");
eventSeries = timelineChart.value.addSeries(null, dimple.plot.bubble);
eventSeries.data = timelineData;