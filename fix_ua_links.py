import re

ua_file = r'd:\Projects\WEB_Travel_Radar_LK\ua\content\best-resorts-snorkeling-access-riviera-maya.html'

with open(ua_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Safe replacements for internal links
content = content.replace('href="/ru/', 'href="/ua/')
content = content.replace('href="https://travelradarlk.com/ru/', 'href="https://travelradarlk.com/ua/')

# Now fix the hreflang tags if they got messed up
# The alternate tags should be:
# hreflang="ru" -> href="https://travelradarlk.com/ru/..."
# hreflang="en" -> href="https://travelradarlk.com/en/..."
# hreflang="uk" -> href="https://travelradarlk.com/ua/..."
# hreflang="x-default" -> href="https://travelradarlk.com/en/..."

content = re.sub(
    r'<link rel="alternate" hreflang="ru" href="[^"]+">',
    r'<link rel="alternate" hreflang="ru" href="https://travelradarlk.com/ru/content/best-resorts-snorkeling-access-riviera-maya">',
    content
)
content = re.sub(
    r'<link rel="alternate" hreflang="en" href="[^"]+">',
    r'<link rel="alternate" hreflang="en" href="https://travelradarlk.com/en/content/best-resorts-snorkeling-access-riviera-maya">',
    content
)
content = re.sub(
    r'<link rel="alternate" hreflang="x-default" href="[^"]+">',
    r'<link rel="alternate" hreflang="x-default" href="https://travelradarlk.com/en/content/best-resorts-snorkeling-access-riviera-maya">',
    content
)

with open(ua_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed UA links!")
