---
layout: post
title:  "Windows 365 USB and device redirection"
date:   2024-01-04 15:30:00 +0100
categories: W365
tags: [HPC,W365,RemoteFX,Intune]
---
# Windows 365 Custom USB and device redirection

![This image shows the AVDPunk Header](/assets/img/2024-01-04/2023-12-21-003-Header.png)

## Table of contents
1. [Introduction](#Introduction)
2. [Device redirection overview](#Device-redirection-overview)
3. Step 1. [Configure your Windows 365 Cloud PC](#step-1-configure-your-windows-365-cloud-pc)
4. Step 2. [Configure your local Windows PC](#step-2-configure-your-local-windows-pc)
5. Step 3. [Testing](#step-3-testing)
6. [Conclusion](#Conclusion)
7. [Resources](#resources)

## Introduction
Transitioning to a Cloud PC was never that easy and since Microsoft is using the Remote Desktop Protocol (RDP) users can connect peripherals like cameras, USB drives, and printers from remote devices.

To understand which redirections are supported on which platform, I recommend to check this doc [Compare the clients](https://learn.microsoft.com/en-us/windows-365/enterprise/manage-rdp-device-redirections). This articel and the setting only work with a Windows Client ([Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/users/connect-windows), [Windows 365](https://support.microsoft.com/en-gb/windows/installing-the-windows-365-app-cbb0d4d5-69d4-4f00-b050-6dc7a02d02d0) or [Windows App](https://learn.microsoft.com/en-gb/windows-app/overview)).

USB redirections is becoming even more relevant when thinking of graphic intense workloads, especially with Microsoft announcement and preview for [Windows 365 GPU](https://learn.microsoft.com/en-us/windows-365/enterprise/gpu-cloud-pc) support. 

This workloads and cloud engineering workspaces often come with special devices like the Spacemouse. In this post we cover the  advanced RemoteFX USB settings, which enable you to redirect these devices and an improved user experience.

>**Note:** Of course, this applies to other USB devices too.😊

## Device redirection overview
Windows 365 and RDPs allow us to use specific types of devices effectively in a remote session, e.g.:
- Easy Print, which allows users to print to local printers in remote sessions
- Drive Redirection, which allows users to access the file system on any local drive in a remote session, including USB drives
- Smart Card Redirection, which allows users to authenticate to and in a remote session by using smart cards/e-tokens
- Plug-and-Play Device Redirection, which allows users to access PTP digital cameras, MTP music players, and POS for .NET devices in a remote session, among others
- Input Redirection, which allows the use of keyboards/mice in remote sessions
- Audio Redirection, which allows recording and playback of audio in remote sessions
- Port Redirection, which allows the use of serial and parallel ports in remote sessions

However, there are many devices like the spacemouse, printers webcams, scanners and more which are not covered by this redirections.

>**Note:** RemoteFX USB redirection compliments your high-level redirection and doesn't replace them.

## Device redirections compared

| RemoteFX USB Redirection | RDP High-Level Device Redirection | 
| --------------- | --------------- | 
| Does not require drivers on the local client | Requires drivers for the device to be installed on the local client| 
| Requires the device driver to be installed on the session host or cloud pc | Generally does not require drivers on the session host or cloud pc | 
| Uses one redirection method for many types of devices | Uses a specific, unique method for each type of device being redirected | 
| Forwards [URBs](https://learn.microsoft.com/en-us/windows-hardware/drivers/usbcon/communicating-with-a-usb-device) to and from the device over the RDP connection | Exposes high-level device functionality in the remote session by using an optimized protocol for the device type | 
| Enables ONLY ONE session to use a device at a given time; the local client cannot use the device while an RDP session is using it | Enables any number of sessions to access the device simultaneously, including the local client |  

## Advanced USB and device redirection configuration on your Cloud PC ##
### Step 1. Configure your Windows 365 Cloud PC ##
1. Open run with **Windows + R** and enter **gpedit.msc**. Open the "Local Group Policy Editor".

2. From the navigation tree on the left, select: **Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Device and Resource Redirection**. Open **Do not allow supported Plug and Play device redirection** and select **Allow plug&play device redirection**

![2023-12-21-000.png](/assets/img/2024-01-04/2023-12-21-000.png)

3. Choose the **Disabled** option and click **OK** in the pop-up window as shown below.disabled do not allow plug and play device redirection

>**Note:** Yes, it's Disabled. Double negative. 🫣

4. Next navigte to **Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Services Session Host > Remote Session Environment > RemoteFX for Windows Server 2008 R2**. Open **Configure RemoteFX** and select **Enabled**

![2023-12-21-004.png](/assets/img/2024-01-04/2023-12-21-004.png) 

5. **Restart** your session host or Cloud PC to apply the changes. 

>**Note:** Yes! since Windows 365 is fully integrted into Intune. Simply create a Windows 10 and later, device profile and use the Settings picker to configure the settings.

![MEMConfig](/assets/img/2024-01-04/2023-12-21-005.png)

>**Note:** Or you can set this via PowerShell.
```
    $RegistryPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services"
    Set-ItemProperty -Path $RegistryPath -Name "fEnableVirtualizedGraphics" -Value 1 -Type DWord
    Set-ItemProperty -Path $RegistryPath -Name "fDisablePNPRedir" -Value 0 -Type DWord
    Restart-Computer -Force
```

### Step 2. Configure your local Windows PC ###
The RemoteFX USB redirection feature is disabled by default so lets enable it. 

1. On your client run **gpedit.msc**.

2. Open: **Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Connection Client\RemoteFX USB Redirection**.

![2023-12-21-001.png](/assets/img/2024-01-04/2023-12-21-001.png)

3. Set **Allow RDP redirection of other supported RemoteFX USB devices from this computer** to **Enabled** and select **Administrators and Users**. Click **OK** and finish the configuration.

4. Finally run **gpupdate /force** to update the machine’s policy.

>**Note:** Of course, you can use Intune here as well. 

![MEMConfig](/assets/img/2024-01-04/2023-12-21-002.png)

>**Note:** or you can set this via PowerShell.

```
    $RegistryPath = "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services\Client"
    Set-ItemProperty -Path $RegistryPath -Name "fUsbRedirectionEnableMode" -Value 2 -Type DWord
    Restart-Computer -Force
```

## Step 3. Testing
Last but least, connect via a Windows App (Azure Virtual Desktop, Windows 365 or Windows App) to your Cloud PC. You will see a new icon in the connection bar to connect your #USBDEVICE. Make sure the device is not in use by any local application, otherwise the redirection will not work.

Devices can't be used on both local devices and the remote session simultaneously. A device can either be mapped locally or into the virtual desktop. And make sure you install the driver on the virtual desktop in case the device is not a "plug and play" device.

![WindowsApp](/assets/img/2024-01-04/2023-12-21-003.png)

## Conclusion ## 
Windows 365 GPU support will be another game-changer for engineering and graphic intense workloads in the cloud. 

With the RemoteFX Settings you can further increase the user experience by redirecting not only Plug and Play devices to your Cloud PC.

This settings act as a catch-all mechanism that redirects these USB devices! Unlike high-level redirections such as drive redirection, RemoteFX USB redirection happens at the port protocol level, and is similar to how one can redirect serial or parallel ports via RDP. 

RemoteFX USB redirection is meant to supplement high-level redirections, not to supplant them. By combining RemoteFX USB redirection with RDP high-level device redirections, you can have the best of both worlds. 

## Resources ##
- [RemoteFX Wikipedia](https://en.wikipedia.org/wiki/RemoteFX)
- [Community Posts](https://docs.microsoft.com/en-us/virtualization/community/team-blog/2010/20100317-explaining-microsoft-remotefx)
- [RDP Properties](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/rdp-files)
- [Supported Clients](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-app-compare#redirection-support)
- [Communicating with USB Devices](https://learn.microsoft.com/en-us/windows-hardware/drivers/usbcon/communicating-with-a-usb-device)
