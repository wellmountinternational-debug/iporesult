/* ═══════════════════════════════════════════════════════════════
   iporesult.in — config.js
   Shared JavaScript for ALL pages.
   ─────────────────────────────────────────────────────────────
   HOW TO USE:
   Load this file in every HTML page with:
     <script src="config.js"></script>
   Put it BEFORE your page-specific <script> block.
   ═══════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────
//  ★ SET YOUR GAS URL ONCE HERE — works for all pages ★
// ─────────────────────────────────────────────────────────────
var GAS_URL = 'https://script.google.com/macros/s/AKfycbzXmyGZBJwN7ImsBb3NXpso5A33UbPDoubKsxtdlMnpb9QXb0mNGfvVsZEV8VY4DFQT/exec';

// ─────────────────────────────────────────────────────────────
//  GRADIENT COLOURS for IPO logo avatars
// ─────────────────────────────────────────────────────────────
var GRADS = [
  ['#4f6ef7','#7c3aed'], ['#f59e0b','#ef4444'],
  ['#10b981','#06b6d4'], ['#ec4899','#8b5cf6'],
  ['#f97316','#eab308'], ['#06b6d4','#3b82f6'],
];

// ─────────────────────────────────────────────────────────────
//  NEWS CATEGORY CONFIG
// ─────────────────────────────────────────────────────────────
var NEWS_ICONS = { Analysis:'📈', News:'🏦', Upcoming:'📅', Policy:'⚖️', Market:'📊', Default:'📰' };
var CAT_COLORS = {
  Analysis : { bg:'rgba(79,110,247,.85)',  text:'#fff' },
  News     : { bg:'rgba(16,185,129,.85)',  text:'#fff' },
  Upcoming : { bg:'rgba(245,158,11,.85)',  text:'#fff' },
  Policy   : { bg:'rgba(239,68,68,.85)',   text:'#fff' },
  Market   : { bg:'rgba(124,58,237,.85)',  text:'#fff' },
};

// ─────────────────────────────────────────────────────────────
//  FETCH from GAS
//  Usage: gasGet('getOpenIPOs').then(function(data){ ... })
// ─────────────────────────────────────────────────────────────
function gasGet(action) {
  return fetch(GAS_URL + '?action=' + action)
    .then(function(r) { return r.json(); })
    .catch(function(err) {
      console.warn('[GAS] ' + action + ' failed:', err);
      return [];
    });
}

// ─────────────────────────────────────────────────────────────
//  HTML ESCAPE — always use this when inserting sheet data
// ─────────────────────────────────────────────────────────────
function e(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ─────────────────────────────────────────────────────────────
//  GMP HELPERS
// ─────────────────────────────────────────────────────────────
function gmpClass(v) { return parseFloat(v) >= 0 ? 'gp' : 'gn'; }
function gmpSign(v)  { return parseFloat(v) >= 0 ? '+' : ''; }
function subPct(v)   { return Math.min(100, Math.round((parseFloat(v) || 0) / 5 * 100)); }

// ─────────────────────────────────────────────────────────────
//  SHOW MESSAGE in any result box
//  type: 'success' | 'error' | 'warn' | 'info' | 'loading'
// ─────────────────────────────────────────────────────────────
function showMsg(boxId, type, html) {
  var box = document.getElementById(boxId);
  if (!box) return;
  var palette = {
    success : { bg:'rgba(16,185,129,.1)',  bd:'rgba(16,185,129,.3)', c:'var(--text)'   },
    error   : { bg:'rgba(239,68,68,.1)',   bd:'rgba(239,68,68,.3)',  c:'var(--red)'    },
    warn    : { bg:'rgba(245,158,11,.1)',  bd:'rgba(245,158,11,.3)', c:'var(--orange)' },
    info    : { bg:'rgba(79,110,247,.08)', bd:'rgba(79,110,247,.3)', c:'var(--text)'   },
    loading : { bg:'rgba(79,110,247,.08)', bd:'rgba(79,110,247,.3)', c:'var(--accent)' },
  };
  var s = palette[type] || palette.info;
  box.style.cssText = 'display:block;padding:14px 18px;border-radius:10px;font-size:13px;line-height:1.7;'
    + 'background:' + s.bg + ';border:1px solid ' + s.bd + ';color:' + s.c + ';margin-top:14px';
  box.innerHTML = (type === 'loading')
    ? '<span class="spinner"></span>' + html
    : html;
}

// ─────────────────────────────────────────────────────────────
//  DRAWER (mobile side menu) — shared across all pages
// ─────────────────────────────────────────────────────────────
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ─────────────────────────────────────────────────────────────
//  BOTTOM NAV — highlight active item on scroll
// ─────────────────────────────────────────────────────────────
function initBottomNav(sectionIds) {
  var items = document.querySelectorAll('.bn');
  if (!items.length) return;
  window.addEventListener('scroll', function() {
    var cur = sectionIds[0];
    sectionIds.forEach(function(id) {
      var el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) cur = id;
    });
    items.forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('href') === '#' + cur);
    });
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
//  MARKET STRIP — inject the live strip HTML into .mstrip-inner
//  Optionally pass extra items like open IPO count
// ─────────────────────────────────────────────────────────────
function buildMarketStrip(extraLabel, extraValue) {
  var base = [
    { l:'NIFTY 50',   v:'22,514 ▲ 0.42%', cls:'up' },
    { l:'SENSEX',     v:'74,119 ▲ 0.38%', cls:'up' },
    { l:'NIFTY BANK', v:'48,220 ▼ 0.12%', cls:'dn' },
  ];
  if (extraLabel) base.push({ l: extraLabel, v: extraValue || 'Live', cls:'', style:'color:var(--accent)' });
  var html = base.concat(base).map(function(item) { // duplicate for seamless loop
    return '<span class="ms"><span class="ms-l">' + item.l + '</span>'
      + '<span class="ms-v ' + (item.cls||'') + '" ' + (item.style?'style="'+item.style+'"':'') + '>'
      + item.v + '</span></span>';
  }).join('');
  var el = document.querySelector('.mstrip-inner');
  if (el) el.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
//  RENDER — OPEN IPOs TABLE (used on index + allotment pages)
// ─────────────────────────────────────────────────────────────
function renderOpenTable(rows, tbodyId) {
  var tbody = document.getElementById(tbodyId || 'openBody');
  if (!tbody) return;

  if (!rows || rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-data">No open IPOs right now. Add rows to the <b>OpenIPOs</b> sheet tab.</td></tr>';
    return;
  }

  // Populate allotment dropdown if present
  var sel = document.getElementById('allotIPO');
  if (sel) {
    sel.innerHTML = '<option value="">— Select IPO —</option>'
      + rows.map(function(r) { return '<option value="' + e(r.name) + '">' + e(r.name) + '</option>'; }).join('');
  }

  var statusMap = { open:'b-open', upcoming:'b-upcoming', closed:'b-closed', listed:'b-listed' };
  tbody.innerHTML = rows.map(function(r) {
    var gmp = parseFloat(r.gmp) || 0;
    var sub = parseFloat(r.subscription) || 0;
    var st  = (r.status || 'open').toLowerCase();
    return '<tr>'
      + '<td class="tbl-name"><a href="#">' + e(r.name) + '</a></td>'
      + '<td>' + e(r.price_band) + '</td>'
      + '<td>' + e(r.open_date) + '</td>'
      + '<td>' + e(r.close_date) + '</td>'
      + '<td class="' + gmpClass(gmp) + '">' + (gmp ? gmpSign(gmp) + '₹' + gmp : '—') + '</td>'
      + '<td><div class="sub-bar-row"><span>' + (sub > 0 ? sub.toFixed(2) + 'x' : '—') + '</span>'
        + (sub > 0 ? '<div class="sub-bar"><div class="sub-fill" style="width:' + subPct(sub) + '%;background:var(--accent)"></div></div>' : '')
        + '</div></td>'
      + '<td><span class="badge ' + (statusMap[st] || 'b-open') + '">' + e(r.status || 'OPEN').toUpperCase() + '</span></td>'
      + '</tr>';
  }).join('');
}

// ─────────────────────────────────────────────────────────────
//  RENDER — UPCOMING IPO CARDS
// ─────────────────────────────────────────────────────────────
function renderUpcomingCards(rows, gridId) {
  var grid = document.getElementById(gridId || 'upcomingGrid');
  if (!grid) return;

  if (!rows || rows.length === 0) {
    grid.innerHTML = '<p style="color:var(--text3);padding:12px;grid-column:1/-1">No upcoming IPOs. Add rows to the <b>UpcomingIPOs</b> sheet tab.</p>';
    return;
  }

  grid.innerHTML = rows.map(function(r, i) {
    var grad    = GRADS[i % GRADS.length];
    var initials = (r.name || '').split(' ').slice(0,2).map(function(w){return w[0]||'';}).join('').toUpperCase();
    var gmp     = parseFloat(r.gmp_est) || 0;
    var gmpHtml = gmp
      ? '<span class="' + gmpClass(gmp) + '" style="font-size:12px">GMP ' + gmpSign(gmp) + '₹' + gmp + ' est.</span>'
      : '<span style="font-size:12px;color:var(--text3)">GMP: TBA</span>';

    return '<div class="card">'
      + '<div class="card-hd">'
        + '<div class="card-logo" style="background:linear-gradient(135deg,' + grad[0] + ',' + grad[1] + ')">' + initials + '</div>'
        + '<span class="badge b-upcoming">Upcoming</span>'
      + '</div>'
      + '<div class="card-t">' + e(r.name) + '</div>'
      + '<div class="card-s">' + e(r.sector || '') + '</div>'
      + '<div class="card-row"><span class="cr-l">Price Band</span><span class="cr-v">' + e(r.price_band || 'TBA') + '</span></div>'
      + '<div class="card-row"><span class="cr-l">Issue Size</span><span class="cr-v">'  + e(r.issue_size || 'TBA')  + '</span></div>'
      + '<div class="card-row"><span class="cr-l">Open Date</span><span class="cr-v">'   + e(r.expected_open || 'TBA') + '</span></div>'
      + '<div class="card-row"><span class="cr-l">Lot Size</span><span class="cr-v">'    + e(r.lot_size ? r.lot_size + ' Shares' : 'TBA') + '</span></div>'
      + '<div class="card-ft">' + gmpHtml
        + '<button class="btn-alert" onclick="alertFor(\'' + e(r.name) + '\')">🔔 Alert</button>'
      + '</div>'
      + '</div>';
  }).join('');
}

// ─────────────────────────────────────────────────────────────
//  RENDER — GMP GRID
// ─────────────────────────────────────────────────────────────
function renderGMPGrid(rows, gridId) {
  var grid = document.getElementById(gridId || 'gmpGrid');
  if (!grid) return;

  if (!rows || rows.length === 0) {
    grid.innerHTML = '<p style="color:var(--text3);padding:12px">No GMP data. Add rows to the <b>GMP</b> sheet tab.</p>';
    return;
  }

  grid.innerHTML = rows.map(function(r) {
    var gmp = parseFloat(r.gmp) || 0;
    var est = parseFloat(r.estimated_listing) || 0;
    var ip  = parseFloat((r.ipo_price || '').toString().replace(/[^\d.]/g,'')) || 0;
    var pct = ip > 0 ? ((gmp / ip) * 100).toFixed(1) : null;
    return '<div class="gmp-card">'
      + '<div class="gmp-co">' + e(r.company) + '</div>'
      + '<div class="gmp-val ' + gmpClass(gmp) + '">' + gmpSign(gmp) + '₹' + gmp + '</div>'
      + '<div class="gmp-kostak">Kostak: ₹' + e(r.kostak || '—') + '</div>'
      + (est ? '<div class="gmp-est" style="color:' + (gmp >= 0 ? 'var(--green)' : 'var(--red)') + '">'
          + 'Est. ₹' + est + (pct ? ' (' + gmpSign(gmp) + pct + '%)' : '') + '</div>' : '')
      + '</div>';
  }).join('');
}

// ─────────────────────────────────────────────────────────────
//  RENDER — GMP TICKER
// ─────────────────────────────────────────────────────────────
function renderTicker(rows, tickerId) {
  var ticker = document.getElementById(tickerId || 'ticker');
  if (!ticker || !rows || !rows.length) return;
  var items = rows.concat(rows); // duplicate for seamless scroll
  ticker.innerHTML = items.map(function(r) {
    var v = parseFloat(r.gmp) || 0;
    return '<span class="t-item">'
      + '<span class="t-name">' + e(r.company) + '</span>'
      + '<span class="t-gmp ' + gmpClass(v) + '">GMP ' + gmpSign(v) + '₹' + v + '</span>'
      + '</span>';
  }).join('');
}

// ─────────────────────────────────────────────────────────────
//  RENDER — SUBSCRIPTION TABLE
// ─────────────────────────────────────────────────────────────
function renderSubTable(rows, tbodyId) {
  var tbody = document.getElementById(tbodyId || 'subBody');
  if (!tbody) return;

  if (!rows || rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="no-data">No subscription data. Add rows to the <b>Subscription</b> sheet tab.</td></tr>';
    return;
  }

  function subCell(v, color) {
    var val = parseFloat(v) || 0;
    return '<td>' + (val
      ? '<div class="sub-bar-row"><span class="' + (val >= 1 ? 'up' : '') + '">' + val.toFixed(2) + 'x</span>'
        + '<div class="sub-bar"><div class="sub-fill" style="width:' + subPct(val) + '%;background:' + color + '"></div></div></div>'
      : '—') + '</td>';
  }

  tbody.innerHTML = rows.map(function(r, i) {
    var tot = parseFloat(r.total) || 0;
    return '<tr>'
      + '<td style="color:var(--text3)">' + (i + 1) + '</td>'
      + '<td class="tbl-name"><a href="#">' + e(r.company) + '</a></td>'
      + subCell(r.qib, 'var(--accent)')
      + subCell(r.nii, 'var(--green)')
      + subCell(r.rii, 'var(--orange)')
      + '<td>' + (r.employee ? parseFloat(r.employee).toFixed(2) + 'x' : '—') + '</td>'
      + '<td class="' + (tot >= 1 ? 'up' : '') + '" style="font-weight:700">' + (tot > 0 ? tot.toFixed(2) + 'x' : '—') + '</td>'
      + '<td>' + e(r.issue_size || '—') + '</td>'
      + '</tr>';
  }).join('');
}

// ─────────────────────────────────────────────────────────────
//  RENDER — NEWS GRID
// ─────────────────────────────────────────────────────────────
function renderNewsGrid(rows, gridId, limit) {
  var grid = document.getElementById(gridId || 'newsGrid');
  if (!grid) return;

  if (!rows || rows.length === 0) {
    grid.innerHTML = '<p style="color:var(--text3);padding:12px;grid-column:1/-1">No news yet. Add rows to the <b>News</b> sheet tab.</p>';
    return;
  }

  var items = limit ? rows.slice(0, limit) : rows;
  grid.innerHTML = items.map(function(r) {
    var cat  = r.category || 'News';
    var cc   = CAT_COLORS[cat] || { bg:'rgba(79,110,247,.85)', text:'#fff' };
    var icon = NEWS_ICONS[cat] || NEWS_ICONS.Default;
    var link = r.slug ? '/blog/' + e(r.slug) : '#';
    return '<article class="blog-card" itemscope itemtype="https://schema.org/Article">'
      + '<div class="blog-img">'
        + (r.image_url ? '<img src="' + e(r.image_url) + '" alt="' + e(r.title) + '" loading="lazy" itemprop="image"/>' : '<div class="blog-icon">' + icon + '</div>')
        + '<span class="blog-cat-badge" style="background:' + cc.bg + ';color:' + cc.text + '">' + e(cat) + '</span>'
      + '</div>'
      + '<div class="blog-body">'
        + '<div class="blog-meta"><time itemprop="datePublished" datetime="' + e(r.date) + '">' + e(r.date || '') + '</time>' + (r.author ? ' · ' + e(r.author) : '') + '</div>'
        + '<div class="blog-title" itemprop="headline"><a href="' + link + '" itemprop="url">' + e(r.title) + '</a></div>'
        + '<div class="blog-exc" itemprop="description">' + e(r.excerpt || '') + '</div>'
        + '<a href="' + link + '" class="read-more">Read more →</a>'
      + '</div>'
      + '</article>';
  }).join('');
}

// ─────────────────────────────────────────────────────────────
//  ALLOTMENT TOGGLE — switch label/placeholder when check method changes
// ─────────────────────────────────────────────────────────────
function toggleAllotField(val) {
  var labels = { pan:'PAN Number', app:'Application Number', dp:'DP / Client ID' };
  var phs    = { pan:'Enter PAN (e.g. ABCDE1234F)', app:'Enter Application Number', dp:'Enter DP ID / Client ID' };
  var lbl = document.getElementById('fieldLabel');
  var inp = document.getElementById('fieldVal');
  if (lbl) lbl.textContent = labels[val] || 'PAN Number';
  if (inp) { inp.placeholder = phs[val] || ''; inp.maxLength = val === 'pan' ? 10 : 20; }
}

// ─────────────────────────────────────────────────────────────
//  ALERT BUTTON
// ─────────────────────────────────────────────────────────────
function alertFor(name) {
  alert('🔔 Alert feature coming soon!\n\nYou will be notified when "' + name + '" allotment results are announced.');
}

// ─────────────────────────────────────────────────────────────
//  AUTO-INIT on every page load
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Mark active nav link based on current filename
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .drawer-nav a').forEach(function(a) {
    var href = a.getAttribute('href') || '';
    if (href === page || (page === 'index.html' && href === 'index.html') || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  // Mark bottom nav active item
  document.querySelectorAll('.bn').forEach(function(b) {
    var href = b.getAttribute('href') || '';
    b.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
});
