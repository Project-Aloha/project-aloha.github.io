import { defineConfig, type DefaultTheme } from 'vitepress'

export const en = defineConfig({
  description: "Bring a New Life to Your Phone",
  lang: 'en-US',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/'},
      { text: 'Documents', link: '/Introduction/mu_aloha_platforms' },
      { text: 'Videos', link: '/Videos/Introduction/Introduction' },
    ],
    sidebar: {
      '/Videos/': { base: '/Videos', items: sidebarVideos() },
      '/': { base: '', items: sidebarDocs() },
    },
    editLink: {
      text: 'Edit this page on Github',
      pattern: 'https://github.com/Project-Aloha/project-aloha.github.io/edit/main/:path'
    },
    footer: {
      copyright: `Site CC BY-NC-SA 4.0 | CopyRight © 2022-${new Date().getFullYear()} Project-Aloha`
    },
  }
})

function sidebarDocs(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Introduction',
      items: [
        { text: 'Project-Aloha', link: '/Introduction/organization'},
        { text: 'mu_aloha_platforms', link: '/Introduction/mu_aloha_platforms'},
        { text: 'UEFI Porting Status', link: '/PortingStatus/PortingStatus'}
      ]
    },
    {
      text: 'Installation',
      items: [
        { text: 'Guides Collection', link: '/InstallationGuides/GuidesCollection'},
        { text: 'Simple Installation Guide', link: '/InstallationGuides/WindowsInstallation' },
        { text: 'Install Drivers', link: '/InstallationGuides/InstallDrivers'},
        { text: 'Enter UMS Mode', link: '/InstallationGuides/EnterUMS'},
        { text: 'Hide Partition', link: '/InstallationGuides/SetGPTPartitionSystemAttr.md'},
      ]
    },
    {
      text: 'Dual Boot',
      items: [
        { text: 'Introduction', link: '/DualBoot/Introduction'},
        { text: 'Apply DualBoot', link:'/DualBoot/PatchKernel.md'},
        { text: 'Config', link: '/DualBoot/Config'},
        { text: 'Shell Code', link: '/DualBoot/ShellCode'},
      ]
    },
    {
      text: 'Porting UEFI',
      items: [
        { text: 'UEFI Porting Guide', link: '/PortingGuides/SimpleGuide'},
        { text: 'Definitions', link: '/PortingGuides/DefinesGuidance'},
        { text: '[Deprecated]Find Protocol Addresses For Kailua', link: '/PortingGuides/FindProtocolAddressesForKailua'},
      ]
    },
    {
      text: 'Debug Windows',
      items: [
        { text: 'Setup KDNET', link: '/WindowsDebug/SetupKDNET.md'},
        { text: 'Setup KDCOM', link: '/WindowsDebug/SetupKDCOM.md'},
      ]
    },
    {
      text: 'Reference Tables',
      items: [
        { text: "QC Silicons' Codenames Reference", link: "/ReferenceTables/QCSiliconCodenameReferenceTable"},
        { text: "Devices' Codenames Reference", link: "/ReferenceTables/DeviceCodenameReferenceTable"},
      ]
    },
  ]
}

function sidebarVideos(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Introduction',
      items: [
        { text: 'About Videos', link: '/Introduction/Introduction'}
      ]
    },
    {
      text: 'Trouble Shooting',
      items: [
        { text: 'example', link: '/Guide/TroubleShoot/example'},
    ]},
    {
      text: 'Installation Guide',
      items: [
        { text: 'example', link: '/Guide/WindowsInstallation/example'},
    ]}
  ]
}