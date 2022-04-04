---
layout: post
title:  "Azure Virtual Desktop BCDR and Multi Region Deployments"
date:   2022-03-10 10:00:00 +0100
categories: AVD
tags: [AVD,BCDR]
---
# Azure Virtual Desktop (AVD) BCDR and Multi Region Deployments

## Table of contents
1. [Introduction](#Introduction)
2. [Device redirection overview](#Device-redirection-overview)
3. [Device redirections compared](#Device-redirections-compared)
4. [What is RemoteFX](#What-is-remotefx)
5. [RemoteFX requirements and configuration](#RemoteFX-requirements-and-configuration)
6. [Conclusion](#Conclusion)

## Introduction
Since more and more Azure Virtual Desktop (AVD) deployments are popping up all over the world, it is essential you consider a vital business continuity and disaster recovery plan. Especially when designing for scale and growth.

Azure Virtual Desktop is an global Azure Cloud native service, hosted and managed by Microsoft.

This means that you don’t have to worry about the underlying infrastructure, and the traditional core components such as the web access server, database, the licensing or brokering server and the load balancer for user connections.

Furthermore, since it is a global service, the service itself is high available by design.

This leads us to the question what should we protect, how can we protect data and compute resources and where to focus on or are there options?

In this post I focus on options for the overall architecture, virtual machines, storage, images and FSLogix of a AVD deployment.

## Part I : The compute resources - Sets and Zones
When deploying high available compute workloads Microsoft offers multiple options: Availability Zone and Availability Sets.

An Azure region contains one or more zones. An availability zone has a distinct power source, network, and cooling, similar to a on-premises datacenter.

An availability set is a logical grouping of VMs that allows Azure to distribute resources within one zone in different fault and update domains.

Fault domains
A fault domain is a logical group of underlying hardware that share a common power source and network switch, similar to a rack within an on-premises datacenter.

Update domains
An update domain is a logical group of underlying hardware that can undergo maintenance or be rebooted at the same time.

This approach ensures that at least one instance of your application always remains running as the Azure platform undergoes periodic maintenance. The order of update domains being rebooted may not proceed sequentially during maintenance, but only one update domain is rebooted at a time.

There is no cost for the availability set itself, you only pay for each VM instance that you create.

For an AVD ARM deployment, session hosts are configured within a availability set and spread across up to three fault domains by default. This protects session hosts of a potential physical hardware failures, network outages, or power interruptions within an Azure datacenter.

## Part II : The data- and storage layer
AVD itself will not store any business critical data. So when we look at the data, storage layer and session hosts, (hopefully) it primarily comes to user profile data and potentially msix app attach containers. personal or project data are stored in OneDrive, a file share or Project Lifecycle Management Software.

Note: If you store business critical data on the session hosts a backup or snapshot might be something you should look at.

I personally recommend to use Azure Files, preferably premium and in case you missed it, Microsoft just dropped the pricing model by 33%. Read more here: 33% price drop announced recently.

Why? Premium files are backed by solid-state drives (SSDs) and provide consistent high performance and low latency, within single-digit milliseconds for most IO operations, for IO-intensive workloads.

It supports up to 100.000 IOPS but a minimum if 400 + 1* GiB.

Furthermore, premium file shares can burst their IOPS up to 4,000 or up to a factor of three, what is very useful if we think at our FSLogix user profiles. We need around 50 IOPS in a logon phase and 10 in a steady mode.

For even higher IOP requirements or high performance workloads there is Azure NetApp Files. (or "Azure Files on steroids")

All options will make it a lot easier to create a highly available setup compared to a traditional IaaS file server setup.

Azure Files requires a storage account and a provides multiple options and features to configure redundancy and security such as data encryption, at rest as well as in transit, identity and authorization options, backups, and many more.

For redundancy and high availability it similar to the compute options.

Local redundant storage or LRS
Zone redundant storage or ZRS
Geo-redundant storage or GRS
and Geo-zone redundant storage or GZRS

Locally redundant: means that every file is stored three times within an Azure storage cluster. This protects against loss of data due to hardware faults, such as a bad disk drive.

Zone redundant: means that every file is stored three times across three distinct Azure storage clusters. Just like with locally redundant storage, zone redundancy gives you three copies of each file, however these copies are physically isolated in three distinct storage clusters in different Azure availability zones.

Geo-redundant: is like locally redundant storage, in that a file is stored three times within an Azure storage cluster in the primary region. All writes are then asynchronously replicated to a Microsoft-defined secondary region. Geo-redundant storage provides 6 copies of your data spread between two Azure regions. In the event of a major disaster such as the permanent loss of an Azure region due to a natural disaster or other similar event, Microsoft will perform a failover so that the secondary in effect becomes the primary, serving all operations. Since the replication between the primary and secondary regions are asynchronous, in the event of a major disaster, data not yet replicated to the secondary region will be lost. You can also perform a manual failover of a geo-redundant storage account.

Geo-zone redundant: is like zone redundant storage, in that a file is stored three times across three distinct storage clusters in the primary region. All writes are then asynchronously replicated to a Microsoft-defined secondary region. The failover process for geo-zone-redundant storage works the same as it does for geo-redundant storage.

Standard Azure file shares support all four redundancy types, while premium Azure file shares only support locally redundant and zone redundant storage.

Note: In case you are looking for a way to migrate you file shares to Azure. Microsoft provides multiple guides to help you move your files into Azure file shares. Read more here: https://docs.microsoft.com/en-us/azure/storage/files/storage-files-migration-overview

Important: Storage redundancy does not replace backups! Consider up backup the Azure Files storage to protect your e.g. user profiles.

## Part III : Images
What could go wrong, you simply spin up a set of new session hosts in case of a disaster. But wait where is the image?

To make a multi region AVD deployment even more easier there is the Shared Image Gallery (SIG).

A great benefit of the Azure Image Gallery is that you can deploy your image to different Regions within Azure at the same time.

## Part IV : FSLogix
While it is generally highly recommended to use the build in redundancy option of the service, there is another option when it comes to the user profile and office container to make them high available - FSLogix Cloud Cache.

Cloud Cache is an optional add-on and allows the use of multiple remote locations, which are all continually updated during the user session.

Using Cloud Cache can insulate users from short-term loss of connectivity to remote profile containers. Cloud Cache can also provide real time, 'Active-Active' redundancy for Profile Container and Office Container.

It's important to understand that, even with Cloud Cache, all initial reads are accomplished from the redirected location. Likewise, all writes occur to all remote storage locations, although writes go to the Local Cache file first.

Note: Cloud Cache doesn't improve the users' sign-on and sign out experience. It gets even worse when using poor performing storage. It's common for environments using Cloud Cache to have slightly slower sign-on and sign out times, relative to using traditional VHDLocations, using the same storage.

## Part V : Active-Active or Active-Passive
All these options are leading us finally to different scenarios and architectures we can deploy to build a scalable, high available and most important vital BCDR plan for our AVD environment.

One option is an Active Active deployment with FSLogix Cloud Cache. Cloud Cache provides seamless failover the only thing you have to make sure is the CCDLocation configuration.

The price you pay for the Cloud Cache is a slightly delay of logon and logoff time and a higher local disk IO due to the local cache.

.. NEW PICTURE .. 

Another option is Active-Passive with a Geo-redundant storage or multiple storage accounts you synchronize or some kind of DFS or replication mechanism. 

FSLogix allows you to configure multiple VHD(x) locations. To configure FSLogix VHD(x) locations you are using the

HKLM\SOFTWARE\FSLogix\Profile\VHDLocation - Type: MULTI_SZ or REG_SZ.

But this option was not designed for high availability in the first place. The list of locations in VHDLocations was created to allow a customer to control where the VHD is placed and to be able to control which VHDs are created on which location using share permissions. FSlogix has built-in logic to determine that the first location is not available and will not proceed to create another disk on the next server in the list so only one VHD(x) location can be accessed at any one time.

Thats why, it is very important to note that this model does not provide seamless failover. In case of a failover, a reboot or more likely a reset of the users’ session will be required and only one region / VHD(x) location should be available at the time.

.. NEW PICTURE .. 

Conclusion
I hope this post and helps you to design, decide and to define how to build an resilient and healthy AVD environment. Hopefully you will never be in a critical scenario, but when, you have a plan ready for it! 

## Resources
https://docs.microsoft.com/en-us/azure/virtual-machines/availability
https://docs.microsoft.com/en-us/azure/storage/files/storage-files-planning
https://docs.microsoft.com/en-gb/azure/storage/common/storage-redundancy
https://docs.microsoft.com/en-us/azure/virtual-machines/shared-image-galleries
https://docs.microsoft.com/en-us/fslogix/cloud-cache-resiliency-availability-cncpt
https://docs.microsoft.com/en-us/fslogix/configure-cloud-cache-tutorial





There are three standard options for storing FSLogix profiles:
• Azure Files
• Azure NetApp Files (ZRS/LSR)
• FSLogix Cloud Cache for replication

Per User / Per Group Settings
- For Cloud Cache



Single Region Resiliency 
- Cloud Cache
- ANF
- Azure Files

Multi Region Business Cont
- Cloud Cache
- ANF
- Azure Files 
- Personal
    - 


Cloud Cache
Cloud Cache uses a local profile to service reads from a redirected Profile or Office container
after completing its first read. Cloud Cache can use multiple remote locations that are updated
continuously during the user session. Cloud Cache can essentially insulate users from the risk of 
short-term loss of connectivity to remote profile containers. It is also important to note that Cloud
Cache can provide active-active redundancy for Profile and Office containers.

Host pool active-active vs. active-passive
For an Azure Virtual Desktop host pool, you can adopt either an active-active or active-passive BCDR approach.

An active-active approach:

Storage outages are mitigated without requiring the user to reauthenticate.
Continuous testing of the disaster recovery location is enabled.
A single host pool can contain VMs from multiple regions. In this scenario, usage of cloud cache is required to actively replicate the user's FSLogix profile and office containers between the regions.
For virtual machines (VMs) in each region, the cloud cache registry entry specifying locations needs to be inverted to give precedence to the local one.
Load balancing of incoming user connection can't take proximity into account; all hosts will be equal and users may be directed to a remote (not optimal) Azure Virtual Desktop host pool VM.
This configuration is limited to a pooled (shared) host pool type. For a personal (dedicated) type, once a desktop is assigned to a user on a certain session host VM, it sticks and doesn't change, even if not available.
This configuration can be complex and isn't considered to be either a performance or cost optimization.
With active-passive:

Azure Site Recovery or a secondary host pool (hot stand-by) can be used to maintain a backup environment.
Azure Site Recovery is supported for both personal (dedicated) and pooled (shared) host pool types, and lets you maintain a single host pool entity.
You can create a new host pool in the failover region while keeping all of the resources turned off. For this method, set up new application groups in the failover region and assign users to them. You can then use a recovery plan in Azure Site Recovery to turn on host pools and create an orchestrated process.



