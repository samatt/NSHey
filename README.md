NSHey
=====

If you get a permissions denied error for bpf 


 * Open Terminal
 * sudo chmod o+r /dev/bpf*

##Log File Description

The log file is a pretty obtuse right now. I need to clean that up. But for now I'll describe how to parse it here.

The log file has the following fields
``timestamp,Interface,power,frequency,band,packetType,field1,field2``

Interface: Redundant field. Always Radio as we're working with Wifi
Power: Rssi mapped to the randge 0-255. Not very reliable.
Frequency: Current center frequency (this is the current channel). 
Band: 2.4 or 5 Ghz indicator (also pretty redundant)
packetType: This is important. It describes what type of packet it is. 

the first four fields are constant for all packets. field1 and field2 aer dependent on packetType.
```
if packetType == Data
field1,field2 = client_mac_addr,router_mac_addr

if packetType == Beacn:
field1 = router_mac_addr,SSID

if packetType == Probe:
field1,field2 == client_mac_addr,Probed SSID
 ```
<!--1429728484,Radio,188,2462,1152,Probe,00:88:65:d1:0f:b5,ClearSPOT_96c41-->
<!--1429728483,Radio,180,2462,1152,Beacn,74:d0:2b:85:47:88,Password Is Not Banana-->
<!--1429728484,Radio,181,2462,1152,Data,01:80:c2:00:00:00,74:d0:2b:85:47:88-->
