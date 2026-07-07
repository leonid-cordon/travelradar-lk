import re
import json

def scan_file(filepath, lang):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Extract article
    article_match = re.search(r'<article[^>]*>(.*?)</article>', html, re.DOTALL)
    if not article_match:
        return []
    article_content = article_match.group(1)

    # Remove tags to get text nodes
    # Let's just find anything resembling english words in the article text (excluding tags)
    
    # regex to find text outside tags
    text_chunks = re.findall(r'>([^<]+)<', article_content)
    
    allowed = {'cancun', 'hotel', 'zone', 'all-inclusive', 'all', 'inclusive', 'resorts', 'resort', 'riu', 'oasis', 'palm', 'krystal', 
            'punta', 'caribe', 'playa', 'langosta', 'crown', 'paradise', 'club', 'wyndham', 'alltra', 'palace', 
            'las', 'americas', 'golden', 'parnassus', 'occidental', 'costa', 'barcelo', 'grand', 'bahia', 'mujeres',
            'usd', 'usd', 'pp', 'night', 'value', 'score', 'excellent', 'very', 'good', 'fair', 
            'rooms', 'restaurants', 'buffet', 'a', 'la', 'carte', 'renovated', 'rebrand', 'central', 'north', 'bay', 
            'adults-only', 'water', 'park', 'ongoing', 'refurb', 'tiered', 'complex', 'usf', 'optical', 'oceanography',
            'lab', 'profeco', 'mexican', 'consumer', 'agency', 'featured', 'snippet', 'overview', 'google',
            'fee', 'day-pass', 'upsell', 'beach', 'min-stay', 'tips', 'money', 'topic', 'stat-row', 'price-grid',
            'budget-cards', 'hidden-costs', 'hotel-card', 'cta', 'related-links', 'faq', 'toc', 'anchor', 
            'data-n', 'json-ld', 'faqpage', 'bom', 'false', 'tables', 'quick-facts', 'value-score', 'mobile-btn',
            'article-image', 'inline', 'style', 'valid', 'parity', 'exact', 'category', 'our', 'pick', 'why', 'it', 'wins',
            'overall', 'cheapest', 'calm', 'base', 'camp', 'sweet', 'spot', 'one-step-up', 'avoid-too-cheap',
            'km', 'min', 'cun', 'usd'}

    errors = []
    
    for chunk in text_chunks:
        # Check if this chunk has multiple english words that are not in allowed list
        words = re.findall(r'[a-zA-Z]{3,}', chunk)
        unallowed = [w for w in words if w.lower() not in allowed]
        
        # If we have common english stop words or many unallowed words
        common_en = {'the', 'and', 'to', 'of', 'in', 'is', 'for', 'that', 'this', 'you', 'it', 'with', 'on', 'as', 'are', 'be', 'at', 'or', 'from', 'but'}
        has_common = any(w.lower() in common_en for w in words)
        
        if len(unallowed) > 2 or has_common:
            errors.append(chunk.strip())

    return errors

ru_errors = scan_file(r'd:\Projects\WEB_Travel_Radar_LK\ru\content\best-budget-all-inclusive-resorts-cancun-hotel-zone.html', 'RU')
ua_errors = scan_file(r'd:\Projects\WEB_Travel_Radar_LK\ua\content\best-budget-all-inclusive-resorts-cancun-hotel-zone.html', 'UA')

print("RU ERRORS:")
for e in ru_errors:
    print(e)
print("------")
print("UA ERRORS:")
for e in ua_errors:
    print(e)

