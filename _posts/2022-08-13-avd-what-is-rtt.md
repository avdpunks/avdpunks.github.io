---
layout: post
title: "Azure Virtual Desktop (AVD) x What is RTT"
description: "A detailed guide on Round-Trip-Time (RTT) in Azure Virtual Desktop, including how to find optimal Azure regions and troubleshoot high RTT."
date: 2022-08-13
category: research
tags:
  - AVD
  - networking
reading_time: "10 min read"
featured_image: "https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2022-04-13-000.png"
source_url: "https://avdpunks.com/2022/08/13/azure-virtual-desktop-avd-x-what-is-rtt/"
source_title: "AVDPunks Original Post"
---

## What is RTT?

RTT means **Round-Trip-Time** — the amount of time it takes for a signal to be sent plus the amount of time it takes for acknowledgement of that signal having been received.

A real life example: you send a package by mail to your friend and he sends this package back to you after acknowledgement. This describes the RTT.

There are many network hops along the way that can affect processing, and each additional hop can increase the RTT. Another influence is the distance a packet has to travel between sender and receiver.

Network quality issues like packet loss (from moving trains or crowded WiFi hotspots) can also increase RTT.

![Diagram showing the communication between sender and receiver](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2022-04-13-000.png)

## How to find the Azure region with the best RTT for your users

The most important question: **where are your users?**

If your users are located in India, deploy your AVD session hosts in India or Southeast Asia. If they are in Europe, deploy in an Azure region in Europe.

Microsoft provides an **Azure Virtual Desktop Experience Estimator** to help you find the optimal Azure region. It estimates the connection RTT from your current location through the AVD service to each Azure region.

Find it here: [Azure Virtual Desktop Experience Estimator](https://azure.microsoft.com/services/virtual-desktop/assessment/)

Get the current RDWeb region URL from your client:

```powershell
Invoke-RestMethod -Uri "https://rdweb.wvd.microsoft.com/api/health" | Select-Object -ExpandProperty RegionUrl
```

## What happens when the RTT is too high?

If your RTT or latency is more than **200 ms**, it can affect the user experience with disconnections and slowness in the session.

![Round trip time from the remote desktop client to the session host and back](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2022-04-13-001.png)

> Microsoft quotes an RTT of up to **150 ms** for a stable session for office applications. For use cases involving rendering or videos, lower is better.

What is the path for the outgoing AVD traffic? Maybe there is a web proxy involved?

> **Microsoft does not recommend using any type of web proxy (scanning, SSL interception, or thread protection) for AVD traffic.**

## How to optimize the RTT

Current options:

- Analyze your network traffic flow and find network components or hops that need optimization
- Follow the proxy server guidelines for AVD
- Ensure users update the AVD client to the latest version

### Azure Virtual Desktop RDP Shortpath for public networks

Microsoft's RDP shortpath for public networks is gatewayless and improves session reliability with better latency and bandwidth.

It uses the Universal Rate Control Protocol (URCP) and STUN/ICE method to establish a direct connection between client and session host.

![Remote Desktop connection information showing round-trip time value](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2022-04-13-002.png)

Documentation: [https://aka.ms/AVDShortPathPublic](https://aka.ms/AVDShortPathPublic)

## Troubleshooting

### Prerequisites

You need an Azure Log Analytics workspace to capture Windows event logs, performance counters, and AVD logs.

### Option 1: Collect RTT via PerfMon counters

Add these Windows performance counters:

```
RemoteFX Network(*)Current TCP Bandwidth
RemoteFX Network(*)Current TCP RTT
RemoteFX Network(*)Current UDP Bandwidth
RemoteFX Network(*)Current UDP RTT
```

![Performance counters of the Log Analytics workspace required for network data](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2022-04-13-003.png)

Query for TCP RTT:

```kusto
Perf
| where Computer == "server.domain.local"
| where ObjectName == "RemoteFX Network"
| where CounterName == "Current TCP RTT"
| summarize AggregatedValue = avg(CounterValue) by bin(TimeGenerated, 30d), Computer
```

### Option 2: Collect RTT via AVD NetworkData

1. Open diagnostics settings for your Azure Virtual Desktop Host Pool
2. Add diagnostics settings and select **allLogs** (NetworkData is required for RTT/Bandwidth)
3. Select **Send to Log Analytics workspace**

![How to enable the diagnostic setting for Azure Virtual Desktop for network data](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2022-04-13-004.png)

Query for AVD NetworkData:

```kusto
WVDConnectionNetworkData 
| join kind=inner (WVDConnections | where State == "Connected" and UserName != "") on CorrelationId
| summarize 
    ["Avg. RTT"]=avg(EstRoundTripTimeInMs),
    ["Max. RTT"]=max(EstRoundTripTimeInMs),
    ["P90 RTT"]=percentile(EstRoundTripTimeInMs,90),
    ["Avg. Bandwidth"]=avg(EstAvailableBandwidthKBps),
    ["Max. Bandwidth"]=max(EstAvailableBandwidthKBps),
    ["P90 Bandwidth"]=percentile(EstAvailableBandwidthKBps,90) 
  by UserName
| order by ["Avg. RTT"] desc
```

![Example for log analytics kusto query output](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2022-04-13-005.png)

## Resources

- [Collect and query Network Data for Azure Virtual Desktop connections](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/collect-and-query-network-data-for-azure-virtual-desktop/m-p/3140397)
- [Connection latency - Microsoft Learn](https://docs.microsoft.com/en-us/azure/virtual-desktop/connection-latency)
