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

Each theme package must have its own directory under `themes/`.

```text
themes/
  glass-dark/
    theme.json
    theme.css
    README.md
    preview.webp
```

The directory name and `theme.json` `id` must match.

`theme.css` is the only CSS entry file. `preview.webp` is required and must use
WebP format. Preview images must be compressed, stripped of unnecessary
metadata, and no larger than 512 KiB.

## Manifest

Every theme must include a `theme.json` file.

```json
{
  "id": "glass-dark",
  "name": "Glass Dark",
  "version": "1.0.0",
  "author": {
    "name": "Author",
    "github": "author",
    "url": "https://example.com"
  },
  "license": "MIT",
  "licenseUrl": "https://opensource.org/license/mit",
  "description": "Community theme for VRCX-0.",
  "tags": ["dark", "glass", "wallpaper"],
  "testedWith": "2.2.1",
  "remoteAssets": false,
  "accentMode": "theme"
}
```

Use strict JSON in real theme manifests. Use `examples/theme.example.jsonc`
only as a commented reference.

## CSS Loading Model

VRCX-0 applies CSS in this order:

1. Built-in app CSS.
2. Installed theme snapshot.
3. User override CSS.

The app should not live-load a remote CSS file at runtime. A theme is installed
by downloading `theme.css`, storing a local snapshot, and injecting that local
snapshot later.

## Compatibility Policy

VRCX-0 may change page structure and styling as the app evolves. App
development takes priority, and themes are not guaranteed to stay compatible
across versions.

## Licenses

The repository framework, documentation, schemas, and validation policy are
licensed under GPL-3.0-only unless stated otherwise.

Each theme must declare its own redistributable license in `theme.json`.
`licenseUrl` is optional but recommended. A separate license file inside every
theme directory is not required.

Recommended license choices:

- `MIT`: recommended for most themes; simple and easy to redistribute.
- `BSD-2-Clause` or `BSD-3-Clause`: permissive and easy to reuse.
- `Apache-2.0`: permissive and GPLv3-compatible.
- `GPL-3.0-only`: compatible with the repository, but more restrictive for
  reuse.
- `CC0-1.0`: acceptable for authors who want the fewest restrictions.

Use one of the recommended licenses unless maintainers approve another
redistributable, GPLv3-compatible license. Do not use non-commercial,
no-derivatives, or all-rights-reserved terms.

This is project policy, not legal advice.
