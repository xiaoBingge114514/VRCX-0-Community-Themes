# VRCX-0 Community Themes

Officially maintained community theme catalog for VRCX-0.

This repository is maintained by the VRCX-0 project, but the themes listed here
are community-authored content. Inclusion in this catalog does not make a theme
an official VRCX-0 skin or endorsement.

This catalog is not a stable Theme API and it does not make VRCX-0 UI internals
public or permanent. Themes use ordinary CSS, and VRCX-0 may change page
structure and styling as the app evolves.

The planned catalog URL is:

```text
https://raw.githubusercontent.com/Map1en/VRCX-0-Community-Themes/master/themes/index.json
```

## Repository Layout

```text
themes/
  index.json
  <theme-id>/
    theme.json
    theme.css
    README.md
    preview.webp
schemas/
  theme.schema.json
  catalog.schema.json
examples/
  theme.example.jsonc
  theme.example.css
docs/
  author-guide.md
  css-hooks.md
  compatibility.md
.github/
  pull_request_template.md
CONTRIBUTING.md
LICENSE
README.md
```

## Theme Package

Each theme package has its own directory under `themes/`.

```text
themes/
  glass-dark/
    theme.json
    theme.css
    README.md
    preview.webp
```

For authoring requirements, see `CONTRIBUTING.md` and `docs/author-guide.md`.

## Manifest

Every theme must include a strict JSON `theme.json` manifest. Start from
`examples/theme.example.jsonc` and validate against `schemas/theme.schema.json`.

## CSS Loading Model

VRCX-0 installs a local snapshot of `theme.css`; it should not live-load a
remote CSS file at runtime. For layer order and app-owned CSS hooks, see
`docs/css-hooks.md`.

## Compatibility Policy

VRCX-0 may change page structure and styling as the app evolves. App
development takes priority, and themes are not guaranteed to stay compatible
across versions. See `docs/compatibility.md`.

## Licenses

The repository framework, documentation, schemas, and validation policy are
licensed under GPL-3.0-only unless stated otherwise.

Themes may omit `license` in `theme.json`. If omitted, the theme is accepted as
GPL-3.0-only. See `CONTRIBUTING.md` for license guidance.

If a theme's externally linked images or CSS code are believed to infringe
someone's rights, please open an issue and I will review and handle it.
