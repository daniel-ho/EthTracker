/* Author: Daniel Ho */

timelineChart = {value 	   : undefined,
				 url 	   : "https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&e=CCCAGG&allData=true",
				 curr_zoom : "All Time"};

/* timelineData = [{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : },
				{"time" : , "close" : , "Event" : }] */

updatePlot(timelineChart, "section#timeline", "All Time");