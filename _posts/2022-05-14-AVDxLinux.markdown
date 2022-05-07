---
layout: post
title:  "Azure Virtual Desktop x Advanced Device Redirection"
date:   2022-05-14 10:00:00 +0100
categories: AVD
tags: [AVD,Linux,HPC]
---
# Azure Virtual Desktop (#AVD) <3 Linux Session Hosts

![This image shows the AVDPunk Header](/assets/img/2022-05-14/2022-05-14-000.png)

## Table of contents
1. [Introduction](#Introduction)
2. [Option I](#option-i)
3. [Option II](#option-ii)
6. [Conclusion](#Conclusion)

## Introduction

Azure Virtual Desktop (AVD) is not supporting Linux virtual machines at the moment.Nevertheless, some developers, engineers and other user groups and customers rely on a Linux desktop and they want to benefit from all the security features like MFA, Conditional Access, etc.

But it is absolutely possible to provide a Linux Desktop via AVD.

## Option I

One way could be through WSL2. The installation on a Windows 10/11 session host is documented here: [Install WSL on Windows 10 | Microsoft Docs](https://docs.microsoft.com/en-us/windows/wsl/install)

![AVD Client with WSL 2](/assets/img/2022-05-14/2022-05-14-001.png)

## Option II

Another option is to simply publish a Linux Desktop via a remote application.

![AVD Client with RDP and Linux](/assets/img/2022-05-14/2022-05-14-002.png)

To do this, spin up a Linux virtual machine with the OS distribution of choice, in my case I choose Ubuntu. 

1. Connect to your new VM an install updates and xfce. E.g.

2. Install updates: 

```
sudo apt update
```

3. Install the desktop shell: 

```
sudo apt install xubuntu-desktop
```

4. Install xrdp: 

```
sudo apt install xrdp
```
5. Check the service status

```
sudo systemctl status xrdp
```

6. Add the current user account to the ssl-cert group to get access via RDP:

```
sudo adduser xrdp ssl-cert
``` 

7. Restart the service:

```
sudo systemctl restart xrdp
```

8. Configure the firewall to allow connection on 3389: 

```
sudo ufw allow from <YOUR-IP-CIDR > to any port 3389

sudo ufw reload

sudo ufw status
```

9. Lets jump back to you session host and the Azure Portal.

Create a .rdp file with the hostname or IP-Address, download an icon of choice and store it on the session host(s).

Lastly configure your remote application in the Azure Portal.

![Azure Portal RemoteApp GUI](/assets/img/2022-05-14/2022-05-14-003.png)

## Conclusion

The optimal solution would be to have native Linux support in AVD but as long as this is not given you can enjoy your Linux desktop delivered through this workaround.