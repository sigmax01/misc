import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "杂七杂八的档案室",
  description: "杂七杂八的配置, 一些新的感悟",
  lang: "zh_Hans",
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon-vitepress-noeffect-3.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon-vitepress-noeffect-3.png' }]
  ],
  markdown: {
    image: {
      lazyLoading: true
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon-vitepress-noeffect-3.svg',
    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '页面导航'
    },
    astUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    nav: [
      {
        text: "导航",
        link: "nav"
      },
      { 
        text: '操作系统', 
        items: [
          { 
            text: 'Linux',
            items: [
              {
                text: "Archlinux",
                link: "/os/linux/archlinux"
              } 
            ]
          },
          {
            text: 'MacOS',
            link: '/os/macos'
          }
        ]
      },
      {
        text: '常用软件',
        items: [
          {
            text: '虚拟化软件',
            items: [
              {
                text: "VMWare",
                link: "/software/vmtools/vmware"
              }
            ]
          }
        ]
      }
    ],
    sidebar: {
      "/os/linux/archlinux": [
        {
          text: '安装',
          items: [
            { text: 'X86安装', link: '/os/linux/archlinux/x86-install' },
          ]
        },
        {
          text: '问题',
          items: [
            { text: '声音卡顿', link: '/os/linux/archlinux/voice-frozen' }
          ]
        }
      ],
      "/software": [
        {
          text: '🚧 施工中...'
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ricolxwz' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Wenze X ♥️.'
    }
  }
})
