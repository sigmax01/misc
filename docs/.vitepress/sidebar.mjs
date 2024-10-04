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
        {
          text: "自签证书",
          link: "/os/linux/archlinux/self-signed-cert",
        },
      ],
    },
  ],
  "/software/kde/": [
    {
      text: "配置",
      link: "/software/config",
    },
  ],
  "/software/gitlab": [
    {
      text: "升级",
      link: "/software/gitlab/upgrade.md",
    },
    {
      text: "迁移",
      link: "/software/gitlab/migrate.md",
    },
    {
      text: "备份",
      link: "/software/gitlab/backup.md",
    },
    {
      text: "runner",
      link: "/software/gitlab/runner.md",
    },
    {
      text: "配置",
      link: "/software/gitlab/config.md",
    },
  ],
  "/software/github": [
    {
      text: "Runner",
      link: "/software/github/runner.md",
    },
  ],
  "/software/portainer": [
    {
      text: "安装",
      link: "/software/portainer/install.md",
    },
    {
      text: "堆",
      link: "/software/portainer/stack.md",
    },
  ],
  "/software/alist": [
    {
      text: "无法预览PDF",
      link: "/software/alist/cannot-preview-pdf",
    },
    {
      text: "改变Logo大小",
      link: "/software/alist/change-logo-size",
    },
  ],
  "/software/ssh": [
    {
      text: "使用谷歌验证器2FA",
      link: "/software/ssh/use-google-2fa",
    },
    {
      text: "限制IP登录",
      link: "/software/ssh/restrict-ip-login",
    },
    {
      text: "端口转发",
      link: "/software/ssh/port-forwarding",
    },
  ],
  "/software/cloudflare": [
    {
      text: "R2对象存储防盗链",
      link: "/software/cloudflare/r2-waf",
    },
  ],
  "/software/nezha": [
    {
      text: "部署探针",
      link: "/software/nezha/install",
    },
    {
      text: "数据迁移",
      link: "/software/nezha/migrate",
    },
    {
      text: "Telegram机器人通知",
      link: "/software/nezha/telebot",
    },
    {
      text: "美化",
      link: "/software/nezha/beautify",
    },
    {
      text: "DDNS",
      link: "/software/nezha/ddns",
    },
    {
      text: "告警",
      link: "/software/nezha/warning",
    },
    {
      text: "服务",
      link: "/software/nezha/service",
    },
  ],
  "/software/mkdocs": [
    {
      text: "mkdocs-git-committers-plugin-2配置",
      link: "/software/mkdocs/git-committers2",
    },
    {
      text: "内嵌视频",
      link: "/software/mkdocs/video",
    },
  ],
  "/software/jetbrains": [
    {
      text: "无法调整MD单元格内的文字大小",
      link: "/software/jetbrains/cannot-addjust-font-in-md-cell",
    },
  ],
  "/software/xray": [
    {
      text: "实用小脚本",
      items: [
        {
          text: "申请证书",
          link: "/software/apply-cert",
        },
      ],
    },
  ],
  "/software/vmware/": [
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
    {
      text: "切换磁盘为预分配/动态分配",
      link: "/software/vmtools/vmware/disk-switch-allocation",
    },
    {
      text: "VMWare工具",
      link: "/software/vmtools/vmware/vmware-tools",
    },
  ],
  "/software/minio": [
    {
      text: "virtual host 风格",
      link: "/software/minio/virtual-host-style",
    },
    {
      text: "无法加载桶",
      link: "/software/minio/can-not-load-bucket",
    },
    {
      text: "无法启动容器",
      link: "/software/minio/can-not-start",
    },
    {
      text: "awscli",
      link: "/software/minio/aws-cli",
    },
    {
      text: "自定义权限",
      link: "/software/minio/policy-to-one-bucket",
    },
  ],
  "/software/gitea": [
    {
      text: "常用配置",
      link: "/software/gitea/config",
    },
  ],
  "/software/frp": [
    {
      text: "安装",
      link: "/software/frp/install",
    },
    {
      text: "安全",
      link: "/software/frp/tls",
    },
  ],
  "/software/cloudfront": [
    {
      text: "配置",
      link: "/software/cloudfront/config",
    },
    {
      text: "cloudfront配合nginx反向代理",
      link: "/software/cloudfront/nginx-502",
    },
  ],
  "/os/windows": [
    {
      text: "Powershell",
      link: "/os/windows/powershell",
    },
    {
      text: "md5",
      link: "/os/windows/md5",
    },
  ],
  "/os/linux/ubuntu": [
    {
      text: "脚本",
      link: "/os/linux/ubuntu/shell",
    },
    {
      text: "网络",
      link: "/os/linux/ubuntu/network"
    }
  ],
  "/software/jellyfin": [
    {
      text: "自签证书",
      link: "/software/jellyfin/ssl",
    },
  ],
  "/software/torrent": [
    {
      text: "qBittorrent管理页面显示unauthorized",
      link: "/software/torrent/qbittorrent-unauthorized",
    },
  ],
  "/software/filebrowser": [
    {
      text: "配置",
      link: "/software/filebrowser/config",
    },
  ],
  "/software/vscode": [
    {
      text: "配置使用CapsLock作为Escape",
      link: "/software/vscode/capslock-as-esc",
    },
  ],
};
