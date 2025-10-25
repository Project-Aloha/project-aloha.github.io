# 如何进入 USB 大容量存储 (UMS) 模式
> 本文介绍几种在不同环境下进入 USB 大容量存储模式（UMS）的方法：UEFI 启动、Android/Recovery 下通过 USB Gadget，以及使用 initrd 与不同内核的方式。

主要有两种进入 UMS 的途径：
- UEFI 应用
- Linux USB Gadget

## 在 UEFI 中进入 UMS
将 [bootpkg.zip](/InstallationGuides/EnterUMS/bootpkg.zip) 解压到一个 FAT 分区（例如 modem_a 或 modem_b）。另外也可以在备份后格式化分区为 FAT 并把文件写入。
例如，如果你的设备目前在 A slot，而 B slot 空闲，则把文件放到 modem_b。假设 `bootpkg.zip` 位于 `/sdcard/`。

```shell
adb shell
su
mkdir /dev/ums && cd /dev/ums
unzip /sdcard/bootpkg.zip
cd ..
umount /dev/ums
```
:::tip
另有预打包的 FAT 镜像可在此处获取 [bootpkg_image.zip](/InstallationGuides/EnterUMS/bookpkg_image.gz)。你可以在电脑上解压并通过 fastboot 写入任何未使用的分区。
:::

将设备重启到 fastboot 模式，然后运行下面命令尝试通过 UEFI 启动。手机将在几秒后显示引导菜单，可以选择进入大容量存储模式：

```shell
fastboot boot /path/to/uefi-XXXX.img
```
:::tip
大多数终端模拟器支持将文件拖放到窗口并自动转换为完整路径。
:::

启动 UEFI 后，在 Windows Boot Manager 中选择 `Mass Storage Mode`。

## 在 Android 或 Recovery 下进入 UMS
:::tip
当 userdata 分区在 Android 或 Recovery 中被挂载时，通常不建议修改该分区。
:::

:::warning
如果设备在内核层强制启用了 SELinux（例如某些 Oplus 设备），本方法可能无法生效。
:::

将下面脚本保存为 `msc.sh`：

```shell
#!/sbin/bash
setenforce 0
echo 0xEF > /config/usb_gadget/g1/bDeviceClass; echo 0x02 > /config/usb_gadget/g1/bDeviceSubClass; echo 0x01 > /config/usb_gadget/g1/bDeviceProtocol
ln -s /config/usb_gadget/g1/functions/mass_storage.0/ /config/usb_gadget/g1/configs/b.1/
echo /dev/block/sda > /config/usb_gadget/g1/configs/b.1/mass_storage.0/lun.0/file
echo 0 > /config/usb_gadget/g1/configs/b.1/mass_storage.0/lun.0/removable
sh -c 'echo > /config/usb_gadget/g1/UDC; echo a600000.dwc3 > /config/usb_gadget/g1/UDC' &
```

把脚本 push 到 `/sdcard` 或 `/dev`，或者在 adb shell 中直接执行这些命令：

```shell
adb push /path/to/msc.sh /sdcard
adb shell
su
sh /sdcard/msc.sh
```

或者直接在 shell 中按步骤执行：

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

## 使用 initrd + Android 内核进入 UMS
:::warning
如果设备在内核层强制启用了 SELinux（例如某些 Oplus 设备），本方法可能无法生效。
:::

你可以将上面的脚本打包到通用的 [mass.cpio.gz](/InstallationGuides/EnterUMS/mass.cpio.gz)。下载并解压该文件，然后替换手机 `boot`/`vendorboot` 中的 initrd，在启动时会自动启用 UMS。
下载适用于 Linux/Android 的 MagiskBoot 预构建工具（例如：
[TeamWin external_magisk-prebuilt](https://github.com/TeamWin/external_magisk-prebuilt/tree/android-12.1/prebuilt)），或用于 Windows 的预构建版本（
[svoboda18/magiskboot releases](https://github.com/svoboda18/magiskboot/releases)）。

使用该工具 unpack/repack boot/vendorboot 镜像（解包后对可执行文件赋予执行权限）。示例命令：

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

接下来你需要将生成的镜像引导或在备份后刷入 vendorboot。设备启动后几秒内将进入 UMS 模式。

```shell
adb pull /sdcard/bootunpack/ums.img .
# Reboot device into fastboot
fastboot boot ums.img # If boot.img
# or
fastboot flash vendorboot ums.img # if vendor boot
```

:::warning
请在刷写前备份你的 boot/vendorboot，使用完毕后再刷回原镜像。
:::

## 使用 initrd + mainline 内核进入 UMS
你也可以尝试在 UEFI 中或通过 ABL 启动 mainline Linux，并在 configfs 中启用 UMS gadget 模式。该方式较为高级，此处仅作简要介绍。

# 结束