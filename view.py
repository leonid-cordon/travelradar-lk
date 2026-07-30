file_path = r'd:\Projects\WEB_Travel_Radar_LK\en\index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

import re
match = re.search(r'data-country="mexico".*?</a>', content, re.DOTALL)
if match:
    print(match.group(0))
else:
    print("Not found")
