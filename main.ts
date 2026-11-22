// Entry point for the gta6-meme-x-01 bounty, entry 6.
//
// The entry is the X post itself: a GTA 6 birth-certificate meme, posted
// from a public account with make.fun and the entrant's play code in its
// text. The house reads that post straight from X and hands its first
// picture and its text to the judge. This program does not judge, rank or
// describe the post, and it does not need the picture: the picture lives
// on the post, not in this repository.
//
// The program's whole job is to hand POST.json to the grader. It reads
// the file from the repository root, checks that it parses as JSON and
// names a post address, and writes the same bytes to the output
// directory, where the sealed scorer reads them. Nothing else.
//
// Deliberately, it asks for nothing else in the repository. Our fifth
// entry's program demanded a PNG file in the repo root and exited 1
// without it — but the submitted snapshot never carries the PNG, so the
// run died before writing anything and the entry was never graded. The
// picture lives on the X post, where the judge reads it; no file gate
// here may ever stand between POST.json and /output again.
//
// Outside the grader's sandbox the two directories are stood in for by
// environment variables, so the same run works on a laptop:
//
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// After that run, out/POST.json is byte for byte this directory's
// POST.json, and the entry is ready to be checked and submitted.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const postPath = join(BOT_DIR, "POST.json");
const outPath = join(OUTPUT_DIR, "POST.json");

let postBytes: Buffer;
try {
  postBytes = readFileSync(postPath);
} catch (err) {
  console.error(`could not read POST.json from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

let post: unknown;
try {
  post = JSON.parse(postBytes.toString("utf8"));
} catch (err) {
  console.error(`POST.json does not parse as JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof post !== "object" || post === null || typeof (post as { url?: unknown }).url !== "string") {
  console.error("POST.json must be an object with a string url field");
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(outPath, postBytes);
console.log(`POST.json handed to the grader: ${(post as { url: string }).url}`);
