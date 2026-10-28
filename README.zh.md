# dsh-just-settings

一个用于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 端的极简 UI 插件：把侧栏左下角的「更多」菜单换成一个「设置」按钮。

| DSH 原生 | 使用本插件后 |
| --- | --- |
| 点「更多」→ 展开菜单（设置 / 意见反馈 / 登录） | 点「设置」→ 直接打开设置面板 |

插件不渲染二级菜单，因此账号菜单里的「登录」和「意见反馈」入口也一并消失。

## 为什么

原生入口是一个账号菜单，设置只是其中一项。如果你用 API Key 或自己的模型服务，这个菜单大多数时候只是绕路——真正需要的只有「设置」。本插件只保留这一个动作：一个按钮、一次点击、没有菜单。

## 要求

- DeepSeek Harness **Web** 界面
- DSH `0.2.1-rc.2`（开发与测试所基于的版本）

## 安装

把 bundle 安装到承载 Web 界面的 profile。示例使用 `web` profile，请替换成你实际使用的 profile 名。

```sh
dsh plugin --profile web add github:lof6yo/dsh-just-settings
```

如果左下角没有立即变化，重启 `dsh web` 并刷新页面。通常 DSH 会热更新新装的客户端 bundle。

### 从本地克隆安装

```sh
git clone https://github.com/lof6yo/dsh-just-settings.git
dsh plugin --profile web add ./dsh-just-settings
```

## 工作原理

- 本包是一个 DSH bundle：`package.json` 同时声明 `dsh.bundle.patch` 和 `dsh.client` Web 入口。
- `cordis.patch.yml` 插入一行 loader entry。
- 浏览器端以 `priority: -1` 注册到 `settings.launcher` 槽位。
- `settings.launcher` 是 **single** 槽位；DSH 渲染优先级最低的占位者，而官方账号启动器的优先级是 `0`，因此本插件遮蔽（shadow）它，而不是删除任何东西。
- 组件就是一个普通按钮：调用槽位提供的 `openSettings`，图标复用共享模块里的官方设置图标，样式使用 DSH 主题 token。

插件没有 Host 端代码，不访问网络、不写存储、不读取账号或凭据数据。

## 兼容性与取舍

- **整个账号入口都会被替换**：即使已登录，侧栏也不会再显示头像和账号（退出登录）菜单。设置页里的「账号」板块由 DSH 提供，不受影响。
- 只能从该菜单进入的「登录」「意见反馈」将无法再从侧栏进入——这正是插件的预期行为。
- 按钮尺寸对齐官方设置入口（展开时 42 px 行高，折叠时 36 px 方块），并跟随侧栏的展开/折叠状态。
- 如果未来的 DSH 修改了 `settings.launcher` 契约，或有其他插件也以 `-1` 优先级注册，本插件可能需要更新。

## 卸载

```sh
dsh plugin --profile web remove dsh-just-settings
```

刷新页面（或重启 `dsh web`），原生「更多」菜单会恢复。

## 开发

源码是纯 JavaScript，没有构建步骤。

| 路径 | 用途 |
| --- | --- |
| `package.json` | 包、bundle 和 client 清单 |
| `cordis.patch.yml` | 插入 loader entry |
| `client.js` | 浏览器端：槽位注册、按钮、样式和文案 |
| `index.js` | Host 端（空） |
| `locale/en.json`、`locale/zh.json` | 插件显示元数据 |
| `icon.svg` | 插件图标 |

语法检查：

```sh
node --check client.js
```

运行中的 DSH 会监听已安装 bundle 的文件变化并热重载客户端模块。以本地链接方式安装时，修改 `client.js` 无需重启宿主即可生效。请通过 `dsh plugin`（或插件页面）添加包，不要手改 profile 的 `package.json`。

## 隐私

本插件只涉及界面，不收集遥测、不连接任何服务器、不修改凭据，也不持久化任何数据。

## 许可证

MIT — 见 [LICENSE](LICENSE)。
