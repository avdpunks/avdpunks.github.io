---
layout: post
title:  "How to support Microsoft 365 apps on multi-session OS from 2025?"
date:   2022-08-26 14:00:00 +0100
categories: AVD
tags: [AVD,Microsoft365,AzureStackHCI,Azure]
---
# How to support Microsoft 365 apps on multi-session OS from 2025?

![This image shows the AVDPunk Header](/assets/img/2022-08-26/2022-08-26-000.png)

## Table of contents
1. [Introduction](#Introduction)
2. [What are the options?](#What-are-the-options)
3. [Conclusion](#Conclusion)

## Introduction

It's hard to read, but support for Microsoft 365 Apps on Windows Server 2019 ends in October 2025 and there is no support on Windows Server 2022. 

Here are the official statements from Microsoft documentation:
> Microsoft 365 Apps is supported on Windows Server 2019 only until October 2025.

> Microsoft 365 Apps isn’t supported on Windows Server 2022.

All statements and dates of the end of support can be find here: [Windows Server end of support and Microsoft 365 Apps](https://docs.microsoft.com/en-us/deployoffice/endofsupport/windows-server-support)

**What does this mean?**

Microsoft 365 apps are no longer supported on Windows Server (Multisession OS) and you need to **plan a migration path now to be ready in October 2025** if you want to use Multisession OS for your virtual desktop environments. 

Otherwise, you can only use personal desktops based on Windows 11 Pro/Enterprise. This can be a good solution, but for most customers it is a capacity and budget discussion. Multisession environments combine user sessions on one virtual machine to save costs and take benefit of scaling features. 

**And now?**

You must ask you the following question:

**Do I still need a multi-session solution with Microsoft 365 from October 2025?**

Please follow this flowchart to find your answer:

![Microsoft 365 Apps / Office support from Oct 25](/assets/img/2022-08-26/2022-08-26-001.png)

If you want to use Windows Server 2022 as your base operating system, you'll need to move to the Office LTSC build, but even that support ends a year later in October 2026. Furthermore, Office LTSC requires an additional license and is not included in existing Microsoft 365 plans.

If your answer is: "Yes, I need a multisession solution for my virtual desktops in the future," then there is **only one option**: you need to switch to the **Windows 11 multisession OS**. 

What are the options to achieve this approach? 

## What are the options?

You will find your answer in the following flowchart:

![This image shows the AVDPunk Header](/assets/img/2022-08-26/2022-08-26-002.png)

If your Windows 11 Multisession virtual machines are running on **Azure or** [**Azure Stack HCI**](https://docs.microsoft.com/en-us/azure/virtual-desktop/azure-stack-hci-overview), everything is fine and supported. That is a fact for now. 

**Other hosting solutions or other public cloud providers do not have support for Windows 11 Multisession OS.** 

## Conclusion

In summary, there are three options for supporting Microsoft 365 Apps on Windows 11 Multisession OS from October 2025. 

These options are native **Azure Virtual Desktop, Azure Stack HCI + AVD (currently public preview)**, and **Citrix Cloud on Azure / VMWare Horizon Cloud on Azure**. 

All other hosting platforms do not support Windows 11 Multisession OS from October 2025.

Windows Server 2022 does not support Microsoft 365 today. 

And Windows 2019 will not support Microsoft 365 applications from October 2025. 

Ultimately, you'll need to analyze your use cases and decide if you want to deploy everything in Windows 11 as a single-user OS or if you need a multisession OS.

**Start your research and planning sooner, before it's too late.**

> This blog post is only to clarify the current situation of Microsoft 365 Apps on Multisession OS from October 2025.
