var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var optimist = require('optimist')
	.usage('Start listening on --listen port for haproxy udp syslog feed and sends statsd to --host')
	.demand(['listen'])
	.default('host', '127.0.0.1')
	.default('port', 8125)
	.default('prefix', 'haproxy')
	.describe('listen', 'udp port to listen for incoming haproxy syslog feed')
	.describe('host', 'ip or hostname of statsd server')
	.describe('port', 'port of statsd server')
	.describe('prefix', 'prefix for statsd')

	
var argv = optimist.argv;

var prefix = argv.prefix;
var syslog_port = argv.listen;
var statsd_host = argv.host;
var statsd_port = argv.port;

var client = dgram.createSocket('udp4');

console.log("Listening on port", syslog_port, "feeding statsd probes to", statsd_host + ":" + statsd_port);
// <150>Nov 21 13:48:33 haproxy[17590]: 127.0.0.1:8274 [21/Nov/2013:13:48:33.744] impact-fe comet-getcampaigns/node_1341-3500 0/0/2/37/40 200 9431 - - ---- 12/7/4/0/0 0/0 "GET 
//          flags    ts              host          source      ts    front  back
//var r = /^<([0-9]+)>(.+ .+ .+:.+:.+) (.+)\[.+?\]: (.+:[0-9]+) \[.+\] (.+?) (.+?)\/(.+?) ([-0-9]+)\/([-0-9]+)\/([-0-9]+)\/([-0-9]+)\/([-0-9]+) /;
var r = /^<(\d+)>.*?(\d+\.\d+\.\d+\.\d+):(\d+)\s\[(.+)\]\s([^\s]+)\s+([^\/]+)\/([^\s]+)\s(\d+)\/(\d+)\/(\d+)\/(\d+)\/(\d+)\s(\d+)\s(\d+)\s(.)\s(.)\s([^\s]+)\s(\d+)\/(\d+)\/(\d+)\/(\d+)\/(\d+)\s(\d+)\/(\d+)\s"([^\s]+)\s([^\s]+)/;
var buf = new Buffer(1324);
var pos = 0;
var str = null;

server.on("message", function (msg, rinfo) {
	if (Math.floor((Math.random() * 10) + 1) != 10) {
	//	return;
	}

	var m = msg.toString().match(r);
	if (!m) {
		return;
	}
	
	var haproxy = "haproxy"; 
	var frontend_name = m[5];
	var backend_name = m[6];
	var server_name = m[7];
	var Tq = m[8];
	var Tw = m[9];
	var Tc = m[10];
	var Tr = m[11];
	var Tt = m[12];
	if (server_name == "<NOSRV>") {
		// frontend request, we aren't interested on these
		return;
	}


	pos = 0;
	str = null;
	var cmd = "";

    if (Tq == -1) {
            cmd += haproxy + "." + haproxy + "." + frontend_name + "." + backend_name + ".Tq-1|c\n";
    } else {
            cmd += haproxy + "." + haproxy + "." + frontend_name + "." + backend_name + ".Tq:" + Tq + "|ms\n";
    }

    if (Tw == -1) {
            cmd += haproxy + "." + haproxy + "." + frontend_name + "." + backend_name + ".Tw-1|c\n";
    } else {
            cmd += haproxy + "." + haproxy + "." + frontend_name + "." + backend_name + ".Tw:" + Tw + "|ms\n";
    }

    if (Tc == -1) {
            cmd += haproxy + "." + haproxy + "." + frontend_name + "." + backend_name + ".Tc-1|c\n";
    } else {
            cmd += haproxy + "." + haproxy + "." + frontend_name + "." + backend_name + ".Tc:" + Tc + "|ms\n";
    }

    if (Tr == -1) {
            cmd += haproxy + "." + haproxy + "." + frontend_name + "." + backend_name + ".Tr-1|c\n";
    } else {
            cmd += haproxy + "." + haproxy + "." + frontend_name + "." + backend_name + ".Tr:" + Tr + "|ms\n";
    }

    if (Tt == -1) {
            cmd += haproxy + "." + haproxy + "." + frontend_name + "." + backend_name + ".Tt-1|c\n";
    } else {
            cmd += haproxy + "." + haproxy + "." + frontend_name + "." + backend_name + ".Tt:" + Tt + "|ms\n";
    }

    var buf = new Buffer(cmd);

    client.send(buf, 0, buf.length, statsd_port, statsd_host);

	
});

server.bind(syslog_port);
