import re
import sys
from collections import Counter

file_path = r'd:\Projects\WEB_Travel_Radar_LK\ru\content\best-resorts-snorkeling-access-riviera-maya.html'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
except Exception as e:
    print(f"Error reading file: {e}")
    sys.exit(1)

article_match = re.search(r'<article[^>]*>(.*?)</article>', content, re.DOTALL | re.IGNORECASE)
if not article_match:
    print("No <article> tag found.")
    sys.exit()

article_content = article_match.group(1)

# Remove HTML tags and entities
text = re.sub(r'<[^>]+>', ' ', article_content)
text = re.sub(r'&[a-zA-Z]+;', ' ', text)

words = re.findall(r'\b[A-Za-z]{2,}\b', text)

# List of common English words that indicate UNTRANSLATED text
common_english = {
    'the', 'and', 'is', 'for', 'with', 'you', 'this', 'that', 'are', 'it', 'on', 'to', 'in',
    'at', 'of', 'from', 'we', 'they', 'your', 'can', 'will', 'have', 'has', 'be', 'an', 'or'
}

found_common = [w.lower() for w in words if w.lower() in common_english]
counts_common = Counter(found_common)

if not found_common:
    print("No obvious untranslated English phrases (no common English stop words found).")
else:
    print(f"WARNING: Found {len(found_common)} common English stop words, indicating untranslated text!")
    for w, c in counts_common.most_common():
        print(f" - {w}: {c}")

# Let's also print all English words not in a known list
allowed = {'cancun', 'hotel', 'zone', 'all-inclusive', 'resort', 'resorts', 'mexico', 'playa', 'mujeres', 'punta',
           'kukulcan', 'km', 'cun', 'airport', 'adults-only', 'day-pass', 'expedia', 'booking', 'com', 'tripadvisor',
           'riviera', 'maya', 'cozumel', 'akumal', 'puerto', 'morelos', 'iberostar', 'secrets', 'barcelo', 'grand',
           'sirenis', 'tulum', 'beach', 'club', 'resort', 'spa', 'del', 'carmen', 'eco', 'nature', 'ocean',
           'coral', 'reef', 'bay', 'half', 'moon', 'yal', 'ku', 'cenote'}

unexpected = [w for w in words if w.lower() not in allowed and w.lower() not in common_english]
counts_unexp = Counter(unexpected)

print(f"\nOther English words found (might be brands/locations or untranslated words): {len(unexpected)}")
for w, c in counts_unexp.most_common(20):
    print(f" - {w}: {c}")

