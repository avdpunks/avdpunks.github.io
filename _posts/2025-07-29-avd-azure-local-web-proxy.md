---
layout: post
title: "Enabling AVD on Azure Local VMs with Web Proxy via PowerShell"
description: "Learn how to enable Azure Virtual Desktop (AVD) on Azure Local VMs with a mandatory web proxy using PowerShell automation."
date: 2025-07-29
category: guide
tags:
  - AVD
  - Azure Local
  - PowerShell
reading_time: "5 min read"
featured_image: "https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/virtual-desktop-azure-local-1-1024x576.png"
source_url: "https://avdpunks.com/2025/07/29/enabling-azure-virtual-desktop-avd-on-azure-local-vms-with-powershell/"
source_title: "AVDPunks Original Post"
---

![Low-level design of AVD on Azure Local with a web proxy](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/virtual-desktop-azure-local-1-1024x576.png)

Do you use a mandatory web proxy for Internet traffic in your environment and want to enable Azure Virtual Desktop (AVD) on your Azure Local VMs?

You may have encountered this challenge when adding new AVD session hosts on Azure Local to your host pool, as the AVD deployment wizard currently does not provide an option to configure a web proxy.

At present, you have two options:

1. Use an Azure ARM template to configure the web proxy during AVD VM deployment on Azure Local
2. First, deploy a new VM on Azure Local, configure the web proxy in the wizard, and then install the AVD agent to register the VM in your host pool—either through manual installation or via a PowerShell script

## What the Script does?

The `Install-AVD-Agent.ps1` script automates the download and installation of the AVD Agent and Bootloader. It uses a mandatory registration token to securely register your VM with the AVD host pool.

> **Note:** Outbound internet traffic is required to download the AVD agent and bootloader sources.

The script:
- Handles errors gracefully to ensure smooth deployment
- Downloads the latest AVD Agent and Bootloader installers
- Installs both components silently

Download the script from the [AVDPunks GitHub repository](https://github.com/avdpunks/public/blob/main/Install-AVD-Agent.ps1).

## How to Use

1. Open PowerShell on your VM or run the script remotely
2. Run the script with your registration token:

```powershell
.\Install-AVD-Agent.ps1 -AVDRegistrationToken "<your_regtoken_here>"
```

> **Note:** You must first create an AVD host pool registration token in the portal or using PowerShell.

Here is an example PS snippet for downloading and running the script via the Run Azure VM command option:

```powershell
$AVDRegistrationToken = "<your_regtoken_here>"
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/avdpunks/public/refs/heads/main/Install-AVD-Agent.ps1' -OutFile 'c:\windows\temp\Install-AVD-Agent.ps1'
Start-Sleep -Seconds 10
Set-Location -Path c:\windows\temp\
& .\Install-AVD-Agent.ps1 -AVDRegistrationToken $AVDRegistrationToken
```

## Conclusion

Configuring a web proxy for AVD VMs can be streamlined using either an ARM template during deployment or by manually setting up the proxy before installing the AVD agent. Leveraging the `Install-AVD-Agent.ps1` script ensures a secure, automated, and error-resilient installation process.

## Resources

- [Azure Virtual Desktop for Azure Local - Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/hybrid/azure-local-workload-virtual-desktop)
- [Create Azure Local virtual machines enabled by Azure Arc](https://learn.microsoft.com/en-us/azure/azure-local/manage/create-arc-virtual-machines)
