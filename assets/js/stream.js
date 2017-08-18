// Credits: https://github.com/cryptoqween/cryptoqween.github.io

var quote = {};

var createDom = function(pair) {
	var wrapper = document.getElementById("intro");
	var div = document.createElement("div");
	div.className = "inner";
	var html = '<h1><span id="fsym_'+ pair +'"></span> <span> - </span> <span id="tsym_'+ pair +'"></span> <span id="price_'+ pair +'"></span></h1>';
	html += '<div class="label"><strong>24h Change: </strong><span id="change_'+ pair +'"></span> (<span id="changepct_'+ pair +'"></span>)</div>';
	html += '<div class="label"><strong>Last Market: </strong><span id="market_'+ pair +'"></span></div>';
	html += '<div class="label"><strong>Last Trade Id: </strong><span id="tradeid_'+ pair +'"></span></div>';
	html += '<div class="label"><strong>Last Trade Volume: </strong><span id="volume_'+ pair +'"></span></div>';
	html += '<div class="label"><strong>Last Trade VolumeTo: </strong><span id="volumeto_'+ pair +'"></span></div>';
	html += '<div class="label"><strong>24h Volume: </strong><span id="24volume_'+ pair +'"></span></div>';
	html += '<div class="label"><strong>24h VolumeTo: </strong><span id="24volumeto_'+ pair +'"></span></div>';
	html += '<div class="label"><strong>Source: </strong><a href="http://www.cryptocompare.com">CryptoCompare</a></div>';
	div.innerHTML = html;
	wrapper.appendChild(div);
};

var displayQuote = function(_quote) {
	var fsym = CCC.STATIC.CURRENCY.SYMBOL[_quote.FROMSYMBOL];
	var tsym = CCC.STATIC.CURRENCY.SYMBOL[_quote.TOSYMBOL];
	var pair = _quote.FROMSYMBOL + _quote.TOSYMBOL;
	
	document.getElementById("market_" + pair).innerHTML = _quote.LASTMARKET;
	document.getElementById("fsym_" + pair).innerHTML = _quote.FROMSYMBOL;
	document.getElementById("tsym_" + pair).innerHTML = _quote.TOSYMBOL;
	document.getElementById("price_" + pair).innerHTML = _quote.PRICE.toFixed(2);
	document.getElementById("volume_" + pair).innerHTML = CCC.convertValueToDisplay(fsym, _quote.LASTVOLUME);
	document.getElementById("volumeto_" + pair).innerHTML = CCC.convertValueToDisplay(tsym, _quote.LASTVOLUMETO);
	document.getElementById("24volume_" + pair).innerHTML = CCC.convertValueToDisplay(fsym, _quote.VOLUME24HOUR);	
	document.getElementById("24volumeto_" + pair).innerHTML = CCC.convertValueToDisplay(tsym, _quote.VOLUME24HOURTO);
	document.getElementById("tradeid_" + pair).innerHTML = _quote.LASTTRADEID.toFixed(0);
	document.getElementById("tradeid_" + pair).innerHTML = _quote.LASTTRADEID.toFixed(0);
	document.getElementById("change_" + pair).innerHTML = CCC.convertValueToDisplay(tsym, _quote.CHANGE24H);
	document.getElementById("changepct_" + pair).innerHTML = _quote.CHANGEPCT24H.toFixed(2) + "%";

	document.title = "($" + _quote.PRICE.toFixed(2) + ") EthTracker"
}

var updateQuote = function(result) {

	var keys = Object.keys(result);
	var pair = result.FROMSYMBOL + result.TOSYMBOL;
	if (!quote.hasOwnProperty(pair)) {
		quote[pair] = {}
		createDom(pair);
	}
	for (var i = 0; i < keys.length; ++i) {
		quote[pair][keys[i]] = result[keys[i]];
	}
	quote[pair]["CHANGE24H"] = quote[pair]["PRICE"] - quote[pair]["OPEN24HOUR"];
	quote[pair]["CHANGEPCT24H"] = quote[pair]["CHANGE24H"]/quote[pair]["OPEN24HOUR"] * 100;
	displayQuote(quote[pair]);
}

var socket = io.connect('https://streamer.cryptocompare.com/');

//Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
//Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
//For aggregate quote updates use CCCAGG as market
var subscription = ['5~CCCAGG~ETH~USD'];

socket.emit('SubAdd', {subs:subscription} );

socket.on("m", function(message){
	var messageType = message.substring(0, message.indexOf("~"));
	var res = {};
	if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
		res = CCC.CURRENT.unpack(message);
		console.log(res);
		updateQuote(res);
	}						
});

