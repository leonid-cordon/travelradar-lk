import { execSync } from 'child_process';
const json = JSON.stringify({
  primary_section: "stay",
  country: "mexico",
  region: "riviera-maya",
  destination: "riviera-maya",
  content_type: "listicle",
  audience: [],
  intent: "plan",
  tags: ["snorkeling", "beaches"],
  featured: 0,
  related_destinations: ["cozumel", "playa-del-carmen"]
});

try {
  execSync(`node dev/generator/registry-tool.mjs insert best-resorts-snorkeling-access-riviera-maya "${json.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
} catch (e) {
  console.log("Error inserting record.");
}
