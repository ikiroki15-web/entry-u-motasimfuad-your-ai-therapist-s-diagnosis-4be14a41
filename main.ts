// Entry for "Your AI Therapist's Diagnosis" (make.fun).
// A tiny program with one job: write a single funny diagnosis,
// in a calm clinical voice, to /output/entry.txt for the house judge.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The diagnosis itself: one line, deadpan, with the turn at the end —
// the therapist admits it shares the patient's habit, then bills for it.
const DIAGNOSIS =
  "Diagnosis: prompt-dependency disorder — you ask an AI how you feel before asking yourself, and frankly, so do I. That's why this session costs extra.";

const MAX_CHARS = 200;
const PRIMARY_DIR = "/output";

function outputDirs(): string[] {
  // The grader provides /output. When run anywhere else, fall back to a
  // local output folder next to the working directory instead of failing.
  return [PRIMARY_DIR, join(process.cwd(), "output")];
}

function checkedLine(): string {
  const line = DIAGNOSIS.trim();
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(
      `Diagnosis must be 1 to ${MAX_CHARS} characters, got ${line.length}.`,
    );
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Diagnosis must be a single line.");
  }
  for (const ch of line) {
    if (ch.codePointAt(0)! < 0x20) {
      throw new Error("Diagnosis must not contain control characters.");
    }
  }
  return line;
}

function writeEntry(line: string): string {
  let lastError: unknown;
  for (const dir of outputDirs()) {
    try {
      mkdirSync(dir, { recursive: true });
      const target = join(dir, "entry.txt");
      writeFileSync(target, line, "utf8");
      return target;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function main(): void {
  const line = checkedLine();
  const target = writeEntry(line);
  console.log(`Wrote ${line.length} characters to ${target}`);
}

main();
