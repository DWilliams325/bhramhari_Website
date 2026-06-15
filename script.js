function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectService(svc) {
  document.querySelectorAll('.svc-pill').forEach(p => p.classList.remove('selected'));
  const el = document.getElementById('pill-' + svc);
  if (el) el.classList.add('selected');
}

let calYear = new Date().getFullYear(), calMonth = new Date().getMonth();
let selectedDate = null, selectedSlot = null;
const takenSlots = {'9:00 AM':true, '2:00 PM':true};
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function renderCalendar() {
  const label = document.getElementById('cal-month-label');
  if (!label) return;
  label.textContent = monthNames[calMonth] + ' ' + calYear;
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
    const dn = document.createElement('div');
    dn.className = 'cal-day-name'; dn.textContent = d; grid.appendChild(dn);
  });
  const first = new Date(calYear, calMonth, 1).getDay();
  const days = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();
  for (let i = 0; i < first; i++) { const e = document.createElement('div'); e.className = 'cal-day empty'; grid.appendChild(e); }
  for (let d = 1; d <= days; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day'; el.textContent = d;
    const isPast = new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
    if (isPast) el.classList.add('past');
    if (isToday) el.classList.add('today');
    if (selectedDate && selectedDate.d === d && selectedDate.m === calMonth && selectedDate.y === calYear) el.classList.add('selected');
    if (!isPast) el.onclick = () => pickDate(d);
    grid.appendChild(el);
  }
}

function pickDate(d) {
  selectedDate = { d, m: calMonth, y: calYear };
  selectedSlot = null;
  renderCalendar(); renderSlots();
}

function renderSlots() {
  const grid = document.getElementById('slots-grid');
  const msg = document.getElementById('no-date-msg');
  if (!selectedDate) { grid.innerHTML = ''; msg.style.display = 'block'; return; }
  msg.style.display = 'none';
  const times = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];
  grid.innerHTML = '';
  times.forEach(t => {
    const el = document.createElement('div');
    el.className = 'slot'; el.textContent = t;
    if (takenSlots[t]) { el.classList.add('taken'); }
    else {
      if (selectedSlot === t) el.classList.add('selected');
      el.onclick = () => { selectedSlot = t; renderSlots(); };
    }
    grid.appendChild(el);
  });
}

function prevMonth() { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); }
function nextMonth() { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); }

function confirmBooking() {
  const fname = document.getElementById('b-fname').value.trim();
  const email = document.getElementById('b-email').value.trim();
  const svc = document.querySelector('.svc-pill.selected');
  if (!fname || !email) { alert('Please enter your name and email.'); return; }
  if (!selectedDate) { alert('Please select a date.'); return; }
  if (!selectedSlot) { alert('Please select a time slot.'); return; }
  const svcName = svc ? svc.textContent.trim() : 'General Consultation';
  const dateStr = monthNames[selectedDate.m] + ' ' + selectedDate.d + ', ' + selectedDate.y;
  document.getElementById('booking-summary').innerHTML =
    '<div class="detail-chip">📅 ' + dateStr + ' at ' + selectedSlot + '</div>' +
    '<br><div class="detail-chip" style="margin-top:8px;">🗂️ ' + svcName + '</div>';
  document.getElementById('booking-form').style.display = 'none';
  document.getElementById('booking-success').style.display = 'block';
}

function resetBooking() {
  document.getElementById('booking-form').style.display = 'block';
  document.getElementById('booking-success').style.display = 'none';
  selectedDate = null; selectedSlot = null;
  ['b-fname','b-lname','b-email','b-phone','b-notes'].forEach(id => document.getElementById(id).value = '');
  document.querySelectorAll('.svc-pill').forEach(p => p.classList.remove('selected'));
  renderCalendar(); renderSlots();
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

function signUpEmail() {
  const val = document.getElementById('email-input').value.trim();
  if (!val) { alert('Please enter your email.'); return; }
  document.getElementById('email-ok').style.display = 'block';
  document.getElementById('email-input').value = '';
}

document.addEventListener('DOMContentLoaded', () => { renderCalendar(); renderSlots(); });
