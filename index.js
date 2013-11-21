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

//          flags    ts              host          source      ts    front  back
var r = /^<([0-9]+)>(.+ .+ .+:.+:.+) (.+)\[.+?\]: (.+:[0-9]+) \[.+\] (.+?) (.+?)\/(.+?) ([-0-9]+)\/([-0-9]+)\/([-0-9]+)\/([-0-9]+)\/([-0-9]+) /;

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

	var haproxy = m[3]; 
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

	if (Tq == -1) {
		pos += buf.write(prefix, pos, prefix.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(haproxy, pos, haproxy.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(frontend_name, pos, frontend_name.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(backend_name, pos, backend_name.length);
		pos += buf.write(".Tq-1|c\n", pos, 8);
	} else {
		pos += buf.write(prefix, pos, prefix.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(haproxy, pos, haproxy.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(frontend_name, pos, frontend_name.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(backend_name, pos, backend_name.length);
		pos += buf.write(".Tq:", pos, 4);
		str = Tq.toString();
		pos += buf.write(str, pos, str.length);
		pos += buf.write("|ms\n", pos, 4);
	}

	if (Tw == -1) {
		pos += buf.write(prefix, pos, prefix.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(haproxy, pos, haproxy.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(frontend_name, pos, frontend_name.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(backend_name, pos, backend_name.length);
		pos += buf.write(".Tw-1|c\n", pos, 8);
	} else {
		pos += buf.write(prefix, pos, prefix.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(haproxy, pos, haproxy.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(frontend_name, pos, frontend_name.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(backend_name, pos, backend_name.length);
		pos += buf.write(".Tw:", pos, 4);
		str = Tw.toString();
		pos += buf.write(str, pos, str.length);
		pos += buf.write("|ms\n", pos, 4);
	}

	if (Tc == -1) {
		pos += buf.write(prefix, pos, prefix.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(haproxy, pos, haproxy.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(frontend_name, pos, frontend_name.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(backend_name, pos, backend_name.length);
		pos += buf.write(".Tc-1|c\n", pos, 8);
	} else {
		pos += buf.write(prefix, pos, prefix.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(haproxy, pos, haproxy.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(frontend_name, pos, frontend_name.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(backend_name, pos, backend_name.length);
		pos += buf.write(".Tc:", pos, 4);
		str = Tc.toString();
		pos += buf.write(str, pos, str.length);
		pos += buf.write("|ms\n", pos, 4);
	}

	if (Tr == -1) {
		pos += buf.write(prefix, pos, prefix.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(haproxy, pos, haproxy.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(frontend_name, pos, frontend_name.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(backend_name, pos, backend_name.length);
		pos += buf.write(".Tr-1|c\n", pos, 8);
	} else {
		pos += buf.write(prefix, pos, prefix.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(haproxy, pos, haproxy.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(frontend_name, pos, frontend_name.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(backend_name, pos, backend_name.length);
		pos += buf.write(".Tr:", pos, 4);
		str = Tr.toString();
		pos += buf.write(str, pos, str.length);
		pos += buf.write("|ms\n", pos, 4);
	}

	if (Tt == -1) {
		pos += buf.write(prefix, pos, prefix.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(haproxy, pos, haproxy.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(frontend_name, pos, frontend_name.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(backend_name, pos, backend_name.length);
		pos += buf.write(".Tt-1|c\n", pos, 8);
	} else {
		pos += buf.write(prefix, pos, prefix.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(haproxy, pos, haproxy.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(frontend_name, pos, frontend_name.length);
		pos += buf.write(".", pos, 1);
		pos += buf.write(backend_name, pos, backend_name.length);
		pos += buf.write(".Tt:", pos, 4);
		str = Tt.toString();
		pos += buf.write(str, pos, str.length);
		pos += buf.write("|ms\n", pos, 4);
	}

	//console.log("pos", pos);
	//console.log(buf.toString("utf8", 0, pos));
	client.send(buf, 0, pos, statsd_port, statsd_host);
	
});

server.bind(syslog_port);
