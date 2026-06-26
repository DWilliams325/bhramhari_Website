function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

function selectService(serviceKey) {
  if (!serviceKey) return;
  showPage('booking');
  setTimeout(() => {
    switchCal(serviceKey);
  }, 50);
}

function switchCal(serviceKey) {
  const keys = ['insurance', 'retirement', 'estate'];
  keys.forEach(key => {
    const pill = document.getElementById('pill-' + key);
    const panel = document.getElementById('cal-' + key);
    if (pill) pill.classList.toggle('selected', key === serviceKey);
    if (panel) panel.style.display = key === serviceKey ? 'block' : 'none';
  });
}

function calculatePlan() {
  const age = Number(document.getElementById('calc-age').value);
  const savings = Number(document.getElementById('calc-savings').value);
  const monthly = Number(document.getElementById('calc-monthly').value);
  const goal = Number(document.getElementById('calc-goal').value);
  const service = document.getElementById('calc-service').value || 'general';
  const resultEl = document.getElementById('calc-results');
  if (!age || age < 18 || savings < 0 || monthly < 0 || goal <= 0) {
    alert('Please enter a valid age, savings, monthly contribution, and goal amount.');
    return;
  }
  const targetYears = Math.max(5, Math.min(40, Math.round((goal - savings) / Math.max(1, monthly * 12))));
  const coverageScore = Math.min(100, Math.max(25, Math.round((savings + monthly * 12) / Math.max(1, goal) * 100)));
  const ageAdvice = age < 35 ? 'Your timeline is strong — the right mix of protective coverage and retirement savings can build momentum now.' : age < 50 ? 'You are in a prime planning window. Focus on insurance protection and retirement readiness.' : 'As retirement approaches, prioritize stability, long-term care, and legacy planning.';
  const serviceHeading = service === 'estate' ? 'Estate Planning Focus' : service === 'insurance' ? 'Insurance Consultation Focus' : service === 'retirement' ? 'Retirement Planning Focus' : service === 'health' ? 'Health Coverage Review' : service === 'longterm' ? 'Long-Term Care Guidance' : service === 'disability' ? 'Disability Protection Advice' : service === 'travel' ? 'Travel Insurance Snapshot' : service === 'mortgage' ? 'Mortgage Protection Summary' : 'General Coverage Guidance';
  const recommendedServices = [];
  if (age < 40) {
    recommendedServices.push('Insurance Consultation', 'Retirement Planning');
  } else {
    recommendedServices.push('Retirement Planning', 'Estate Planning');
  }
  if (service === 'estate') recommendedServices.unshift('Estate Planning');
  if (service === 'insurance') recommendedServices.unshift('Insurance Consultation');
  if (service === 'health') recommendedServices.unshift('General Health Insurance');
  resultEl.innerHTML = `
    <h3>Your quick coverage estimate</h3>
    <div class="result-badge">Coverage readiness: ${coverageScore}%</div>
    <div class="result-list">
      <div class="result-item"><strong>Suggested planning horizon</strong><span>Approximately ${targetYears} year(s) to reach your goal at your current monthly contribution.</span></div>
      <div class="result-item"><strong>Best next step</strong><span>${ageAdvice}</span></div>
      <div class="result-item"><strong>${serviceHeading}</strong><span>Based on your selection, review ${recommendedServices.slice(0, 3).join(', ')} with Sarita.</span></div>
    </div>
    <p style="margin-top:16px;">Ready to go deeper? Click Book a Consultation to discuss the plan and coverage options that match your goals.</p>
  `;
  resultEl.classList.remove('hidden');
}

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
      ${flyerSrc ? `<img src="${flyerSrc}" alt="${name} flyer" />` : ''}
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

async function loadEventsFromSheets() {
  const feed = document.getElementById('events-feed');
  if (!feed) return;
  if (!EVENTS_SHEETS_URL) {
    feed.innerHTML = '<div class="events-empty">No Google Sheets URL set yet. Add your published CSV URL to <strong>EVENTS_SHEETS_URL</strong> in script.js.</div>';
    return;
  }
  feed.innerHTML = '<div class="events-empty">Loading events…</div>';
  try {
    const res = await fetch(EVENTS_SHEETS_URL);
    const text = await res.text();
    const rows = text.trim().split('\n').slice(1).filter(r => r.trim());
    if (!rows.length) {
      feed.innerHTML = '<div class="events-empty">No upcoming events found in the sheet.</div>';
      return;
    }
    feed.innerHTML = '';
    let shown = 0;
    rows.forEach(row => {
      const [title, date, time, location, type, description, link, active] = parseCSVRow(row);
      if (!title) return;
      if (active && active.toLowerCase() !== 'true' && active.toLowerCase() !== 'yes') return;
      shown++;
      const formattedDate = date ? (() => { try { return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return date; } })() : '';
      const qrSrc = link ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(link)}` : '';
      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <div class="event-card-body">
          <div class="event-card-flag">Upcoming Bhramhari Event${type ? ` · ${escapeHtml(type)}` : ''}</div>
          <div class="event-card-title">${escapeHtml(title)}</div>
          <div class="event-card-meta">
            ${formattedDate ? `<span><span class="meta-label">Date:</span> ${formattedDate}</span>` : ''}
            ${time ? `<span><span class="meta-label">Time:</span> ${escapeHtml(time)}</span>` : ''}
            ${location ? `<span><span class="meta-label">Location:</span> ${escapeHtml(location)}</span>` : ''}
          </div>
          ${description ? `<div class="event-card-description">${escapeHtml(description)}</div>` : ''}
          ${qrSrc ? `
          <div class="event-qr-wrap">
            <img src="${qrSrc}" alt="QR code for ${escapeHtml(title)}" class="event-qr" />
            <div class="event-qr-label">Scan to learn more</div>
          </div>` : ''}
          <div class="event-badge-row"><span class="event-badge">Bhramhari</span>${type ? `<span class="event-badge">${escapeHtml(type)}</span>` : ''}</div>
        </div>`;
      feed.appendChild(card);
    });
    if (shown === 0) feed.innerHTML = '<div class="events-empty">No active events right now. Check back soon!</div>';
  } catch {
    feed.innerHTML = '<div class="events-empty">Could not load events. Check that the Sheets URL is published and try Refresh.</div>';
  }
}

window.addEventListener('DOMContentLoaded', () => loadEventsFromSheets());

function signUpEmail() {
  const val = document.getElementById('email-input').value.trim();
  if (!val) { alert('Please enter your email.'); return; }
  document.getElementById('email-ok').style.display = 'block';
  document.getElementById('email-input').value = '';
}

