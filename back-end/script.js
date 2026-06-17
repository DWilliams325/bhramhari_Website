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

const galleryStorageKey = 'bhramhariGalleryItems';
const useBackendGalleryStorage = false; // flip to true when backend storage is available
let pendingGalleryFiles = [];

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getStoredGalleryItems() {
  const json = localStorage.getItem(galleryStorageKey);
  if (!json) return [];
  try { return JSON.parse(json); } catch (e) { return []; }
}

function saveGalleryItems(items) {
  localStorage.setItem(galleryStorageKey, JSON.stringify(items));
}

async function loadGalleryItems() {
  if (useBackendGalleryStorage) {
    // TODO: replace with your backend GET endpoint when ready
    return getStoredGalleryItems();
  }
  return getStoredGalleryItems();
}

async function storeGalleryItems(items) {
  if (useBackendGalleryStorage) {
    // TODO: replace with your backend POST/PUT endpoint when ready
    return saveGalleryItems(items);
  }
  return saveGalleryItems(items);
}

function createGalleryCard(item) {
  const card = document.createElement('div');
  card.className = 'gallery-card';
  card.style.position = 'relative';
  const locked = Boolean(item.locked);
  card.innerHTML = `
    <div class="gallery-card-actions">
      <button class="gallery-card-save" type="button" data-id="${item.id}">Save</button>
      <button class="gallery-card-edit" type="button" data-id="${item.id}">Edit</button>
      <button class="gallery-card-remove" type="button" data-id="${item.id}">Remove</button>
    </div>
    <img src="${item.src}" alt="${escapeHtml(item.title) || 'Bhramhari booth photo'}" />
    <div class="gallery-card-meta">
      <div class="gallery-card-view ${locked ? '' : 'hidden'}">
        <div class="gallery-card-view-row">
          <span class="gallery-card-view-label">Event Name</span>
          <span class="gallery-card-view-value">${escapeHtml(item.eventName || 'Bhramhari Event')}</span>
        </div>
        <div class="gallery-card-view-row">
          <span class="gallery-card-view-label">Location</span>
          <span class="gallery-card-view-value">${escapeHtml(item.location || 'Aurora, IL')}</span>
        </div>
        <div class="gallery-card-view-row">
          <span class="gallery-card-view-label">Title</span>
          <span class="gallery-card-view-value">${escapeHtml(item.title || 'Bhramhari Booth Display')}</span>
        </div>
        <div class="gallery-card-view-description">${escapeHtml(item.description || 'Highlight the Bhramhari brand display, booth setup, or event location.')}</div>
      </div>
      <div class="gallery-card-editable ${locked ? 'hidden' : ''}">
        <label class="gallery-card-label">Event Name</label>
        <input class="gallery-card-event" type="text" value="${escapeHtml(item.eventName || 'Bhramhari Event')}" placeholder="Edit event name" ${locked ? 'disabled' : ''} />
        <label class="gallery-card-label">Location</label>
        <input class="gallery-card-location" type="text" value="${escapeHtml(item.location || 'Aurora, IL')}" placeholder="Edit location" ${locked ? 'disabled' : ''} />
        <label class="gallery-card-label">Photo Title</label>
        <input class="gallery-card-title" type="text" value="${escapeHtml(item.title || 'Bhramhari Booth Display')}" placeholder="Add a Bhramhari title" ${locked ? 'disabled' : ''} />
        <label class="gallery-card-label">Description</label>
        <textarea class="gallery-card-description" placeholder="Describe this booth or event setup" ${locked ? 'disabled' : ''}>${escapeHtml(item.description || 'Highlight the Bhramhari brand display, booth setup, or event location.')}</textarea>
      </div>
    </div>
  `;

  const eventInput = card.querySelector('.gallery-card-event');
  const locationInput = card.querySelector('.gallery-card-location');
  const titleInput = card.querySelector('.gallery-card-title');
  const descTextarea = card.querySelector('.gallery-card-description');
  const saveBtn = card.querySelector('.gallery-card-save');
  const removeBtn = card.querySelector('.gallery-card-remove');
  const editBtn = card.querySelector('.gallery-card-edit');

  const viewSection = card.querySelector('.gallery-card-view');
  const editSection = card.querySelector('.gallery-card-editable');

  const updateCardState = (lockedState) => {
    if (eventInput) eventInput.disabled = lockedState;
    if (locationInput) locationInput.disabled = lockedState;
    if (titleInput) titleInput.disabled = lockedState;
    if (descTextarea) descTextarea.disabled = lockedState;
    if (saveBtn) {
      saveBtn.textContent = lockedState ? 'Saved' : 'Save';
      saveBtn.disabled = lockedState;
      saveBtn.classList.toggle('gallery-card-saved', lockedState);
    }
    if (editBtn) {
      editBtn.disabled = !lockedState;
    }
    if (viewSection) viewSection.classList.toggle('hidden', !lockedState);
    if (editSection) editSection.classList.toggle('hidden', lockedState);
  };

  const saveCard = () => {
    const items = getStoredGalleryItems();
    const target = items.find(i => i.id === item.id);
    if (!target) return;
    target.eventName = eventInput?.value || '';
    target.location = locationInput?.value || '';
    target.title = titleInput?.value || '';
    target.description = descTextarea?.value || '';
    target.locked = true;
    storeGalleryItems(items);
    if (viewSection) {
      viewSection.querySelector('.gallery-card-view-row:nth-child(1) .gallery-card-view-value').textContent = target.eventName || 'Bhramhari Event';
      viewSection.querySelector('.gallery-card-view-row:nth-child(2) .gallery-card-view-value').textContent = target.location || 'Aurora, IL';
      viewSection.querySelector('.gallery-card-view-row:nth-child(3) .gallery-card-view-value').textContent = target.title || 'Bhramhari Booth Display';
      viewSection.querySelector('.gallery-card-view-description').textContent = target.description || 'Highlight the Bhramhari brand display, booth setup, or event location.';
    }
    updateCardState(true);
  };

  const editCard = () => {
    const items = getStoredGalleryItems();
    const target = items.find(i => i.id === item.id);
    if (!target) return;
    target.locked = false;
    storeGalleryItems(items);
    updateCardState(false);
    const firstField = eventInput || locationInput || titleInput;
    if (firstField) {
      firstField.focus();
      if (firstField.select) firstField.select();
    }
  };

  updateCardState(locked);

  saveBtn?.addEventListener('click', saveCard);
  removeBtn?.addEventListener('click', () => removeGalleryItem(item.id));
  editBtn?.addEventListener('click', editCard);
  return card;
}

