const calLinks = {
  estate:     'https://cal.com/bhramhari/estate-planning',
  insurance:  'https://cal.com/bhramhari/insurance-consultation',
  retirement: 'https://cal.com/bhramhari/retirement-planning',
  health:     'https://cal.com/bhramhari/general-health-insurance',
  longterm:   'https://cal.com/bhramhari/long-term-care',
  disability: 'https://cal.com/bhramhari/disability-coverage',
  travel:     'https://cal.com/bhramhari/travel-insurance',
  notary:     'https://cal.com/bhramhari/notary-services',
  mortgage:   'https://cal.com/bhramhari/mortgage-protection',
};

function openBooking() {
  const sel = document.getElementById('svc-select');
  if (!sel || !sel.value) {
    alert('Please select a service first.');
    return;
  }
  window.open(calLinks[sel.value], '_blank');
}

function switchCal(key) {
  document.querySelectorAll('.svc-pill').forEach(p => p.classList.remove('selected'));
  document.getElementById('pill-' + key)?.classList.add('selected');
}

window.addEventListener('DOMContentLoaded', () => {
  const service = new URLSearchParams(location.search).get('service');
  if (service && document.getElementById('pill-' + service)) switchCal(service);
});

let starRating = 0;
function setStars(n) {
  starRating = n;
  document.querySelectorAll('.star-pick').forEach((s, i) => s.classList.toggle('lit', i < n));
}

function submitReview() {
  const name = document.getElementById('rv-name').value.trim();
  const email = document.getElementById('rv-email').value.trim();
  const text = document.getElementById('rv-text').value.trim();
  if (!name || !email || !text || starRating === 0) { alert('Please fill all fields and select a star rating.'); return; }
  const colors = ['#E8421A','#1B3A6B','#1B6B3A','#7B2D8B','#B8660A','#0F6E86'];
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const color = colors[Math.floor(Math.random() * colors.length)];
  const starsStr = '★'.repeat(starRating) + '☆'.repeat(5 - starRating);
  const card = document.createElement('div');
  card.className = 'review-card';
  card.innerHTML = `<div class="reviewer-row"><div class="rev-avatar" style="background:${color};">${initials}</div><div><div class="rev-name">${name}</div><div class="rev-date">Just now</div></div></div><div class="rev-stars">${starsStr}</div><p class="rev-text">${text}</p><div class="rev-verified">✓ Verified Review</div>`;
  document.getElementById('review-grid').prepend(card);
  document.getElementById('rv-success').style.display = 'block';
  document.getElementById('rv-name').value = '';
  document.getElementById('rv-email').value = '';
  document.getElementById('rv-text').value = '';
  document.getElementById('rv-service').value = '';
  setStars(0);
}

