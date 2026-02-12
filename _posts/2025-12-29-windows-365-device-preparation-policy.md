---
layout: post
title: "Windows 365 Frontline Shared: How to Use Device Preparation Policy for Cloud PC Deployments"
description: "Learn how to use the Windows Autopilot Device Preparation Policy with Windows 365 Frontline in Shared Mode to ensure every Cloud PC is fully configured before users sign in."
date: 2025-12-29
category: guide
tags:
  - Windows365
  - Frontline Shared
  - Device Preparation Policy
  - Intune
reading_time: "10 min read"
source_url: "https://avdpunks.com/2025/12/29/windows-365-frontline-shared-how-to-use-device-preparation-policy-for-cloud-pc-deployments-preview/"
source_title: "AVDPunks Original Post"
---

This article is part of the Windows 365 Frontline Shared series.

The Device Preparation Policy for Cloud PC deployments is currently in preview and available for all Windows 365 editions, Enterprise and Frontline, in both Dedicated and Shared Mode. But why is a Device Preparation Policy so important? Because it ensures that all required apps, configurations, and scripts are applied before users sign in to their Windows 365 Cloud PCs, delivering a consistent and ready-to-use experience from the very first login.

This blog article focuses on using the Autopilot Device Preparation Policy together with Windows 365 Frontline in Shared Mode to ensure that every Cloud PC is fully prepared before users sign in.

## Requirements

Please review the Windows Autopilot device preparation requirements, including networking, software, licensing, and other prerequisites.

## Assign the Intune Provisioning Client Service Principal to the Device Group

Autopilot Device Preparation requires the Intune Provisioning Client service principal to be an Owner of the assigned device group. You can either create a new assigned device group or use an existing one and grant ownership to the service principal.

> **Note:** If you can't find the Intune Provisioning Client service principal in your tenant, search for the App ID `f1346770-5b25-470b-88bd-d5744ab7952c`.

> **Note:** Windows Autopilot device preparation doesn't use dynamic groups.

During Windows Autopilot device preparation, devices are automatically added to this device group. You don't need to manually add devices as members.

## Create a Device Preparation Policy for Cloud PC

1. Open the Intune Device Enrollment page, go to Windows, and select **Device preparation policies**
2. Click **Create** and then select **Automatic (Preview)** as the device preparation policy type
3. Enter a unique name that describes your use case for Windows 365 Cloud PC and click **Next**
4. Search for your assigned device group, then select it from the results and click **Next**

In the Configuration settings tab, you can select up to 10 apps and up to 10 scripts to include in the device preparation policy. These will be installed before the Cloud PC is ready for the user to connect.

Click **Add** in the Apps or Scripts section. Install the apps in the system context to ensure they're available for all users.

> **Note:** You must also assign all selected apps and scripts to your Windows 365 Cloud PC device groups, otherwise the apps or scripts will be skipped in the device preparation policy.

After selecting all your apps and scripts, click **Save**. Review the overview details, then click **Next**.

## Assign Device Preparation Policy to Windows 365 Provisioning Policy

Your previously created device preparation policy must be assigned to your Windows 365 provisioning policy, otherwise the preparation policy will not be applied.

During the provisioning policy setup, select your device preparation policy in the Configuration tab. Then specify a timeout and enable the option to prevent users from connecting to the Cloud PC if installation fails or the timeout is reached.

When you modify an existing provisioning policy, you must reprovision all Cloud PCs to ensure they are prepared as expected.

## Monitor Device Preparation Policy Status

Open the Intune Device Enrollment page, go to **Monitor**, and select **Windows Autopilot device preparation deployment status** to view all devices that have applied a device preparation policy.

Select the device you want to review. You can now see the status of all assigned apps and scripts from the device preparation policy.

## User Experience during the Reprovisioning Process

What is the user experience during the reprovisioning process? Users receive an informational message in the Windows app indicating that the preparation process is active.

When users select View resources, the Windows app displays all cloud apps, but they are not accessible at this stage.

## Conclusion

The Device Preparation Policy brings important improvements to Windows 365 deployments by ensuring that apps, scripts, and configurations are applied before a user's first sign-in. This is especially valuable for Windows 365 Frontline in Shared Mode, where consistent readiness is essential.

## Resources

- [Overview for Windows Autopilot device preparation - Microsoft Learn](https://learn.microsoft.com/en-us/autopilot/device-preparation/tutorial/user-driven/entra-join-workflow)
- [Use Autopilot device preparation with Cloud PCs - Microsoft Learn](https://learn.microsoft.com/en-us/windows-365/enterprise/autopilot-device-preparation)
