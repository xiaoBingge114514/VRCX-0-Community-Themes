# VRCX-0 CSS Hooks

VRCX-0 exposes a small set of CSS variables and hook classes to reduce theme
author friction. These hooks are app-owned entry points, but they are not a
long-term stable Theme API.

## CSS Layer Order

VRCX-0 applies CSS in this order:

1. Built-in app CSS.
2. Installed theme snapshot.
3. User override CSS.

User override CSS wins over installed theme CSS.

## App-wide Wallpaper

Use app-wide wallpaper variables when one image should show behind the full app
shell, including titlebar, sidebars, main content, side panel, and status bar.

```css
:root {
  --vrcx-0-wallpaper-image: url("https://example.com/wallpaper.jpg");
  --vrcx-0-wallpaper-size: cover;
  --vrcx-0-wallpaper-position: center;
  --vrcx-0-wallpaper-repeat: no-repeat;
  --vrcx-0-wallpaper-opacity: 1;
  --vrcx-0-wallpaper-filter: none;
}
```

## Main-content Wallpaper

Use main-content wallpaper variables when only the center page outlet should
show a wallpaper.

```css
:root {
  --vrcx-0-main-content-wallpaper-image: url("https://example.com/center.jpg");
  --vrcx-0-main-content-wallpaper-size: cover;
  --vrcx-0-main-content-wallpaper-position: center;
  --vrcx-0-main-content-wallpaper-repeat: no-repeat;
  --vrcx-0-main-content-wallpaper-opacity: 1;
  --vrcx-0-main-content-wallpaper-filter: none;
}
```

## Surface Variables

Surface variables control the visible background of the major app areas.

```css
:root {
  --vrcx-0-app-surface: hsl(var(--background));
  --vrcx-0-titlebar-surface: hsl(var(--background));
  --vrcx-0-main-surface: hsl(var(--background));
  --vrcx-0-main-content-surface: hsl(var(--background));
  --vrcx-0-sidebar-surface: hsl(var(--sidebar));
  --vrcx-0-sidebar-inset-surface: hsl(var(--background));
  --vrcx-0-side-panel-surface: hsl(var(--background));
  --vrcx-0-statusbar-surface: hsl(var(--background));
  --vrcx-0-table-surface: hsl(var(--card));
  --vrcx-0-table-header-surface: hsl(var(--muted));
}
```

Example app-wide wallpaper surfaces:

```css
:root {
  --vrcx-0-app-surface: transparent;
  --vrcx-0-main-surface: transparent;
  --vrcx-0-main-content-surface: rgb(0 0 0 / 0.35);
  --vrcx-0-titlebar-surface: rgb(0 0 0 / 0.45);
  --vrcx-0-sidebar-surface: rgb(0 0 0 / 0.55);
  --vrcx-0-side-panel-surface: rgb(0 0 0 / 0.55);
  --vrcx-0-statusbar-surface: rgb(0 0 0 / 0.65);
}
```

## Hook Classes and Data Attributes

Current app-owned hooks include:

```text
.vrcx-0-app-root
.vrcx-0-route-host
.vrcx-0-titlebar
.vrcx-0-main-shell
.vrcx-0-sidebar-layout
.vrcx-0-sidebar-surface
.vrcx-0-sidebar-inset
.vrcx-0-main-content
.vrcx-0-side-panel
.vrcx-0-statusbar
.vrcx-0-data-table
.vrcx-0-table-header
```

Major surfaces also expose `data-vrcx-0-surface` values such as
`app-root`, `titlebar`, `main`, `main-content`, `sidebar`, `side-panel`,
`statusbar`, `table`, and `table-header`.

These hooks are less fragile than arbitrary DOM selectors, but they are still
not a permanent compatibility contract.
