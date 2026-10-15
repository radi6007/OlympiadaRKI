import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
// The organiser-supplied source is a trusted, private server file, never bundled
// or served. Invoke its exact grader, including normalization and partial credit.
export function loadScoring(path) {
  const source = readFileSync(path, 'utf8');
  const ctx = vm.createContext(Object.create(null), {codeGeneration: {strings: false, wasm: false}});
  vm.runInContext(source, ctx, {timeout: 1000});
  const version = createHash('sha256').update(source).digest('hex');
  const tests = JSON.parse(JSON.stringify(ctx.TESTS));
  const run = new vm.Script('JSON.stringify(grade_(__testId, JSON.parse(__answers)))');
  return {
    version, tests, headers: [...ctx.HEAD_FIXED],
    grade(testId, answers) {
      ctx.__testId = testId; ctx.__answers = JSON.stringify(answers);
      try { return JSON.parse(run.runInContext(ctx, {timeout: 1000})); }
      finally { delete ctx.__testId; delete ctx.__answers; }
    },
  };
}
