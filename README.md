Feed per connection timer statitics from haproxy udp syslog feed into statsd.

Usage:

use a *log* directive in haproxy config and feed the haproxy logs on *info* level to this process. For each served request following statsd timers will be sent:

<pre>
prefix.haproxy.frontend.backend.Tq:1|ms
prefix.haproxy.frontend.backend.Tw:0|ms
prefix.haproxy.frontend.backend.Tc:0|ms
prefix.haproxy.frontend.backend.Tr:-1|ms
prefix.haproxy.frontend.backend.Tt:1002|ms
</pre>

1) The first part is the prefix set from command line

2) Second part is the process name from syslog. Usually "haproxy"

3) Third part is the name of the frontend in haproxy configuration

4) Fourth part is the name of the backend in haproxy configuratrion

5) Fifth parts are one of the Tq, Tw, Tc, Tr and Tt timers. See more from haproxy documentation under "Timing events"
http://cbonte.github.io/haproxy-dconv/configuration-1.4.html#8.4

For each request where value is -1 an additional counter is sent instead with name on form of "<counter>-1". eg:
<pre>
haproxy.haproxy.frontend.frontend.Tq-1|c
haproxy.haproxy.frontend.frontend.Tw-1|c
haproxy.haproxy.frontend.frontend.Tc-1|c
haproxy.haproxy.frontend.frontend.Tr-1|c
haproxy.haproxy.frontend.frontend.Tt-1|c
<pre>
