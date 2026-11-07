# ArtCraft Theme Palette

Reusable theme reference captured from **ArtCraft - Capable open source tools** at https://getartcraft.com/.

> **Source:** the palette values below were read from the website capture's reported CSS custom properties and rendered design tokens. Values marked as semantic roles are an interpretation of how to reuse those tokens in a new app.

## Core palette

| Token | Hex / value | Suggested role |
|---|---:|---|
| `--bg` | `#121316` | Main page background |
| `--bg-raised` | `#101014` | Cards, panels, navigation |
| `--bg-sunken` | `#060607` | Deep/inset areas |
| `--ink` | `#f2f1ee` | Primary text and icons |
| `--ink-strong` | `#ffffff` | High-emphasis text |
| `--muted` | `#f2f1ee99` | Secondary text |
| `--faint` | `#f2f1ee61` | Low-emphasis text or disabled content |
| `--line` | `#f2f1ee26` | Subtle borders and dividers |
| `--line-strong` | `#f2f1ee66` | Focused or emphasized borders |
| `--accent` | `#2d81ff` | Primary actions, links, focus states |
| `--accent-ink` | `#74aaff` | Accent text on dark surfaces |
| `--danger` | `#ff6259` | Errors, destructive actions, alerts |
| `--invert-bg` | `#ffffff` | Light/inverted surface |
| `--invert-fg` | `#0b0b0c` | Text on an inverted surface |
| `--scanline` | `#ffffff06` | Optional atmospheric overlay |

## Supporting colors

These additional rendered colors appeared in the capture and can be used sparingly for tags, categories, or status indicators:

- Blue: `#2f7bf5`
- Red: `#e8573f`
- Purple: `#8b5cf6`
- Amber: `#f2a516`
- Pink-red: `#e8204f`
- Magenta: `#e0368f`
- Lime: `#7bb51c`
- Green: `#02da96`
- Brown-orange: `#c2672b`
- Teal: `#178a9c`

## Copy-paste CSS

```css
:root {
  --bg: #121316;
  --bg-raised: #101014;
  --bg-sunken: #060607;

  --ink: #f2f1ee;
  --ink-strong: #ffffff;
  --muted: #f2f1ee99;
  --faint: #f2f1ee61;
  --line: #f2f1ee26;
  --line-strong: #f2f1ee66;

  --accent: #2d81ff;
  --accent-ink: #74aaff;
  --danger: #ff6259;

  --invert-bg: #ffffff;
  --invert-fg: #0b0b0c;
}

body {
  background: var(--bg);
  color: var(--ink);
}

.card {
  background: var(--bg-raised);
  border: 1px solid var(--line);
}

button.primary,
a.primary {
  background: var(--accent);
  color: var(--ink-strong);
}

button.primary:hover,
a.primary:hover {
  background: var(--accent-ink);
}
```

## Typography pairing

The captured site uses these font families:

- **Display:** Archivo
- **Body:** Inter
- **Monospace / technical UI:** Geist Mono
- **Optional editorial accent:** Instrument Serif

A practical fallback stack is `Archivo, system-ui, sans-serif` for headings, `Inter, system-ui, sans-serif` for body text, and `ui-monospace, SFMono-Regular, Menlo, monospace` for code or technical labels.

## Design notes

- Use the near-black `--bg-sunken` only for depth; keep most surfaces on `--bg` or `--bg-raised`.
- Keep borders faint and let spacing, contrast, and the blue accent establish hierarchy.
- Reserve `--accent` for interactive emphasis rather than coloring every component.
- Treat the supporting colors as categorical accents, not replacements for the primary blue.
