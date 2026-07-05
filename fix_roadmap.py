import codecs
import re
import sys

def fix_run_log():
    path = '_dev/en-article-system/run-logs/0103-best-boutique-hotels-tulum-town.md'
    with open(path, 'rb') as f:
        data = f.read()
    
    # Пытаемся декодировать, игнорируя ошибки, либо вручную
    try:
        text = data.decode('utf-8')
    except UnicodeDecodeError:
        # Разделяем на 2 части: оригинальный utf-8 и добавленный cp1251
        text1 = data[:7513].decode('utf-8')
        text2 = data[7513:].decode('cp1251')
        text = text1 + text2
        
    # Заменяем чекбоксы
    text = text.replace('[ ] /publish + build-all', '[x] /publish + build-all')
    text = text.replace('Статус: Translations Complete', 'Статус: Published (EN, RU, UA)')
    
    # Меняем "Следующие шаги" (поскольку там может быть разный текст, найдем регуляркой)
    text = re.sub(r'## Следующие шаги\s*-\s*.*', '## Следующие шаги\n- Статья опубликована.', text)
    
    with codecs.open(path, 'w', 'utf-8') as f:
        f.write(text)

def fix_roadmap():
    path = '_dev/en-article-system/ROADMAP.md'
    with codecs.open(path, 'r', 'utf-8') as f:
        text = f.read()
    
    # Найти строку с 103 и Tulum Town и заменить статус
    # Например: `| 103 | Tulum Town | ... | EN Complete |`
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if 'best-boutique-hotels-tulum-town' in line or '103' in line:
            if '|' in line:
                # Заменим статус на Published (EN, RU, UA)
                lines[i] = re.sub(r'EN Complete[^\|]*\|', 'Published (EN, RU, UA) |', line)
                lines[i] = re.sub(r'Translations Complete[^\|]*\|', 'Published (EN, RU, UA) |', lines[i])
                
    with codecs.open(path, 'w', 'utf-8') as f:
        f.write('\n'.join(lines))

fix_run_log()
fix_roadmap()
print('Fixes applied successfully!')