function sendContact() {
  const fn = document.getElementById('cf-fn').value.trim();
  const em = document.getElementById('cf-em').value.trim();
  const msg = document.getElementById('cf-msg').value.trim();
  if (!fn || !em || !msg) { alert('Please fill in all required fields.'); return; }
  document.getElementById('cf-ok').style.display = 'block';
  document.getElementById('cf-fn').value = '';
  document.getElementById('cf-ln').value = '';
  document.getElementById('cf-em').value = '';
  document.getElementById('cf-msg').value = '';
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function addUpcomingEvent() {
  const name = document.getElementById('event-name').value.trim();
  const date = document.getElementById('event-date').value;
  const location = document.getElementById('event-location').value.trim();
  const description = document.getElementById('event-description').value.trim();
  const flyerInput = document.getElementById('event-flyer');
  if (!name || !date || !location || !description) {
    alert('Please fill in the event name, date, location, and details.');
    return;
  }
  const feed = document.getElementById('events-feed');
  const empty = document.querySelector('.events-empty');
  if (empty) empty.style.display = 'none';
  const card = document.createElement('div');
  card.className = 'event-card';
  const flyerFile = flyerInput.files[0];
  const renderCard = flyerSrc => {
    card.innerHTML = `
      ${flyerSrc ? `<img src="${flyerSrc}" alt="${name} flyer" loading="lazy" decoding="async" />` : ''}
      <div class="event-card-body">
        <div class="event-card-flag">Upcoming Bhramhari Event</div>
        <div class="event-card-title">${name}</div>
        <div class="event-card-meta">
          <span><span class="meta-label">Date:</span> ${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span><span class="meta-label">Location:</span> ${location}</span>
        </div>
        <div class="event-card-description">${description}</div>
        <div class="event-badge-row">
          <span class="event-badge">Bhramhari</span>
          <span class="event-badge">Flyer Added</span>
        </div>
      </div>
    `;
    feed.prepend(card);
  };
  if (flyerFile && flyerFile.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => renderCard(reader.result);
    reader.readAsDataURL(flyerFile);
  } else {
    renderCard('');
  }
  document.getElementById('event-name').value = '';
  document.getElementById('event-date').value = '';
  document.getElementById('event-location').value = '';
  document.getElementById('event-description').value = '';
  flyerInput.value = '';
}

// Paste your published Google Sheets CSV URL here.
// In Sheets: File > Share > Publish to web > Sheet1 > CSV > Publish, then copy the URL.
// Expected columns (row 1 = headers): Title, Date, Time, Location, Type, Description, Link, Active
const EVENTS_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSQFo9tgGR_OsKtuQqLZfbpomralH0fz8Xvcy0PBTJBf30HAoCadGJFxAbEpSW6lVqaXGnuLNoHGAwX/pub?gid=0&single=true&output=csv';

function parseCSVRow(row) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    if (row[i] === '"' && !inQuotes) { inQuotes = true; }
    else if (row[i] === '"' && inQuotes) { inQuotes = false; }
    else if (row[i] === ',' && !inQuotes) { result.push(cur.trim()); cur = ''; }
    else { cur += row[i]; }
  }
  result.push(cur.trim());
  return result;
}

let allEvents = [];
let calendarMonth = new Date().getMonth();
let calendarYear = new Date().getFullYear();

function parseEventDate(dateStr) {
  if (!dateStr) return null;
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function eventTooltipLine(e) {
  return [e.title, e.time, e.location].filter(Boolean).join(' · ');
}

function buildEventModalEntryHTML(e) {
  const formattedDate = e.dateObj ? e.dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (e.date || '');
  return `
    <div class="event-modal-entry">
      <div class="event-modal-flag">Upcoming Bhramhari Event${e.type ? ` · ${escapeHtml(e.type)}` : ''}</div>
      <div class="event-modal-title">${escapeHtml(e.title)}</div>
      <div class="event-modal-meta">
        ${formattedDate ? `<span><span class="meta-label">Date:</span> ${formattedDate}</span>` : ''}
        ${e.time ? `<span><span class="meta-label">Time:</span> ${escapeHtml(e.time)}</span>` : ''}
        ${e.location ? `<span><span class="meta-label">Location:</span> ${escapeHtml(e.location)}</span>` : ''}
      </div>
      ${e.description ? `<div class="event-modal-description">${escapeHtml(e.description)}</div>` : ''}
    </div>`;
}

function openEventModal(year, month, day) {
  const dayEvents = allEvents.filter(e => e.dateObj &&
    e.dateObj.getFullYear() === year && e.dateObj.getMonth() === month && e.dateObj.getDate() === day);
  if (!dayEvents.length) return;
  document.getElementById('event-modal-body').innerHTML = dayEvents.map(buildEventModalEntryHTML).join('');
  document.getElementById('event-modal-overlay').classList.add('open');
}

function closeEventModal(evt) {
  if (evt && evt.target !== document.getElementById('event-modal-overlay')) return;
  document.getElementById('event-modal-overlay').classList.remove('open');
}

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeEventModal();
});

function changeCalendarMonth(delta) {
  calendarMonth += delta;
  if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
  if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
  renderCalendar();
}

