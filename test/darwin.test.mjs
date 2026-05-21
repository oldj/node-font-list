/**
 * Darwin font helper integration test.
 * Verifies both the native fontlist binary and the JS API wrapper.
 * Run on macOS via: npm run test:darwin
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { getFonts, getFonts2 } from "../index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const bin = join(__dirname, "..", "libs", "darwin", "fontlist");
const pexecFile = promisify(execFile);
const MAX_BUFFER = 10 * 1024 * 1024;

const WEIGHTS = new Set([
  "ultralight",
  "light",
  "regular",
  "medium",
  "semibold",
  "bold",
  "heavy",
]);
const STYLES = new Set(["normal", "italic"]);
const WIDTHS = new Set(["normal", "condensed", "expanded"]);

const skipReason =
  process.platform !== "darwin" ? "requires macOS" : undefined;

describe("darwin font helper", { skip: skipReason }, () => {
  test("helper binary exists at libs/darwin/fontlist", () => {
    assert.ok(
      existsSync(bin),
      `binary not found at ${bin} (did you run \`npm run build:darwin\`?)`
    );
  });

  test("binary: simple mode prints non-empty family names", async () => {
    const { stdout } = await pexecFile(bin, [], { maxBuffer: MAX_BUFFER });
    const lines = stdout.split("\n").filter(Boolean);
    assert.ok(lines.length > 0, "binary returned no fonts in simple mode");
    for (const line of lines) {
      assert.equal(typeof line, "string");
      assert.ok(line.length > 0);
    }
  });

  test("binary: --detail emits valid JSON with complete typed fields", async () => {
    const { stdout } = await pexecFile(bin, ["--detail"], {
      maxBuffer: MAX_BUFFER,
    });
    const data = JSON.parse(stdout);
    assert.ok(Array.isArray(data), "--detail JSON root must be an array");
    assert.ok(data.length > 0, "binary returned no fonts in --detail mode");
    for (const item of data) {
      assert.equal(typeof item.familyName, "string");
      assert.ok(item.familyName.length > 0);
      assert.equal(typeof item.postScriptName, "string");
      assert.ok(
        WEIGHTS.has(item.weight),
        `unexpected weight ${JSON.stringify(item.weight)} on ${item.familyName}`
      );
      assert.ok(
        STYLES.has(item.style),
        `unexpected style ${JSON.stringify(item.style)} on ${item.familyName}`
      );
      assert.ok(
        WIDTHS.has(item.width),
        `unexpected width ${JSON.stringify(item.width)} on ${item.familyName}`
      );
      assert.equal(typeof item.monospace, "boolean");
    }
  });

  test("binary: -d short flag is equivalent to --detail", async () => {
    const [{ stdout: longFlag }, { stdout: shortFlag }] = await Promise.all([
      pexecFile(bin, ["--detail"], { maxBuffer: MAX_BUFFER }),
      pexecFile(bin, ["-d"], { maxBuffer: MAX_BUFFER }),
    ]);
    assert.equal(shortFlag, longFlag);
  });

  test("binary: simple and --detail return the same font count", async () => {
    const [{ stdout: simple }, { stdout: detail }] = await Promise.all([
      pexecFile(bin, [], { maxBuffer: MAX_BUFFER }),
      pexecFile(bin, ["--detail"], { maxBuffer: MAX_BUFFER }),
    ]);
    const simpleCount = simple.split("\n").filter(Boolean).length;
    const detailCount = JSON.parse(detail).length;
    assert.equal(
      simpleCount,
      detailCount,
      "simple list and --detail must enumerate the same fonts"
    );
  });

  test("JS API: getFonts returns a sorted, non-empty string array", async () => {
    const fonts = await getFonts();
    assert.ok(Array.isArray(fonts), "getFonts must return an array");
    assert.ok(fonts.length > 0, "getFonts returned empty");
    for (const f of fonts) {
      assert.equal(typeof f, "string");
      assert.ok(f.length > 0);
    }
    const sorted = [...fonts].sort((a, b) =>
      a.replace(/^['"]+/, "").toLocaleLowerCase() <
      b.replace(/^['"]+/, "").toLocaleLowerCase()
        ? -1
        : 1
    );
    assert.deepEqual(
      fonts,
      sorted,
      "getFonts output should be sorted (case-insensitive, leading quotes stripped)"
    );
  });

  test("JS API: getFonts2 returns objects with complete typed fields", async () => {
    const fonts = await getFonts2();
    assert.ok(Array.isArray(fonts), "getFonts2 must return an array");
    assert.ok(fonts.length > 0, "getFonts2 returned empty");
    for (const f of fonts) {
      assert.equal(typeof f.name, "string");
      assert.ok(f.name.length > 0);
      assert.equal(typeof f.familyName, "string");
      assert.ok(f.familyName.length > 0);
      assert.equal(typeof f.postScriptName, "string");
      assert.ok(
        WEIGHTS.has(f.weight),
        `unexpected weight ${JSON.stringify(f.weight)} on ${f.name}`
      );
      assert.ok(
        STYLES.has(f.style),
        `unexpected style ${JSON.stringify(f.style)} on ${f.name}`
      );
      assert.ok(
        WIDTHS.has(f.width),
        `unexpected width ${JSON.stringify(f.width)} on ${f.name}`
      );
      assert.equal(typeof f.monospace, "boolean");
    }
  });
});
