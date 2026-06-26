// Generates the static *.html pages in front-end/ from template.html + partials/ + pages/.
// Run with: node build.js (from front-end/, or via the Vercel buildCommand).
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://bhramhari.com';
const root = __dirname;

const template = fs.readFileSync(path.join(root, 'template.html'), 'utf8');
const navPartial = fs.readFileSync(path.join(root, 'partials', 'nav.html'), 'utf8');
const footerPartial = fs.readFileSync(path.join(root, 'partials', 'footer.html'), 'utf8');
const pages = JSON.parse(fs.readFileSync(path.join(root, 'pages.json'), 'utf8'));

const navIds = ['home', 'services', 'about', 'events', 'contact', 'booking'];

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;');
}

function renderNav(activeNavId) {
  let nav = navPartial;
  for (const id of navIds) {
    nav = nav.replace(`{{ACTIVE_${id}}}`, id === activeNavId ? 'active' : '');
  }
  return nav;
}

for (const page of pages) {
  const content = fs.readFileSync(path.join(root, 'pages', page.content), 'utf8');
  const canonicalUrl = `${SITE_URL}/${page.slug === 'index' ? '' : page.slug + '.html'}`;
  const ogImage = `${SITE_URL}/assets/BHRAMHARI_Logo.png`;

  const html = template
    .replace(/{{TITLE}}/g, escapeAttr(page.title))
    .replace(/{{DESCRIPTION}}/g, escapeAttr(page.description))
    .replace(/{{OG_TITLE}}/g, escapeAttr(page.title))
    .replace(/{{OG_DESCRIPTION}}/g, escapeAttr(page.description))
    .replace(/{{OG_IMAGE}}/g, escapeAttr(ogImage))
    .replace(/{{CANONICAL}}/g, escapeAttr(canonicalUrl))
    .replace('{{NAV}}', renderNav(page.navId))
    .replace('{{CONTENT}}', content)
    .replace('{{FOOTER}}', footerPartial);

  const outPath = path.join(root, `${page.slug}.html`);
  fs.writeFileSync(outPath, html);
  console.log(`Built ${page.slug}.html`);
}
