(function () {
    var destinationConfig = { displayName: 'Cancun', defaultEurRate: 0.92 };
    var originConfig = {
        europe: { label: 'Европа', baseFlight: 1080, note: '~1000 EUR / человек' },
        'usa-ny': { label: 'США - Нью-Йорк', baseFlight: 480, note: '~$480 / человек' },
        'usa-miami': { label: 'США - Майами', baseFlight: 360, note: '~$360 / человек' },
        'usa-la': { label: 'США - Лос-Анджелес', baseFlight: 560, note: '~$560 / человек' },
        canada: { label: 'Канада', baseFlight: 650, note: '~C$700 / человек' },
        other: { label: 'Другое направление', baseFlight: 600, note: '~$600 / человек' }
    };
    var formatConfig = {
        budget: { label: 'Budget', hotelBasePerNight: 70, daily: { food: 30, transport: 9, activities: 20, hidden: 14 } },
        comfort: { label: 'Comfort', hotelBasePerNight: 150, daily: { food: 50, transport: 14, activities: 35, hidden: 20 } },
        ai: { label: 'All Inclusive', hotelBasePerNight: 300, daily: { food: 12, transport: 14, activities: 28, hidden: 28 } }
    };
    var zoneConfig = {
        north: { label: 'Hotel Zone - север', multiplier: 1.20 },
        center: { label: 'Hotel Zone - центр', multiplier: 1.00 },
        downtown: { label: 'Downtown', multiplier: 0.55 }
    };
    var seasonConfig = {
        0: { season: 'high', flight: 1.16, hotel: 1.15, daily: 1.04 },
        1: { season: 'high', flight: 1.18, hotel: 1.16, daily: 1.05 },
        2: { season: 'high', flight: 1.14, hotel: 1.12, daily: 1.03 },
        3: { season: 'mid', flight: 1.00, hotel: 1.00, daily: 1.00 },
        4: { season: 'mid', flight: 0.98, hotel: 0.98, daily: 0.99 },
        5: { season: 'mid', flight: 1.02, hotel: 1.00, daily: 1.01 },
        6: { season: 'mid', flight: 1.05, hotel: 1.03, daily: 1.02 },
        7: { season: 'mid', flight: 1.03, hotel: 1.02, daily: 1.01 },
        8: { season: 'low', flight: 0.90, hotel: 0.86, daily: 0.97 },
        9: { season: 'low', flight: 0.88, hotel: 0.84, daily: 0.96 },
        10: { season: 'mid', flight: 1.04, hotel: 1.05, daily: 1.01 },
        11: { season: 'high', flight: 1.17, hotel: 1.20, daily: 1.06 }
    };
    var leadTimeConfig = [
        { minDays: 0, maxDays: 14, flight: 1.35, hotel: 1.12, label: 'очень близко к вылету' },
        { minDays: 15, maxDays: 45, flight: 1.15, hotel: 1.06, label: 'близкая дата вылета' },
        { minDays: 46, maxDays: 90, flight: 1.00, hotel: 1.00, label: 'нормальное окно бронирования' },
        { minDays: 91, maxDays: 180, flight: 0.93, hotel: 0.97, label: 'раннее бронирование' },
        { minDays: 181, maxDays: 9999, flight: 0.96, hotel: 1.00, label: 'очень ранняя оценка' }
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
        { name: 'Antillano Hotel', zone: 'downtown', formats: ['budget'], priceMin: 45, priceMax: 72, directUrl: 'https://www.booking.com/searchresults.ru.html?ss=Antillano%20Hotel%20Cancun', tags: ['budget', 'центр'] },
        { name: 'Hotel Plaza Kokai', zone: 'downtown', formats: ['budget', 'comfort'], priceMin: 58, priceMax: 86, directUrl: 'https://www.booking.com/searchresults.ru.html?ss=Hotel%20Plaza%20Kokai%20Cancun', tags: ['рынок', 'транспорт'] },
        { name: 'Riu Caribe', zone: 'center', formats: ['comfort', 'ai'], priceMin: 140, priceMax: 235, directUrl: 'https://www.booking.com/searchresults.ru.html?ss=Riu%20Caribe%20Cancun', tags: ['пляж', 'баланс'] },
        { name: 'The Westin Cancun', zone: 'center', formats: ['comfort'], priceMin: 150, priceMax: 210, directUrl: 'https://www.booking.com/searchresults.ru.html?ss=The%20Westin%20Cancun', tags: ['сервис', 'пляж'] },
        { name: 'Grand Fiesta Americana', zone: 'north', formats: ['comfort', 'ai'], priceMin: 165, priceMax: 250, directUrl: 'https://www.booking.com/searchresults.ru.html?ss=Grand%20Fiesta%20Americana%20Cancun', tags: ['север', 'лучший пляж'] },
        { name: 'Krystal Grand Cancun', zone: 'north', formats: ['comfort'], priceMin: 145, priceMax: 205, directUrl: 'https://www.booking.com/searchresults.ru.html?ss=Krystal%20Grand%20Cancun', tags: ['семьи'] },
        { name: 'Hyatt Ziva Cancun', zone: 'north', formats: ['ai'], priceMin: 310, priceMax: 440, directUrl: 'https://www.booking.com/searchresults.ru.html?ss=Hyatt%20Ziva%20Cancun', tags: ['premium', 'AI'] },
        { name: 'Moon Palace Cancun', zone: 'center', formats: ['ai'], priceMin: 290, priceMax: 420, directUrl: 'https://www.booking.com/searchresults.ru.html?ss=Moon%20Palace%20Cancun', tags: ['большой resort'] },
        { name: 'Hard Rock Hotel Cancun', zone: 'center', formats: ['ai'], priceMin: 260, priceMax: 390, directUrl: 'https://www.booking.com/searchresults.ru.html?ss=Hard%20Rock%20Hotel%20Cancun', tags: ['активный'] }
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
        baggage: document.getElementById('c2-extra-baggage'), insurance: document.getElementById('c2-extra-insurance'),
        transfer: document.getElementById('c2-extra-transfer'), resort: document.getElementById('c2-extra-resort'), esim: document.getElementById('c2-extra-esim')
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
        var dt = new Date(y, m, d);
        if (dt.getFullYear() !== y || dt.getMonth() !== m || dt.getDate() !== d) return null;
        return dt;
    }
    function diffDays(a, b) { return Math.max(0, Math.ceil((dayStart(b).getTime() - dayStart(a).getTime()) / 86400000)); }
    function nightWord(n) { var d = n % 10, h = n % 100; if (d === 1 && h !== 11) return 'ночь'; if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return 'ночи'; return 'ночей'; }
    function personWord(n) { return n === 1 ? 'человек' : 'человека'; }
    function roomWord(n) { return n === 1 ? 'номер' : 'номера'; }
    function dayWord(n) { var d = n % 10, h = n % 100; if (d === 1 && h !== 11) return 'день'; if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return 'дня'; return 'дней'; }
    function formatRuDate(d) { var m = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']; return d.getDate() + ' ' + m[d.getMonth()] + ' ' + d.getFullYear(); }
    function seasonLabel(k) { return k === 'high' ? 'высокий сезон' : (k === 'low' ? 'низкий сезон' : 'средний сезон'); }
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
            baggage: !!(el.baggage && el.baggage.checked), insurance: !!(el.insurance && el.insurance.checked),
            transfer: !!(el.transfer && el.transfer.checked), resort: !!(el.resort && el.resort.checked), esim: !!(el.esim && el.esim.checked)
        };
    }
    function extrasTotal(s, people, nights, rooms) {
        var t = 0;
        Object.keys(s).forEach(function (k) {
            if (!s[k]) return;
            var x = extrasConfig[k];
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
        return {
            key: input.format + ':' + input.zone, originLabel: origin.label, originNote: origin.note,
            formatKey: input.format, formatLabel: format.label, zoneKey: input.zone, zoneLabel: zone.label,
            nights: input.nights, people: input.people, rooms: rooms, context: ctx, extrasState: extrasState,
            flight: { min: flightReal * 0.92, real: flightReal, max: flightReal * 1.12 },
            hotel: { min: hotelReal * 0.95, real: hotelReal, max: hotelReal * 1.10 },
            daily: { min: dailyReal * 0.93, real: dailyReal, max: dailyReal * 1.08 },
            extras: { min: extrasReal, real: extrasReal, max: extrasReal },
            totalMin: roundTo(flightReal * 0.92 + hotelReal * 0.95 + dailyReal * 0.93 + extrasReal, 50),
            totalReal: roundTo(flightReal + hotelReal + dailyReal + extrasReal, 100),
            totalMax: roundTo(flightReal * 1.12 + hotelReal * 1.10 + dailyReal * 1.08 + extrasReal, 50)
        };
    }
    function scenarioLabel(s) { return s.formatLabel + ' · ' + s.zoneLabel; }
    function scenarioMeta(s) { return s.nights + ' ' + nightWord(s.nights) + ' · ' + s.people + ' ' + personWord(s.people) + ' · ' + s.rooms + ' ' + roomWord(s.rooms); }
    function listScenarios(input, ctx, extrasState) {
        var out = [];
        Object.keys(formatConfig).forEach(function (f) {
            Object.keys(zoneConfig).forEach(function (z) {
                out.push(buildScenario({ origin: input.origin, format: f, zone: z, nights: input.nights, people: input.people }, ctx, extrasState));
            });
        });
        return out;
    }
    function statusForBudget(budget, s) {
        if (budget >= s.totalReal + 700) return { key: 'fit', label: 'Есть запас' };
        if (budget >= s.totalReal) return { key: 'tight', label: 'Плотно' };
        if (budget >= s.totalMin) return { key: 'over', label: 'Выше бюджета' };
        return { key: 'low', label: 'Нужно больше' };
    }
    function sortByBudgetFit(arr, budget) {
        return arr.slice().sort(function (a, b) {
            var aw = a.totalReal <= budget ? 0 : 1, bw = b.totalReal <= budget ? 0 : 1;
            if (aw !== bw) return aw - bw;
            return Math.abs(a.totalReal - budget) - Math.abs(b.totalReal - budget);
        });
    }
    function renderOptions(options, budget, primaryKey) {
        clearNode(el.options);
        options.forEach(function (s) {
            var card = document.createElement('div');
            card.className = 'calc2-budget-option' + (s.key === primaryKey ? ' is-primary' : '');
            card.innerHTML = '<div class="calc2-budget-option-title"></div><div class="calc2-budget-option-price"></div><div class="calc2-budget-option-meta"></div><div class="calc2-budget-option-note"></div>';
            card.children[0].textContent = scenarioLabel(s);
            card.children[1].textContent = 'Реалистично: ' + usd(s.totalReal);
            card.children[2].textContent = 'Диапазон: ' + usd(s.totalMin) + ' - ' + usd(s.totalMax) + ' · ' + scenarioMeta(s);
            card.children[3].textContent = budget >= s.totalReal ? 'Вписывается, запас ' + usd(budget - s.totalReal) : 'Не хватает ' + usd(s.totalReal - budget);
            el.options.appendChild(card);
        });
    }
    function renderSavings(current, input, ctx, extrasState) {
        clearNode(el.savings);
        var tips = [];
        function add(title, detail, candidate) {
            var save = current.totalReal - candidate.totalReal;
            if (save > 70) tips.push({ title: title, detail: detail, saving: save });
        }
        if (input.nights >= 4) add('Убрать 1 ночь', 'Самый мягкий способ снизить итог.', buildScenario({ origin: input.origin, format: input.format, zone: input.zone, nights: input.nights - 1, people: input.people }, ctx, extrasState));
        if (input.zone === 'north') add('Перейти в центральную Hotel Zone', 'Пляжная логика сохраняется, цена ниже.', buildScenario({ origin: input.origin, format: input.format, zone: 'center', nights: input.nights, people: input.people }, ctx, extrasState));
        if (input.zone === 'center') add('Перейти в Downtown', 'Самый сильный рычаг экономии, но пляж станет отдельной поездкой.', buildScenario({ origin: input.origin, format: input.format, zone: 'downtown', nights: input.nights, people: input.people }, ctx, extrasState));
        if (input.format === 'ai') add('Сменить all inclusive на Comfort', 'Полезно, если планируете много выездов.', buildScenario({ origin: input.origin, format: 'comfort', zone: input.zone, nights: input.nights, people: input.people }, ctx, extrasState));
        if (input.format === 'comfort') add('Сменить Comfort на Budget', 'Работает для самостоятельной поездки.', buildScenario({ origin: input.origin, format: 'budget', zone: input.zone, nights: input.nights, people: input.people }, ctx, extrasState));
        tips.sort(function (a, b) { return b.saving - a.saving; });
        if (!tips.length) tips.push({ title: 'Сценарий уже близок к оптимальному', detail: 'Оставьте небольшой запас на изменение цен.', saving: 0 });
        tips.slice(0, 4).forEach(function (tip) {
            var card = document.createElement('div');
            card.className = 'calc2-saving-item';
            card.innerHTML = '<strong></strong><div></div>';
            card.children[0].textContent = tip.title;
            card.children[1].textContent = tip.detail;
            if (tip.saving > 0) {
                var amt = document.createElement('div');
                amt.className = 'calc2-saving-amount';
                amt.textContent = 'Экономия около ' + usd(tip.saving);
                card.appendChild(amt);
            }
            el.savings.appendChild(card);
        });
    }
    function buildExplainText(s) {
        var extrasCount = Object.keys(s.extrasState).filter(function (k) { return s.extrasState[k]; }).length;
        var text = 'Вылет: ' + s.originLabel + '. До поездки ' + s.context.daysUntilDeparture + ' ' + dayWord(s.context.daysUntilDeparture) + ' (' + s.context.lead.label + '), период: ' + seasonLabel(s.context.season.season) + '. ';
        text += 'Для ' + s.people + ' ' + personWord(s.people) + ' жилье считается на ' + s.rooms + ' ' + roomWord(s.rooms) + '. ';
        text += extrasCount > 0 ? 'Дополнительные расходы включены в итог.' : 'Дополнительные расходы не включены, это базовая оценка.';
        return text;
    }
    function pickHotels(formatKey, zoneKey) {
        var exact = hotelCatalog.filter(function (h) { return h.zone === zoneKey && h.formats.indexOf(formatKey) > -1; });
        if (exact.length >= 3) return exact.slice(0, 3);
        var byFormat = hotelCatalog.filter(function (h) { return h.formats.indexOf(formatKey) > -1; });
        return byFormat.length >= 3 ? byFormat.slice(0, 3) : hotelCatalog.slice(0, 3);
    }
    function bookingSearchUrl(s) {
        var inDate = formatDateInput(s.context.departureDate), outDate = formatDateInput(addDays(s.context.departureDate, s.nights));
        return 'https://www.booking.com/searchresults.ru.html?ss=' + encodeURIComponent(destinationConfig.displayName + ' ' + s.zoneLabel) + '&checkin=' + encodeURIComponent(inDate) + '&checkout=' + encodeURIComponent(outDate) + '&group_adults=' + encodeURIComponent(String(s.people)) + '&no_rooms=' + encodeURIComponent(String(s.rooms)) + '&selected_currency=USD';
    }
    function renderHotelCards(s) {
        clearNode(el.hotelCards);
        pickHotels(s.formatKey, s.zoneKey).forEach(function (h) {
            var link = document.createElement('a');
            link.href = h.directUrl + '&checkin=' + encodeURIComponent(formatDateInput(s.context.departureDate)) + '&checkout=' + encodeURIComponent(formatDateInput(addDays(s.context.departureDate, s.nights))) + '&group_adults=' + encodeURIComponent(String(s.people)) + '&no_rooms=' + encodeURIComponent(String(s.rooms));
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            var card = document.createElement('div');
            card.className = 'calc2-hotel-card';
            card.innerHTML = '<div class="chc-name"></div><div class="chc-price"></div><div class="chc-tag"></div><div class="chc-link-hint">Открыть на Booking</div>';
            card.children[0].textContent = h.name;
            card.children[1].textContent = usd(h.priceMin) + ' - ' + usd(h.priceMax) + ' / ночь';
            card.children[2].textContent = h.tags.join(' · ');
            link.appendChild(card);
            el.hotelCards.appendChild(link);
        });
    }
    function renderUrgency(s) {
        if (s.context.daysUntilDeparture <= 14) {
            el.urgTitle.textContent = 'Поездка близко, цены могут расти ежедневно';
            el.urgText.textContent = 'В таком окне перелеты и хорошие отели обычно дорожают быстрее.';
        } else if (s.context.season.season === 'high') {
            el.urgTitle.textContent = 'Вы выбрали высокий сезон Канкуна';
            el.urgText.textContent = 'В пиковые месяцы хорошие варианты заканчиваются раньше.';
        } else {
            el.urgTitle.textContent = 'Спокойное окно для бронирования';
            el.urgText.textContent = 'Сейчас обычно проще поймать хороший баланс цены и качества.';
        }
    }
    function renderScenario(current, options, budget) {
        el.min.textContent = usd(current.totalMin);
        el.real.textContent = usd(current.totalReal);
        el.max.textContent = usd(current.totalMax);
        el.badge.textContent = current.formatLabel;
        el.badge.className = 'calc2-category-badge badge-' + current.formatKey;
        el.meta.textContent = current.zoneLabel + ' · ' + scenarioMeta(current) + ' · вылет ' + formatDateInput(current.context.departureDate);
        el.breakdown.innerHTML = 'Перелет: ' + usd(current.flight.real) + ' <span class="calc2-inline-note">(' + current.originNote + ')</span> · Отель: ' + usd(current.hotel.real) + ' · Остальные расходы: ' + usd(current.daily.real) + (current.extras.real > 0 ? ' · Дополнительно: ' + usd(current.extras.real) : '') + '<br>Ориентир в EUR: ' + eur(current.totalReal * destinationConfig.defaultEurRate);
        var status = statusForBudget(budget, current);
        el.budgetState.className = 'calc2-budget-state state-' + status.key;
        el.budgetState.textContent = status.label;
        if (status.key === 'fit') el.budgetSummary.textContent = 'Есть запас около ' + usd(budget - current.totalReal) + '. Этот сценарий можно оставить.';
        else if (status.key === 'tight') el.budgetSummary.textContent = 'Сценарий почти точно в бюджете. Запас около ' + usd(budget - current.totalReal) + '.';
        else if (status.key === 'over') el.budgetSummary.textContent = 'Реалистичная оценка выше бюджета на ' + usd(current.totalReal - budget) + ', но нижний диапазон еще возможен.';
        else el.budgetSummary.textContent = 'Даже нижняя оценка выше бюджета на ' + usd(current.totalMin - budget) + '. Нужен более экономный сценарий.';
        renderOptions(options, budget, current.key);
        el.explain.textContent = buildExplainText(current);
        renderUrgency(current);
        renderHotelCards(current);
        el.ctaLabel.textContent = scenarioLabel(current) + ' · ' + scenarioMeta(current);
        el.ctaLink.href = bookingSearchUrl(current);
    }
    function calc() {
        var ctx = getContext(el.date.value);
        el.date.value = formatDateInput(ctx.departureDate);
        el.today.innerHTML = '<strong>Сегодня:</strong> ' + formatRuDate(ctx.today);
        el.rate.innerHTML = '<strong>USD/EUR:</strong> 1 USD ≈ ' + destinationConfig.defaultEurRate.toFixed(2) + ' EUR';
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
        var options = sortByBudgetFit(listScenarios(input, ctx, extrasState), budget).filter(function (s) { return s.key !== current.key; }).slice(0, 2);
        options.unshift(current);
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
