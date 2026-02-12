---
layout: post
title: "How to Use Dev Box Image with Windows 365"
description: "Learn how to create a managed image from Microsoft Dev Box and deploy it to Windows 365 Cloud PCs as Dev Box capabilities transition to Windows 365."
date: 2025-10-21
category: guide
tags:
  - Windows365
  - Dev Box
  - Custom Image
reading_time: "7 min read"
source_url: "https://avdpunks.com/2025/10/21/how-to-use-devbox-image-with-windows-365/"
source_title: "AVDPunks Original Post"
---

Setting up a consistent and ready-to-code development environment can be time-consuming, especially when onboarding new developers in cloud-first organizations. Microsoft Dev Box is a desktop-as-a-service (DaaS) solution designed specifically for developers, providing self-service access to ready-to-code cloud workstations.

But in early October 2025, Microsoft announced that Dev Box capabilities are being integrated into Windows 365. As part of this transition, starting November 1, 2025, it will no longer be possible to initiate new Dev Box projects or deployments.

In this blog post, we'll walk through a workaround that enables you to leverage the Microsoft Dev Box Gallery image by creating a managed image, importing it into Windows 365, and deploying it to your Cloud PCs.

## Create a Managed Image from the Dev Box Image

To build a managed image based on the Microsoft Dev Box Marketplace offering, start by creating a new virtual machine. This image comes preloaded with essential developer tools, including:

- Visual Studio 2022 (Community, Professional, or Enterprise)
- Visual Studio Code
- Windows Subsystem for Linux (WSL)
- Additional productivity and development utilities

In the Virtual Machine Wizard, under Image, select "Show all images," search for "Visual Studio 2022 (Microsoft Dev Box)", and then select the image you want.

> **Note:** Please verify that the security type is set to "Standard", as managed images do not currently support trusted boot.

Then complete the VM creation process with your settings.

Run the following PowerShell commands to generalize the VM with Sysprep:

```powershell
#Run SysPrep
Start-Process -FilePath "C:\Windows\System32\Sysprep\Sysprep.exe" -ArgumentList "/oobe /generalize /shutdown" -NoNewWindow -Wait
```

After successfully running the Sysprep command, the VM status will show "Stopped". To complete the deallocation, click "Stop".

When the VM is in the "Stopped (deallocated)" state, click "Capture" and select "Image". Select your resource group, "No, capture only a managed image", and enter a unique name.

## Import a managed Image to Windows 365 custom images

Open the Windows 365 admin panel in Intune and select "Custom images" and then "+ Add" to upload a new image version.

Enter an image name and version, then select your Azure subscription and source image (managed image).

> **Note:** The Windows 365 service principal must have the Azure Subscription Reader role to read the managed images.

Click "Add" to start the upload process. The upload process takes a while.

## Deploy new Dev Box Cloud PCs

Once your custom image has been successfully uploaded, you can deploy new Dev Box Cloud PCs by creating a new Windows 365 provisioning policy.

On the "Image" tab, change the image type to "Custom Image" and select your image. Continue with the creation of the provisioning policy.

After provisioning, the user can log in to the Windows app to connect to the new Dev Box Cloud PC with all developer tools installed.

Enjoy coding! 😉

## Conclusion

As Microsoft transitions Dev Box capabilities into Windows 365, developers should prepare for this change by adapting their workflows. By importing the Dev Box images into Windows 365 and deploying them to Cloud PCs, teams can maintain a consistent, ready-to-code environment without disruption.

## Resources

- [Microsoft Dev Box capabilities are coming to Windows 365 - Microsoft Learn](https://learn.microsoft.com/en-us/azure/dev-box/dev-box-windows-365-announcement)
- [Device images in Windows 365 - Microsoft Learn](https://learn.microsoft.com/en-us/windows-365/enterprise/device-images)
- [Add or delete custom device images for Windows 365 - Microsoft Learn](https://learn.microsoft.com/en-us/windows-365/enterprise/add-device-images)
