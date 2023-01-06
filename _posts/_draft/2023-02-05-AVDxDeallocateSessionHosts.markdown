---
layout: post
title:  "Azure Virtual Desktop x Deallocate Session Hosts"
date:   2023-02-05 10:00:00 +0100
categories: AVD
tags: [AVD,Automation,Cost Optimization]
---
# Azure Virtual Desktop (#AVD) x Deallocate stopped VMs

![This image shows the AVDPunk Header](/assets/img/2023-01-06/2023-01-06-000.png)


## Table of contents
1. [Introduction](#Introduction)
2. [Components and workflow](#components-and-workflow)
3. [Setup shutdown and deallocation on disconnect](#setup-shutdown-and-deallocation-on-disconnect)
4. [Conclusion](#Conclusion)

## Introduction

Azure Virtual Desktop (AVD) costs come from two sources: underlying Azure resource consumption and licensing.

In the cloud, we want to "Do More, With Less" and maximize the efficiency, ROI and costs of our cloud environment. For AVD this means; the less users are connected to their personal session hosts, the less compute resources should be allocated. 

In this article, we'll explain how to automatically deallocate unused **personal** VMs to maximize your cost optimization. 

If you are optimizing pooled or multi session deployments, please take a closer look at the AVD [Scaling Plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios) feature.

## Components and workflow

To deallocate virtual machines we use:
- the [Windows Task Scheduler](https://learn.microsoft.com/en-us/windows/win32/taskschd/task-scheduler-start-page)
- an [Azure Function](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview)

To interrupt the deallocation process we use:
- the Windows Task Scheduler

To start the session host again we use: 
- the Azure Virtual Desktop [Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect) feature

This image shows the deallocation workflow:
![This image shows the deallocation workflow](/assets/img/2023-01-06/2023-01-06-001.png)

1. By default, AVD session hosts virtual machines (vms) and Remote Desktop Services allows users to disconnect from a remote session without logging off and ending the session. When a session is in a disconnected state, running programs are kept active even though the user is no longer actively connected. You can limit the amount of time that active, disconnected, and idle (without user input) sessions remain on the server. The configuration of Timeout and Reconnection Settings for Remote Desktop Services Sessions is documented [here](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc754272(v=ws.11)).

2. When a user triggers the logoff or the idle time period is reached and the logoff is executed, a **scheduled task** is triggered. 

3. The scheduled task is triggers the **Windows Shutdown** and can be **delayed** e.g. for 15min. 

4. After defined shutdown delay, the triggered task is initiating the **Windows Shutdown**. 

5. As soon as the shutdown is triggered, the session host virtual machines will be in the **Stopped** state

6. An **Azure Function** will deallocate all VMs with the state **Stopped**

7. AVD [Start VM On Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect) will enable the end users to turn on their session host virtual machines when they need them.

8. If a user is triggering a logon while in phase **2.** or **3.** we **terminate** the scheduled shutdown task and wait for the next logoff to be triggered. 

## Setup shutdown and deallocation on disconnect

### Create an Azure Function to deallocate all stopped VMs

1. Open the **Azure Function page**, you can use this direct link: [https://azfn.cmd.ms/](https://azfn.cmd.ms/), then click **Create** to crate a new Azure function resource. 

2. **Select your project details** (subscription/resource group) and then select a **unique Azure function name**, select **PowerShell Core as runtime stack** and **your preferred region**. For the operating system, select **Windows** and the plan type should be **Consumption (Serverless)**. 

![This image shows the Azure feature creation basic tab](/assets/img/2023-01-06/2023-01-06-002.png)

3. Next, on the Hosting tab, **select your preferred storage account or create a new one**. 

![This image shows the Azure feature creation hosting tab](/assets/img/2023-01-06/2023-01-06-003.png)

4. Next, you can **skip the Network tab** because of the limitation of the service plan. Go to the next tab **Monitoring** and enable it to get more insights into the applications if you want. This is not required, but it will help if a problem occurs. 

> **Note**: Here you will find some information about [Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview?tabs=net).

![This image shows the Azure feature creation monitoring tab](/assets/img/2023-01-06/2023-01-06-004.png)

5. The Deploy tab can also be skipped and then you can **assign some tags if you want**. Otherwise, click **Check + Create**.  

![This image shows the Azure feature creation review tab](/assets/img/2023-01-06/2023-01-06-005.png)

6. When the Azure function is successfully created, access the resource. First, you need to **enable a system-assigned managed identity** and **assign an Azure permission role** that enables virtual machine shutdown.

**Open Identity Settings** and change the status for the assigned system from Off to **On**, and then click **Save**. 

This registers the Azure function in Azure Active Directoy so that you can assign specific Azure permissions to this managed identity. Alternatively, you can use a user-assigned managed identity instead of a system-assigned one if you wish. 

![This image shows the Azure function identity settings](/assets/img/2023-01-06/2023-01-06-006.png)

7. Now you can assign Azure permissions to this managed identity. Click **Azure Role Assignments** and then click **Add Role Assignment**. 

![This image shows the Azure function identity settings](/assets/img/2023-01-06/2023-01-06-007.png)

If you want to use this Azure feature only for a specific resource group, select **Resource group as scope** and **your Subscription/Resource group** However, if you want to use it for the entire subscription, select **Subscription as Scope**.

Meanwhile, there is a built-in permission role that allows you to start and deallocate virtual machines. You can use your custom role if you have one, otherwise select the **Desktop Virtualization Power On Off Contributor** role. The same role is also used for the scaling plan feature. 

![This image shows the Azure function identity settings](/assets/img/2023-01-06/2023-01-06-008.png)

### Create Windows Task Scheduler for shutdown automation



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
