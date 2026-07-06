import subprocess
import json
import sys

data = {
  "primary_section": "stay",
  "country": "mexico",
  "region": None,
  "destination": "isla-mujeres",
  "related_destinations": [],
  "content_type": "guide",
  "audience": ["first-timer", "family", "couples"],
  "intent": "book",
  "tags": ["island-trip", "boutique-hotel", "beaches", "hotel-mistakes"],
  "featured": 0
}

json_str = json.dumps(data)

# validate
result_val = subprocess.run(["node", "dev/generator/registry-tool.mjs", "validate", json_str], capture_output=True, text=True)
print("Validate Output:", result_val.stdout)
if result_val.returncode != 0:
    print("Validate Error:", result_val.stderr)
    sys.exit(1)

# insert
result_ins = subprocess.run(["node", "dev/generator/registry-tool.mjs", "insert", "best-hotels-isla-mujeres", json_str], capture_output=True, text=True)
print("Insert Output:", result_ins.stdout)
if result_ins.returncode != 0:
    print("Insert Error:", result_ins.stderr)
    sys.exit(1)

print("Validation and Insertion successful.")
