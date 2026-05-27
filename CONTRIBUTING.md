# Contributing Themes

Thank you for contributing a VRCX-0 community theme.

This repository is officially maintained by the VRCX-0 project, but submitted
themes are community-authored content. The goal is to make theme installation
convenient while keeping redistribution, compatibility, and review expectations
explicit.

For file preparation and manifest field details, see `docs/author-guide.md`.

## Pull Request Rules

- One pull request should add or update one theme.
- Do not modify another author's theme unless the author requested it or the
  maintainers asked for a compatibility fix.
- A new theme must include `theme.json`, `theme.css`, `README.md`, and
  `preview.webp`.
- The theme directory name must match `theme.json` `id`.
- `themes/index.json` should only add or keep the theme id string. Do not copy
  theme metadata into the index.
- The `version` field must use semantic versioning and start at `1.0.0` or
  higher.
- The `author.github` field is required.
- The `testedWith` field must be the latest VRCX-0 version the author tested.
- By submitting a theme, the contributor agrees that the submitted theme follows
  GPL-3.0-only for VRCX-0 community theme distribution.
- If the CSS references remote images or fonts, `remoteAssets` must be `true`.
- Set `darkMode` to `true` when the CSS is written against VRCX-0's dark-mode
  base, or `false` when it is written against the light-mode base.
- `preview.webp` must be WebP, compressed, and no larger than 256 KiB.
- The preview image must only include assets the author owns, has permission to
  use, or may redistribute.
- Do not minify or obfuscate CSS. CSS must be reviewable.

## Theme Directory

```text
themes/<theme-id>/
  theme.json
  theme.css
  README.md
  preview.webp
```

`theme.json` is machine-readable metadata. `theme.css` is the CSS installed by
VRCX-0. `README.md` should be a short user-facing theme introduction that can
be shown in the app. `preview.webp` is the required catalog image.

## CSS Policy

Allowed:

- App-owned surface variables documented in `docs/css-hooks.md`.
- Ordinary CSS selectors.
- Tailwind/shadcn class overrides, with the understanding that they are not
  stable.
- External image or font URLs when `remoteAssets` is `true`.

Not allowed:

- CSS that hides or disables recovery, close, exit, login, confirmation, or
  destructive-action UI.
- CSS intended to mislead the user about app state or identity.
- Remote `@import` of CSS files.
- JavaScript, HTML, browser extension code, or build output.
- Minified, generated, encrypted, or intentionally unreadable CSS.

## Remote Assets

Remote images and fonts are allowed when `remoteAssets` is `true`. Authors are
responsible for using assets they have permission to reference or redistribute.

If a theme's externally linked images or CSS code are believed to infringe
someone's rights, please open an issue and I will review and handle it.

## Review Checklist

Before opening a pull request:

- Validate that `theme.json` is strict JSON.
- Check that the theme directory name matches `id`.
- Check that `themes/index.json` contains only the theme id string.
- Check that `remoteAssets` matches the CSS.
- Check that `darkMode` matches the CSS base mode.
- Confirm the UI remains recoverable with the theme enabled.
- Confirm `preview.webp` is included, compressed, and no larger than 256 KiB.
- Confirm the preview image uses only assets the author owns, has permission to
  use, or may redistribute.

## Updating a Theme

Theme updates should bump `version` and update `testedWith` when the theme is
verified against a newer VRCX-0 version.
