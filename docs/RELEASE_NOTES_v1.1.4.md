# Mineradio Plus v1.1.4

本版本继续基于原创项目 [XxHuberrr/Mineradio](https://github.com/XxHuberrr/Mineradio) 做二次开发。感谢原作者 XxHuberrr 开源 Mineradio，本仓库为 `jiulics/Mineradio_Plus` 非官方 Plus 分支。

## 更新重点

- 首页天气卡现在优先使用 Windows 系统 GPS 定位。
- GPS 坐标会反查为真实地点名，例如 `广东省 · 东莞市 · 东城街道`，坐标仅作为辅助校验显示。
- GPS 失败后会继续尝试浏览器定位和网络 IP 定位，最终回退到默认 `东莞市松山湖`。
- 手动更换城市修复：弹窗不再把 GPS 展示名当输入值，手动城市会正确保存并刷新天气。
- 后端默认天气地点从上海改为 `东莞市松山湖`。
- 后端网络请求支持 `HTTP_PROXY`、`HTTPS_PROXY` 和 `NO_PROXY`，便于天气、反向地理编码和 GitHub 下载走代理。
- Home 播放态保持主界面，不再因为播放/切歌自动退出。
- Home Now Playing 小卡显示当前封面、歌名、歌手和播放状态。
- 右侧播放区域只跟随当前播放队列，同步当前歌曲高亮。
- 首页天气氛围条继续跟随当前音轨的 beat、bass 和整体能量变化。

## 安装包

- 推荐下载：`Mineradio-1.1.4-Setup.exe`
- SHA256：请同时下载 Release 中的 `.sha256` 校验文件。

## 验证

本版本发布前已运行：

```text
node scripts/check-home-weather-sync.js
node scripts/check-inline-scripts.js
node --check server.js
node --check dj-analyzer.js
node --check desktop/main.js
node --check desktop/preload.js
node --check desktop/overlay-preload.js
git diff --check
```

并额外验证：

- `GPS 23.056525,113.767765` 可反查为 `广东省 · 东莞市 · 东城街道`。
- 手动城市 `东莞市松山湖` 不再回退到上海。

## 说明

Mineradio Plus 不是任何音乐平台的官方客户端，不提供绕过会员、付费、版权、地区或登录限制的能力。第三方平台接入仅用于个人学习、本地客户端体验和用户自有账号的播放辅助。
