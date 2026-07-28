# Hello Ngdp

Hello Ngdp addon for [ngdpbase](https://github.com/jwilleke/ngdpbase).

- **Slug:** `hello-ngdp` — the canonical identity. It is the registry key and the
  config key, and it must equal the `name` exported from `index.ts`.
- **Type:** `additive` — augments an existing wiki.

## Enable

```json
{
  "ngdpbase.addons.hello-ngdp.enabled": true
}
```

## Contents

| Path | What it is |
|---|---|
| `managers/GreeterDataManager.ts` | Data layer, registered as `GreeterDataManager` |
| `plugins/GreetPlugin.ts` | Renders `[{Greet}]` on a page |
| `pages/` | Seed pages copied into the wiki on first enable |
| `config/default-config.json` | Config keys this addon reads |

## Develop

Drop this directory into an ngdpbase instance's `addons/` (or point
`ngdpbase.managers.addons-manager.addons-path` at its parent), enable it, and
restart. For production, see the platform's `packaged` distribution model.
