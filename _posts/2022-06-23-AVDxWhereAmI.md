---
layout: post
title:  "Azure Virtual Desktop x Location redirection #WhereAmI"
date:   2022-06-23 16:00:00 +0100
categories: AVD
tags: [AVD]
---
# Azure Virtual Desktop (#AVD) x Where am I

![This image shows the AVDPunk Header](/assets/img/2022-06-23/2022-06-23-000.png)

## Table of contents
1. [Introduction](#Introduction)
2. [Windows location service](#Windows-location-service-and-privacy)
3. [How to enable Location service on Windows 11 for AVD](#How-to-enable-Location-service-on-Windows-11-for-AVD)
4. [How to enable Location redirection for AVD](#How-to-enable-Location-redirection-for-AVD)
5. [Look and feel](#Look-and-feel)
5. [Limitations](#Limitations)
6. [Conclusion](#Conclusion)

## Introduction
Traveling across europe with my Van while working on a VDI deployed in Western Europe can be a challenge, especially when route planning. 😅 (This VDI thinks all the time I am in Amsterdam...)

And so, you might have the same or at least a similar challenge that a lot of your deployments are in the North/West Europe Region, but your end users are located in a different country. 

This brings the big question, can we improve the over all user experience by redirecting the edge device location. 

Yes...and No. First we need to understand, Windows is determining the location and region settings based on multiple factors and some services services (like your search engine of choice) are using the IP-based Geo-location to display results. The only way to improve this, is via a proxy or breakout in the country itself. 

Nevertheless, in our latest test we notices new settings in the [Windows Client](https://docs.microsoft.com/en-us/azure/virtual-desktop/configure-device-redirections) and RDP Properties and managed to redirect the location to the session host. This allows us to get weather reporting, more relevant local news, and overall greater functionality for apps and Windows like the map. 

>⚠️ There is no official documentation around this configuration ⚠️

## Lab setup and requirements

We performed all test with 
1. Windows 11 21H2 Edge Device
2. Windows MSRDC Client Version
3. Windows 11 21H2 Session Host, Intune enrolled, since we are using the settings picker to configure the session host

Redirecting geo-location information from the client device to remote desktops or published applications requires enabling the geo-location redirection feature on the session host machine, configuring group policy settings on your Active Directory server, and specifying which websites use this feature.

Location services must be **enabled** on both client devices and the session host. 

## Windows location service

All is about the famous **Windows location service**, which has been available since Windows 10. This service allows users to use their local location in websites and applications, e.g. for navigation requests or weather information. 

![This image shows the Edge location service](/assets/img/2022-06-23/2022-06-23-001.png)

![This image shows the Windows 11 weather widget location service](/assets/img/2022-06-23/2022-06-23-002.png)

>💡 Microsoft location service will use a combination of global positioning service (GPS), nearby wireless access points, cell towers, and your IP address (or default location) to determine your device’s location.

You can find a detailed description and documentation about the [Windows location service and privacy.](https://support.microsoft.com/en-us/windows/windows-location-service-and-privacy-3a8eee0a-5b0b-dc07-eede-2a5ca1c49088)

## How to enable Location service on Windows 11 for AVD

There are several ways to enable the location service on Windows 11 devices, including Windows 11 multi-session. In this post we will show the options (1) local settings, the (2) Intune configuration as well as the (3) registry key configuration. 

Let's start with the local setting, which are not enterprise-grade because it is done manually. 

### Via local settings

From the start menu search for **Location** and open the **Privacy & security > Location** settings then you need to switch the Location services to **On**. Additionally, you can specify the location settings for individual application or service. 

![This image shows the Windows 11 Privacy & security:Location panel](/assets/img/2022-06-23/2022-06-23-003.png)

Please verify that the option **"Let desktop apps access your location"** is enabled that is needed for native AVD client. 

![This image shows the Windows 11 "Let desktop apps access your location"](/assets/img/2022-06-23/2022-06-23-004.png)

### Via Intune Configuration Policy

Option (2) would be the ability to enable location services via the Intune configuration policy. We still focus on the **settings catalog** and not on the templates (ADMX, Custom & Co). 

The Settings Catalog is the only way to define configuration policies for Windows 10+ multisession (currently only System Settings). VDI is also supported with the settings catalog. It will be the next standard for configuration policies in the future. 

Please follow the description to create a new settings catalog for Windows 10+ VDI or multisession: [How to configure profiles](https://avdpunks.com/avd/2022/02/05/IntuneConfigOptForAVD.html#How-to-configure-profiles)

You can create a new configuration policy or add the setting to an existing policy. 

Search for **Allow Location** in the settings picker and select **Allow Location** in the results list. 

![This image shows the Intune Settings picker for Allow Location](/assets/img/2022-06-23/2022-06-23-005.png)

Next, select **Force Location On. All location privacy settings are toggled...** for the Allow Location setting on the Configuration Settings tab. 

![This image shows the Intune Settings Catalog to allow location](/assets/img/2022-06-23/2022-06-23-006.png)

If you have created a new policy, you must assign that policy to a user or device group. 

That is all to enable location services via Intune configuration policy.

### Via Registry Key

The (3) option is to add the following registry to the session host and to your local machine to enable location services:

```
Windows Registry Editor Version 5.00
[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\location]
"Value"="Allow"
```
## How to enable Location redirection for AVD

As a next step you have to configure the RDP Properties for your Hostpool and enable the redirection for the client location. 

In the Azure Portal, navigate to Azure Virtual Desktop, select your Hostpool, RDP Properties and add **redirectlocation:i:1** to your existing RDP properties in the **Advanced** tab:

```
redirectlocation:i:1
```

![This image shows the Azure Portal RDP Properties](/assets/img/2022-06-23/2022-06-23-007.png)

You can also enable this in the **Device redirection** tab and select **Enable location sharing from the local device and redirect to apps in the remote session** and click on **Save**.

![This image shows the Azure Portal RDP Properties](/assets/img/2022-06-23/2022-06-23-008.png)

> ⚠️ This is a host pool configuration and cannot be set individually per session host. 

Done! This is how to enable location redirection on AVD session host. 

## Look and feel

Let's see how it looks and feels. As soon as you logon to your AVD session host and open the browser or maps application you will see you local weather forecast and news. 

Our AVD session host is hosted in Azure Brazil South region, so everything will be displayed from Brazil.  With location redirection enabled, you can use their localization. 

Here are two examples of how location redirection looks and works:

1. Location redirection for Edge for navigation

https://user-images.githubusercontent.com/35801653/175242958-c5feb4f0-8398-49bd-836e-f44f38647893.mp4

2. Location redirection for the native Windows weather app

https://user-images.githubusercontent.com/35801653/175242979-be945135-8651-4b2e-9dfd-a0f080063a9a.mp4

![test123](https://user-images.githubusercontent.com/35801653/175242979-be945135-8651-4b2e-9dfd-a0f080063a9a.mp4)

## Limitations

This feature does not change the Bing or Google search results or news to your location, which only works with web proxy in the correct location. 

These websites are based on the public IP address of the client to show you the search results or news and not on the combination of Global Positioning Service (GPS).

## Conclusion

Even if it just a limited scope, it is an improvement for the overall user experience and since a couple of days the Azure Portal is showing new features in the RDP Properties section. 

Feel free to test the location redirection in your AVD environment. 

So stay tuned for more updates.

[Follow us on twitter!](https://twitter.com/avdpunks)

## Resources
 - [Configure Device Redirections](https://docs.microsoft.com/en-us/azure/virtual-desktop/configure-device-redirections)

 - [RDP Files](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/rdp-files)

 - [Compare RDP Clients](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-app-compare#other-redirection-devices-etc)
