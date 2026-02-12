---
layout: post
title: "How to support Microsoft 365 apps on multi-session OS from 2026"
description: "Understand the support timeline for Microsoft 365 Apps on Windows Server and plan your migration to Windows 11 multisession OS."
date: 2022-08-26
category: research
tags:
  - AVD
  - Azure Stack HCI
  - Office
reading_time: "5 min read"
featured_image: "https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2022-08-26-001.png"
source_url: "https://avdpunks.com/2022/08/26/how-to-support-microsoft-365-apps-on-multi-session-os-from-2026/"
source_title: "AVDPunks Original Post"
---

## Introduction

It's hard to read, but support for Microsoft 365 Apps on Windows Server 2019 ends in October 2025 and on Windows Server 2022 ends in October 2026.

![Flowchart to determine if multisession solution is needed](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2022-08-26-001.png)

Here are the official statements from Microsoft:

> Microsoft 365 Apps is supported on Windows Server 2019 only until October 2025.

> Microsoft 365 Apps is supported on Windows Server 2022 only until October 2026, which is when mainstream support ends for Windows Server 2022.

### What does this mean?

Microsoft 365 apps are no longer supported on Windows Server (Multisession OS) and you need to plan a migration path now to be ready in October 2026 if you want to use Multisession OS for your virtual desktop environments.

Otherwise, you can only use personal desktops based on Windows 11 Pro/Enterprise. This can be a good solution, but for most customers it is a capacity and budget discussion. Multisession environments combine user sessions on one virtual machine to save costs.

### The key question

Do I still need a multi-session solution with Microsoft 365 from October 2026?

If your answer is: "Yes, I need a multisession solution for my virtual desktops in the future," then there is only one option: **you need to switch to the Windows 11 multisession OS**.

Otherwise, there is no future support for Microsoft 365 Apps or Office LTSC on Windows Server 2019/2022.

## What are the options?

![Options flowchart for Windows 11 Multisession](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2022-08-26-002.png)

If your Windows 11 Multisession virtual machines are running on **Azure** or **Azure Stack HCI**, everything is fine and supported.

> **Note:** Other hosting solutions or other public cloud providers do not have support for Windows 11 Multisession OS.

## Conclusion

In summary, there are three options for supporting Microsoft 365 Apps on Windows 11 Multisession OS:

1. **Native Azure Virtual Desktop**
2. **Azure Stack HCI + AVD**
3. **Citrix Cloud on Azure / VMWare Horizon Cloud on Azure**

All other hosting platforms do not support Windows 11 Multisession OS.

**Timeline:**
- Windows Server 2022 supports Microsoft 365 Apps until **October 2026**
- Windows Server 2019 will not support Microsoft 365 applications from **October 2025**

Ultimately, you'll need to analyze your use cases and decide if you want to deploy everything in Windows 11 as a single-user OS or if you need a multisession OS.

**Start your research and planning sooner, before it's too late.**

## Resources

- [Microsoft 365 Apps migration from Windows Server](https://learn.microsoft.com/en-us/deployoffice/endofsupport/windows-server-migration)
- [Windows Server end of support and Microsoft 365 Apps](https://docs.microsoft.com/en-us/deployoffice/endofsupport/windows-server-support)
