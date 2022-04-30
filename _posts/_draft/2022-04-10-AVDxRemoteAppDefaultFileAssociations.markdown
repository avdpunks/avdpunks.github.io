---
layout: post
title:  "Azure Virtual Desktop x RemoteApp Default File Associations"
date:   2022-04-10 10:00:00 +0100
categories: AVD
tags: [AVD,RemoteApp]
---
# Azure Virtual Desktop (#AVD) x RemoteApp Default File Associations


![This image shows the AVDPunk Header](/assets/img/2022-03-15/2022-03-15-001.png)


## Table of contents
1. [Introduction](#Introduction)
2. [Device redirection overview](#Device-redirection-overview)
3. [Device redirections compared](#Device-redirections-compared)
4. [What is RemoteFX](#What-is-remotefx)
5. [RemoteFX Configuration](#RemoteFX-configuration)
6. [Conclusion](#Conclusion)

## Introduction
What is a Cloud Engineering Workspace without the loved engineering pheripherie device, the Spacemouse? In this post we cover all essentials around the RemoteFX USB redirection in an Azure Virtual Desktop (AVD) or Remote Desktop environement and how to configure it.

*Note: Ofcorse this applies to other USB devices too.* 😊

## Device redirection overview
AVD and the RDP allow us to use specific types of devices effectively in a remote session, e.g.:
- Easy Print, which allows users to print to local printers in remote sessions
- Drive Redirection, which allows users to access the file system on any local drive in a remote session, including USB drives
- Smart Card Redirection, which allows users to authenticate to and in a remote session by using smart cards/e-tokens
- Plug-and-Play Device Redirection, which allows users to access PTP digital cameras, MTP music players, and POS for .NET devices in a remote session, among others
- Input Redirection, which allows the use of keyboards/mice in remote sessions
- Audio Redirection, which allows recording and playback of audio in remote sessions
- Port Redirection, which allows the use of serial and parallel ports in remote sessions

These high-level redirections can be controlled and resitricted via the [RDP Properties](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/rdp-files) directly from the portal.

However, there are many devices like the spacemouse, printers webcams, scanners and more which are not covered by this redirections.
RemoteFX USB redirection enables you to redirect these devices and brings you the best of both worlds and an improved user experience.
*Note* RemoteFX USB redirection compliments your high-level redirection and doesn't replace them.

Here is a table that compares and contrasts the two forms of redirection.

## Device redirections compared
| RemoteFX USB Redirection | RDP High-Level Device Redirection |
| --------------- | --------------- |
| No drivers are required on the client machine | Driver installation is required on the client machine |
| One redirection method regardless of device type | Specific redirection methods based on the device type
 |
| Forwards URBs to/from the device via RDP connection | Exposes high-level device functionality within remote sessions via optimized protocols based on the device type |
| Devices can only be used during one RDP session at a time (i.e: another client machine cannot use the USB device while it’s in use during another remote session) | Multiple remote desktop sessions can access and control a device simultaneously (this includes the local client, too) |
| RemoteFX is optimized for Local Area Networks (LAN) | RDP high-level device redirection functions on both WAN and LAN networks |

## What is RemoteFX?
RemoteFX was invented and developed by Calista Technologies and quickly acquired by Microsoft in 2008. 

It  was released in 2011 as part of Service Pack 1 (SP1) for Windows Server 2008 R2 and Windows. 
It was designed to deliver a rich user experience and graphic hardware support to Hyper-V virtual machines (VMs).
Over the last 9+ years, RemoteFX improved the overall user experience during a remote desktop session and let users enjoy high-quality media support, audio-synchronization, graphics, and RemoteFX USB redirection.

With new features like Adaptive Graphics, RemoteFX Multi-Touch, RemoteFX Media Redirection, and RemoteFX for WAN the RDP Protocol and experience improved massivley. 

With Windows Server 2012, and subsequent releases including RemoteFX in Windows 10, RemoteFX was designed with more default features that made it simpler and easier to use.

## RemoteFX Configuration ##
## Enable RemoteFX on your AVD session hosts ##
1. Open run with **Windows + R** and enter **gpedit.msc**. Open the "Local Group Policy Editor".

2. From the navigation tree on the left, select: **Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Device and Resource Redirection**. Open **Do not allow supported Plug and Play device redirection** and select **Allow plug&play device redirection**

![2022-03-01-000.png](/assets/img/2022-03-01/2022-03-01-000.png)

3. Choose the **Disabled** option and click **OK** in the pop-up window as shown below.disabled do not allow plug and play device redirection

4. **Restart** your session host to apply the changes

## Enable RemoteFX USB redirection in Windows 10/Windows 11 ##
The RemoteFX USB redirection feature is disabled by default so lets enable it. 

1. On your client run **gpedit.msc**.

2. Open: **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Connection Client\RemoteFX USB Redirection**.

![2022-03-01-001.png](/assets/img/2022-03-01/2022-03-01-001.png)

3. Set **Allow RDP redirection of other supported RemoteFX USB devices from this computer** to **Enabled** and specify which users have RemoteFX USB device redirection permission. Click **OK** and finish the configuration.

4. Finally run “gpupdate /force” to update the machine’s policy.

Note: Ofcorse you can use the Group Policy Management to configure this settings via Active Directory Group Policies 😊.
After creating and configuring a new policy, link the policy to the Organizational Unit of the target machine’s location.

OR you use Microsoft Endpoint Configuration Manager (#MEM) to configure this settings.

![MEMConfig](/assets/img/2022-03-01/2022-03-01-002.png)

Lastly, connect your spacemouse to you device, make sure it's not in use by any local application and enjoy it in you remote session💡.

## Conclusion ##
RemoteFX acts as a catch-all mechanism that redirects these USB devices! Unlike high-level redirections such as drive redirection, RemoteFX USB redirection happens at the port protocol (USB request block or URB) level, and is similar to how one can redirect serial or parallel ports via RDP. This provides some unique advantages, as you’ll see below. However, RemoteFX USB redirection is meant to supplement high-level redirections, not to supplant them. By combining RemoteFX USB redirection with RDP high-level device redirections, you can have the best of both worlds. 

## Resources ##
https://en.wikipedia.org/wiki/RemoteFX
https://docs.microsoft.com/en-us/virtualization/community/team-blog/2010/20100317-explaining-microsoft-remotefx