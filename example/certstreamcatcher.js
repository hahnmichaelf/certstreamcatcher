
const catcherstream = require('../index');
const certstream = require("certstream");

const keywords = /(?:bitcoin|yobit|ethereum|myetherwallet|apple|paypal|mycrypto|bitfinex|etherdelta|iqoption|localbitcoins|ethereum|wallet|mymonero|blockchain|bitflyer|coinbase|hitbtc|lakebtc|bitfinex|bittrex|blockchain|cryptopia|localbitcoins|gdax|changelly|binance|hitbtc|bithumb|luno|coinatmradar|poloniex|shapeshift|bitmex|gemini|bitbay|coinmama|bitflyer|bisq|btcmarkets|coincheck|zebpay|indacoin|coinhive)/gi;

const tlds = ['.io','.gq','.ml','.cf','.tk','.xyz','.pw','.cc','.club','.work','.top','.support','.bank','.info','.study','.party','.click','.country','.stream','.gdn','.mom','.xin','.kim','.men', '.loan', '.download', '.racing', '.online', '.center', '.ren', '.gb', '.win', '.review', '.vip', '.party', '.tech', '.science', '.business', '.com'];

var client = new certstream(function(certstream) {
	catcherstream.certstreamClientPhishing(certstream, keywords, tlds, {tlds: false});
});

client.connect();
