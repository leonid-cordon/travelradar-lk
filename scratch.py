import re
import io

text = io.open('d:/Projects/WEB_Travel_Radar_LK/en/content/best-hotels-isla-mujeres.html', 'r', encoding='utf-8').read()
alts = re.findall(r'alt="([^"]+)"', text)
for a in alts:
    print(a)
