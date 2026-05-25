# Contributing Themes

Thank you for contributing a VRCX-0 community theme.

This repository is officially maintained by the VRCX-0 project, but submitted
themes are community-authored content. The goal is to make theme installation
convenient while keeping redistribution, compatibility, and review expectations
explicit.

## Pull Request Rules

- One pull request should add or update one theme.
- Do not modify another author's theme unless the author requested it or the
  maintainers asked for a compatibility fix.
- A new theme must include `theme.json`, `theme.css`, `README.md`, and
  `preview.webp`.
- `preview.webp` must be compressed, WebP format, and no larger than 512 KiB.
- The theme directory name must match `theme.json` `id`.
- The `id` must be lowercase kebab-case, for example `glass-dark`.
- The `version` field must use semantic versioning and start at `1.0.0` or
  higher.
- The `author.github` field is required.
- The optional `author.url` field may link to a personal site or profile.
- The `testedWith` field must be the latest VRCX-0 version the author tested.
- The `accentMode` field is boolean: `true` means users can customize accent
  color in VRCX-0, `false` means the theme controls accent color.
- The `license` field is optional. If omitted, the theme is accepted as
  GPL-3.0-only.
- Only set `license` and optional `licenseUrl` when maintainers approve another
  GPLv3-compatible redistributable license.
- `tags` may use any language, but English tags are recommended and only three
  tags are allowed.
- If the CSS references remote images or fonts, `remoteAssets` must be `true`.
- Do not add wallpaper or large binary assets unless the asset license clearly
  allows redistribution.
- Do not minify or obfuscate CSS. CSS must be reviewable.

## Required Files

```text
themes/<theme-id>/
  theme.json
  theme.css
  README.md
  preview.webp
```

`theme.json` is machine-readable metadata. `theme.css` is the CSS installed by
VRCX-0. `README.md` should be a short user-facing theme introduction that can
be shown in the app. `preview.webp` is required.

`preview.webp` requirements:

- File name: `preview.webp`.
- Format: WebP.
- Maximum file size: 512 KiB.
- Use compression and strip unnecessary metadata.

## CSS Policy

Allowed:

- VRCX-0 CSS variables such as `--vrcx-0-wallpaper-image`.
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

Remote assets are allowed but must be explicit.

If your CSS contains `url("https://...")` for an image or font, set:

```json
{
  "remoteAssets": true
}
```

Remote assets can expose user IP address and user agent to the asset host. They
can also disappear, change, or become unavailable. Theme authors are
responsible for using assets that they have permission to reference or
redistribute.

## License Guidance

The `license` field may be omitted. If omitted, the theme is accepted as
GPL-3.0-only. A separate `LICENSE` file inside every theme directory is
optional.

Omitting the field is the default path. It matches this repository's GPLv3
license policy and keeps theme redistribution unambiguous.

Maintainers may approve another redistributable, GPLv3-compatible license when
there is a clear reason. Do not use non-commercial, no-derivatives, or
all-rights-reserved terms.

If a theme's externally linked images or CSS code are believed to infringe
someone's rights, please open an issue and I will review and handle it.

## Compatibility Expectations

Themes are not guaranteed to stay compatible across VRCX-0 versions. See
`docs/compatibility.md` for the compatibility policy.

## Review Checklist

Before opening a pull request:

- Validate that `theme.json` is strict JSON.
- Check that the theme directory name matches `id`.
- Check that `remoteAssets` matches the CSS.
- Confirm any explicit `license` is an approved GPLv3-compatible
  redistributable license. If `license` is omitted, GPL-3.0-only applies.
- Confirm the UI remains recoverable with the theme enabled.
- Confirm `preview.webp` is included, compressed, and no larger than 512 KiB.

## Updating a Theme

Theme updates should bump `version` and update `testedWith` when the theme is
verified against a newer VRCX-0 version.
