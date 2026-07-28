# Contributing

## Renaming the addon

This is the step people get wrong, and the reason the checklist exists rather
than a sentence saying "rename it".

An addon's **slug** is its identity. `ngdpbase.slug` in `package.json` is
authoritative — it is the registry key, the `ngdpbase.addons.<slug>.enabled`
config key, and what ngdpbase's boot-time validator matches against. Change some
of the places it appears and not others, and you get an addon that loads under
one name while being configured under another. It reads as "the addon is
ignoring my config".

A real rename of a deployed addon (`ve-geology` → `geohazardwatch`) took a full
day to propagate from source repo to running pod. Every item below is one of the
places that had to change.

### Checklist

- [ ] `addons/<old>/` → `addons/<new>/` — the directory itself
- [ ] `package.json` → `ngdpbase.slug`
- [ ] `package.json` → `name` (`@scope/<new>`)
- [ ] `index.ts` → the exported `name:` — **must equal the manifest slug**
- [ ] `config/default-config.json` → every `ngdpbase.addons.<old>.*` key
- [ ] Any `engine.registerManager('…')` names you want renamed
- [ ] Static asset routes — `/addons/<old>` → `/addons/<new>`
- [ ] `Dockerfile` → the `COPY` path
- [ ] Instance config on **every deployment** — `ngdpbase.addons.<new>.enabled: true`
- [ ] Downstream deploy manifests (Kustomize / Flux / compose) referencing the old slug

### Do not

- **Do not** end the slug in `-addon`. ngdpbase strips that suffix when deriving
  identity from a folder name, so `foo-addon` resolves to `foo` and your config
  key silently stops matching the folder.
- **Do not** rename seed-page UUIDs. The UUID is the page's identity in the
  wiki; changing it orphans the already-seeded copy and seeds a duplicate.
  Renaming the addon does not require touching them.

### Verify

After renaming, boot the instance and check the log:

```
📦 Discovered add-on: <new>
✅ Add-on loaded: <new>
```

If you see a slug-mismatch warning, `index.ts`'s `name` and the manifest slug
disagree. If you see neither line, the enable key does not match the resolved
slug.

## Seed pages

Pages under `addons/<slug>/pages/` are copied into the wiki when the addon is
first enabled.

- The **filename must be `<uuid>.md`** and the frontmatter `uuid` must match it.
- The UUID must be a real v4 UUID. A placeholder or hand-copied value makes
  ngdpbase skip the page — silently, from the operator's point of view.
- Generate one with `node -e "console.log(crypto.randomUUID())"`.
- Once seeded, the page belongs to the instance. Edits made in the wiki are
  preserved; the addon will not overwrite a page a human has changed.

## Tests

Add tests alongside the code they cover, under `addons/<slug>/__tests__/`.
ngdpbase runs vitest; a test that generates into a temp directory should clean
up only that directory — never a `data/` tree.

## Before opening a PR

- [ ] The addon still loads — check the boot log for `✅ Add-on loaded`
- [ ] `[{Greet}]` (or your plugin) renders on a page
- [ ] No slug-mismatch warning in the log
- [ ] Tests pass
