
var express = require('express')
var superagent = require('superagent')
var cheerio = require('cheerio')
var app = express()

infos = ['','','','','']
EOSYunbiPrice = 0
setInterval(function(){
	superagent.get('http://eoschart.com/data/getIcoStatus.html')
		.end(function(err, res){
			if (err){
				return next(err);
			}
			var cheerio = require('cheerio'),
    		$ = cheerio.load(res.text);
    		$('span').each(function(i, elem){
    			var info = $(this).text().trim();
    			if(info != ''){
    				infos[i] = info;
    			} 
    		});
    		infos.join(', ');
    		console.log(infos)
		});
}, 20000);

app.get('/yunbi',function(req, res, next){
	var request = require('request');
	var eosprice = '';
	request('https://yunbi.com//api/v2/tickers/eoscny.json', function (error, response, body) {
  		console.log('error:', error); // Print the error if one occurred
  		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  		var eosprice = body;
  		var obj = JSON.parse(eosprice);
  		var jsonstr = {'EOSCNY': obj.ticker.last}
  		res.send(jsonstr);
	});
	
});
app.get('/', function(req, res, next){
	var timeString = infos[0];
	var ETHCount = infos[1].split(' ')[1];
	var ETH2EOS = infos[2].split(' ')[1];
	var ICOPrice = infos[3].split(' ￥')[1];
	var marketValue = infos[4].split(' ￥')[1];
	jsonStr = {
		'time': timeString,
		'ETHCount': ETHCount,
		'ETH2EOS': ETH2EOS,
		'ICOPrice':ICOPrice,
		'marketValue':marketValue 
	};
	res.send(jsonStr)
})

app.listen(3000, function(req, res){
	console.log('app is running at port 3000')
});



