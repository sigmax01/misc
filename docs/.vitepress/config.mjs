import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "杂七杂八的档案室",
  description: "杂七杂八的配置, 一些新的感悟",
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon-vitepress-noeffect-2.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon-vitepress-noeffect-2.png' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon-vitepress-noeffect-2.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'Test', link: '/测试/测试' }
    ],
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ricolxwz' }
    ]
  }
})
