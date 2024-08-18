import { defineConfig } from "vitepress";
import { nav } from "./nav.mjs";
import { sidebar } from "./sidebar.mjs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "杂七杂八的档案室",
  description: "杂七杂八的配置, 一些新的感悟",
  lastUpdated: true,
  lang: "zh_Hans",
  // ignoreDeadLinks: true,
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon-vitepress-noeffect-3.svg",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon-vitepress-noeffect-3.png",
      },
    ],
  ],
  markdown: {
    image: {
      lazyLoading: true,
    },
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "例子",
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon-vitepress-noeffect-3.png",
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
    editLink: {
      pattern: "https://github.com/ricolxwz/misc/edit/master/docs/:path",
      text: "在 GitHub 上编辑此页面",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    outline: {
      label: "页面导航",
    },
    lastUpdatedText: "📑 最后更新于",
    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    nav,
    sidebar,
    socialLinks: [{ icon: "github", link: "https://github.com/ricolxwz" }],
    footer: {
      message: "基于 MIT 许可发布",
      copyright: "版权所有 © 2024-至今 许文泽 ️🌴",
    },
  },
});
