import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectDirectory = dirname(dirname(fileURLToPath(import.meta.url)));
const npmExecutable = process.env.npm_execpath;

assert.ok(
  npmExecutable,
  "Run package verification through `npm run check:package`.",
);

const temporaryDirectory = await mkdtemp(join(tmpdir(), "deltaphoto-package-"));
const cacheDirectory = join(temporaryDirectory, "npm-cache");
const consumerDirectory = join(temporaryDirectory, "consumer");

const runNpm = (arguments_, cwd) =>
  execFileSync(process.execPath, [npmExecutable, ...arguments_], {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      npm_config_cache: cacheDirectory,
      npm_config_dry_run: "false",
      npm_config_registry: "https://registry.npmjs.org/",
    },
    stdio: ["ignore", "pipe", "inherit"],
  });

try {
  const packOutput = runNpm(
    ["pack", "--silent", "--pack-destination", temporaryDirectory],
    projectDirectory,
  );
  const tarballName = packOutput.trim().split("\n").at(-1);

  assert.ok(tarballName?.endsWith(".tgz"), "npm pack did not create a tarball");

  const tarballPath = join(temporaryDirectory, tarballName);
  const tarEntries = execFileSync("tar", ["-tzf", tarballPath], {
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .sort();
  const expectedEntries = [
    "package/LICENSE",
    "package/README.md",
    "package/dist/Deltaphoto.d.ts",
    "package/dist/Deltaphoto.d.ts.map",
    "package/dist/Deltaphoto.js",
    "package/dist/Deltaphoto.js.map",
    "package/dist/index.d.ts",
    "package/dist/index.d.ts.map",
    "package/dist/index.js",
    "package/dist/index.js.map",
    "package/dist/styles.css",
    "package/package.json",
  ].sort();

  assert.deepEqual(tarEntries, expectedEntries);

  await mkdir(consumerDirectory);
  await writeFile(
    join(consumerDirectory, "package.json"),
    JSON.stringify({ name: "deltaphoto-consumer", private: true, type: "module" }),
  );

  runNpm(
    [
      "install",
      tarballPath,
      "--ignore-scripts",
      "--legacy-peer-deps",
      "--offline",
      "--no-audit",
      "--no-fund",
    ],
    consumerDirectory,
  );

  const consumerNodeModules = join(consumerDirectory, "node_modules");
  for (const packageName of ["react", "react-dom"]) {
    await symlink(
      await realpath(join(projectDirectory, "node_modules", packageName)),
      join(consumerNodeModules, packageName),
      "dir",
    );
  }

  const typesDirectory = join(consumerNodeModules, "@types");
  await mkdir(typesDirectory);
  for (const packageName of ["react", "react-dom"]) {
    await symlink(
      await realpath(
        join(projectDirectory, "node_modules", "@types", packageName),
      ),
      join(typesDirectory, packageName),
      "dir",
    );
  }

  await writeFile(
    join(consumerDirectory, "verify.mjs"),
    `import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Deltaphoto } from "deltaphoto";

const html = renderToStaticMarkup(
  createElement(Deltaphoto, { before: "/before.jpg", after: "/after.jpg" }),
);

assert.match(html, /deltaphoto__range/);
assert.equal(existsSync(fileURLToPath(import.meta.resolve("deltaphoto/styles.css"))), true);
`,
  );
  execFileSync(process.execPath, [join(consumerDirectory, "verify.mjs")], {
    cwd: consumerDirectory,
    stdio: "inherit",
  });

  await writeFile(
    join(consumerDirectory, "consumer.tsx"),
    `import { Deltaphoto, type DeltaphotoProps } from "deltaphoto";

const props: DeltaphotoProps = {
  before: "/before.jpg",
  after: "/after.jpg",
  onPositionChange: (position) => position.toFixed(1),
};

export const comparison = <Deltaphoto {...props} />;
`,
  );
  await writeFile(
    join(consumerDirectory, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        jsx: "react-jsx",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        noEmit: true,
        strict: true,
        target: "ES2022",
      },
      include: ["consumer.tsx"],
    }),
  );

  execFileSync(
    process.execPath,
    [
      join(projectDirectory, "node_modules", "typescript", "bin", "tsc"),
      "-p",
      join(consumerDirectory, "tsconfig.json"),
    ],
    { cwd: consumerDirectory, stdio: "inherit" },
  );

  const installedPackage = JSON.parse(
    await readFile(
      join(consumerNodeModules, "deltaphoto", "package.json"),
      "utf8",
    ),
  );
  assert.equal(installedPackage.name, "deltaphoto");
  assert.equal(installedPackage.private, undefined);

  console.log(`Verified ${tarballName} in a clean JavaScript and TypeScript consumer.`);
} finally {
  await rm(temporaryDirectory, { force: true, recursive: true });
}
