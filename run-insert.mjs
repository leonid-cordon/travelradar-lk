import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';

const jsonStr = readFileSync('temp.json', 'utf8').trim();

console.log("Validating...");
try {
  const out1 = execFileSync('node', ['dev/generator/registry-tool.mjs', 'validate', jsonStr], { encoding: 'utf8' });
  console.log(out1);
} catch (e) {
  console.error("Validate failed:", e.stdout || e.message);
  process.exit(1);
}

console.log("Inserting...");
try {
  const out2 = execFileSync('node', ['dev/generator/registry-tool.mjs', 'insert', 'cancun-in-summer-june-july-august', jsonStr], { encoding: 'utf8' });
  console.log(out2);
} catch (e) {
  console.error("Insert failed:", e.stdout || e.message);
  process.exit(1);
}
