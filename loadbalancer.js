var httpProxy = require('http-proxy');
var http = require('http');
var proxy = httpProxy.createProxyServer();
var fs = require('fs');
 
var IP_DEFAULT = "172.17.0.3";
var PORT_DEFAULT = "80";

function readIps(callback) {
	fs.readFile('/opt/docker/app/ips.txt', 'utf8', function(err, ips) {	
		if (err) {
	       callback(err, null);
	   	}
	    console.log(ips); 
	    var arrayIps = ips.split("\n");  
	    console.log(arrayIps);
	    callback(null, arrayIps);
	});
}
 
function randomUrl(callback) {
	readIps(function(err, ips) {	
		if (err) {
	       callback("http://" + IP_DEFAULT + ":" + PORT_DEFAULT);
	   	}
	   	callback("http://" + ips[Math.floor(Math.random() * ips.length)]  + ":" + PORT_DEFAULT);
	});
}

var server = http.createServer(function (req, res) {
	randomUrl(function(url) {
   		proxy.web(req, res, { target: url });
   	});
});

server.on('upgrade', function (req, socket, head) {
	randomUrl(function(url) {		
	   	proxy.ws(req, socket, head, { target: url });
	});
});

server.listen(80);
console.log("Load Balancer escutando na porta 80!");