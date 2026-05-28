# VRCX-0 CSS Hooks

VRCX-0 exposes a small set of CSS variables and hook classes to reduce theme
author friction. These hooks are app-owned entry points, but they are not a
long-term stable Theme API.

## CSS Layer Order

VRCX-0 applies CSS in this order:

1. Built-in app CSS.
2. Official background CSS, if enabled.
3. Installed theme snapshot.
4. User override CSS.

Installed community themes and user override CSS win over official background
CSS. User override CSS wins over installed theme CSS.

## App-wide Image Variables

These variables control an app-wide image layer behind the shell surfaces.

```css
:root {
  --vrcx-0-wallpaper-image: url("https://example.com/image.jpg");
  --vrcx-0-wallpaper-size: cover;
  --vrcx-0-wallpaper-position: center;
  --vrcx-0-wallpaper-repeat: no-repeat;
  --vrcx-0-wallpaper-opacity: 1;
  --vrcx-0-wallpaper-filter: none;
}
```

## Main-content Image Variables

These variables control an image layer behind the center page outlet.

```css
:root {
  --vrcx-0-main-content-wallpaper-image: url("https://example.com/image.jpg");
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

Example transparent shell surfaces:

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

## shadcn and Tailwind Tokens

VRCX-0 uses shadcn UI with Tailwind CSS v4. Tailwind color utilities such as
`bg-background`, `text-muted-foreground`, `border-border`, and `ring-ring` are
mapped through shadcn CSS variables, so theme authors should override the token
variables instead of targeting every generated utility class.

Common shadcn tokens include:

```css
:root {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --radius: 0.625rem;
}
```

Sidebar components use their own token set:

```css
:root {
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}
```

For broad theme color changes, set these variables on `:root`. If the theme
uses `darkMode: true`, the app runs with the `.dark` class and the same
variables can also be scoped under `.dark`.

```css
:root,
.dark {
  --background: oklch(0.18 0.03 260);
  --foreground: oklch(0.97 0.01 260);
  --primary: oklch(0.75 0.16 260);
  --primary-foreground: oklch(0.12 0.02 260);
  --ring: oklch(0.75 0.16 260);
  --sidebar: oklch(0.14 0.03 260);
}
```

Theme CSS is loaded as plain CSS, not compiled by Tailwind. Do not use
Tailwind-only directives such as `@apply` in submitted themes. When a targeted
override is needed, prefer VRCX-0 hooks or shadcn `data-slot` attributes and
write normal CSS:

```css
.vrcx-0-data-table [data-slot="table-row"]:hover {
  background: color-mix(in oklch, var(--muted) 70%, transparent);
}

.vrcx-0-sidebar-surface [data-slot="sidebar-menu-button"][data-active="true"] {
  color: var(--sidebar-primary-foreground);
  background: var(--sidebar-primary);
}
```

Direct Tailwind class selectors and shadcn internals can be used for small
fixes, but they are more fragile than tokens, hook classes, and `data-slot`
selectors.

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
