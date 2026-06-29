# Mineradio Plus

Mineradio Plus 是基于原创项目 [XxHuberrr/Mineradio](https://github.com/XxHuberrr/Mineradio) 的二次开发桌面端音乐播放器。它延续原项目的沉浸式粒子视觉、歌词舞台、天气电台和 3D 歌单架体验，并围绕本地天气、播放队列同步、Listen1 歌单兼容和桌面端发布体验继续优化。

## 致谢原创作者

Mineradio 的原始创意、产品方向、视觉语言、核心交互和基础工程来自原作者 XxHuberrr。感谢原作者开源 Mineradio，也感谢原项目早期共创、体验和测试用户的反馈积累。

本仓库为 `jiulics/Mineradio_Plus` 二次开发分支，不代表原作者官方版本。MR Logo、Mineradio 名称、界面视觉设计与原创视觉表达归原作者所有；本仓库新增代码遵循项目现有 GPL-3.0 授权。

## 当前版本

当前 Plus 版本：`1.1.4`

Release 下载：

- 仓库：https://github.com/jiulics/Mineradio_Plus
- 推荐安装包：`Mineradio-1.1.4-Setup.exe`
- 便携调试包：`win-unpacked` 目录版仅用于本地测试，不作为普通用户首选安装方式。

## Plus 优化内容

- 首页天气卡替换旧施工占位，展示本地时间、日期、真实地点、天气、温度、体感、湿度、风速和音轨联动氛围条。
- 桌面端优先使用 Windows 系统定位获取 GPS 坐标，再回退到浏览器定位、网络 IP 定位和默认城市。
- GPS 坐标会通过反向地理编码显示为真实地点名，例如 `广东省 · 东莞市 · 东城街道`，坐标只作为辅助校验信息展示。
- 默认天气城市统一为 `东莞市松山湖`；旧的上海、当前位置、GPS 临时标签不会污染本地城市缓存。
- 更换城市改为应用内弹窗输入，手动城市会正确保存并刷新天气，不再误用 GPS 展示名。
- 后端网络请求支持 `HTTP_PROXY` / `HTTPS_PROXY` / `NO_PROXY`，便于 GitHub、天气、反向地理编码等请求统一走代理。
- 天气电台请求会传入当前登录/兼容音源偏好，优先尝试 QQ、Listen1、网易云等可用来源。
- Home 下播放音乐不会退出主界面；Now Playing 小卡会显示当前歌曲、歌手和封面。
- 播放态右侧只显示当前播放队列，当前歌曲会高亮并同步到播放进度。
- Home 顶部提供右侧内容显示/隐藏按钮，隐藏 Home 右侧视觉时不影响音乐播放。
- Listen1 兼容功能支持导入用户自己的 Listen1 备份歌单，并在播放时通过 Mineradio 的换源桥接尝试当前可访问版本。

## 安装使用

Windows 用户下载 Release 中的 `Mineradio-1.1.4-Setup.exe` 后直接运行即可。安装包会创建桌面快捷方式。

如果 Windows SmartScreen 或浏览器提示未签名风险，请确认下载来源是本仓库 Release；未签名 Electron 应用可能出现系统提示。若杀毒软件明确隔离或报高危，请不要强行运行，重新下载或等待后续签名版本。

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

如需代理下载 Electron 或访问 GitHub：

```bash
set HTTP_PROXY=http://127.0.0.1:7890
set HTTPS_PROXY=http://127.0.0.1:7890
set NO_PROXY=127.0.0.1,localhost
```

## 验证

发布前建议运行：

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
git diff --check
```

## 第三方平台说明

Mineradio Plus 不是网易云音乐、QQ 音乐或腾讯音乐娱乐集团的官方客户端，也不隶属于任何音乐平台。

项目中的第三方平台接入仅用于个人学习、本地客户端体验和用户自有账号的播放辅助。请遵守对应平台的用户协议、版权规则和会员权益规则。项目不会提供绕过付费、绕过会员、破解音质或重新分发音乐内容的能力。

Listen1 兼容功能仅用于读取用户自己导出的 `listen1_backup.json`，把其中的歌单和歌曲元数据导入本地。导入时会丢弃备份中的旧播放直链；播放时通过 Mineradio 的 Listen1 自动换源桥接实时尝试网易云、QQ、酷我、酷狗、咪咕的当前可访问版本。若目标歌曲受会员、版权、地区或平台登录限制，应用会提示、换源或跳过，不会绕过会员、付费、版权、地区或登录限制。

## 隐私与本地数据

登录 Cookie、搜索历史、自定义封面、自定义歌词、节奏分析缓存、天气城市缓存等数据只应保存在本机用户数据目录或浏览器本地存储中，不应提交到仓库。

更多说明见 [PRIVACY.md](./PRIVACY.md)。

## 版权与授权

Copyright (C) 2026 XxHuberrr.

本项目采用 GPL-3.0 授权。详见 [LICENSE](./LICENSE)。

本二次开发仓库保留并尊重原项目版权与致谢信息。第三方依赖和第三方服务分别遵循其各自授权与服务条款。