async function renderGalleryItems() {
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  if (!grid) return;

  const items = await loadGalleryItems();
  grid.innerHTML = '';

  if (!items.length) {
    if (empty) {
      empty.style.display = 'block';
      grid.appendChild(empty);
    }
    return;
  }

  items.forEach(item => {
    grid.appendChild(createGalleryCard(item));
  });
}

function updateGalleryStatus() {
  const status = document.getElementById('gallery-status');
  if (!status) return;
  if (!pendingGalleryFiles.length) {
    status.textContent = 'Choose one or more photos and add Bhramhari-friendly captions, event name, and location, then click Save.';
  } else {
    status.textContent = `${pendingGalleryFiles.length} photo(s) selected. Add your details and press Save to enter them into the gallery.`;
  }
}

window.addEventListener('DOMContentLoaded', () => renderGalleryItems());

function handleGalleryUpload(event) {
  pendingGalleryFiles = Array.from(event.target.files).filter(file => file.type.startsWith('image/'));
  updateGalleryStatus();
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

async function saveGalleryEntry() {
  if (!pendingGalleryFiles.length) {
    alert('Please choose at least one photo before saving.');
    return;
  }

  const title = document.getElementById('gallery-title').value.trim();
  const eventName = document.getElementById('gallery-event').value.trim();
  const location = document.getElementById('gallery-location').value.trim();
  const description = document.getElementById('gallery-description').value.trim();
  const storedItems = await loadGalleryItems();

  const savedItems = await Promise.all(pendingGalleryFiles.map(async file => {
    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      src: await fileToDataURL(file),
      title: title || 'Bhramhari Booth Display',
      description: description || 'Highlight the Bhramhari brand display, booth setup, or event location.',
      eventName: eventName || 'Bhramhari Event',
      location: location || 'Aurora, IL',
      locked: true,
    };
  }));

  const allItems = [...savedItems, ...storedItems];
  await storeGalleryItems(allItems);
  pendingGalleryFiles = [];
  document.getElementById('gallery-files').value = '';
  document.getElementById('gallery-title').value = '';
  document.getElementById('gallery-event').value = '';
  document.getElementById('gallery-location').value = '';
  document.getElementById('gallery-description').value = '';
  updateGalleryStatus();
  renderGalleryItems();
}

function removeGalleryItem(itemId) {
  const items = getStoredGalleryItems().filter(item => item.id !== itemId);
  storeGalleryItems(items);
  renderGalleryItems();
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

