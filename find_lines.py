import re

en_file = r'd:\Projects\WEB_Travel_Radar_LK\en\content\best-budget-all-inclusive-resorts-cancun-hotel-zone.html'
ru_file = r'd:\Projects\WEB_Travel_Radar_LK\ru\content\best-budget-all-inclusive-resorts-cancun-hotel-zone.html'
ua_file = r'd:\Projects\WEB_Travel_Radar_LK\ua\content\best-budget-all-inclusive-resorts-cancun-hotel-zone.html'

with open(en_file, 'r', encoding='utf-8') as f:
    en_lines = f.readlines()

fragments = [
    "~613 rooms &bull;",
    "~214 rooms &bull; buffet",
    "strong for the calm-water beach",
    "~502 rooms &bull;",
    "you are buying the walk-to-nightlife location",
    "~506 rooms &bull;",
    "~617 rooms &bull;",
    "~458 all-suite rooms",
    "Use this search when you want the value sweet spot",
    "One Step Up: Budget-Plus Resorts Worth the Small Splurge",
    "This is the tier for travelers who can stretch a little",
    "The adults-only value resorts are the sharpest pick here",
    "~372 rooms &bull;",
    "~214 rooms &bull; 5 restaurants",
    "~358 rooms &bull;",
    "Use this search when you will spend a little more for newer rooms",
    "the gap between budget and mid-range",
    "Chasing the lowest headline rate",
    "The cheapest \"from\" price often excludes",
    "A budget all-inclusive in Cancun is not the cheapest room",
    "Book this tier when the resort matters a bit more",
    "Adults-Only / Upgraded Riu",
    "Riu's adults-only, upgraded tier near",
    "Very good &mdash; adults-only calm near the strip",
    "sheltered north-central corner, calmer than the open strip",
    "Check before booking:"
]

found_lines = {}
for i, line in enumerate(en_lines):
    for frag in fragments:
        if frag in line:
            found_lines[i] = line
            break

print(f"Found {len(found_lines)} lines to replace.")

# Generate translation dictionary
import json
open('lines_to_translate.json', 'w', encoding='utf-8').write(json.dumps(found_lines, indent=2))
