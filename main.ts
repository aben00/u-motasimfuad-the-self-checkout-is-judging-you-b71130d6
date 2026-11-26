// The Self-Checkout Is Judging You — entry program.
// Writes one funny remark from a judgmental self-checkout machine
// to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).
// Gate: UTF-8 text, 1-200 characters, not only whitespace, single line.
// The em dash in the entry is a single Unicode code point, so the
// character count uses [...text] (code points), not text.length.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Twelve yoghurts and nothing else. I've scanned your whole personality — it expires before the yoghurts do.";

function selfCheck(text) {
  const chars = [...text];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`gate: entry is ${chars.length} chars, must be 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate: entry must be a single line");
  }
}

function main() {
  selfCheck(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  // Read back and verify byte-for-byte.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== ENTRY) {
    throw new Error("verify: read-back does not match entry byte-for-byte");
  }
  console.log(`wrote ${outPath} (${[...ENTRY].length} chars)`);
  console.log(ENTRY);
}

main();
