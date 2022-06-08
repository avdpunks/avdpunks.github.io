---
layout: post
title:  "Azure Virtual Desktop x Location redirection #WhereAmI"
date:   2022-05-29 14:00:00 +0100
categories: AVD
tags: [AVD,Landingzone,IaC,Bicep]
---
# Azure Virtual Desktop (#AVD) x Where am I

![This image shows the AVDPunk Header](/assets/img/2022-03-15/2022-05-31-001.png)

## Table of contents
1. [Introduction](#Introduction)
6. [Conclusion](#Conclusion)

## Introduction
Traveling across europe with my Van while working on a VDI deployed in Western Europe can be frustraiting 


While some services (like your search engine) are using the IP-based Geolocation to display results. 

Redirecting geolocation information from the client device to remote desktops or published applications requires enabling the Geolocation Redirection feature on the agent machine, configuring group policy settings on your Active Directory server, and specifying which websites use this feature.

Fuction
Precise location means better weather reporting, more relevant local news, and overall greater functionality for apps and Windows. 

We have several WVD deployments in West Europe, but we and the customers are located in Norway. We need Edge to return results relevant to Norwegian users, not results relevant to users in Amsterdam.. I know it can be done manually for each users if they log on to Edge, but a solution with a GPO would be preferrable as there are lots of users 

⚠️ There is no official documentation around this configuration ⚠️

## Location redirection

Intune: Profil / AVD session aktiviert sein.

Da gibt es eine Intune Policy meine ich.
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\location]
"Value"="Allow"

## 

##

## Conclusion

## Resources
https://docs.microsoft.com/en-us/azure/virtual-desktop/configure-device-redirections
https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/rdp-files
https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-app-compare#other-redirection-devices-etc
