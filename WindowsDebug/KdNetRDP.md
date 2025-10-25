# KdNet Remote Desktop
> This method is intended for early-stage debugging. You can connect to the target device's Windows remote desktop via KdNet to test touch, USB, etc.
> References and tutorials adapted from the [WOA Project](https://github.com/WOA-Project/).

## Preparation
  - A device that has just had Windows deployed and has not been booted yet.
  - The ESP partition's ESP FLAG must have been set correctly before deploying Windows.
  - The phone is currently in Mass Storage Mode and connected to the PC.
  - You have read the [KDNET setup guide](/WindowsDebug/SetupKDNET.md) and performed the full procedure at least once.
  - Download `unattend.xml` from [unattend.xml](/WindowsDebug/KdNetRDP/unattend.xml).

:::warning Note
  The unattended file only takes effect on the first boot. Make sure you have just finished deploying the system and installed drivers.
  - For installing Windows see [Windows installation summary](/InstallationGuides/WindowsInstallation.md).
  - For driver installation see [Install Drivers](/InstallationGuides/InstallDrivers.md).
:::

## Configure Unattended Setup
  - Open File Explorer and locate the system drive of the phone.
  - Enter `\Windows\Panther\`.
  - Copy the `unattend.xml` you downloaded into this folder.
    + Optional: you can modify the `LocalUser` in `unattend.xml` to change the created username.
  - Eject the disk and reboot the phone, then boot into UEFI.
  - Wait for the system to boot. The normal flow is:
    + Spinning wheel -> Getting devices ready -> Ready -> Automatic reboot
  - After the automatic reboot, boot UEFI again. The normal flow is:
    + Spinning wheel -> OOBE -> Enter desktop as user `LocalUser`
  - Note both steps are automated; you only need to boot UEFI twice.
  - If on first boot you see a "Windows could not complete the installation... click OK to restart" message, check the ESP FLAG and reinstall Windows if necessary.

## Windbg Connection
  - Follow the KDNET setup steps in [SetupKDNET](/WindowsDebug/SetupKDNET.md#setup-bcd) to configure KDNET and connect.
    + If the debugger auto-breaks, click `Go` in the top-left of Windbg or type `g` and press Enter in the command line.
  - After the phone boots into Windows, click the `Break` button in the top-left of Windbg. In the command line area enter `!process 0 1` and press Enter, then wait for the output to finish.
  - Pick any process, click the blue data link after `Peb`, Windbg will execute the command and dump a lot of data.
  ![Process](/WindowsDebug/KdNetRDP/Process.png)
  - In the output find `USERDOMAIN` and copy the value after it. It is usually like `PHONE-XXXXX` or `DESKTOP-XXXX`.
  ![UserDomain](/WindowsDebug/KdNetRDP/UserDomain.png)
:::tip
If the selected Peb output does not contain `USERDOMAIN`, try another process's Peb.
:::

## RDP Connection
  - Open the built-in Windows Remote Desktop tool (`Remote Desktop Connection`). You can search it in the Start menu or press `Win+R` and run `mstsc`.
  - Enter the `USERDOMAIN` you copied in the `Computer` field and click Connect.
  ![Connect](/WindowsDebug/KdNetRDP/mstsc.png)
  - The username is `LocalUser`, or whatever you set in `unattend.xml`.
  - There is no password; enter the username and connect. If you are warned about a certificate, ignore/accept it.
  - If Remote Desktop connects successfully, the setup is complete — start your debugging session!
  ![Connected](/WindowsDebug/KdNetRDP/Connected.png)

## References
 - [MSDN: Answer file (unattend.xml)](https://learn.microsoft.com/zh-cn/windows-hardware/manufacture/desktop/update-windows-settings-and-scripts-create-your-own-answer-file-sxs)
