/* Author: Daniel Ho */

timelineChart = {value 	   : undefined,
				 url 	   : "https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&e=CCCAGG&allData=true",
				 curr_zoom : "All Time"};

timelineData = [{"time" : "2015 Nov 15 00:00", "close" : "0.93", "Event" : "DevCon1 held in London, main points involved scalability and security"},
				{"time" : "2016 Mar 14 00:00", "close" : "13.09", "Event" : "Homestead release of Ethereum"},
				{"time" : "2016 May 19 00:00", "close" : "13.73", "Event" : "Coinbase announces plans to offer trading of Ether on GDAX"},
				{"time" : "2016 May 28 00:00", "close" : "12.28", "Event" : "DAO raises over $150mil making it one of the most successful crowdfunding campaigns up to that point"},
				{"time" : "2016 Jul 20 00:00", "close" : "12.66", "Event" : "DAO hard fork announced, resulting in Ethereum Classic split from Ethereum"},
				{"time" : "2016 Sep 19 00:00", "close" : "14.72", "Event" : "DevCon2 held in Shanghai, introduced discussion on proof of stake model"},
				{"time" : "2016 Oct 18 00:00", "close" : "11.98", "Event" : "Tangerine Whistle hard fork announced in response to DoS attacks starting from Sep 18"},
				{"time" : "2016 Nov 22 00:00", "close" : "9.78", "Event" : "Spurious Dragon, second hard fork of two-round hard fork, announced to protect against replay attacks"},
				{"time" : "2017 Feb 9 00:00", "close" : "11.34", "Event" : "Microsoft and other major tech companies announce formation of Enterprise Ethereum Alliance (EEA)"},
				{"time" : "2017 Mar 14 00:00", "close" : "35.18", "Event" : "Ethereum Name Service (ENS) deployed to offer secure method to address resources using human-readable names"},
				{"time" : "2017 Apr 1 00:00", "close" : "48.55", "Event" : "Japan passes law to recognize bitcoin as legal method of payment"},
				{"time" : "2017 Apr 24 00:00", "close" : "50.09", "Event" : "Gnosis, a platform for prediciton market applications, raises $12mil through its ICO in less than 15min"},
				{"time" : "2017 May 11 00:00", "close" : "85.15", "Event" : "Members of European Union Parliament discuss government's role in advancement of blockchain technology"},
				{"time" : "2017 May 18 00:00", "close" : "124.38", "Event" : "0x OTC launched, allowing parties to exchange tokens built using the ERC20 token standard without need for centralized exchange"},
				{"time" : "2017 May 22 00:00", "close" : "169.50", "Event" : "EEA adds 86 new members, signalling greater support from corporations"},
				{"time" : "2017 May 27 00:00", "close" : "172.86", "Event" : "Huobi, a leading bitcoin exchange in China, officially integrates support for Ethereum trading"},
				{"time" : "2017 May 31 00:00", "close" : "220.70", "Event" : "OKCoin, one of China's big three cryptocurrency exchanges, announces formal launch of Ethereum trading on its platform"},
				{"time" : "2017 Jun 3 00:00", "close" : "244.96", "Event" : "Vladimir Putin and Vitalik Buterin discuss development of blockchain technology in Russia"},
				{"time" : "2017 Jun 12 00:00", "close" : "388.09", "Event" : "Bancor, a Switzerland based startup, raises $153mil in just three hours, making it the largest ICO in the network's history"},
				{"time" : "2017 Jun 21 00:00", "close" : "320.97", "Event" : "Series of ICO triggers bottleneck in network, raising questions about network's scalability"},
				{"time" : "2017 Jun 25 00:00", "close" : "253.68", "Event" : "Rumor that Vitalik Buterin had died in a fatal car crash causes loss in confidence in Ethereum"},
				{"time" : "2017 Jul 18 00:00", "close" : "194.41", "Event" : "EEA adds 34 new members including MasterCard and Cisco; hackers exploit bug in Parity's Multisig wallet, resulting in about $30mil in Ether being stolen"},
				{"time" : "2017 Jul 25 00:00", "close" : "202.88", "Event" : "SEC rules that digital currencies are subject to same rules as regular stocks"},
				{"time" : "2017 Jul 26 00:00", "close" : "202.93", "Event" :  "BTC-e, the largest Russian cryptocurrency exchange, is closed after one of its owners is arrested for laundering $4bil in Bitcoin over 6 years"},
				{"time" : "2017 Aug 1 00:00", "close" : "218.12", "Event" : "Bitcoin hard fork resulting in Bitcoin Cash split from Bitcoin"},
				{"time" : "2017 Aug 7 00:00", "close" : "296.51", "Event" : "HP aims to formally announce EEA membership and interest in blockchain technology"},
				{"time" : "2017 Aug 9 00:00", "close" : "298.28", "Event" : "Vitalik Buterin and Joseph Poon release paper on Plasma, framework for significantly improving scalability of Ethereum network"},
				{"time" : "2017 Aug 11 00:00", "close" : "308.02", "Event" : "Bitfinex announces plans to discontinue service to U.S. customers following SEC ruling"}]

var overlayEvents = function() {
	eventSeries = timelineChart.value.addSeries("Event", dimple.plot.bubble);
	eventSeries.data = timelineData;
}

updatePlot(timelineChart, "section#timeline", "All Time", overlayEvents);

window.onresize = function() {
	var id = "section#timeline"
	var width = getChartWidth(id);
	var height = getChartHeight(id);
	timelineChart.value.svg[0][0].setAttribute("viewBox", "0 0 " + width + " " + height);
	timelineChart.value.draw(0, true);
}