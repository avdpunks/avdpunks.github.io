---
layout: post
title:  "Azure Virtual Desktop - What is RTT?"
date:   2022-02-15 11:11:11 +0100
categories: AVD
tags: [AVD,Azure,Networking]
---
# Azure Virtual Desktop - What is RTT?

![2022-02-15-000.png](/assets/img/2022-02-15/2022-02-15-000.png)

**Let's go!**

## Table of contents
1. [What is RTT?](#What-is-RTT)
2. [How to find the Azure region with the best RTT for your users](#How-to-find-the-Azure-regio-with-the-best-RTT-for-your-users)
3. [What happens when the RTT is too high?](#What-happens-when-the-RTT-is-too-high)
4. [Troubleshooting](#troubleshooting)


## What is RTT?

RTT means **Round-Trip-Time** that is the amount of time it takes for a signal to be sent plus the amount of time it takes for acknowledgement of that signal having been received. This time delay includes propagation times for the paths between the two communication endpoints. [Wikipedia](https://en.wikipedia.org/wiki/Round-trip_delay)

Short description for RTT it is the time it takes a package to go from the sender to the recipient and back. A real life example: you send a package by mail to your friend and he sends this package back to you after acknowledgement. This described the RTT. 

There are many network hops along the way that can affect processing, and **each additional hop** that processes the packet can increase the RTT. Another influence is the **length of the distance** a packet has to travel between sender and receiver, i.e. the latency required to send a request to the receiver and a response to the sender.

Also, if the **network quality is unacceptable** and there is a lot of packet loss, for example, connections from moving trains or WiFi hotspots with many users. These are factors that can also increase RTT.

This diagram describes the connection between the Remote Desktop Client and the AVD Session Host VM. 

> It is intended to show an example of a client connection from Central India and an AVD Session Host located in Azure Western Europe. The RTT is imaginary and strongly varied.
 
![2022-02-15-001.png](/assets/img/2022-02-15/2022-02-15-001.png)

## How to find the Azure region with the best RTT for your users

The most important question before we can answer the other question is: **where are your users?** 

If your users are located in India, it would make sense to deploy your AVD session hosts in India or Southeast Asia. And if they are in Europe, then you should deploy in the Azure region in Europe.

The **AVD gateway** is available in more than **30 regions around the world**, as well as Azure regions. 

Microsoft provides an **Azure Virtual Desktop Experience Estimator** to help you find the optimal Azure region for your AVD session host. This tool estimates the connection RTT from your current location through the Azure Virtual Desktop service to each Azure region where you can deploy virtual machines.  

Here you will find the optimal Azure region for AVD: [Azure Virtual Desktop Experience Estimator](https://azure.microsoft.com/en-in/services/virtual-desktop/assessment/)

## What happens when the RTT is too high?

![2022-02-15-002.png](/assets/img/2022-02-15/2022-02-15-002.png)

https://docs.microsoft.com/en-us/azure/virtual-desktop/connection-latency


## How to optimize the RTT

https://docs.microsoft.com/en-us/azure/virtual-desktop/shortpath

## Troubleshooting

### Prerequisites

Activate the Perf Counters:
- RX Network - TCP 
- RX Network - UDP

### Use Log Analytics to analyze the RTT

### Use Azure Monitor Insights to analyze the RTT
