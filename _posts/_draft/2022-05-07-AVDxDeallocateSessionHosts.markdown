---
layout: post
title:  "Azure Virtual Desktop x Deallocate Session Hosts"
date:   2022-05-08 10:00:00 +0100
categories: AVD
tags: [AVD,Automation,Cost Optimization]
---
# Azure Virtual Desktop (#AVD) x Deallocate stopped VMs

![This image shows the AVDPunk Header](/assets/img/2022-03-15/2022-03-15-001.png)

## Table of contents
1. [Introduction](#Introduction)
2. [Components and workflow](#components-and-workflow)
3. [Setup shutdown and deallocation on disconnect](#setup-shutdown-and-deallocation-on-disconnect)
4. [Option I](#option-i)
5. [Option II](#option-ii)
6. [Conclusion](#Conclusion)

## Introduction

Azure Virtual Desktop (AVD) costs come from two sources: underlying Azure resource consumption and licensing.

In the cloud, we want to "Do More, With Less" and maximize the efficiency, ROI and costs of our cloud environment. For AVD this means; the less users are connected to their personal session hosts, the less compute resources should be allocated. 

In this article, we'll explain how to automatically deallocate unused **personal** VMs to maximize your cost optimization. 

If you are optimizing pooled or multi session deployments, please take a closer look at the AVD [Scaling Plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios) feature.

## Components and workflow

To deallocate virtual machines we use:
- the Windows Task Scheduler
- an Azure function
To interrupt the deallocation process we use:
- the Windows Task Scheduler
To start the session host again we use: 
- the Azure Virtual Desktop [Start on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect) feature

![This image shows the deallocation workflow](/assets/img/2023-02-05/2023-02-05-000.png)

1. By default, AVD session hosts virtual machines (vms) and Remote Desktop Services allows users to disconnect from a remote session without logging off and ending the session. When a session is in a disconnected state, running programs are kept active even though the user is no longer actively connected. You can limit the amount of time that active, disconnected, and idle (without user input) sessions remain on the server. The configuration of Timeout and Reconnection Settings for Remote Desktop Services Sessions is documented [here](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754272(v=ws.11)).

2. When a user triggers the logoff or the idle time period is reached and the logoff is executed, a **scheduled task** is triggered. 

3. The scheduled task is triggers the **Windows Shutdown** and can be **delayed** e.g. for 15min. 

4. After defined shutdown delay, the triggered task is initiating the **Windows Shutdown**. 

5. As soon as the shutdown is triggered, the session host virtual machines will be in the **Stopped** state

6. An **Azure Function** will deallocate all VMs with the state **Stopped**

7. AVD [Start VM On Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect) will enable the end users to turn on their session host virtual machines when they need them.

8. If a user is triggering a logon while in phase **2.** or **3.** we **terminate** the scheduled shutdown task and wait for the next logoff to be triggered. 

## Setup shutdown and deallocation on disconnect

```
Param  
(  
    [Parameter (Mandatory = $false)]  
    [object] $WebhookData  
)  
 
# If runbook was called from Webhook, WebhookData will not be null.  
if ($WebhookData){ 

    Write-Output "Logging into Azure subscription using a Managed Identity..."
    
    # Ensures you do not inherit an AzContext in your runbook
    Disable-AzContextAutosave -Scope Process

    # Connect to Azure with system-assigned managed identity
    $AzureContext = (Connect-AzAccount -Identity).context

    # Set and store context
    $AzureContext = Set-AzContext -SubscriptionName $AzureContext.Subscription -DefaultProfile $AzureContext   
   
    Write-Output "Successfully logged into Azure subscription using a Managed Identity..."

    #Specify the value of your tags you want to manage
    $tags = @{
        managed = 'true'
        avd = 'true'
    }

	$VMs = Get-AzVM -Status | Where-Object {($_.tags.managed -eq $tags.managed)}  

	foreach ($vm in $VMs){
		if($vm.PowerState -eq 'VM stopped'){
			Write-Warning "PowerStates for VM: $($vm.Name) is: $($vm.PowerState) initiate de-allocation for cost optimization"
			Stop-AzVM -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Confirm:$false -Force
		}
		else{
			Write-Warning "No Action required"
		}
	}
}
```

## Conclusion

## Resources

https://learn.microsoft.com/en-us/azure/cost-management-billing/cost-management-billing-overview
https://learn.microsoft.com/en-us/azure/virtual-desktop/tag-virtual-desktop-resources 

Interested in further cost tracking options, check the Azure Academy for this here: https://www.youtube.com/watch?v=dUft4FZ40O8 
