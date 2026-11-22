(function (global) {
    'use strict';

    var cfg = global.MAP_LAB_CONFIG || {};
    var cachedPromises = Object.create(null);

    function toLocalSiteUrl(rawUrl) {
        if (!rawUrl) return '#';
        return rawUrl.replace(/^https?:\/\/travelradarlk\.com/i, '');
    }

    function normalizeLinkLang(rawLang) {
        if (rawLang) {
            var lower = String(rawLang).toLowerCase().trim();
            if (lower === 'ru') return 'ru';
            if (lower === 'ua' || lower === 'uk') return 'ua';
            if (lower === 'en') return 'en';
        }
        if (global.location && typeof global.location.pathname === 'string') {
            var m = global.location.pathname.match(/^\/(en|ru|ua)(?:\/|$)/i);
            if (m) return m[1].toLowerCase();
        }
        if (global.document && global.document.documentElement) {
            var docLang = String(global.document.documentElement.lang || '').toLowerCase();
            if (docLang.indexOf('ru') === 0) return 'ru';
            if (docLang.indexOf('uk') === 0 || docLang.indexOf('ua') === 0) return 'ua';
        }
        return 'en';
    }

    function fetchIndexMap(url) {
        if (!url) return Promise.resolve(null);
        return fetch(url)
            .then(function (resp) {
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.json();
            })
            .then(function (json) {
                var records = Array.isArray(json.records) ? json.records : [];
                var bySlug = Object.create(null);
                records.forEach(function (rec) {
                    if (rec && rec.slug) bySlug[rec.slug] = rec;
                });
                return { records: records, bySlug: bySlug };
            })
            .catch(function () {
                return null;
            });
    }

    function loadIndex(indexUrl, linkLang) {
        var lang = normalizeLinkLang(linkLang);
        var enUrl = indexUrl || (cfg.localizedIndexUrls && cfg.localizedIndexUrls.en) || '/assets/data/content-index.en.json';
        var cacheKey = enUrl + '::' + lang;

        if (cachedPromises[cacheKey]) return cachedPromises[cacheKey];

        var enPromise = fetchIndexMap(enUrl);
        var locUrl = (lang !== 'en' && cfg.localizedIndexUrls && cfg.localizedIndexUrls[lang])
            ? cfg.localizedIndexUrls[lang]
            : null;
        var locPromise = locUrl ? fetchIndexMap(locUrl) : Promise.resolve(null);

        cachedPromises[cacheKey] = Promise.all([enPromise, locPromise]).then(function (results) {
            var enData = results[0];
            var locData = results[1];
            if (!enData) return null;
            return {
                records: enData.records,
                bySlug: enData.bySlug,
                localizedBySlug: locData ? locData.bySlug : null,
                linkLang: lang
            };
        });

        return cachedPromises[cacheKey];
    }

    function resolveGuideUrl(indexData, enRecord) {
        if (!enRecord) return '#';
        if (indexData && indexData.localizedBySlug && enRecord.slug) {
            var localizedRec = indexData.localizedBySlug[enRecord.slug];
            if (localizedRec && localizedRec.url) {
                return toLocalSiteUrl(localizedRec.url);
            }
        }
        return toLocalSiteUrl(enRecord.url);
    }

    function pickGuidesForFeature(indexData, props, maxCount) {
        if (!indexData || !props) return [];
        var limit = maxCount || 4;
        var chosen = [];
        var seenSlugs = Object.create(null);
        var seenSections = Object.create(null);

        function addRecord(rec) {
            if (!rec || !rec.slug || seenSlugs[rec.slug]) return false;
            seenSlugs[rec.slug] = true;
            seenSections[rec.primary_section || 'other'] = true;
            var locRec = (indexData && indexData.localizedBySlug) ? indexData.localizedBySlug[rec.slug] : null;
            chosen.push({
                slug: rec.slug,
                title: (locRec && locRec.title) ? locRec.title : rec.title,
                section: (locRec && locRec.section_label) ? locRec.section_label : (rec.section_label || rec.primary_section || 'Guide'),
                url: resolveGuideUrl(indexData, rec)
            });
            return true;
        }

        // 1. Curated slugs first (always authoritative)
        var featured = Array.isArray(props.featuredSlugs) ? props.featuredSlugs : [];
        featured.forEach(function (slug) {
            if (chosen.length >= limit) return;
            addRecord(indexData.bySlug[slug]);
        });

        if (chosen.length >= limit || props.detailLevel !== 'full') {
            return chosen;
        }

        // 2. Smart diverse-section fill by destination / related_destinations
        var destKeys = Array.isArray(props.matchDestinations) ? props.matchDestinations : [];
        if (!destKeys.length) return chosen;

        var candidates = indexData.records.filter(function (rec) {
            if (rec.country !== props.region) return false;
            if (destKeys.indexOf(rec.destination) !== -1) return true;
            if (Array.isArray(rec.related_destinations)) {
                return rec.related_destinations.some(function (d) {
                    return destKeys.indexOf(d) !== -1;
                });
            }
            return false;
        });

        // Prefer guides from sections not yet represented in chosen
        candidates.forEach(function (rec) {
            if (chosen.length >= limit) return;
            if (!seenSections[rec.primary_section]) {
                addRecord(rec);
            }
        });

        // Fill any remaining slots up to limit
        candidates.forEach(function (rec) {
            if (chosen.length >= limit) return;
            addRecord(rec);
        });

        return chosen;
    }

    global.MAP_LAB_GUIDES = {
        loadIndex: loadIndex,
        normalizeLinkLang: normalizeLinkLang,
        pickGuidesForFeature: pickGuidesForFeature
    };
})(window);
