---
layout: post
title: "Azure Virtual Desktop x Shutdown and deallocate Session host at logoff"
description: "Learn how to automatically deallocate unused personal AVD VMs at user logoff to optimize costs using Windows Task Scheduler and Azure Functions."
date: 2023-01-12
category: guide
tags:
  - AVD
  - automation
  - Cost optimization
  - Azure Monitor
reading_time: "15 min read"
featured_image: "https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2023-01-06-001-1.png"
source_url: "https://avdpunks.com/2023/01/12/avd-shutdown-and-deallocate-session-host-at-logoff/"
source_title: "AVDPunks Original Post"
---

## Introduction

Azure Virtual Desktop (AVD) costs come from two sources: underlying Azure resource consumption and licensing.

In the cloud, we want to "Do More, With Less" and maximize the efficiency, ROI and costs of our cloud environment. For AVD this means: the less users are connected to their personal session hosts, the less compute resources should be allocated.

In this article, we'll explain how to automatically deallocate unused personal VMs to increase your cost optimization score.

> **Note:** If you are optimizing pooled or multi session deployments, please take a closer look at the AVD Scaling Plan feature.

## Components and workflow

![Deallocation workflow diagram](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2023-01-06-001-1.png)

To deallocate virtual machines we use:
- Windows Task Scheduler
- Azure Function

To interrupt the deallocation process we use:
- Windows Task Scheduler

To start the session host again we use:
- Azure Virtual Desktop Start VM on Connect feature

The workflow:

1. Configure RDP Timeout and Reconnection Settings
2. When a user triggers logoff or idle time is reached, a scheduled task is triggered
3. The scheduled task triggers Windows Shutdown (can be delayed e.g. 15min)
4. After the delay, shutdown is initiated
5. Session host VM enters Stopped state
6. Azure Function deallocates all VMs with Stopped state
7. AVD Start VM On Connect enables users to turn on their session host when needed
8. If a user logs in during delay phase, the shutdown task is terminated

## Setup shutdown and deallocation on disconnect

### Enable RDP Timeouts

#### Via Intune Settings Catalog

1. Create a new Device Configuration profile
2. Search for "Session Time Limits" in the settings picker
3. Add "Set time limit for active but idle Remote Desktop Services sessions" and "Set time limit for disconnected sessions"
4. Activate these settings and set your preferred timeouts
5. Assign to a device or user group

#### Via Registry Key

```powershell
$registryPath = "HKLM:\Software\Policies\Microsoft\Windows NT\Terminal Services"
$Name = "MaxDisconnectionTime"
$value = '0x000dbba0'  # 900000ms = 15mins
New-ItemProperty -Path $registryPath -Name $name -Value $value -PropertyType DWORD -Force | Out-Null

$Name = "MaxIdleTime"
$value = '0x000dbba0'
New-ItemProperty -Path $registryPath -Name $name -Value $value -PropertyType DWORD -Force | Out-Null
```

> **Note:** Use `'{0:x}' -f [number in ms]` to convert from decimal to hex.

### Create an Azure Function to deallocate all stopped VMs

Azure continues to charge for VM core hours while it's Stopped. Only when deallocated do you just pay for storage.

1. Create a new Azure Function (PowerShell Core, Consumption plan)
2. Enable a system-assigned managed identity
3. Assign the "Desktop Virtualization Power On Off Contributor" role
4. Add an application setting `ResourceGroupName` with your resource group
5. Add Az.Accounts and Az.Compute modules to requirements.psd1
6. Create a Timer Trigger function with this script:

```powershell
$StoppedVMs = Get-AzVM -ResourceGroupName $env:ResourceGroupName -Status | Where-Object {($_.powerstate -eq "VM stopped")}
if ($null -ne $StoppedVMs){
    foreach ($VM in $StoppedVMs){
        Write-Host "VM $($VM.Name) will be deallocated now..."
        $StopVM = Stop-AzVM -Name $VM.Name -ResourceGroupName $env:ResourceGroupName -Force
        If ($StopVM.Status -eq "Succeeded") {
            Write-Host "VM $($VM.Name) was successfully deallocated..."
        } else {
            Write-Host "Something went wrong! Please check the Azure activity log..."
        }
    }   
} else {
    Write-Host "No VMs could be found in the status stopped..."
}
```

### Create Windows Task Scheduler for shutdown automation

The scheduled task triggers on Event ID 4647 (user initiated logout):

```powershell
$TaskName = "AVD - Shutdown VM after user logs off"
$principal = New-ScheduledTaskPrincipal 'NT Authority\SYSTEM' -RunLevel Highest
$class = cimclass MSFT_TaskEventTrigger root/Microsoft/Windows/TaskScheduler
$triggerM = $class | New-CimInstance -ClientOnly
$triggerM.Enabled = $true
$triggerM.Subscription='<QueryList><Query Id="0" Path="Security"><Select Path="Security">*[System[EventID=4647]]</Select></Query></QueryList>'
#$triggerM.Delay = "PT15M"  # Optional 15min delay
$actionM = New-ScheduledTaskAction -Execute "$env:windir\System32\shutdown.exe" -Argument "/f /s /t 0"
$settingsM = New-ScheduledTaskSettingsSet
$taskM = New-ScheduledTask -Action $actionM -Principal $principal -Trigger $triggerM -Settings $settingsM -Description "AVD - Shutdown VM after user logs off" 
Register-ScheduledTask $TaskName -InputObject $taskM
```

## Conclusion

Compute cost of session host VMs are by far the largest cost component. Implementing this process to automatically turn VMs on at connect and turn them off once users are no longer connected will help you create a cost-effective AVD environment.

Do More With Less – Less complexity, Less time and Less cost 😉

## Resources

- [Cost Management](https://learn.microsoft.com/en-us/azure/cost-management-billing/cost-management-billing-overview)
- [Tagging](https://learn.microsoft.com/en-us/azure/virtual-desktop/tag-virtual-desktop-resources)
