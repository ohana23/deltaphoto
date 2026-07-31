import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("server-renders the finished Deltaphoto demo", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Before meets after/);
  assert.match(html, /npm install deltaphoto/);
  assert.doesNotMatch(html, /codex-preview|taking shape|loading skeleton/i);
});

test("package output is publishable and dependency-light", async () => {
  const packageRoot = new URL("../packages/deltaphoto/", import.meta.url);
  const packageJson = JSON.parse(
    await readFile(new URL("package.json", packageRoot), "utf8"),
  );
  const component = await readFile(
    new URL("src/Deltaphoto.tsx", packageRoot),
    "utf8",
  );

  assert.equal(packageJson.private, undefined);
  assert.deepEqual(packageJson.peerDependencies, { react: ">=18" });
  assert.equal(packageJson.dependencies, undefined);
  assert.match(component, /type="range"/);
  assert.match(component, /aria-valuetext/);

  await access(new URL("dist/index.js", packageRoot));
  await access(new URL("dist/index.d.ts", packageRoot));
  await access(new URL("dist/styles.css", packageRoot));
  await access(new URL("public/demo/before.png", root));
  await access(new URL("public/demo/after.png", root));
});
