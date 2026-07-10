import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
const json = readFileSync('temp.json', 'utf8').trim();

let res = spawnSync('node', ['dev/generator/registry-tool.mjs', 'validate', json], { stdio: 'inherit', shell: false });
if (res.status === 0) {
  spawnSync('node', ['dev/generator/registry-tool.mjs', 'insert', 'best-eco-resorts-tulum-sustainable-luxury', json], { stdio: 'inherit', shell: false });
}
