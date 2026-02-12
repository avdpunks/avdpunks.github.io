---
layout: post
title: "Windows 365 Custom USB and Device Redirection"
description: "A guide to enhance remote session experiences with Windows 365 using RemoteFX USB settings for device redirection."
date: 2024-01-04
category: guide
tags:
  - Windows365
  - RemoteFX
  - USB Redirection
reading_time: "8 min read"
featured_image: "https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2023-12-21-000.png"
source_url: "https://avdpunks.com/2024/01/04/19/"
source_title: "AVDPunks Original Post"
---

## Introduction

Transitioning to a Cloud PC was never that easy and since Microsoft is using the Remote Desktop Protocol (RDP) users can connect peripherals like cameras, USB drives, and printers from remote devices.

USB redirections is becoming even more relevant when thinking of graphic intense workloads, especially with Microsoft announcement and preview for Windows 365 GPU support.

These workloads and cloud engineering workspaces often come with special devices like the Spacemouse. In this post we cover the advanced RemoteFX USB settings, which enable you to redirect these devices and improve user experience.

## Device redirection overview

Windows 365 and RDP allow us to use specific types of devices effectively in a remote session:

- **Easy Print** - allows users to print to local printers in remote sessions
- **Drive Redirection** - allows users to access the file system on any local drive, including USB drives
- **Smart Card Redirection** - allows users to authenticate using smart cards/e-tokens
- **Plug-and-Play Device Redirection** - allows users to access PTP digital cameras, MTP music players, and POS for .NET devices
- **Input Redirection** - allows the use of keyboards/mice
- **Audio Redirection** - allows recording and playback of audio
- **Port Redirection** - allows the use of serial and parallel ports

However, there are many devices like the spacemouse, printers, webcams, scanners and more which are not covered by these redirections.

> **Note:** RemoteFX USB redirection complements your high-level redirection and doesn't replace them.

## Advanced USB and device redirection configuration

### Step 1: Configure your Windows 365 Cloud PC

1. Open run with Windows + R and enter `gpedit.msc`
2. Navigate to: Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Device and Resource Redirection
3. Open "Do not allow supported Plug and Play device redirection" and select **Disabled**

![Do not allow supported Plug and Play device redirection GPO setting](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2023-12-21-000.png)

> **Note:** Yes, it's Disabled. Double negative. 🫣

4. Navigate to: Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Remote Session Environment > RemoteFX for Windows Server 2008 R2
5. Open "Configure RemoteFX" and select **Enabled**

![Configure RemoteFX GPO setting enabled](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2023-12-21-004.png)

6. Restart your session host or Cloud PC

Or you can set this via PowerShell:

```powershell
$RegistryPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services"
Set-ItemProperty -Path $RegistryPath -Name "fEnableVirtualizedGraphics" -Value 1 -Type DWord
Set-ItemProperty -Path $RegistryPath -Name "fDisablePNPRedir" -Value 0 -Type DWord
Restart-Computer -Force
```

### Step 2: Configure your local Windows PC

1. On your client run `gpedit.msc`
2. Open: Computer Configuration\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Connection Client\RemoteFX USB Redirection
3. Set "Allow RDP redirection of other supported RemoteFX USB devices from this computer" to **Enabled** and select "Administrators and Users"
4. Run `gpupdate /force` to update the machine's policy

Or via PowerShell:

```powershell
$RegistryPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services\Client"
Set-ItemProperty -Path $RegistryPath -Name "fUsbRedirectionEnableMode" -Value 2 -Type DWord
Restart-Computer -Force
```

### Step 3: Testing

Connect via Windows App to your Cloud PC. You will see a new icon in the connection bar to connect your USB device. Make sure the device is not in use by any local application.

![Windows App connection bar with USB device icon](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2023-12-21-003.png)

Devices can't be used on both local devices and the remote session simultaneously.

## Conclusion

Windows 365 GPU support will be another game-changer for engineering and graphic intense workloads in the cloud.

With the RemoteFX Settings you can further increase the user experience by redirecting not only Plug and Play devices to your Cloud PC.

RemoteFX USB redirection is meant to supplement high-level redirections, not to supplant them. By combining RemoteFX USB redirection with RDP high-level device redirections, you can have the best of both worlds.

## Resources

- [RemoteFX Wikipedia](https://en.wikipedia.org/wiki/RemoteFX)
- [Community Posts](https://techcommunity.microsoft.com/t5/security-compliance-and-identity/introducing-microsoft-remotefx-usb-redirection-part-1/ba-p/247035)
- [Supported Clients](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-app-compare)
