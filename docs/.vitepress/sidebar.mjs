export const sidebar = {
  "/os/linux/archlinux/": [
    {
      text: "安装",
      items: [{ text: "X86安装", link: "/os/linux/archlinux/x86-install" }],
    },
    {
      text: "问题",
      items: [
        { text: "声音卡顿", link: "/os/linux/archlinux/voice-frozen" },
        {
          text: "Zed编辑器无法启动问题",
          link: "/os/linux/archlinux/zed-cannot-start",
        },
        {
          text: "Thinkbook下没有声音问题",
          link: "/os/linux/archlinux/no-sound-under-thinkbook",
        },
      ],
    },
    {
      text: "提示",
      items: [
        { text: "内核安装更换", link: "/os/linux/archlinux/kernel-install" },
        {
          text: "雷蛇驱动安装",
          link: "/os/linux/archlinux/razer-driver",
        },
        {
          text: "快照",
          link: "/os/linux/archlinux/snapshots",
        },
        {
          text: "配置触控板",
          link: "/os/linux/archlinux/configure-touchpad",
        },
        {
          text: "自动重命名文件为md5",
          link: "/os/linux/archlinux/auto-md5-generation",
        },
        {
          text: "申请SSL证书",
          link: "/os/linux/archlinux/apply-cert",
        },
        {
          text: "Nginx反代小服务",
          link: "/os/linux/archlinux/nginx-reverse-service",
        },
      ],
    },
  ],
  "/software/desktop/kde/": [
    {
      text: "配置",
      link: "/software/desktop/kde/config",
    },
  ],
  "/software/misc/": [
    {
      text: "Alist",
      items: [
        {
          text: "无法预览PDF",
          link: "/software/misc/alist/cannot-preview-pdf",
        },
      ],
    },
    {
      text: "SSH",
      items: [
        {
          text: "使用谷歌验证器2FA",
          link: "/software/misc/ssh/use-google-2fa",
        },
      ],
    },
    {
      text: "Cloudflare",
      items: [
        {
          text: "R2对象存储防盗链",
          link: "/software/misc/cloudflare/r2-waf",
        },
      ],
    },
  ],
  "/software/dev/jetbrains": [
    {
      text: "问题",
      items: [
        {
          text: "无法调整MD单元格内的文字大小",
          link: "/software/dev/jetbrains/cannot-addjust-font-in-md-cell",
        },
      ],
    },
  ],
  "/software/vmtools/vmware/": [
    {
      text: "优化",
      items: [
        { text: "选项", link: "/software/vmtools/vmware/choice" },
        { text: "CPU", link: "/software/vmtools/vmware/cpu" },
        {
          text: "网络",
          link: "/software/vmtools/vmware/network",
        },
        {
          text: "存储",
          link: "/software/vmtools/vmware/storage",
        },
      ],
    },
    {
      text: "问题",
      items: [
        { text: "鼠标抓取", link: "/software/vmtools/vmware/mouse-grub" },
        {
          text: "鼠标侧边栏按键",
          link: "/software/vmtools/vmware/mouse-side-tools",
        },
        {
          text: "无法找到共享文件夹",
          link: "/software/vmtools/vmware/shared-cannot-find",
        },
        {
          text: "鼠标滚动迟缓",
          link: "/software/vmtools/vmware/mouse-scroll-delay",
        },
      ],
    },
    {
      text: "提示",
      items: [
        {
          text: "切换磁盘为预分配/动态分配",
          link: "/software/vmtools/vmware/disk-switch-allocation",
        },
        {
          text: "VMWare工具",
          link: "/software/vmtools/vmware/vmware-tools",
        },
      ],
    },
  ],
};
