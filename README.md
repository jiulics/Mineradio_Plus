# Mineradio Plus

Mineradio Plus 是基于原创项目 [XxHuberrr/Mineradio](https://github.com/XxHuberrr/Mineradio) 的二次开发桌面端音乐播放器。它延续原项目的沉浸式粒子视觉、歌词舞台、天气电台和 3D 歌单架体验，并在首页天气、播放同步和桌面端测试体验上继续优化。

## 致敬原创

Mineradio 的原始创意、产品方向、视觉语言、核心交互和基础工程来自原作者 XxHuberrr。感谢原作者开源 Mineradio，也感谢原项目早期共创、体验和测试用户的反馈积累。

本仓库为 `jiulics/Mineradio_Plus` 二次开发分支，不代表原作者官方版本。MR Logo、Mineradio 名称、界面视觉设计与原创视觉表达归原作者所有；本仓库新增代码遵循项目现有 GPL-3.0 授权。

## Plus 版本优化

- 首页施工占位区升级为本地时间 + 天气主视觉卡。
- 天气优先使用 GPS/系统定位，失败时提示手动更新。
- 默认天气城市设为 `东莞市松山湖`，并迁移旧默认城市缓存。
- 继续复用原项目 Open-Meteo 天气电台接口，不新增天气后端。
- 天气氛围条会跟随当前音轨的 bass、beat pulse 和整体能量呼吸。
- 右侧 3D 歌单详情打开后会定位到当前正在播放的歌曲。
- 在 3D 歌单详情中点击播放后不再退出详情视图。
- 普通队列、迷你队列和 3D 队列会在播放切换时同步当前歌曲。
- 新增 Listen1 备份导入兼容，可导入 Listen1 歌单并在未登录时展示本地歌单库。
- Listen1 导入歌曲播放时会通过 Listen1 自动换源桥接尝试网易云、QQ、酷我、酷狗、咪咕的当前可访问版本，不使用 Listen1 旧直链。
- 新增 `scripts/check-home-weather-sync.js` 回归检查脚本，防止首页天气和播放同步逻辑回退。
- 新增 `scripts/check-listen1-compat.js`、`scripts/check-listen1-ui.js` 和 `scripts/check-inline-scripts.js`，用于校验 Listen1 解析、UI 接线和前端内联脚本语法。

## 当前版本

当前 Plus 版本：`1.1.3`

Release 产物以本仓库 GitHub Releases 为准：

- 仓库：https://github.com/jiulics/Mineradio_Plus
- 推荐下载：`Mineradio-1.1.3-Setup.exe`

## 使用说明

Windows 用户下载 Release 中的安装包后直接运行即可。安装包会创建桌面快捷方式。

如果 Windows SmartScreen 或浏览器提示未签名风险，请确认下载来源是本仓库 Release；未签名 Electron 应用可能出现系统提示，属于常见情况。若杀毒软件明确隔离或报高危，请不要强行运行，重新下载或等待后续签名版本。

## 开发运行

```bash
npm install
npm start
```

打包 Windows 安装包：

```bash
npm run build:win
```

打包开发版目录：

```bash
npm run build:win:dir
```

## 验证

本仓库当前使用以下轻量检查作为基础验证：

```bash
node scripts/check-home-weather-sync.js
node scripts/check-listen1-compat.js
node scripts/check-listen1-ui.js
node scripts/check-listen1-audio-bridge.js
node scripts/check-inline-scripts.js
node --check server.js
node --check dj-analyzer.js
node --check desktop/main.js
node --check desktop/preload.js
node --check desktop/overlay-preload.js
```

前端内联脚本语法可用 Node `vm.Script` 解析 `public/index.html` 中的 inline script 进行检查。

## 第三方平台说明

Mineradio Plus 不是网易云音乐、QQ 音乐或腾讯音乐娱乐集团的官方客户端，也不隶属于任何音乐平台。

项目中的第三方平台接入仅用于个人学习、本地客户端体验和用户自有账号的播放辅助。请遵守对应平台的用户协议、版权规则和会员权益规则。项目不会提供绕过付费、绕过会员、破解音质或重新分发音乐内容的能力。

Listen1 兼容功能仅用于读取用户自己导出的 `listen1_backup.json`，把其中的歌单和歌曲元数据导入本地。导入时会丢弃备份中的旧播放直链；播放时通过 Mineradio 的 Listen1 自动换源桥接实时尝试网易云、QQ、酷我、酷狗、咪咕的当前可访问版本。若目标歌曲受会员、版权、地区或平台登录限制，应用会提示、换源或跳过，不会绕过会员、付费、版权、地区或登录限制。

## 隐私与本地数据

登录 Cookie、搜索历史、自定义封面、自定义歌词、节奏分析缓存等数据只应保存在本机用户数据目录或浏览器本地存储中，不应提交到仓库。

更多说明见 [PRIVACY.md](./PRIVACY.md)。

## 版权与授权

Copyright (C) 2026 XxHuberrr.

本项目采用 GPL-3.0 授权。详见 [LICENSE](./LICENSE)。

本二次开发仓库保留并尊重原项目版权与致谢信息。第三方依赖和第三方服务分别遵循其各自授权与服务条款。
