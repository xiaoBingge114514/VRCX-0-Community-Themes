# Theme Author Guide

This guide explains how to prepare a VRCX-0 community theme.

## 1. Create a Theme Directory

Use a lowercase kebab-case directory name.

```text
themes/my-theme/
  theme.json
  theme.css
  README.md
  preview.webp
```

The directory name must match `theme.json` `id`.
`preview.webp` is required and must use that exact file name and WebP format.
Keep it compressed, stripped of unnecessary metadata, and no larger than
512 KiB.

## 2. Write theme.json

Start from `examples/theme.example.jsonc`, then remove comments and save strict
JSON as `theme.json`.

Important fields:

- `id`: stable lowercase slug.
- `version`: semantic version starting at `1.0.0`.
- `author.github`: required GitHub username.
- `author.url`: optional personal site or profile link.
- `license`: optional redistributable license for this theme. If omitted,
  GPL-3.0-only applies.
- `licenseUrl`: optional link to the license text when `license` is set.
- `tags`: up to three tags; any language is allowed, English is recommended.
- `testedWith`: latest VRCX-0 version you tested.
- `remoteAssets`: `true` if CSS references remote images or fonts.
- `accentMode`: `true` if users can keep using VRCX-0's built-in accent color
  selector, `false` if the theme controls accent colors.

## 3. Write theme.css

Theme CSS is ordinary CSS. You can use VRCX-0 surface variables, app CSS
variables, and selectors.

Prefer VRCX-0 owned variables for layout-level effects:

- App-wide wallpaper: `--vrcx-0-wallpaper-image`.
- Center-only wallpaper: `--vrcx-0-main-content-wallpaper-image`.
- Shell transparency: `--vrcx-0-*-surface`.

See `docs/css-hooks.md` for the current hook list.

To debug CSS, use the official VRCX-0 repository and start the app in
development mode.

## 4. Write README.md

Write a short introduction for the theme. VRCX-0 may show this text in the app,
so keep it concise and user-facing.

## 5. License the Theme

You may omit the `license` field in `theme.json`. If omitted, the theme is
accepted as GPL-3.0-only. A separate `LICENSE` file inside the theme directory
is optional.

Only set `license` and `licenseUrl` when maintainers approve another
GPLv3-compatible redistributable license. For exceptions and infringement
handling policy, see `CONTRIBUTING.md`.
