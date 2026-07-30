import os
import re
import json
import argparse
from glob import glob

def process_files(dry_run=False):
    project_root = r"d:\Projects\WEB_Travel_Radar_LK"
    
    with open(os.path.join(project_root, '_dev', '_audit_update', 'schema', 'authors.json'), 'r', encoding='utf-8') as f:
        authors_db = json.load(f)
    leonid = authors_db['leonid_kadantsev']
    claire = authors_db['claire_bennet']
    kimalie = authors_db['kaimile_smith']
    leonid['id'] = 'leonid-kadantsev'
    claire['id'] = 'claire-bennett'
    kimalie['id'] = 'kimalie-smith'
    
    files_to_process = []
    for lang in ['en', 'ru', 'ua']:
        search_path = os.path.join(project_root, lang, "content", "**", "*.html")
        files_to_process.extend(glob(search_path, recursive=True))

    processed_count = 0
    skipped_count = 0
    error_count = 0

    for file_path in files_to_process:
        if os.path.basename(file_path) == 'index.html':
            skipped_count += 1
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find ALL hero-subtitle tags
        matches = list(re.finditer(r'<p class="hero-subtitle">(.*?)</p>', content, flags=re.DOTALL))
        if not matches:
            skipped_count += 1
            continue
            
        original_inner_combined = " ".join([m.group(1) for m in matches])
        
        # Verify it's an article
        if '&bull;' not in original_inner_combined and 'min read' not in original_inner_combined and 'By ' not in original_inner_combined and 'Автор' not in original_inner_combined and 'читання' not in original_inner_combined and 'мин' not in original_inner_combined:
            skipped_count += 1
            continue

        # Extract read time and date
        parts = original_inner_combined.split('&bull;')
        read_time_str = parts[-1].strip()
        
        date_part = parts[-2].strip() if len(parts) >= 2 else "2026"
        for prefix in ["Опубліковано ", "Опубликовано ", "Updated ", "Оновлено ", "Джерела перевірено "]:
            if date_part.startswith(prefix):
                date_part = date_part[len(prefix):]
        if "Опубліковано" in date_part:
            date_part = date_part.split("Опубліковано")[-1].strip()
        if "Опубликовано" in date_part:
            date_part = date_part.split("Опубликовано")[-1].strip()
            
        date_str = date_part
        
        # Determine Reviewer
        is_mexico = '/mexico/' in file_path.replace('\\', '/') or 'cancun' in file_path or 'tulum' in file_path or 'playa-del-carmen' in file_path or 'riviera-maya' in file_path or 'cozumel' in file_path or 'holbox' in file_path
        reviewer = claire if is_mexico else kimalie
        
        # Localize
        if '\\ru\\' in file_path or '/ru/' in file_path:
            by_str = "Автор:"
            rev_str = "Рецензент:"
            lang_prefix = "/ru/"
        elif '\\ua\\' in file_path or '/ua/' in file_path:
            by_str = "Автор:"
            rev_str = "Рецензент:"
            lang_prefix = "/ua/"
        else:
            by_str = "By"
            rev_str = "Reviewed by"
            lang_prefix = "/en/"
            
        new_hero_html = f'<p class="hero-subtitle">{by_str} <a href="{lang_prefix}about#leonid" class="author-link">{leonid["name"]}</a> &bull; {rev_str} <a href="{lang_prefix}about#{reviewer["id"]}" class="author-link">{reviewer["name"]}</a> &bull; {date_str} &bull; {read_time_str}</p>'

        start_idx = matches[0].start()
        end_idx = matches[-1].end()
        new_content = content[:start_idx] + new_hero_html + content[end_idx:]

        json_pattern = r'(<script type="application/ld\+json">\s*\{)(.*?)(\}\s*</script>)'
        json_matches = list(re.finditer(json_pattern, new_content, flags=re.DOTALL))
        
        if not json_matches:
            error_count += 1
            continue

        try:
            article_schema_idx = -1
            article_data = None
            for i, jm in enumerate(json_matches):
                try:
                    data = json.loads("{" + jm.group(2) + "}")
                    if data.get('@type') == 'Article':
                        article_schema_idx = i
                        article_data = data
                        break
                    if isinstance(data, list) and len(data) > 0 and data[0].get('@type') == 'Article':
                        article_schema_idx = i
                        article_data = data
                        break
                except json.JSONDecodeError:
                    pass

            if article_schema_idx != -1:
                target_obj = article_data[0] if isinstance(article_data, list) else article_data
                target_obj['author'] = {
                    "@type": "Person",
                    "name": leonid["name"],
                    "url": f"https://travelradarlk.com{lang_prefix}about#leonid",
                    "sameAs": leonid["sameAs"]
                }
                target_obj['reviewedBy'] = {
                    "@type": "Person",
                    "name": reviewer["name"],
                    "url": f"https://travelradarlk.com{lang_prefix}about#{reviewer['id']}",
                    "sameAs": reviewer["sameAs"] if reviewer.get("sameAs") else []
                }
                
                updated_json = json.dumps(article_data, indent=4, ensure_ascii=False)
                jm = json_matches[article_schema_idx]
                new_json_block = f'<script type="application/ld+json">\n{updated_json}\n</script>'
                new_content = new_content[:jm.start()] + new_json_block + new_content[jm.end():]
            else:
                error_count += 1
                continue
                
        except Exception as e:
            error_count += 1
            continue

        if not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
        
        processed_count += 1

    print(f"--- {'DRY RUN ' if dry_run else ''}SUMMARY ---")
    print(f"Articles ready to be processed: {processed_count}")
    print(f"Files skipped (Hubs/Indexes):   {skipped_count}")
    print(f"Errors (Broken JSON-LD/Format): {error_count}")
    print(f"Total files scanned:            {len(files_to_process)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true', help='Run without saving files')
    args = parser.parse_args()
    process_files(dry_run=args.dry_run)
