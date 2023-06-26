```
vlmcs 1113, built 2020-03-28 17:56:44 UTC

Usage: ./vlmcs-darwin [options] [ <host>[:<port>] | .<domain> | - ] [options]

Options:

  -v Be verbose
  -l <app>
  -4 Force V4 protocol
  -5 Force V5 protocol
  -6 Force V6 protocol
  -i <IpVersion> Use IP protocol (4 or 6)
  -j <file> Load external KMS data file <file>
  -e Show some valid examples
  -x Show valid Apps
  -d no DNS names, use Netbios names (no effect if -w is used)
  -V show version information and exit

Advanced options:

  -a <AppGUID> Use custom Application GUID
  -s <ActGUID> Use custom Activation Configuration GUID
  -k <KmsGUID> Use custom KMS GUID
  -c <ClientGUID> Use custom Client GUID. Default: Use random
  -o <PreviousClientGUID> Use custom Prevoius Client GUID. Default: ZeroGUID
  -K <ProtocolVersion> Use a specific (possibly invalid) protocol version
  -w <Workstation> Use custom workstation name. Default: Use random
  -r <RequiredClientCount> Fake required clients
  -n <Requests> Fixed # of requests (Default: Enough to charge)
  -m Pretend to be a virtual machine
  -G <file> Get ePID/HwId data and write to <file>. Can't be used with -l, -4, -5, -6, -a, -s, -k, -r and -n
  -T Use a new TCP connection for each request.
  -N <0|1> disable or enable NDR64. Default: 1
  -B <0|1> disable or enable RPC bind time feature negotiation. Default: 1
  -t <LicenseStatus> Use specfic license status (0 <= T <= 6)
  -g <BindingExpiration> Use a specfic binding expiration time in minutes. Default 43200
  -P Ignore priority and weight in DNS SRV records
  -p Don't use multiplexed RPC bind

<port>:         TCP port name of the KMS to use. Default 1688.
<host>:         host name of the KMS to use. Default 127.0.0.1
.<domain>:      find KMS server in <domain> via DNS
<app>:          (Type ./vlmcs-darwin -x to see a list of valid apps)
```
