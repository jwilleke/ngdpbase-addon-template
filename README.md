# ngdpbase-addon-template

A working [ngdpbase](https://github.com/jwilleke/ngdpbase) addon you can copy and rename.

This repository is a **reference implementation**, not a framework. Everything in
it runs as-is: enable it against an ngdpbase instance and you get a `[{Greet}]`
plugin, a registered `GreeterDataManager`, and a seeded wiki page.

## Two ways to start

**Generate a fresh addon** (recommended — you get your own names, and a valid
page UUID, without editing anything):

```bash
# from an ngdpbase checkout
npm run create:addon -- --id my-addon --plugins MyPlugin --managers MyData
```

**Or use this repo as a template** — click *Use this template* on GitHub, then
work through [CONTRIBUTING.md § Renaming the addon](CONTRIBUTING.md#renaming-the-addon).
Renaming by hand has more moving parts than it looks; the checklist exists
because getting it partly right produces an addon that loads under one name and
is configured under another.

## Layout

```
addons/hello-ngdp/
├── package.json      ← the ngdpbase manifest block lives here
├── index.ts          ← register(): wires managers and plugins
├── managers/         ← data layer
├── plugins/          ← [{Markup}] renderers
├── pages/            ← wiki pages seeded on first enable
└── config/           ← config keys this addon reads
Dockerfile            ← wrapper image: ngdpbase + this addon
renovate.json         ← keeps the base image current
```

The repo-level `addons/` directory is the convention: one repository may hold
several addons side by side.

## Enable it

```json
{
  "ngdpbase.addons.hello-ngdp.enabled": true
}
```

Discovery alone never enables an addon. An addon present but not enabled is
silently absent — that is deliberate, not a bug.

Then put `[{Greet}]` on any page.

## The one rule worth reading twice

**The addon's slug is its identity.** `ngdpbase.slug` in `package.json` is
authoritative: it is the registry key, the `ngdpbase.addons.<slug>.enabled`
config key, and what the boot-time validator matches against. The `name`
exported from `index.ts` is a display label and **must equal it**. When they
disagree, ngdpbase warns and uses the manifest slug — so an addon whose label
says one thing and whose config key says another will look mysteriously
disabled.

Do not name the folder `<something>-addon`: ngdpbase strips that suffix when
deriving identity from a folder name, and the config key would stop matching.

## Deploying

The `Dockerfile` here layers the addon into ngdpbase's image as a **drop-in** —
the simplest shape, and fine for development or a private addon.

For production, read
[`addon-packaged.md`](https://github.com/jwilleke/ngdpbase/blob/master/docs/platform/deployment/addon-packaged.md).
The `packaged` (npm) model version-pins the addon independently of the base
image, which is what removes the version-drift class of outage.

## Further reading

| Document | What it covers |
|---|---|
| [Addon development guide](https://github.com/jwilleke/ngdpbase/blob/master/docs/platform/addon-development-guide.md) | Code patterns, the full checklist |
| [Addon architecture](https://github.com/jwilleke/ngdpbase/blob/master/docs/platform/addon-architecture.md) | Distribution models, addon types |
| [Addon identity contract](https://github.com/jwilleke/ngdpbase/blob/master/docs/platform/addon-identity-contract.md) | Every place the slug appears, and what breaks when they drift |
| [Addon page handling](https://github.com/jwilleke/ngdpbase/blob/master/docs/platform/addon-page-handling.md) | How seeded pages sync, and why updates default to frozen |
