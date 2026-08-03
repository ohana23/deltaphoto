import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Deltaphoto } from "../dist/index.js";

test("publishes the component, declarations, and stylesheet", () => {
  assert.equal(typeof Deltaphoto, "function");
  assert.equal(existsSync(new URL("../dist/index.d.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../dist/styles.css", import.meta.url)), true);
});

test("renders accessible defaults", () => {
  const html = renderToStaticMarkup(
    createElement(Deltaphoto, {
      before: "/before.jpg",
      after: "/after.jpg",
    }),
  );

  assert.match(html, /src="\/before\.jpg" alt="Before"/);
  assert.match(html, /src="\/after\.jpg" alt="After"/);
  assert.match(html, /type="range"/);
  assert.match(html, /aria-label="Compare before and after images"/);
  assert.match(html, /aria-valuetext="50% before image visible"/);
  assert.match(html, /aria-label="Toggle"/);
  assert.match(html, /--deltaphoto-position:50%/);
});

test("supports labels, inherited div attributes, and visual options", () => {
  const html = renderToStaticMarkup(
    createElement(Deltaphoto, {
      before: "/night.jpg",
      after: "/day.jpg",
      beforeAlt: "Skyline at night",
      afterAlt: "Skyline during the day",
      beforeLabel: "Night",
      afterLabel: "Day",
      ariaLabel: "Compare the skyline at night and during the day",
      className: "comparison",
      id: "skyline-comparison",
      aspectRatio: "16 / 9",
      objectFit: "contain",
      foregroundColor: "#111111",
      backgroundColor: "#eeeeee",
    }),
  );

  assert.match(html, /class="deltaphoto comparison"/);
  assert.match(html, /id="skyline-comparison"/);
  assert.match(html, /alt="Skyline at night"/);
  assert.match(html, /alt="Skyline during the day"/);
  assert.match(html, />Night<\/span>/);
  assert.match(html, />Day<\/span>/);
  assert.match(html, /aria-label="Compare the skyline at night and during the day"/);
  assert.match(html, /aspect-ratio:16 \/ 9/);
  assert.match(html, /--deltaphoto-fit:contain/);
  assert.match(html, /--deltaphoto-foreground:#111111/);
  assert.match(html, /--deltaphoto-background:#eeeeee/);
});

test("clamps initial and controlled positions to the public range", () => {
  const initialHtml = renderToStaticMarkup(
    createElement(Deltaphoto, {
      before: "/before.jpg",
      after: "/after.jpg",
      initialPosition: -20,
    }),
  );
  const controlledHtml = renderToStaticMarkup(
    createElement(Deltaphoto, {
      before: "/before.jpg",
      after: "/after.jpg",
      position: 120,
    }),
  );

  assert.match(initialHtml, /value="0"/);
  assert.match(initialHtml, /--deltaphoto-position:0%/);
  assert.match(controlledHtml, /value="100"/);
  assert.match(controlledHtml, /--deltaphoto-position:100%/);
});

test("can hide visual labels without removing image alternatives", () => {
  const html = renderToStaticMarkup(
    createElement(Deltaphoto, {
      before: "/before.jpg",
      after: "/after.jpg",
      beforeAlt: "Room before renovation",
      afterAlt: "Room after renovation",
      showLabels: false,
    }),
  );

  assert.doesNotMatch(html, /deltaphoto__labels/);
  assert.match(html, /alt="Room before renovation"/);
  assert.match(html, /alt="Room after renovation"/);
});
