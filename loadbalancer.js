var httpProxy = require('http-proxy');
var http = require('http');
var proxy = httpProxy.createProxyServer();
var fs = require('fs');
 
var IP_DEFAULT = "172.17.0.3";

function readIps(callback) {
	fs.readFile('../ips.txt', 'utf8', function(err, ips) {	
		if (err) {
	       callback(err, null);
	   	}
	    console.log(ips); 
	    var arrayIps = ips.split("\r\n");  
	    console.log(arrayIps);
	    callback(null, arrayIps);
	});
}
 
function randomUrl(callback) {
	console.log("ok 2");
	readIps(function(err, ips) {	
		if (err) {
			console.log("ok 3");
	       callback("http://" + IP_DEFAULT);
	   	}
	   	console.log("ok 4");
	   	callback("http://" + ips[Math.floor(Math.random() * ips.length)]);
	});
}

var server = http.createServer(function (req, res) {
	console.log("ok");
	randomUrl(function(url) {
   		proxy.web(req, res, { target: randomUrl() });
   	});
});

server.on('upgrade', function (req, socket, head) {
	console.log("ok");
	randomUrl(function(url) {			
	   	proxy.ws(req, socket, head, { target: url });
	});
});

server.listen(80);
console.log("Load Balancer escutando na porta 80!");