import { defineConfig, type DefaultTheme } from 'vitepress'

export const zh = defineConfig({
  description: "你的手机，焕发新生",
  lang: 'zh-CN',
  themeConfig: {    
    nav: [
      { text: '主页', link: '/'},
      { text: '文档', link: '/zh/Introduction/organization', activeMatch: '/zh/' },
      { text: '视频', link: '/zh/Videos/Introduction/Introduction', activeMatch: '/zh/Videos/' },
    ],
    sidebar: {
      '/zh/': { base: '/zh', items: sidebarDocs() },
      '/zh/Videos/': { base: '/zh/Videos', items: sidebarVideos() },
    },
    lastUpdated: {
      text: '最后更新于',
    },
    outline: {
      label: '页面导航'
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换至浅色模式',
    darkModeSwitchTitle: '切换至深色模式',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    editLink: {
      text: '在 Github 上编辑此页',
      pattern: 'https://github.com/Project-Aloha/project-aloha.github.io/edit/main/:path'
    },
    footer: {
      copyright: `网站 CC BY-NC-SA 4.0 | 版权所有 © 2022-${new Date().getFullYear()} Project-Aloha`
    },
  }
})

function sidebarDocs(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      items: [
        { text: 'Project-Aloha', link: '/Introduction/organization'},
        { text: 'mu_aloha_platforms', link: '/Introduction/mu_aloha_platforms'},
        { text: '移植状态', link: '/PortingStatus/PortingStatus'}
      ]
    },
    {
      text: '安装',
      items: [
        { text: '教程收集', link: '/InstallationGuides/GuidesCollection'},
        { text: 'Windows安装简述', link: '/InstallationGuides/WindowsInstallation' },
        { text: '驱动安装', link: '/InstallationGuides/InstallDrivers'},
        { text: '进入USB大容量存储模式', link: '/InstallationGuides/EnterUMS'},
      ]
    },
    {
      text: 'UEFI移植',
      items: [
        { text: '简易移植教程', link: '/PortingGuides/SimpleGuide'}
      ]
    },
    {
      text: '调试Windows',
      items: [
        { text: '配置 KDNET', link: '/WindowsDebug/SetupKDNET.md'},
        { text: '配置 KDCOM', link: '/WindowsDebug/SetupKDCOM.md'},
        { text: 'KDNET 远程桌面', link: '/WindowsDebug/KdNetRDP.md'},
      ]
    },
    {
      text: '参考表',
      items: [
        { text: "高通芯片代号参考", link: "/ReferenceTables/QCSiliconCodenameReferenceTable"},
        { text: "设备代号参考", link: "/ReferenceTables/DeviceCodenameReferenceTable"},
      ]
    },
  ]
}

function sidebarVideos(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      items: [
        { text: '关于视频', link: '/Introduction/Introduction'}
      ]
    },
    {
      text: '常见问题',
      items: [
        { text: '样例', link: '/Guide/TroubleShoot/example'},
    ]},
    {
      text: '安装教程',
      items: [
        { text: '样例', link: '/Guide/WindowsInstallation/example'},
    ]}
  ]
}