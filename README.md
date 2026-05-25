# VRCX-0 Community Themes

Officially maintained community theme catalog for VRCX-0. The repository is
maintained by the VRCX-0 project, while the themes listed here are community
content.

Catalog URL:

```text
https://raw.githubusercontent.com/Map1en/VRCX-0-Community-Themes/master/themes/index.json
```

## Maintained Themes

- [Bing Daily Wallpaper](themes/bing-daily-wallpaper/) by Map1en
- [NASA APOD Wallpaper](themes/nasa-apod-wallpaper/) by Map1en
- [Trans Theme Example](themes/trans-theme-example/) by Map1en
- [Darkblue Theme](themes/darkblue-theme) by xiaoBingge114514

## Theme Developer Build

Theme authors should download the dedicated VRCX-0 theme developer build from
[package-theme-devkit](https://github.com/Map1en/VRCX-0/actions/workflows/package-theme-devkit.yml).
It is intended for theme CSS development and debugging.

## How The Catalog Works

`themes/index.json` only lists theme ids. VRCX-0 then loads metadata from each
theme directory:

```text
themes/
  index.json
  <theme-id>/
    theme.json
    theme.css
    README.md
    preview.webp
```

VRCX-0 installs a local snapshot of `theme.css`; it should not live-load a
remote CSS file at runtime.

Some catalog entries may be app-coordinated examples. `nasa-apod-wallpaper` is a
special id handled by VRCX-0 so the app can resolve the NASA APOD API before
injecting the installed CSS snapshot.

## Documentation

- Author a theme: `docs/author-guide.md`
- Download the theme developer build:
  [package-theme-devkit](https://github.com/Map1en/VRCX-0/actions/workflows/package-theme-devkit.yml)
- Submit or update a theme: `CONTRIBUTING.md`
- CSS hooks and layer order: `docs/css-hooks.md`
- Compatibility policy: `docs/compatibility.md`
- Manifest examples and schemas: `examples/`, `schemas/`

The repository framework, documentation, schemas, and default theme license are
GPL-3.0-only unless stated otherwise. If a theme omits `license` in
`theme.json`, it is accepted as GPL-3.0-only.
