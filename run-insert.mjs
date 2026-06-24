import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';

const jsonStr = `{"primary_section":"planning","country":"mexico","region":"riviera-maya","destination":"cancun","related_destinations":["playa-del-carmen","tulum","isla-mujeres"],"content_type":"guide","intent":"plan","audience":["family"],"tags":["best-time","hotel-mistakes"],"featured":0}`;

console.log("Validating...");
try {
  const out1 = execFileSync('node', ['dev/generator/registry-tool.mjs', 'validate', jsonStr], { encoding: 'utf8' });
  console.log(out1);
} catch (e) {
  console.error("Validation failed:", e.stdout || e.message);
  process.exit(1);
}

console.log("Inserting...");
try {
  const out2 = execFileSync('node', ['dev/generator/registry-tool.mjs', 'insert', 'spring-break-cancun', jsonStr], { encoding: 'utf8' });
  console.log(out2);
} catch (e) {
  console.error("Insert failed:", e.stdout || e.message);
  process.exit(1);
}
