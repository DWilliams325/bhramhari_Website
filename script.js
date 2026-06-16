function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectService(svc) {
  switchCal(svc);
}

const calLinks = {
  insurance:  'damian325/insurance-consultation',
  retirement: 'damian325/retirement-planning',
  estate:     'damian325/estate-planning',
};

function switchCal(service) {
  const sel = document.getElementById('svc-select');
  if (sel) sel.value = service;
  const btn = document.getElementById('booking-btn');
  if (btn) btn.setAttribute('data-cal-link', calLinks[service]);
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

document.addEventListener('DOMContentLoaded', () => {
  Cal("ui", {
    styles: { branding: { brandColor: "#E8421A" } },
    hideEventTypeDetails: false,
    layout: "month_view"
  });
});
