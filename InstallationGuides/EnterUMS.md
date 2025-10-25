# How to enter USB Mass Storage Mode
There are 2 main ways to enter UMS mode:
- UEFI Application
- Linux Usb Gadget

## Enter UMS in UEFI
Unpack [bootpkg.zip](/InstallationGuides/EnterUMS/bootpkg.zip) into a fat partition like modem_a/modem_b. Alternatively you can format a partition into fat and put files in it after backup.
For example, put files in modem_b if your device is currently in A slot and B slot is free. Assume `bootpkg.zip` was putting at `/sdcard/`

```shell
adb shell
su
mkdir /dev/ums && cd /dev/ums
unzip /sdcard/bootpkg.zip
cd ..
umount /dev/ums
```
:::tip
Alternatively, an prepacked FAT image was provided here [bootpkg_image.zip](/InstallationGuides/EnterUMS/bookpkg_image.gz). You can decompress it on your computer and flash it into any unused partition via fastboot.
:::

Reboot your device into fastboot and execute the cmd below to try boot uefi. The phone will show a boot menu to enter mass storage mode after seconds.
```shell
fastboot boot /path/to/uefi-XXXX.img
```
:::tip
Most Virtual Terminal Application supports convert the file(s) drag in the windows to full path to the file(s).
:::

After booting uefi, select `Mass Storage Mode` in the Windows boot manager.

## Enter UMS in Android or Recovery
:::tip
You may not want to edit userdata partition when it was mounted in Android or Rec.
:::

:::warn
This way may not work if the device has selinux force enabled in kernel code(e.g. Oplus).
:::

Save the following script into file `msc.sh`.
```shell
#!/sbin/bash
setenforce 0
echo 0xEF > /config/usb_gadget/g1/bDeviceClass; echo 0x02 > /config/usb_gadget/g1/bDeviceSubClass; echo 0x01 > /config/usb_gadget/g1/bDeviceProtocol
ln -s /config/usb_gadget/g1/functions/mass_storage.0/ /config/usb_gadget/g1/configs/b.1/
echo /dev/block/sda > /config/usb_gadget/g1/configs/b.1/mass_storage.0/lun.0/file
echo 0 > /config/usb_gadget/g1/configs/b.1/mass_storage.0/lun.0/removable
sh -c 'echo > /config/usb_gadget/g1/UDC; echo a600000.dwc3 > /config/usb_gadget/g1/UDC' &
```

Push the script into `/sdcard` or `/dev`, or execute those commands in adb shell.

```shell
adb push /path/to/msc.sh /sdcard
adb shell
su
sh /sdcard/msc.sh
```

or 

```shell
adb shell
su
setenforce 0
echo 0xEF > /config/usb_gadget/g1/bDeviceClass; echo 0x02 > /config/usb_gadget/g1/bDeviceSubClass; echo 0x01 > /config/usb_gadget/g1/bDeviceProtocol
ln -s /config/usb_gadget/g1/functions/mass_storage.0/ /config/usb_gadget/g1/configs/b.1/
echo /dev/block/sda > /config/usb_gadget/g1/configs/b.1/mass_storage.0/lun.0/file
echo 0 > /config/usb_gadget/g1/configs/b.1/mass_storage.0/lun.0/removable
sh -c 'echo > /config/usb_gadget/g1/UDC; echo a600000.dwc3 > /config/usb_gadget/g1/UDC' &
```

## Enter UMS with initrd + android kernel
:::warn
This way may not work if the device has selinux force enabled in kernel code(e.g. Oplus).
:::

You can pack the upper script into a generic [mass.cpio.gz](/InstallationGuides/EnterUMS/mass.cpio.gz). Download and decompress the file and replace the initrd in your phone's `boot`/`vendorboot` will bring up UMS automatically when booting.
Download [prebuilt MagiskBoot](https://github.com/TeamWin/external_magisk-prebuilt/tree/android-12.1/prebuilt) for linux or android.
Alternatively you can also download [Prebuilt MagiskBoot for windows](https://github.com/svoboda18/magiskboot/releases).

Use the tool unpack and repack boot/vendorboot image after unpacking executable file and add executing permission.

Following commands as a example:
```shell
adb push mass.cpio /sdcard/
su
mkdir -p /sdcard/bootunpack && cd /sdcard/bootunpack
./path/to/magiskboot unpack /dev/block/by-name/boot_a
ls .  # If ramdisk does not exist in boot, try edit vendor boot.
cp ../mass.cpio ramdisk.cpio
./path/to/magiskboot repack ums.img
# You will get a ums.img here
ls .
```

The next step you need to do is booting the boot file or flash it into vendorboot after backing up. The phone will boot into UMS mode after seconds.
```shell
adb pull /sdcard/bootunpack/ums.img .
# Reboot device into fastboot
fastboot boot ums.img # If boot.img
# or
fastboot flash vendorboot ums.img # if vendor boot
```

:::warn
Please backup your boot/vendorboot before flash. Flash them back after using ums image.
:::

## Enter UMS with initrd + mainline kernel
You can also try boot mainline linux in uefi or via ABL and enable ums gadget mode in configfs. It's advanced so i'll only introduce here.

# End