function renderCalendar() {
  const grid = document.getElementById('event-cal-grid');
  const monthLabel = document.getElementById('event-cal-month');
  if (!grid || !monthLabel) return;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthLabel.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstWeekday = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  const eventsByDay = {};
  allEvents.forEach(e => {
    if (!e.dateObj) return;
    if (e.dateObj.getMonth() === calendarMonth && e.dateObj.getFullYear() === calendarYear && e.dateObj >= today) {
      (eventsByDay[e.dateObj.getDate()] = eventsByDay[e.dateObj.getDate()] || []).push(e);
    }
  });

  let html = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="event-cal-day-name">${d}</div>`).join('');
  for (let i = 0; i < firstWeekday; i++) html += '<div class="event-cal-day empty"></div>';
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(calendarYear, calendarMonth, day);
    const isToday = dateObj.getTime() === today.getTime();
    const isPast = dateObj < today;
    const dayEvents = eventsByDay[day];
    const classes = ['event-cal-day'];
    if (isToday) classes.push('today');
    if (isPast) classes.push('past');
    if (dayEvents) classes.push('has-events');
    const tooltip = dayEvents ? ` title="${escapeHtml(dayEvents.map(eventTooltipLine).join('\n'))}"` : '';
    const onclick = dayEvents ? ` onclick="openEventModal(${calendarYear}, ${calendarMonth}, ${day})"` : '';
    html += `<div class="${classes.join(' ')}"${tooltip}${onclick}>${day}${dayEvents ? '<span class="event-cal-dot"></span>' : ''}</div>`;
  }
  grid.innerHTML = html;
}

async function loadEventsFromSheets() {
  const status = document.getElementById('event-cal-status');
  if (!status) return;
  if (!EVENTS_SHEETS_URL) {
    status.textContent = 'No Google Sheets URL set yet. Add your published CSV URL to EVENTS_SHEETS_URL in script.js.';
    return;
  }
  status.textContent = 'Loading events…';
  try {
    const res = await fetch(EVENTS_SHEETS_URL);
    const text = await res.text();
    const rows = text.trim().split('\n').slice(1).filter(r => r.trim());
    allEvents = rows.map(row => {
      const [title, date, time, location, type, description, link, active] = parseCSVRow(row);
      return { title, date, time, location, type, description, link, active, dateObj: parseEventDate(date) };
    }).filter(e => e.title && (!e.active || ['true', 'yes'].includes(e.active.toLowerCase())));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = allEvents.filter(e => e.dateObj && e.dateObj >= today);

    if (upcoming.length) {
      const soonest = upcoming.sort((a, b) => a.dateObj - b.dateObj)[0];
      calendarMonth = soonest.dateObj.getMonth();
      calendarYear = soonest.dateObj.getFullYear();
      status.textContent = '';
    } else {
      calendarMonth = today.getMonth();
      calendarYear = today.getFullYear();
      status.textContent = 'No upcoming events right now. Check back soon!';
    }

    renderCalendar();
  } catch {
    status.textContent = 'Could not load events. Check that the Sheets URL is published and try Refresh.';
  }
}

window.addEventListener('DOMContentLoaded', () => loadEventsFromSheets());

function switchCalcTab(key) {
  document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('selected'));
  document.getElementById('calc-tab-' + key)?.classList.add('selected');
  document.querySelectorAll('.calc-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById('calc-panel-' + key)?.classList.remove('hidden');
}

function formatCurrency(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function calculateInsurance() {
  const age = parseFloat(document.getElementById('ins-age').value);
  const income = parseFloat(document.getElementById('ins-income').value);
  const debt = parseFloat(document.getElementById('ins-debt').value) || 0;
  const dependents = parseFloat(document.getElementById('ins-dependents').value) || 0;
  const savings = parseFloat(document.getElementById('ins-savings').value) || 0;
  const result = document.getElementById('calc-result-insurance');

  if (!age || age < 18 || !income || income <= 0) {
    result.innerHTML = '<p class="calc-error">Please enter a valid age and annual income.</p>';
    return;
  }

  let multiplier;
  if (age < 35) multiplier = 15;
  else if (age < 45) multiplier = 12;
  else if (age < 55) multiplier = 10;
  else if (age < 65) multiplier = 7;
  else multiplier = 5;

  const incomeReplacement = income * multiplier;
  const educationFund = dependents * 25000;
  const grossNeed = incomeReplacement + debt + educationFund;
  const coverage = Math.max(0, grossNeed - savings);

  const termOptions = [10, 15, 20, 25, 30];
  const idealTerm = Math.max(10, Math.min(30, 65 - age));
  const suggestedTerm = termOptions.reduce((closest, t) =>
    Math.abs(t - idealTerm) < Math.abs(closest - idealTerm) ? t : closest, termOptions[0]);
  const pct = n => Math.round((n / grossNeed) * 100);

  result.innerHTML = `
    <div class="calc-result-grid">
      <div class="calc-result-item">
        <div class="calc-result-num">${formatCurrency(coverage)}</div>
        <div class="calc-result-label">Estimated Coverage Need</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-num">${suggestedTerm}-Yr</div>
        <div class="calc-result-label">Suggested Term Length</div>
      </div>
    </div>
    <div class="calc-bar">
      <div class="calc-bar-seg" style="width:${pct(incomeReplacement)}%;background:var(--orange);"></div>
      <div class="calc-bar-seg" style="width:${pct(debt)}%;background:var(--navy);"></div>
      <div class="calc-bar-seg" style="width:${pct(educationFund)}%;background:var(--gold);"></div>
    </div>
    <div class="calc-bar-legend">
      <span><span class="calc-bar-dot" style="background:var(--orange);"></span>Income replacement (${formatCurrency(incomeReplacement)})</span>
      <span><span class="calc-bar-dot" style="background:var(--navy);"></span>Debt (${formatCurrency(debt)})</span>
      <span><span class="calc-bar-dot" style="background:var(--gold);"></span>Education fund (${formatCurrency(educationFund)})</span>
    </div>
    <p class="calc-result-breakdown">Based on ${multiplier}× income replacement for your age, plus debt and education costs, minus ${formatCurrency(savings)} in current savings and existing coverage. A ${suggestedTerm}-year term policy would typically keep coverage active until your dependents are financially independent.</p>
    <a class="btn-fill calc-cta" href="booking.html?service=insurance" data-cal-link="bhramhari/insurance-consultation" data-cal-config='{"layout":"month_view"}'>Discuss My Coverage →</a>
  `;
}

function calculateRetirement() {
  const age = parseFloat(document.getElementById('ret-age').value);
  const retireAge = parseFloat(document.getElementById('ret-retire-age').value);
  const savings = parseFloat(document.getElementById('ret-savings').value) || 0;
  const contribution = parseFloat(document.getElementById('ret-contribution').value) || 0;
  const rate = parseFloat(document.getElementById('ret-return').value) / 100;
  const result = document.getElementById('calc-result-retirement');

  if (!age || age < 18 || !retireAge || retireAge <= age) {
    result.innerHTML = '<p class="calc-error">Please enter a valid current age and a retirement age greater than your current age.</p>';
    return;
  }

  const months = (retireAge - age) * 12;
  const monthlyRate = rate / 12;
  const futureValue = monthlyRate > 0
    ? savings * Math.pow(1 + monthlyRate, months) + contribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    : savings + contribution * months;
  const monthlyIncome = (futureValue * 0.04) / 12;
  const totalContributed = contribution * months;
  const totalPrincipal = savings + totalContributed;
  const growth = Math.max(0, futureValue - totalPrincipal);
  const principalPct = futureValue > 0 ? Math.min(100, Math.round((totalPrincipal / futureValue) * 100)) : 100;
  const growthPct = 100 - principalPct;

  result.innerHTML = `
    <div class="calc-result-grid">
      <div class="calc-result-item">
        <div class="calc-result-num">${formatCurrency(futureValue)}</div>
        <div class="calc-result-label">Projected Savings at Age ${retireAge}</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-num">${formatCurrency(monthlyIncome)}</div>
        <div class="calc-result-label">Est. Monthly Retirement Income</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-num">${formatCurrency(totalContributed)}</div>
        <div class="calc-result-label">Total You'll Contribute</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-num">${formatCurrency(growth)}</div>
        <div class="calc-result-label">Growth From Compounding</div>
      </div>
    </div>
    <div class="calc-bar">
      <div class="calc-bar-seg" style="width:${principalPct}%;background:var(--navy);"></div>
      <div class="calc-bar-seg" style="width:${growthPct}%;background:var(--gold);"></div>
    </div>
    <div class="calc-bar-legend">
      <span><span class="calc-bar-dot" style="background:var(--navy);"></span>Your contributions (${principalPct}%)</span>
      <span><span class="calc-bar-dot" style="background:var(--gold);"></span>Investment growth (${growthPct}%)</span>
    </div>
    <p class="calc-result-breakdown">Assumes a ${(rate * 100).toFixed(0)}% average annual return over ${retireAge - age} years. Monthly income is estimated using the 4% withdrawal rule.</p>
    <a class="btn-fill calc-cta" href="booking.html?service=retirement" data-cal-link="bhramhari/retirement-planning" data-cal-config='{"layout":"month_view"}'>Plan My Retirement →</a>
  `;
}

// ---- Photo gallery (Supabase-backed) ----
// Loads the Supabase SDK only on pages that actually need it (gallery.html/admin.html),
// detected via the presence of #gallery-app / #admin-app, so the other pages never
// make this network request.
function loadSupabaseSdk() {
  if (window.__supabaseSdkLoaded) return;
  window.__supabaseSdkLoaded = true;
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  s.onload = function () {
    if (window.initGalleryPage) initGalleryPage();
    if (window.initAdminPage) initAdminPage();
  };
  document.head.appendChild(s);
}
window.addEventListener('load', function () {
  if (!document.getElementById('gallery-app') && !document.getElementById('admin-app')) return;
  if ('requestIdleCallback' in window) requestIdleCallback(loadSupabaseSdk, { timeout: 3000 });
  else setTimeout(loadSupabaseSdk, 1500);
});

let _galleryClient = null;
function getGalleryClient() {
  if (!_galleryClient) {
    _galleryClient = window.supabase.createClient(window.GALLERY_SUPABASE_URL, window.GALLERY_SUPABASE_ANON_KEY);
  }
  return _galleryClient;
}

const GALLERY_BUCKET = 'gallery-photos';
const GALLERY_MAX_BYTES = 5 * 1024 * 1024;
const GALLERY_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function showGalleryError(msg) {
  const el = document.getElementById('gallery-upload-error');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function galleryCard(photo) {
  const name = photo.uploader_name ? escapeHtml(photo.uploader_name) : '';
  const caption = photo.caption ? escapeHtml(photo.caption) : '';
  return `
    <div class="gallery-card">
      <img src="${photo.image_url}" alt="${name ? `Photo by ${name}` : 'Community photo'}" loading="lazy" decoding="async" />
      ${(name || caption) ? `<div class="gallery-card-body">${caption ? `<p class="gallery-card-caption">${caption}</p>` : ''}${name ? `<p class="gallery-card-name">— ${name}</p>` : ''}</div>` : ''}
    </div>`;
}

async function loadApprovedPhotos() {
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  if (!grid) return;
  const { data, error } = await getGalleryClient()
    .from('photos')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });
  if (error) return;
  if (!data || !data.length) {
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = data.map(galleryCard).join('');
}

function initGalleryPage() {
  loadApprovedPhotos();
}
window.initGalleryPage = initGalleryPage;

async function uploadGalleryPhoto() {
  const hp = document.getElementById('gallery-hp-field');
  if (hp && hp.value) return; // honeypot tripped — silently ignore

  const errorEl = document.getElementById('gallery-upload-error');
  const okEl = document.getElementById('gallery-upload-ok');
  const btn = document.getElementById('gallery-submit-btn');
  errorEl.style.display = 'none';
  okEl.style.display = 'none';

  const fileInput = document.getElementById('gallery-file');
  const file = fileInput.files[0];
  const name = document.getElementById('gallery-name').value.trim();
  const caption = document.getElementById('gallery-caption').value.trim();

  if (!file) { showGalleryError('Please choose a photo to upload.'); return; }
  if (!GALLERY_ALLOWED_TYPES.includes(file.type)) { showGalleryError('Please upload a JPG, PNG, or WEBP image.'); return; }
  if (file.size > GALLERY_MAX_BYTES) { showGalleryError('Image must be under 5MB.'); return; }

  btn.disabled = true;
  btn.textContent = 'Uploading…';

  const client = getGalleryClient();
  const ext = file.name.split('.').pop().toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await client.storage.from(GALLERY_BUCKET).upload(path, file);
  if (uploadError) {
    showGalleryError('Upload failed. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Submit Photo →';
    return;
  }

  const { data: urlData } = client.storage.from(GALLERY_BUCKET).getPublicUrl(path);
  const { error: insertError } = await client.from('photos').insert({
    image_url: urlData.publicUrl,
    storage_path: path,
    uploader_name: name || null,
    caption: caption || null,
  });

  if (insertError) {
    await client.storage.from(GALLERY_BUCKET).remove([path]);
    showGalleryError('Something went wrong submitting your photo. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Submit Photo →';
    return;
  }

  fileInput.value = '';
  document.getElementById('gallery-name').value = '';
  document.getElementById('gallery-caption').value = '';
  okEl.style.display = 'block';
  btn.disabled = false;
  btn.textContent = 'Submit Photo →';
}

// ---- Admin moderation dashboard ----
function showAdminError(msg) {
  const el = document.getElementById('admin-login-error');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function adminPendingCard(photo) {
  const name = photo.uploader_name ? escapeHtml(photo.uploader_name) : '';
  const caption = photo.caption ? escapeHtml(photo.caption) : '';
  return `
    <div class="admin-pending-card" id="admin-card-${photo.id}">
      <img src="${photo.image_url}" alt="Pending photo" loading="lazy" decoding="async" />
      <div class="admin-pending-body">
        ${caption ? `<p class="gallery-card-caption">${caption}</p>` : ''}
        ${name ? `<p class="gallery-card-name">— ${name}</p>` : ''}
        <div class="admin-pending-actions">
          <button class="btn-fill" onclick="approvePhoto('${photo.id}')">Approve</button>
          <button class="btn-reject" onclick="rejectPhoto('${photo.id}', '${photo.storage_path}')">Reject</button>
        </div>
      </div>
    </div>`;
}

async function loadPendingPhotos() {
  const grid = document.getElementById('admin-pending-grid');
  const empty = document.getElementById('admin-pending-empty');
  const { data, error } = await getGalleryClient()
    .from('photos')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: false });
  if (error || !data || !data.length) {
    if (empty) empty.style.display = 'block';
    if (grid) grid.innerHTML = '';
    return;
  }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = data.map(adminPendingCard).join('');
}

function showAdminDashboard() {
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-dashboard').style.display = 'block';
  loadPendingPhotos();
}

function showAdminLogin() {
  document.getElementById('admin-dashboard').style.display = 'none';
  document.getElementById('admin-login').style.display = 'block';
}

async function initAdminPage() {
  const { data } = await getGalleryClient().auth.getSession();
  if (data && data.session) showAdminDashboard();
  else showAdminLogin();
}
window.initAdminPage = initAdminPage;

async function adminLogin() {
  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  const errorEl = document.getElementById('admin-login-error');
  errorEl.style.display = 'none';
  if (!email || !password) { showAdminError('Please enter your email and password.'); return; }
  const { error } = await getGalleryClient().auth.signInWithPassword({ email, password });
  if (error) { showAdminError('Invalid email or password.'); return; }
  showAdminDashboard();
}

async function adminLogout() {
  await getGalleryClient().auth.signOut();
  showAdminLogin();
}

async function approvePhoto(id) {
  const { error } = await getGalleryClient().from('photos').update({ approved: true }).eq('id', id);
  if (error) { alert('Could not approve this photo. Please try again.'); return; }
  const card = document.getElementById(`admin-card-${id}`);
  if (card) card.remove();
}

async function rejectPhoto(id, storagePath) {
  if (!confirm('Reject and permanently delete this photo?')) return;
  const client = getGalleryClient();
  const { error: storageError } = await client.storage.from(GALLERY_BUCKET).remove([storagePath]);
  if (storageError) { alert('Could not delete the photo file. Please try again.'); return; }
  const { error: dbError } = await client.from('photos').delete().eq('id', id);
  if (dbError) { alert('Photo file deleted, but the record could not be removed. Please try again.'); return; }
  const card = document.getElementById(`admin-card-${id}`);
  if (card) card.remove();
}

function signUpEmail() {
  const val = document.getElementById('email-input').value.trim();
  if (!val) { alert('Please enter your email.'); return; }
  document.getElementById('email-ok').style.display = 'block';
  document.getElementById('email-input').value = '';
}

