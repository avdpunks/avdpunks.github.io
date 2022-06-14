---
layout: post
title:  "Azure Virtual Desktop x Location redirection #WhereAmI"
date:   2022-05-29 14:00:00 +0100
categories: AVD
tags: [AVD,Landingzone,IaC,Bicep]
---
# Azure Virtual Desktop (#AVD) x Where am I

![This image shows the AVDPunk Header](/assets/img/2022-06-14/2022-06-14-000.png)

## Table of contents
1. [Introduction](#Introduction)
2. [Windows location service](#Windows-location-service-and-privacy)
6. [Conclusion](#Conclusion)

## Introduction
Traveling across europe with my Van while working on a VDI deployed in Western Europe can be frustraiting 

While some services (like your search engine) are using the IP-based Geolocation to display results. 

Redirecting geolocation information from the client device to remote desktops or published applications requires enabling the Geolocation Redirection feature on the agent machine, configuring group policy settings on your Active Directory server, and specifying which websites use this feature.

Fuction
Precise location means better weather reporting, more relevant local news, and overall greater functionality for apps and Windows. 

We have several WVD deployments in West Europe, but we and the customers are located in Norway. We need Edge to return results relevant to Norwegian users, not results relevant to users in Amsterdam.. I know it can be done manually for each users if they log on to Edge, but a solution with a GPO would be preferrable as there are lots of users. 

⚠️ There is no official documentation around this configuration ⚠️

## Windows location service

All is about the famous **Windows location service**, which has been available since Windows 10. This service allows users to use their local location in websites and applications, e.g. for navigation requests or weather information. 

![This image shows the Edge location service](/assets/img/2022-06-14/2022-06-14-001.png)

![This image shows the Windows 11 weather widget location service](/assets/img/2022-06-14/2022-06-14-002.png)

>Microsoft location service will use a combination of global positioning service (GPS), nearby wireless access points, cell towers, and your IP address (or default location) to determine your device’s location.

Here you can find a detailed description about the [Windows location service and privacy.](https://support.microsoft.com/en-us/windows/windows-location-service-and-privacy-3a8eee0a-5b0b-dc07-eede-2a5ca1c49088)

## How to enable Location service on Windows 11 for AVD

There are several ways to enable the location service on Windows 11 devices, including Windows 11 multi-session. We will show all options from local settings to Intune configuration / GPOs to adding a registry key. 

Let's start with the local setting, which are not enterprise-grade because it is done manually. 

### Via local settings

From the start menu search for **Location** and open the **Privacy & security > Location** settings then you need to switch the Location services to **On**. Additionally, you can specify the location settings for individual application or service. 

![This image shows the Windows 11 Privacy & security:Location panel](/assets/img/2022-06-14/2022-06-14-003.png)

Please verify that the option **"Let desktop apps access your location"** is enabled that is needed for native AVD client. 

![This image shows the Windows 11 "Let desktop apps access your location"](/assets/img/2022-06-14/2022-06-14-004.png)

### Via Intune Configuration Policy

The next option would be the ability to enable location services via the Intune configuration policy. We still focus on the **settings catalog** and not on the templates (ADMX, Custom & Co). 

The Settings Catalog is the only way to define configuration policies for Windows 10+ multisession (currently only System Settings). VDI is also supported with the settings catalog. It will be the next standard for configuration policies in the future. 

Please follow the description to create a new settings catalog for Windows 10+ VDI or multisession: [How to configure profiles](https://avdpunks.com/avd/2022/02/05/IntuneConfigOptForAVD.html#How-to-configure-profiles)

Search for **Allow Location** in the settings picker and select **Allow Location** in the results list. 

![This image shows the Intune Settings picker for Allow Location](/assets/img/2022-06-14/2022-06-14-005.png)



![This image shows the Intune Settings Catalog to allow location](/assets/img/2022-06-14/2022-06-14-006.png)

### Via GPO

### Via Registry Key

```
Windows Registry Editor Version 5.00
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\location]
"Value"="Allow"
```
## How to enable Location redirection for AVD

RDP Property
```
redirectlocation:i:1
```
## Look and feel


## Conclusion

## Resources
https://docs.microsoft.com/en-us/azure/virtual-desktop/configure-device-redirections
https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/rdp-files
https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-app-compare#other-redirection-devices-etc
