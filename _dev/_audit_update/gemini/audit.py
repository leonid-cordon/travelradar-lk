import os
import re
from glob import glob

def run_audit():
    project_root = r"d:\Projects\WEB_Travel_Radar_LK"
    
    stats = {
        'total_html_files': 0,
        'index_files_skipped': 0,
        'articles_with_1_subtitle': 0,
        'articles_with_2_subtitles': 0,
        'articles_with_3_plus_subtitles': 0,
        'no_subtitle_found': 0,
    }
    
    files_to_process = []
    for lang in ['en', 'ru', 'ua']:
        search_path = os.path.join(project_root, lang, "content", "**", "*.html")
        files_to_process.extend(glob(search_path, recursive=True))
        
    stats['total_html_files'] = len(files_to_process)
    
    hero_subtitle_pattern = r'<p class="hero-subtitle">.*?</p>'
    
    for file_path in files_to_process:
        if os.path.basename(file_path) == 'index.html':
            stats['index_files_skipped'] += 1
            continue
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            matches = re.findall(hero_subtitle_pattern, content, flags=re.DOTALL)
            count = len(matches)
            
            if count == 0:
                stats['no_subtitle_found'] += 1
            elif count == 1:
                stats['articles_with_1_subtitle'] += 1
            elif count == 2:
                stats['articles_with_2_subtitles'] += 1
            else:
                stats['articles_with_3_plus_subtitles'] += 1
                
        except Exception as e:
            print(f"Error reading {file_path}: {e}")

    print("=" * 40)
    print("AUDIT RESULTS: HERO-SUBTITLE STRUCTURE")
    print("=" * 40)
    print(f"Total HTML files in content folders: {stats['total_html_files']}")
    print(f"Index files (skipped):               {stats['index_files_skipped']}")
    print(f"Files with NO hero-subtitle:         {stats['no_subtitle_found']}")
    print("-" * 40)
    print(f"Articles with 1 hero-subtitle tag:   {stats['articles_with_1_subtitle']}")
    print(f"Articles with 2 hero-subtitle tags:  {stats['articles_with_2_subtitles']}")
    print(f"Articles with 3+ hero-subtitle tags: {stats['articles_with_3_plus_subtitles']}")
    print("=" * 40)
    print(f"Total valid articles to process:     {stats['articles_with_1_subtitle'] + stats['articles_with_2_subtitles'] + stats['articles_with_3_plus_subtitles']}")

if __name__ == "__main__":
    run_audit()
