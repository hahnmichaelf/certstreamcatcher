
const catcherstream = require('./index');
const certstream = require("certstream");

const json = require('json');

const keywords = /(?:yobit|apple|bitcoin|btc|ethereum|myetherwallet|mycrypto|bitfinex|etherdelta|localbitcoins|ethereum|mymonero|bitflyer|coinbase|hitbtc|lakebtc|bitfinex|bittrex|cryptopia|localbitcoins|gdax|changelly|binance|hitbtc|bithumb|luno|coinatmradar|poloniex|shapeshift|bitmex|gemini|bitbay|coinmama|bitflyer|bisq|btcmarkets|coincheck|zebpay|indacoin|coinhive)/gi;

const tlds = ['.io','.gq','.ml','.cf','.tk','.xyz','.pw','.cc','.club','.work','.top','.support','.bank','.info','.study','.party','.click','.country','.stream','.gdn','.mom','.xin','.kim','.men', '.loan', '.download', '.racing', '.online', '.center', '.ren', '.gb', '.win', '.review', '.vip', '.party', '.tech', '.science', '.business', '.com'];

var client = new certstream(function(certstream) {
	catcherstream.certstreamClientPhishing(certstream, keywords, tlds, {tlds: false});
});

client.connect();
