---
layout: post
title: "Don't wait for the build to fail: How to check Azure Image Builder live log"
description: "Learn how to monitor Azure Image Builder progress in real time using Azure Container Instances live log streaming."
date: 2025-05-21
category: guide
tags:
  - AVD
  - Azure Image Builder
  - Custom Image Template
reading_time: "4 min read"
featured_image: "https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/image-15-1024x301.png"
source_url: "https://avdpunks.com/2025/05/21/dont-wait-for-the-build-to-fail-how-to-check-azure-image-builder-live-log/"
source_title: "AVDPunks Original Post"
---

If you've ever found yourself wondering, "Where can I actually see what's happening during the Azure Image Builder process?" — you're in good company. Until recently, the only way to check progress was to repeatedly download the customization.log from the packerlogs container. Tedious? Definitely.

But here's the good news: thanks to an Azure upgrade, the Azure Image Builder process now runs on Azure Container Instances (ACI) — and that means live log streaming is finally possible. No more guesswork. No more downloads. Just real-time visibility into your image builds.

## Why Live Logs Matter

Live logs help you:

- Monitor the progress of your image build in real time
- Identify and resolve errors early
- Validate that scripts and configurations are executing as expected

No more waiting for the build process to finish—access the live log file instantly to verify that all your customizations were applied successfully.

## How to check the live logs during the build process

Here's how you can view Azure Image Builder live logs directly in the Azure Portal:

1. Open your staging resource group from the Custom Image Template list

![How to access the staging resource group](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/image-15-1024x301.png)

2. Search for a temporary container instance that starts with "vmimagebuilder-build-container" and open this instance

![Container instances in the temporary resource group](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/image-16-1-1024x316.png)

3. Click on "Container" under "Settings" and then open "Logs" to view the live logs during the build process

![Containers logs option](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/image-17-1-1024x483.png)

> **Note:** The log view is not updated automatically, you have to click on the "Refresh" button.

If the build process has been completed successfully or has failed, the log file is saved in the temporary storage account in the staging resource group. And all other temporary resources are deleted immediately.

## Conclusion

Accessing live logs during the Azure Image Builder process provides valuable real-time insights into your image customization steps. By following the steps outlined above, you can monitor progress directly in the Azure Portal without waiting for the build to complete.

This not only speeds up troubleshooting but also ensures greater confidence in your automation workflows. Happy building!

## Resources

- [Troubleshoot Azure VM Image Builder - Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-troubleshoot)
- [View container group logs in a log analytics workspace - Microsoft Learn](https://learn.microsoft.com/en-us/azure/container-instances/viewing-logs-in-portal)
