# dsh-just-settings

A tiny, UI-only plugin for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web client. It replaces the sidebar footer's **More** menu with a single **Settings** button.

| Stock DSH | With `dsh-just-settings` |
| --- | --- |
| Click **More** → menu with Settings, Feedback and Sign in | Click **Settings** → the settings panel opens |

No second-level menu is rendered, so the account menu's **Sign in** and **Feedback** entries disappear along with it.

## Why

The stock launcher is an account menu that also happens to contain Settings. If you use an API key or another model provider, that menu is mostly a detour: the only entry you need is Settings. This plugin keeps that one action and removes the rest — one button, one click, no menu.

## Requirements

- DeepSeek Harness **Web** UI
- DSH `0.2.1-rc.2` (the version this plugin was written and tested against)

## Install

Install the bundle into the profile that serves your Web UI. The examples use the `web` profile; replace it with the profile you actually run.

```sh
dsh plugin --profile web add github:lof6yo/dsh-just-settings
```

Restart `dsh web` and reload the page if the launcher does not change immediately. DSH normally hot-applies a newly installed client bundle.

### From a local clone

```sh
git clone https://github.com/lof6yo/dsh-just-settings.git
dsh plugin --profile web add ./dsh-just-settings
```

## How it works

- The package is a DSH bundle. `package.json` declares `dsh.bundle.patch` and a `dsh.client` Web entry.
- `cordis.patch.yml` inserts one loader row for the package.
- The browser half registers a component into the `settings.launcher` slot at priority `-1`.
- `settings.launcher` is a **single** slot. DSH renders the occupant with the lowest priority, and the shipped account launcher registers at `0`, so this plugin shadows that launcher instead of deleting anything.
- The component is a plain button. It calls the slot's `openSettings` prop, uses the shipped settings icon from the shared primitives module, and uses DSH theme tokens for its styling.

The plugin has no host-side code. It makes no network requests, writes no storage, and reads no account or credential data.

## Compatibility and trade-offs

- **The whole account launcher is replaced.** The sidebar no longer shows an avatar or the account (sign-out) menu, even when signed in. The Settings → Account page is provided by DSH and is unaffected.
- Actions that are only reachable from that menu (**Sign in**, **Feedback**) are no longer reachable from the sidebar. That is the intended behavior.
- The button mirrors the stock Settings trigger geometry (42 px row, 36 px collapsed-rail button) and follows the sidebar's expanded/collapsed width.
- If a future DSH release changes the `settings.launcher` contract or registers another launcher at priority `-1`, the plugin may need an update.

## Uninstall

```sh
dsh plugin --profile web remove dsh-just-settings
```

Reload the page (or restart `dsh web`). The stock **More** menu returns.

## Development

The source is plain JavaScript; there is no build step.

| Path | Purpose |
| --- | --- |
| `package.json` | package, bundle and client manifests |
| `cordis.patch.yml` | inserts the loader row |
| `client.js` | browser half: slot registration, button, styles and copy |
| `index.js` | host half (empty) |
| `locale/en.json`, `locale/zh.json` | plugin display metadata |
| `icon.svg` | plugin icon |

Syntax check:

```sh
node --check client.js
```

A running DSH watches installed bundle files and reloads a changed client module. When the plugin is installed from a linked local checkout, edits to `client.js` apply without restarting the host. Add the package through `dsh plugin` (or your Plugins page) rather than editing the profile's `package.json` by hand.

## Privacy

This plugin is UI-only. It does not collect telemetry, contact any server, modify credentials, or persist anything.

## License

MIT — see [LICENSE](LICENSE).
