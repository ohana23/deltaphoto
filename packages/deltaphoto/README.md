# deltaphoto

A polished, accessible before-and-after image comparison component for React. It has no runtime dependencies beyond React and works with mouse, touch, and keyboard input.

```bash
npm install deltaphoto
```

```tsx
import { Deltaphoto } from "deltaphoto";
import "deltaphoto/styles.css";

export function Renovation() {
  return (
    <Deltaphoto
      before="/room-before.jpg"
      after="/room-after.jpg"
    />
  );
}
```

The only required props are `before` and `after`. Labels, alt text, the starting position, image fit, aspect ratio, controlled state, and styling are all optional.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `before` | `string` | required |
| `after` | `string` | required |
| `beforeAlt` | `string` | `"Before"` |
| `afterAlt` | `string` | `"After"` |
| `beforeLabel` | `string` | `"Before"` |
| `afterLabel` | `string` | `"After"` |
| `showLabels` | `boolean` | `true` |
| `initialPosition` | `number` | `50` |
| `position` | `number` | uncontrolled |
| `onPositionChange` | `(position: number) => void` | — |
| `aspectRatio` | CSS `aspect-ratio` value | `"3 / 2"` |
| `objectFit` | CSS `object-fit` value | `"cover"` |
| `foregroundColor` | CSS color value | `"#000"` |
| `backgroundColor` | CSS color value | `"#fff"` |
| `ariaLabel` | `string` | comparison description |

All other props are passed to the root element, including `className`, `style`, and `data-*` attributes.
