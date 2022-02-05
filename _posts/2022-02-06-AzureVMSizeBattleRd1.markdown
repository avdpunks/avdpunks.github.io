---
layout: post
title:  "Azure VM Size Battle Round I: Ddasv5 vs. Ddsv5"
date:   2022-01-20 11:11:11 +0100
categories: AVD
tags: [AVD,Azure,VM]
---

![2022-02-06-000.png](/assets/img/2022-02-06/2022-02-06-000.png)
# Azure VM Size Battle Round I: Ddasv5 vs. Ddsv5 
## Table of contents
1. [Introduction](#Introduction)
2. [What brings us the good old question AMD or Intel and how do they perform?](#What-brings-us-the-good-old-question-AMD-or-Intel-and-how-do-they-perform)
3. [Conclusion](#Conclusion)

## Introduction

Whether you're running your virtual machine on **Remote Desktop Services (RDS) or Azure Virtual Desktop (AVD)**, different types of workloads require different session host virtual machine (VM) configurations.

One question Ben and I received quick frequently is how to deliver the **best possible experience**, scale your deployment depending on your users' needs and keep costs on a human level.

As you may know, on Ignite we released a new Azure Virtual Machine series that deliver better price and performance for most general purpose and memory-intensive workloads, compared to prior virtual machine (VM) generations.

The general availability of the **Dv5 and Ev5 Azure Virtual Machine**, which deliver up to **15% increased performance** for most workloads and can scale up to **96 vCPUs**. These work well for most general computing workloads including AVD.

The new Dasv5 and Easv5 Azure Virtual Machines, which are based on the **3rd Generation AMD EPYC 7763v (Milan) processor**. These new VMs provide options with and without local disk storage for a lower price of entry. They are ideal for memory-intensive enterprise applications and large relational database servers.

## What brings us the good old question AMD or Intel and how do they perform?

For these tests, we deployed two Windows 11 21H2 (build 22000.194) virtual machines in region West Europe that only connected to Azure Active Directory (AADJ) and added to the AVD host pool for personal desktops. The **VM#1 has size D2ds v5** that based on the 3rd Generation Intel Xeon Platinum 8370 and the **VM#2 has size D2ads** that based on the AMD CPU as already mentioned. Both VM sizes included 75GB SSD temp data and Standard SSD 127GB as OS Disk. 

These test runs were performed with connected RDP sessions and each test was run three times. **The result is the average of these 3 tests**, the benchmark points show the higher this value the better the performance in the areas.

![2022-02-06-001.png](/assets/img/2022-02-06/2022-02-06-001.png)

![2022-02-06-002.png](/assets/img/2022-02-06/2022-02-06-002.png)

![2022-02-06-003.png](/assets/img/2022-02-06/2022-02-06-003.png)

**The VM Size D2ads v5 has better performances in video & photo editing, video conferencing, and web browsing**. All other use-cases are very similar between these two VM sizes, but spreadsheets can be better handled by D2ds v5.

Next, were be the same test runs with D-series version 4 and compared to version 5.

![2022-02-06-004.png](/assets/img/2022-02-06/2022-02-06-004.png)

![2022-02-06-005.png](/assets/img/2022-02-06/2022-02-06-005.png)

![2022-02-06-006.png](/assets/img/2022-02-06/2022-02-06-006.png)

## Conclusion

Beside our tests, we recommend you use simulation tools to test your deployment with both stress tests and real-life usage simulations. Make sure your system is responsive and resilient enough to meet user needs, and remember to vary the load size to avoid surprises. But from our experience the Ddasv5 has 4.2% better performance than D2ds v5 and is an outstanding SKU for your general purpose workloads. 

**The D-series version 5 is better in all my performances tests than the D-series version 4.** One last thing, the lead of D2ads in version 5 has melted compared to version 4.

Leave us a comment and your thoughts around this!

Official Documentation and recommendations: [Virtual machine sizing | Microsoft Docs](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs#multi-session-recommendations)