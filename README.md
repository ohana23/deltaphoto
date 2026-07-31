# Deltaphoto

Deltaphoto is a polished before-and-after image comparison component for React, plus the demo site used to develop it.

The public documentation will live with the Writing on [dannyohana.com](https://www.dannyohana.com/writing/before-after). This project keeps the local playground used to develop and test the package.

The publishable package lives in `packages/deltaphoto`. Run `npm run package:build` to create its `dist` folder or `npm run package:pack` to create the npm tarball.

```tsx
import { Deltaphoto } from "deltaphoto";
import "deltaphoto/styles.css";

<Deltaphoto before="/before.jpg" after="/after.jpg" />
```
