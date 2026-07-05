import { execFileSync } from 'child_process';

const json = JSON.stringify({
  primary_section: "stay",
  country: "mexico",
  region: "riviera-maya",
  destination: "tulum",
  related_destinations: [],
  content_type: "guide",
  tags: ["boutique-hotel", "budget", "booking-checklist"],
  audience: ["couples", "solo", "first-timer"],
  featured: 0,
  intent: "plan"
});

try {
  console.log('Validating...');
  execFileSync('node', ['dev/generator/registry-tool.mjs', 'validate', json], { stdio: 'inherit' });
  console.log('Inserting...');
  execFileSync('node', ['dev/generator/registry-tool.mjs', 'insert', 'best-boutique-hotels-tulum-town', json], { stdio: 'inherit' });
  console.log('Done!');
} catch (e) {
  console.error('Failed!', e.message);
}
