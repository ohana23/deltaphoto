# deltaphoto

An accessible, responsive before-and-after image comparison component for React.

## Features

- Pointer, touch, keyboard, and one-click toggle controls
- Controlled and uncontrolled position APIs
- Custom image descriptions, labels, colors, sizing, and object fitting
- TypeScript declarations included
- No runtime dependencies beyond React
- Works with React 18 and newer

## Install

```bash
npm install deltaphoto
```

## Quick start

Import the component and its stylesheet once in your application:

```tsx
import { Deltaphoto } from "deltaphoto";
import "deltaphoto/styles.css";

export function RenovationComparison() {
  return (
    <Deltaphoto
      before="/photos/living-room-before.jpg"
      after="/photos/living-room-after.jpg"
      beforeAlt="Living room before renovation"
      afterAlt="Living room after renovation"
    />
  );
}
```

The component fills the width of its container. Its default aspect ratio is `3 / 2`.

## Controlled position

Use `position` and `onPositionChange` when another part of your application needs to control or observe the comparison position:

```tsx
import { useState } from "react";
import { Deltaphoto } from "deltaphoto";
import "deltaphoto/styles.css";

export function ControlledComparison() {
  const [position, setPosition] = useState(50);

  return (
    <>
      <Deltaphoto
        before="/before.jpg"
        after="/after.jpg"
        position={position}
        onPositionChange={setPosition}
      />
      <p>{Math.round(position)}% before image visible</p>
    </>
  );
}
```

Use `initialPosition` instead when the component should manage its own position.

## Next.js

`Deltaphoto` is a client component and includes the `"use client"` directive. Import the package stylesheet from a location where your Next.js setup permits global CSS, such as your root layout:

```tsx
// app/layout.tsx
import "deltaphoto/styles.css";
```

## Props

`Deltaphoto` also accepts standard `<div>` attributes such as `className`, `id`, `style`, and `data-*` attributes.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `before` | `string` | Required | URL of the image revealed from the left. |
| `after` | `string` | Required | URL of the image shown underneath. |
| `beforeAlt` | `string` | `"Before"` | Alternative text for the before image. |
| `afterAlt` | `string` | `"After"` | Alternative text for the after image. |
| `beforeLabel` | `string` | `"Before"` | Visible label for the before image. |
| `afterLabel` | `string` | `"After"` | Visible label for the after image. |
| `showLabels` | `boolean` | `true` | Shows or hides the visual image labels. |
| `initialPosition` | `number` | `50` | Initial uncontrolled position from `0` to `100`. |
| `position` | `number` | — | Controlled position from `0` to `100`. |
| `onPositionChange` | `(position: number) => void` | — | Called when a user changes the position. |
| `aspectRatio` | `CSSProperties["aspectRatio"]` | `"3 / 2"` | CSS aspect ratio for the comparison. |
| `objectFit` | `CSSProperties["objectFit"]` | `"cover"` | CSS object fitting applied to both images. |
| `foregroundColor` | `CSSProperties["color"]` | `"rgb(55, 55, 55)"` | Control and label foreground color. |
| `backgroundColor` | `CSSProperties["backgroundColor"]` | `"rgb(230, 230, 230)"` | Control and label background color. |
| `ariaLabel` | `string` | `"Compare before and after images"` | Accessible name for the range control. |

Positions outside `0`–`100` are clamped to the supported range.

## Accessibility

The comparison uses a native range input, provides visible keyboard focus styles, supports left and right arrow keys, and exposes the visible percentage to assistive technology. The separate toggle button lets users switch between complete images without dragging.

Provide meaningful `beforeAlt`, `afterAlt`, and `ariaLabel` values that describe the specific comparison. Set an image's alternative text to an empty string only when that image is genuinely decorative.

Motion is disabled when the user has enabled reduced motion in their operating system.

## Custom styling

Use `className` and `style` for layout or surface-level overrides:

```tsx
<Deltaphoto
  className="comparison"
  before="/before.jpg"
  after="/after.jpg"
  aspectRatio="16 / 9"
  objectFit="contain"
  foregroundColor="#111111"
  backgroundColor="#f4f4f5"
/>
```

The component's internal class names use the `deltaphoto__*` prefix. Treat those selectors as an advanced customization surface that may change between major versions.

## Development

This repository pins its development runtime with asdf:

```bash
asdf install
npm install
npm run dev
```

Run every release check locally with:

```bash
npm run check
```

That command typechecks and builds the library, runs the component tests, creates the npm tarball, installs it into a clean temporary consumer, and verifies both JavaScript and TypeScript usage.

See [RELEASING.md](./RELEASING.md) for the publication process.

## License

[MIT](./LICENSE)
