---
layout: post
title:  "Azure Virtual Desktop x Windows 365 x Windows Insider Program"
date:   2024-03-07 16:00:00 +0100
categories: AVD
tags: [AVD,W365,InsiderBuild]
---
# Azure Virtual Desktop (#AVD) x Windows 365 (#W365) x Windows Insider Program

![This image shows the AVDPunk Header](/assets/img/2024-03-07/2024-03-07-000.png)

## Table of contents
1. [How to enable the Windows Insider Preview Build](#How-to-enable-the-Windows-Insider-Preview-Build)
2. [How to use Windows Insider Preview Build iso images](#How-to-use-Windows-Insider-Preview-Build-iso-images)
3. [Resources](#resources)

## How to enable the Windows Insider Preview Build

Are you interested in getting early access to new features and updates for Windows? 

If so, you might want to consider joining the [**Windows Insider Program**](https://www.microsoft.com/de-de/windowsinsider/). This program allows you to preview builds of the upcoming release of Windows and provide feedback to help shape the future of the operating system.

Here’s how to enable the Windows Insider Preview Build:

1. Open the **Settings app** on your Windows 11 AVD session host or W365 Cloud PC and navigate to the **Windows Updates** section.

![This image shows the Windows 11 settings app](/assets/img/2024-03-07/2024-03-07-001.png)

2. Click on **Windows Insider Program** option on the left side of the screen.

![This image shows the Windows Insider Program](/assets/img/2024-03-07/2024-03-07-002.png)

3. First you must activate **the optional diagnostic data** and then click on **Get started**.

![This image shows the Windows Insider Program - Get started](/assets/img/2024-03-07/2024-03-07-003.png)

4. Follow the prompts to **link your Microsoft account** and **choose your Insider build**. 

You can choose between the following builds:
- [Canary Channel](https://blogs.windows.com/windows-insider/2024/02/14/announcing-windows-11-insider-preview-build-26058-canary-and-dev-channels/): For highly technical users and for updates in an early development cycle
- [Dev Channel](https://blogs.windows.com/windows-insider/2024/02/14/announcing-windows-11-insider-preview-build-26058-canary-and-dev-channels/): For the earliest access to new features
- [Beta Channel](https://blogs.windows.com/windows-insider/2024/03/04/announcing-windows-11-insider-preview-build-22635-3276-beta-channel/): for slightly more stable builds
- [Release Preview Channel](https://blogs.windows.com/windows-insider/2024/02/15/releasing-windows-11-builds-22621-3227-and-22631-3227-to-the-release-preview-channel/): for the most stable preview builds

![This image shows the different insider builds](/assets/img/2024-03-07/2024-03-07-004.png)

>**Note:** For the [AVD Public Preview clipboard transfer direction and data types](https://learn.microsoft.com/en-us/azure/virtual-desktop/clipboard-transfer-direction-data-types?tabs=registry) you need the Dev-Channel Insider Preview Build (25898 or higher).

5. Once you’ve chosen your Insider Preview build, your Windows 11 device will begin **downloading the latest Insider Preview Build**. This may take some time, depending on your internet connection.

![This image shows the Windows Update downloading the insider build](/assets/img/2024-03-07/2024-03-07-005.png)

After the **download is complete**, you’ll need to **restart your PC to install the new build**.


![This image shows the Windows Update to restart now](/assets/img/2024-03-07/2024-03-07-006.png)

**That’s it!** 

**You’re now part of the Windows Insider Program** and will receive regular updates with new features and improvements. 

Remember to **provide feedback to help** shape the future of Windows.

>**Note:** Keep in mind that Insider Preview Builds may be less stable than regular releases and could potentially cause issues with your AVD session host or W365 Cloud PC. Make sure to back up your important data before joining the program.

## How to use Windows Insider Preview Build iso images

1. Open the [**Windows Insider Preview Downloads**](https://www.microsoft.com/en-us/software-download/windowsinsiderpreviewiso) and **login with your Microsoft account**.

![This image shows the Windows Insider Preview Downloads](/assets/img/2024-03-07/2024-03-07-007.png)

2. Scroll down to **select the edition** you want to download, e.g. Windows 11 Insider Preview (Dev Channel), and click **Confirm**.

![This image shows the Windows Insider Preview Downloads - Select Editon](/assets/img/2024-03-07/2024-03-07-008.png)

3. Select the **product language** and click **Confirm** again. 

![This image shows the Windows Insider Preview Downloads - Select Product Language](/assets/img/2024-03-07/2024-03-07-009.png)

4. **Download** the select Windows Insider build. This may take some time, depending on your internet connection.

![This image shows the Windows Insider Preview Downloads - Download](/assets/img/2024-03-07/2024-03-07-010.png)









## Resources

- [Join the Windows Insider Program and manage Insider settings](https://support.microsoft.com/en-us/windows/join-the-windows-insider-program-and-manage-insider-settings-ef20bb3d-40f4-20cc-ba3c-a72c844b563c)
- [Announcing Windows 11 Insider Preview Build 26058 (Canary and Dev Channels)](https://blogs.windows.com/windows-insider/2024/02/14/announcing-windows-11-insider-preview-build-26058-canary-and-dev-channels/)
- [Releasing Windows 11 Builds 22621.3227 and 22631.3227 to the Release Preview Channel](https://blogs.windows.com/windows-insider/2024/02/15/)
- [The Windows Insider Program](https://www.microsoft.com/de-de/windowsinsider/)