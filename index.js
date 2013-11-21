var dgram = require("dgram");
var server = dgram.createSocket("udp4");

var prefix = 'haproxy';

var syslog_port = 5000;
var client = dgram.createSocket('udp4');
var statsd_host = "127.0.0.1";
var statsd_port = 8125;


//          flags    ts              host          source      ts    front  back
var r = /^<([0-9]+)>(.+ .+ .+:.+:.+) (.+)\[.+?\]: (.+:[0-9]+) \[.+\] (.+?) (.+?)\/.+? ([-0-9]+)\/([-0-9]+)\/([-0-9]+)\/([-0-9]+)\/([-0-9]+) /;

server.on("message", function (msg, rinfo) {

	if (Math.floor((Math.random() * 10) + 1) != 10) {
		return;
	}

	var m = msg.toString().match(r);
	if (!m) {
		return;
	}

	var haproxy = m[3]; 
	var frontend_name = m[5];
	var backend_name = m[6];
	var Tq = m[7];
	var Tw = m[8];
	var Tc = m[9];
	var Tr = m[10];
	var Tt = m[11];

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
