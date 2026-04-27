                    (function () {
                        var destinationConfig = { displayName: 'Cancun', defaultEurRate: 0.92 };
                        var originConfig = {
                            europe: { label: 'Europe', baseFlight: 1080, note: '~EUR 1,000 / person' },
                            'usa-ny': { label: 'USA — New York', baseFlight: 480, note: '~$480 / person' },
                            'usa-miami': { label: 'USA — Miami', baseFlight: 360, note: '~$360 / person' },
                            'usa-la': { label: 'USA — Los Angeles', baseFlight: 560, note: '~$560 / person' },
                            canada: { label: 'Canada', baseFlight: 650, note: '~C$700 / person' },
                            other: { label: 'Other', baseFlight: 600, note: '~$600 / person' }
                        };
                        var formatConfig = {
                            budget: { label: 'Budget', hotelBasePerNight: 70, daily: { food: 30, transport: 9, activities: 20, hidden: 14 } },
                            comfort: { label: 'Comfort', hotelBasePerNight: 150, daily: { food: 50, transport: 14, activities: 35, hidden: 20 } },
                            ai: { label: 'All Inclusive', hotelBasePerNight: 300, daily: { food: 12, transport: 14, activities: 28, hidden: 28 } }
                        };
                        var zoneConfig = {
                            north: { label: 'Hotel Zone (north)', multiplier: 1.20 },
                            center: { label: 'Hotel Zone (central)', multiplier: 1.00 },
                            downtown: { label: 'Downtown', multiplier: 0.55 }
                        };
                        var seasonConfig = {
                            0: { season: 'high', flight: 1.16, hotel: 1.15, daily: 1.04 }, 1: { season: 'high', flight: 1.18, hotel: 1.16, daily: 1.05 },
                            2: { season: 'high', flight: 1.14, hotel: 1.12, daily: 1.03 }, 3: { season: 'mid', flight: 1.00, hotel: 1.00, daily: 1.00 },
                            4: { season: 'mid', flight: 0.98, hotel: 0.98, daily: 0.99 }, 5: { season: 'mid', flight: 1.02, hotel: 1.00, daily: 1.01 },
                            6: { season: 'mid', flight: 1.05, hotel: 1.03, daily: 1.02 }, 7: { season: 'mid', flight: 1.03, hotel: 1.02, daily: 1.01 },
                            8: { season: 'low', flight: 0.90, hotel: 0.86, daily: 0.97 }, 9: { season: 'low', flight: 0.88, hotel: 0.84, daily: 0.96 },
                            10: { season: 'mid', flight: 1.04, hotel: 1.05, daily: 1.01 }, 11: { season: 'high', flight: 1.17, hotel: 1.20, daily: 1.06 }
                        };
                        var leadTimeConfig = [
                            { minDays: 0, maxDays: 14, flight: 1.35, hotel: 1.12, label: 'very close to departure' },
                            { minDays: 15, maxDays: 45, flight: 1.15, hotel: 1.06, label: 'close departure date' },
                            { minDays: 46, maxDays: 90, flight: 1.00, hotel: 1.00, label: 'normal booking window' },
                            { minDays: 91, maxDays: 180, flight: 0.93, hotel: 0.97, label: 'early booking' },
                            { minDays: 181, maxDays: 9999, flight: 0.96, hotel: 1.00, label: 'very early estimate, lower accuracy' }
                        ];
                        var monthPartConfig = { firstHalf: { flight: 1.00, hotel: 1.00 }, secondHalf: { flight: 1.03, hotel: 1.04 } };
                        var extrasConfig = {
                            baggage: { type: 'per_person_roundtrip', price: 70 },
                            insurance: { type: 'per_person_trip', price: 35 },
                            transfer: { type: 'per_booking_trip', price: 55 },
                            resort: { type: 'per_night_per_room', price: 18 },
                            esim: { type: 'per_person_trip', price: 18 }
                        };
                        var hotelCatalog = [
                            { name: 'Antillano Hotel', zone: 'downtown', formats: ['budget'], priceMin: 45, priceMax: 72, directUrl: 'https://www.booking.com/searchresults.html?ss=Antillano%20Hotel%20Cancun', tags: ['budget', 'central'] },
                            { name: 'Hostal Natura', zone: 'downtown', formats: ['budget'], priceMin: 50, priceMax: 76, directUrl: 'https://www.booking.com/searchresults.html?ss=Hostal%20Natura%20Cancun', tags: ['wifi', 'clean'] },
                            { name: 'Hotel Plaza Kokai', zone: 'downtown', formats: ['budget', 'comfort'], priceMin: 58, priceMax: 86, directUrl: 'https://www.booking.com/searchresults.html?ss=Hotel%20Plaza%20Kokai%20Cancun', tags: ['market', 'transport'] },
                            { name: 'Riu Caribe', zone: 'center', formats: ['comfort', 'ai'], priceMin: 140, priceMax: 235, directUrl: 'https://www.booking.com/searchresults.html?ss=Riu%20Caribe%20Cancun', tags: ['beach', 'balanced'] },
                            { name: 'Park Royal Beach', zone: 'center', formats: ['comfort'], priceMin: 130, priceMax: 185, directUrl: 'https://www.booking.com/searchresults.html?ss=Park%20Royal%20Beach%20Cancun', tags: ['families', 'central'] },
                            { name: 'The Westin Cancun', zone: 'center', formats: ['comfort'], priceMin: 150, priceMax: 210, directUrl: 'https://www.booking.com/searchresults.html?ss=The%20Westin%20Cancun', tags: ['service', 'beach'] },
                            { name: 'Grand Fiesta Americana', zone: 'north', formats: ['comfort', 'ai'], priceMin: 165, priceMax: 250, directUrl: 'https://www.booking.com/searchresults.html?ss=Grand%20Fiesta%20Americana%20Cancun', tags: ['north', 'best beach'] },
                            { name: 'Krystal Grand Cancun', zone: 'north', formats: ['comfort'], priceMin: 145, priceMax: 205, directUrl: 'https://www.booking.com/searchresults.html?ss=Krystal%20Grand%20Cancun', tags: ['families'] },
                            { name: 'Hyatt Ziva Cancun', zone: 'north', formats: ['ai'], priceMin: 310, priceMax: 440, directUrl: 'https://www.booking.com/searchresults.html?ss=Hyatt%20Ziva%20Cancun', tags: ['premium', 'AI'] },
                            { name: 'Moon Palace Cancun', zone: 'center', formats: ['ai'], priceMin: 290, priceMax: 420, directUrl: 'https://www.booking.com/searchresults.html?ss=Moon%20Palace%20Cancun', tags: ['large resort'] },
                            { name: 'Hard Rock Hotel Cancun', zone: 'center', formats: ['ai'], priceMin: 260, priceMax: 390, directUrl: 'https://www.booking.com/searchresults.html?ss=Hard%20Rock%20Hotel%20Cancun', tags: ['active'] },
                            { name: 'Oasis Palm', zone: 'downtown', formats: ['ai', 'comfort'], priceMin: 180, priceMax: 280, directUrl: 'https://www.booking.com/searchresults.html?ss=Oasis%20Palm%20Cancun', tags: ['affordable AI'] }
                        ];
                        var el = {
                            origin: document.getElementById('c2-origin'), date: document.getElementById('c2-date'), nights: document.getElementById('c2-nights'), people: document.getElementById('c2-people'),
                            budget: document.getElementById('c2-budget'), format: document.getElementById('c2-format'), zone: document.getElementById('c2-zone'),
                            today: document.getElementById('c2-today'), rate: document.getElementById('c2-rate'), min: document.getElementById('c2-price-min'),
                            real: document.getElementById('c2-price-real'), max: document.getElementById('c2-price-max'), badge: document.getElementById('c2-badge'),
                            meta: document.getElementById('c2-current-meta'), breakdown: document.getElementById('c2-breakdown'), budgetState: document.getElementById('c2-budget-state'),
                            budgetSummary: document.getElementById('c2-budget-summary'), options: document.getElementById('c2-budget-options'),
                            savings: document.getElementById('c2-savings'), explain: document.getElementById('c2-explain'),
                            urgTitle: document.getElementById('c2-urgency-title'), urgText: document.getElementById('c2-urgency-text'),
                            ctaLabel: document.getElementById('c2-cta-label'), hotelCards: document.getElementById('c2-hotel-cards'), ctaLink: document.getElementById('c2-cta-link'),
                            baggage: document.getElementById('c2-extra-baggage'),
                            insurance: document.getElementById('c2-extra-insurance'), transfer: document.getElementById('c2-extra-transfer'),
                            resort: document.getElementById('c2-extra-resort'), esim: document.getElementById('c2-extra-esim')
                        };
                        if (!el.origin || !el.date || !el.nights || !el.people || !el.budget || !el.format || !el.zone) return;

                        function clampInt(v, fb, min, max) { var n = parseInt(v, 10); if (isNaN(n)) n = fb; return Math.min(max, Math.max(min, n)); }
                        function roundTo(n, step) { return Math.round(n / step) * step; }
                        function usd(v) { return '$' + Math.round(v).toLocaleString('en-US'); }
                        function eur(v) { return '€' + Math.round(v).toLocaleString('de-DE'); }
                        function clearNode(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
                        function dayStart(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
                        function addDays(d, x) { var c = new Date(d.getTime()); c.setDate(c.getDate() + x); return c; }
                        function formatDateInput(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
                        function parseDateInput(v) {
                            if (!v) return null;
                            var p = v.split('-'); if (p.length !== 3) return null;
                            var y = parseInt(p[0], 10), m = parseInt(p[1], 10) - 1, d = parseInt(p[2], 10);
                            var dt = new Date(y, m, d); if (dt.getFullYear() !== y || dt.getMonth() !== m || dt.getDate() !== d) return null;
                            return dt;
                        }
                        function diffDays(a, b) { return Math.max(0, Math.ceil((dayStart(b).getTime() - dayStart(a).getTime()) / 86400000)); }
                        function dayWord(n) { return n === 1 ? 'day' : 'days'; }
                        function nightWord(n) { return n === 1 ? 'night' : 'nights'; }
                        function personWord(n) { return n === 1 ? 'person' : 'people'; }
                        function roomWord(n) { return n === 1 ? 'room' : 'rooms'; }
                        function formatRuDate(d) { var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; return m[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); }
                        function seasonLabel(k) { return k === 'high' ? 'high season' : (k === 'low' ? 'low season' : 'shoulder season'); }
                        function findLead(days) { for (var i = 0; i < leadTimeConfig.length; i++) if (days >= leadTimeConfig[i].minDays && days <= leadTimeConfig[i].maxDays) return leadTimeConfig[i]; return leadTimeConfig[2]; }
                        function getContext(v) {
                            var now = dayStart(new Date()), dep = parseDateInput(v);
                            if (!dep) dep = addDays(now, 90);
                            dep = dayStart(dep);
                            if (dep.getTime() < now.getTime()) dep = now;
                            var days = diffDays(now, dep);
                            return { today: now, departureDate: dep, daysUntilDeparture: days, season: seasonConfig[dep.getMonth()] || seasonConfig[3], lead: findLead(days), monthPart: dep.getDate() <= 15 ? monthPartConfig.firstHalf : monthPartConfig.secondHalf };
                        }
                        function getExtrasState() {
                            return {
                                baggage: !!(el.baggage && el.baggage.checked),
                                insurance: !!(el.insurance && el.insurance.checked),
                                transfer: !!(el.transfer && el.transfer.checked),
                                resort: !!(el.resort && el.resort.checked),
                                esim: !!(el.esim && el.esim.checked)
                            };
                        }
                        function extrasTotal(s, people, nights, rooms) {
                            var t = 0;
                            Object.keys(s).forEach(function (k) {
                                if (!s[k]) return;
                                var x = extrasConfig[k];
                                if (!x) return;
                                if (x.type === 'per_person_roundtrip' || x.type === 'per_person_trip') t += x.price * people;
                                else if (x.type === 'per_booking_trip') t += x.price;
                                else if (x.type === 'per_night_per_room') t += x.price * nights * rooms;
                            });
                            return t;
                        }
                        function buildScenario(input, ctx, extrasState) {
                            var origin = originConfig[input.origin] || originConfig.other;
                            var format = formatConfig[input.format] || formatConfig.comfort;
                            var zone = zoneConfig[input.zone] || zoneConfig.center;
                            var rooms = Math.max(1, Math.ceil(input.people / 2));
                            var flightReal = origin.baseFlight * input.people * ctx.season.flight * ctx.lead.flight * ctx.monthPart.flight;
                            var hotelReal = format.hotelBasePerNight * zone.multiplier * ctx.season.hotel * ctx.lead.hotel * ctx.monthPart.hotel * input.nights * rooms;
                            var dailyBase = format.daily.food + format.daily.transport + format.daily.activities + format.daily.hidden;
                            var dailyReal = dailyBase * ctx.season.daily * input.nights * input.people;
                            var extrasReal = extrasTotal(extrasState, input.people, input.nights, rooms);
                            var flight = { min: flightReal * 0.92, real: flightReal, max: flightReal * 1.12 };
                            var hotel = { min: hotelReal * 0.95, real: hotelReal, max: hotelReal * 1.10 };
                            var daily = { min: dailyReal * 0.93, real: dailyReal, max: dailyReal * 1.08 };
                            var extras = { min: extrasReal, real: extrasReal, max: extrasReal };
                            return {
                                key: input.format + ':' + input.zone,
                                originLabel: origin.label,
                                originNote: origin.note,
                                formatKey: input.format,
                                formatLabel: format.label,
                                zoneKey: input.zone,
                                zoneLabel: zone.label,
                                nights: input.nights,
                                people: input.people,
                                rooms: rooms,
                                context: ctx,
                                extrasState: extrasState,
                                flight: flight,
                                hotel: hotel,
                                daily: daily,
                                extras: extras,
                                totalMin: roundTo(flight.min + hotel.min + daily.min + extras.min, 50),
                                totalReal: roundTo(flight.real + hotel.real + daily.real + extras.real, 100),
                                totalMax: roundTo(flight.max + hotel.max + daily.max + extras.max, 50)
                            };
                        }
                        function listScenarios(input, ctx, extrasState) {
                            var out = [];
                            var formats = Object.keys(formatConfig);
                            var zones = Object.keys(zoneConfig);
                            formats.forEach(function (f) {
                                zones.forEach(function (z) {
                                    out.push(buildScenario({ origin: input.origin, format: f, zone: z, nights: input.nights, people: input.people }, ctx, extrasState));
                                });
                            });
                            return out;
                        }
                        function scenarioLabel(s) { return s.formatLabel + ' · ' + s.zoneLabel; }
                        function scenarioMeta(s) { return s.nights + ' ' + nightWord(s.nights) + ' · ' + s.people + ' ' + personWord(s.people) + ' · ' + s.rooms + ' ' + roomWord(s.rooms); }
                        function statusForBudget(budget, s) {
                            if (budget >= s.totalReal + 700) return { key: 'fit', label: 'Comfortable buffer' };
                            if (budget >= s.totalReal) return { key: 'tight', label: 'Tight' };
                            if (budget >= s.totalMin) return { key: 'over', label: 'Above budget' };
                            return { key: 'low', label: 'Needs more budget' };
                        }
                        function sortByBudgetFit(arr, budget) {
                            return arr.slice().sort(function (a, b) {
                                var aw = a.totalReal <= budget ? 0 : 1;
                                var bw = b.totalReal <= budget ? 0 : 1;
                                if (aw !== bw) return aw - bw;
                                if (aw === 0) return b.totalReal - a.totalReal;
                                var ag = Math.abs(a.totalReal - budget);
                                var bg = Math.abs(b.totalReal - budget);
                                if (ag !== bg) return ag - bg;
                                return a.totalMin - b.totalMin;
                            });
                        }
                        function pickOptions(current, all, budget) {
                            var sorted = sortByBudgetFit(all, budget);
                            var res = [current];
                            for (var i = 0; i < sorted.length && res.length < 3; i++) {
                                if (sorted[i].key !== current.key) res.push(sorted[i]);
                            }
                            return res;
                        }
                        function renderOptions(options, budget, primaryKey) {
                            clearNode(el.options);
                            if (!el.options) return;
                            options.forEach(function (s) {
                                var card = document.createElement('div');
                                card.className = 'calc2-budget-option' + (s.key === primaryKey ? ' is-primary' : '');
                                var title = document.createElement('div');
                                title.className = 'calc2-budget-option-title';
                                title.textContent = scenarioLabel(s);
                                var price = document.createElement('div');
                                price.className = 'calc2-budget-option-price';
                                price.textContent = 'Realistic: ' + usd(s.totalReal);
                                var meta = document.createElement('div');
                                meta.className = 'calc2-budget-option-meta';
                                meta.textContent = 'Range: ' + usd(s.totalMin) + ' - ' + usd(s.totalMax) + ' · ' + scenarioMeta(s);
                                var note = document.createElement('div');
                                note.className = 'calc2-budget-option-note';
                                note.textContent = budget >= s.totalReal ? 'Fits with a buffer of ' + usd(budget - s.totalReal) : 'Short by ' + usd(s.totalReal - budget);
                                card.appendChild(title);
                                card.appendChild(price);
                                card.appendChild(meta);
                                card.appendChild(note);
                                el.options.appendChild(card);
                            });
                        }
                        function getCheaperFormat(f) { if (f === 'ai') return 'comfort'; if (f === 'comfort') return 'budget'; return null; }
                        function getCheaperZone(z) { if (z === 'north') return 'center'; if (z === 'center') return 'downtown'; return null; }
                        function renderSavings(current, input, ctx, extrasState) {
                            clearNode(el.savings);
                            if (!el.savings) return;
                            var tips = [];
                            function pushTip(title, detail, candidate) {
                                var save = current.totalReal - candidate.totalReal;
                                if (save >= 70) tips.push({ title: title, detail: detail, saving: save });
                            }
                            if (input.nights >= 4) {
                                pushTip('Remove 1 night', 'Shorten the trip by 1 night.',
                                    buildScenario({ origin: input.origin, format: input.format, zone: input.zone, nights: input.nights - 1, people: input.people }, ctx, extrasState));
                            }
                            if (input.nights >= 5) {
                                pushTip('Remove 2 nights', 'The most common saving without changing the travel style.',
                                    buildScenario({ origin: input.origin, format: input.format, zone: input.zone, nights: input.nights - 2, people: input.people }, ctx, extrasState));
                            }
                            var cheapZone = getCheaperZone(input.zone);
                            if (cheapZone) {
                                pushTip('Switch area to ' + zoneConfig[cheapZone].label, 'Same travel style, more affordable area.',
                                    buildScenario({ origin: input.origin, format: input.format, zone: cheapZone, nights: input.nights, people: input.people }, ctx, extrasState));
                            }
                            var cheapFormat = getCheaperFormat(input.format);
                            if (cheapFormat) {
                                pushTip('Switch style to ' + formatConfig[cheapFormat].label, 'Usually the strongest lever on the total price.',
                                    buildScenario({ origin: input.origin, format: cheapFormat, zone: input.zone, nights: input.nights, people: input.people }, ctx, extrasState));
                            }
                            var selectedExtras = Object.keys(extrasState).filter(function (k) { return extrasState[k]; });
                            if (selectedExtras.length) {
                                pushTip('Remove extra costs', 'Add them back later only where they matter.',
                                    buildScenario({ origin: input.origin, format: input.format, zone: input.zone, nights: input.nights, people: input.people }, ctx, { baggage: false, insurance: false, transfer: false, resort: false, esim: false }));
                            }
                            if (ctx.season.season === 'high' || ctx.daysUntilDeparture <= 45) {
                                var shiftedCtx = getContext(formatDateInput(addDays(ctx.departureDate, 42)));
                                pushTip('Shift the date by 4-6 weeks', 'Season and urgency multipliers are often lower.',
                                    buildScenario({ origin: input.origin, format: input.format, zone: input.zone, nights: input.nights, people: input.people }, shiftedCtx, extrasState));
                            }
                            tips.sort(function (a, b) { return b.saving - a.saving; });
                            if (!tips.length) tips.push({ title: 'The current scenario is close to optimal', detail: 'Keep a small buffer for price changes.', saving: 0 });
                            tips.slice(0, 4).forEach(function (tip) {
                                var card = document.createElement('div');
                                card.className = 'calc2-saving-item';
                                var ttl = document.createElement('strong');
                                ttl.textContent = tip.title;
                                var dtl = document.createElement('div');
                                dtl.textContent = tip.detail;
                                card.appendChild(ttl);
                                card.appendChild(dtl);
                                if (tip.saving > 0) {
                                    var amt = document.createElement('div');
                                    amt.className = 'calc2-saving-amount';
                                    amt.textContent = 'Saves about ' + usd(tip.saving);
                                    card.appendChild(amt);
                                }
                                el.savings.appendChild(card);
                            });
                        }
                        function buildExplainText(s) {
                            var extrasCount = Object.keys(s.extrasState).filter(function (k) { return s.extrasState[k]; }).length;
                            var text = 'You are flying from ' + s.originLabel + '. There are ' + s.context.daysUntilDeparture + ' ' + dayWord(s.context.daysUntilDeparture) +
                                ' until the trip (' + s.context.lead.label + '), and the date falls in ' + seasonLabel(s.context.season.season) + '. ';
                            text += 'For ' + s.people + ' ' + personWord(s.people) + ', accommodation is calculated for ' + s.rooms + ' ' + roomWord(s.rooms) + '. ';
                            text += extrasCount > 0 ? 'Extra costs are included, so the total is above the base estimate.' : 'Extra costs are not included, so this is a base estimate.';
                            return text;
                        }
                        function pickHotels(formatKey, zoneKey) {
                            var exact = hotelCatalog.filter(function (h) { return h.zone === zoneKey && h.formats.indexOf(formatKey) > -1; });
                            if (exact.length >= 3) return exact.slice(0, 3);
                            var byFormat = hotelCatalog.filter(function (h) { return h.formats.indexOf(formatKey) > -1; });
                            if (byFormat.length >= 3) return byFormat.slice(0, 3);
                            return hotelCatalog.slice(0, 3);
                        }
                        function bookingSearchUrl(s) {
                            var inDate = formatDateInput(s.context.departureDate);
                            var outDate = formatDateInput(addDays(s.context.departureDate, s.nights));
                            var phrase = destinationConfig.displayName + ' ' + s.zoneLabel;
                            return 'https://www.booking.com/searchresults.html?ss=' + encodeURIComponent(phrase) +
                                '&checkin=' + encodeURIComponent(inDate) + '&checkout=' + encodeURIComponent(outDate) +
                                '&group_adults=' + encodeURIComponent(String(s.people)) + '&no_rooms=' + encodeURIComponent(String(s.rooms)) +
                                '&selected_currency=USD';
                        }
                        function renderHotelCards(s) {
                            clearNode(el.hotelCards);
                            if (!el.hotelCards) return;
                            pickHotels(s.formatKey, s.zoneKey).forEach(function (h) {
                                var link = document.createElement('a');
                                link.href = h.directUrl +
                                    '&checkin=' + encodeURIComponent(formatDateInput(s.context.departureDate)) +
                                    '&checkout=' + encodeURIComponent(formatDateInput(addDays(s.context.departureDate, s.nights))) +
                                    '&group_adults=' + encodeURIComponent(String(s.people)) +
                                    '&no_rooms=' + encodeURIComponent(String(s.rooms));
                                link.target = '_blank';
                                link.rel = 'noopener noreferrer';
                                var card = document.createElement('div');
                                card.className = 'calc2-hotel-card';
                                var name = document.createElement('div');
                                name.className = 'chc-name';
                                name.textContent = h.name;
                                var price = document.createElement('div');
                                price.className = 'chc-price';
                                price.textContent = usd(h.priceMin) + ' - ' + usd(h.priceMax) + ' / night';
                                var tag = document.createElement('div');
                                tag.className = 'chc-tag';
                                tag.textContent = h.tags.join(' · ');
                                var hint = document.createElement('div');
                                hint.className = 'chc-link-hint';
                                hint.textContent = 'Open on Booking';
                                card.appendChild(name);
                                card.appendChild(price);
                                card.appendChild(tag);
                                card.appendChild(hint);
                                link.appendChild(card);
                                el.hotelCards.appendChild(link);
                            });
                        }
                        function renderUrgency(s) {
                            if (!el.urgTitle || !el.urgText) return;
                            if (s.context.daysUntilDeparture <= 14) {
                                el.urgTitle.textContent = 'The trip is close, and prices can rise daily';
                                el.urgText.textContent = 'With this booking window, flights and good hotels usually get more expensive faster.';
                                return;
                            }
                            if (s.context.season.season === 'high') {
                                el.urgTitle.textContent = 'You selected Cancun high season';
                                el.urgText.textContent = 'In peak months, it is better to book early: good options sell out sooner.';
                                return;
                            }
                            if (s.context.daysUntilDeparture >= 181) {
                                el.urgTitle.textContent = 'This estimate is very early';
                                el.urgText.textContent = 'For now, treat it as a planning range; accuracy improves closer to the trip.';
                                return;
                            }
                            el.urgTitle.textContent = 'This is a calm booking window';
                            el.urgText.textContent = 'This period usually gives you a better chance at a good price-quality balance.';
                        }
                        function renderScenario(current, options, budget) {
                            if (el.min) el.min.textContent = usd(current.totalMin);
                            if (el.real) el.real.textContent = usd(current.totalReal);
                            if (el.max) el.max.textContent = usd(current.totalMax);
                            if (el.badge) {
                                el.badge.textContent = current.formatLabel;
                                el.badge.className = 'calc2-category-badge badge-' + current.formatKey;
                            }
                            if (el.meta) el.meta.textContent = current.zoneLabel + ' · ' + scenarioMeta(current) + ' · departure ' + formatDateInput(current.context.departureDate);
                            if (el.breakdown) {
                                el.breakdown.innerHTML = 'Flight: ' + usd(current.flight.real) + ' <span class=\"calc2-inline-note\">(' + current.originNote + ')</span> · Hotel: ' + usd(current.hotel.real) +
                                    ' · Other costs: ' + usd(current.daily.real) + (current.extras.real > 0 ? ' · Extra costs: ' + usd(current.extras.real) : '') +
                                    '<br>EUR reference (realistic): ' + eur(current.totalReal * destinationConfig.defaultEurRate);
                            }
                            var status = statusForBudget(budget, current);
                            if (el.budgetState) {
                                el.budgetState.className = 'calc2-budget-state state-' + status.key;
                                el.budgetState.textContent = status.label;
                            }
                            if (el.budgetSummary) {
                                if (status.key === 'fit') el.budgetSummary.textContent = 'You have a buffer of about ' + usd(budget - current.totalReal) + '. You can keep this scenario and still hold a reserve.';
                                else if (status.key === 'tight') el.budgetSummary.textContent = 'This scenario fits almost exactly. Buffer: about ' + usd(budget - current.totalReal) + '.';
                                else if (status.key === 'over') el.budgetSummary.textContent = 'The realistic estimate is above your budget by ' + usd(current.totalReal - budget) + ', but the low-end scenario may still be possible.';
                                else el.budgetSummary.textContent = 'Even the low-end estimate is above your budget by ' + usd(current.totalMin - budget) + '. You need a more economical setup.';
                            }
                            renderOptions(options, budget, current.key);
                            if (el.explain) el.explain.textContent = buildExplainText(current);
                            renderUrgency(current);
                            renderHotelCards(current);
                            if (el.ctaLabel) el.ctaLabel.textContent = scenarioLabel(current) + ' · ' + scenarioMeta(current);
                            if (el.ctaLink) el.ctaLink.href = bookingSearchUrl(current);
                        }
                        function calc() {
                            var ctx = getContext(el.date.value);
                            el.date.value = formatDateInput(ctx.departureDate);
                            if (el.today) el.today.innerHTML = '<strong>Today:</strong> ' + formatRuDate(ctx.today);
                            if (el.rate) el.rate.innerHTML = '<strong>USD/EUR:</strong> 1 USD ≈ ' + destinationConfig.defaultEurRate.toFixed(2) + ' EUR';
                            var input = {
                                origin: el.origin.value, format: el.format.value, zone: el.zone.value,
                                nights: clampInt(el.nights.value, 7, 3, 30), people: clampInt(el.people.value, 2, 1, 8)
                            };
                            var budget = clampInt(el.budget.value, 5000, 1200, 30000);
                            el.nights.value = input.nights;
                            el.people.value = input.people;
                            el.budget.value = budget;
                            var extrasState = getExtrasState();
                            var current = buildScenario(input, ctx, extrasState);
                            var options = pickOptions(current, listScenarios(input, ctx, extrasState), budget);
                            renderScenario(current, options, budget);
                            renderSavings(current, input, ctx, extrasState);
                        }
                        [el.origin, el.date, el.nights, el.people, el.budget, el.format, el.zone, el.baggage, el.insurance, el.transfer, el.resort, el.esim].forEach(function (node) {
                            if (!node) return;
                            node.addEventListener('change', calc);
                            node.addEventListener('input', calc);
                        });
                        Array.prototype.slice.call(document.querySelectorAll('.calc2-help')).forEach(function (btn) {
                            btn.addEventListener('click', function (e) {
                                e.preventDefault();
                                var t = document.getElementById(btn.getAttribute('data-help-target'));
                                if (t) t.hidden = !t.hidden;
                            });
                        });
                        calc();
                    })();
