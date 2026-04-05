/* ═══════════════════════════════════════════════════════════════
   iporesult.in — config.js  v3.0
   Header and footer are baked INTO this file as strings.
   No file fetching. Works everywhere: Hostinger, GitHub, localhost.
   ═══════════════════════════════════════════════════════════════ */

var GAS_URL = 'https://script.google.com/macros/s/AKfycbzXmyGZBJwN7ImsBb3NXpso5A33UbPDoubKsxtdlMnpb9QXb0mNGfvVsZEV8VY4DFQT/exec';

var GRADS = [['#4f6ef7','#7c3aed'],['#f59e0b','#ef4444'],['#10b981','#06b6d4'],['#ec4899','#8b5cf6'],['#f97316','#eab308'],['#06b6d4','#3b82f6']];
var NEWS_ICONS = {Analysis:'📈',News:'🏦',Upcoming:'📅',Policy:'⚖️',Market:'📊',Default:'📰'};
var CAT_COLORS = {Analysis:{bg:'rgba(79,110,247,.85)',text:'#fff'},News:{bg:'rgba(16,185,129,.85)',text:'#fff'},Upcoming:{bg:'rgba(245,158,11,.85)',text:'#fff'},Policy:{bg:'rgba(239,68,68,.85)',text:'#fff'},Market:{bg:'rgba(124,58,237,.85)',text:'#fff'}};

// ══════════════════════════════════════════════════════════════
//  HEADER HTML  — to add/change nav links, edit this string
// ══════════════════════════════════════════════════════════════
var HEADER_HTML = [
'<div class="mstrip"><div class="mstrip-inner">',
'<span class="ms"><span class="ms-l">NIFTY 50</span><span class="ms-v up">22,514 ▲ 0.42%</span></span>',
'<span class="ms"><span class="ms-l">SENSEX</span><span class="ms-v up">74,119 ▲ 0.38%</span></span>',
'<span class="ms"><span class="ms-l">NIFTY BANK</span><span class="ms-v dn">48,220 ▼ 0.12%</span></span>',
'<span class="ms"><span class="ms-l">IPOs Open</span><span class="ms-v" style="color:var(--accent)" id="stripOpenCount">Live</span></span>',
'<span class="ms"><span class="ms-l">NIFTY 50</span><span class="ms-v up">22,514 ▲ 0.42%</span></span>',
'<span class="ms"><span class="ms-l">SENSEX</span><span class="ms-v up">74,119 ▲ 0.38%</span></span>',
'<span class="ms"><span class="ms-l">NIFTY BANK</span><span class="ms-v dn">48,220 ▼ 0.12%</span></span>',
'<span class="ms"><span class="ms-l">iporesult.in</span><span class="ms-v" style="color:var(--accent)">Live Data</span></span>',
'</div></div>',
'<div class="overlay" id="overlay" onclick="closeDrawer()"></div>',
'<nav class="drawer" id="drawer">',
'<div class="drawer-hd"><a href="index.html" class="logo"><span>IPO</span><span class="logo-badge">Result</span></a>',
'<button class="drawer-close" onclick="closeDrawer()">✕</button></div>',
'<div class="drawer-nav">',
'<a href="index.html">🏠 Home</a>',
'<a href="upcoming-ipo.html">📅 Upcoming IPO</a>',
'<a href="ipo-gmp.html">📈 IPO GMP</a>',
'<a href="allotment.html">🎯 Allotment Status</a>',
'<a href="subscription.html">📊 Subscription</a>',
'<div class="d-div"></div>',
'<a href="news.html">📰 IPO News</a>',
'</div></nav>',
'<header><nav class="navbar">',
'<a href="index.html" class="logo"><span>IPO</span><span class="logo-badge">Result</span></a>',
'<ul class="nav-links">',
'<li><a href="index.html">Home</a></li>',
'<li><a href="upcoming-ipo.html">Upcoming IPO</a></li>',
'<li><a href="ipo-gmp.html">IPO GMP</a></li>',
'<li><a href="allotment.html">Allotment</a></li>',
'<li><a href="subscription.html">Subscription</a></li>',
'<li><a href="news.html">News</a></li>',
'</ul>',
'<button class="hamburger" id="hamburgerBtn" onclick="openDrawer()"><span></span><span></span><span></span></button>',
'</nav></header>'
].join('');

// ══════════════════════════════════════════════════════════════
//  FOOTER HTML  — to edit footer, change this string
// ══════════════════════════════════════════════════════════════
var FOOTER_HTML = [
'<footer class="footer">',
'<div class="footer-grid">',
'<div class="footer-brand">',
'<a href="index.html" class="logo"><span>IPO</span><span class="logo-badge">Result</span></a>',
'<p>India\'s trusted portal for IPO GMP, allotment status, subscription data and upcoming IPO news. Data updated live from Google Sheets.</p>',
'</div>',
'<div class="fc"><h4>IPO Pages</h4><ul>',
'<li><a href="upcoming-ipo.html">Upcoming IPO 2025</a></li>',
'<li><a href="ipo-gmp.html">IPO GMP Today</a></li>',
'<li><a href="allotment.html">Allotment Status</a></li>',
'<li><a href="subscription.html">Subscription Data</a></li>',
'<li><a href="news.html">IPO News</a></li>',
'</ul></div>',
'<div class="fc"><h4>Resources</h4><ul>',
'<li><a href="#">How to Apply for IPO</a></li>',
'<li><a href="#">IPO Glossary</a></li>',
'<li><a href="#">SME IPOs</a></li>',
'<li><a href="#">Listed IPOs 2025</a></li>',
'</ul></div>',
'<div class="fc"><h4>Company</h4><ul>',
'<li><a href="#">About Us</a></li>',
'<li><a href="#">Contact</a></li>',
'<li><a href="#">Privacy Policy</a></li>',
'<li><a href="#">Disclaimer</a></li>',
'</ul></div>',
'</div>',
'<div class="footer-bot">',
'<p>© 2025 iporesult.in — All Rights Reserved. Not SEBI registered. Data is for reference only.</p>',
'<p>Made with ❤️ for Indian investors</p>',
'</div></footer>',
'<nav class="bnav"><div class="bnav-inner">',
'<a href="index.html" class="bn"><span class="bn-ic">🏠</span>Home</a>',
'<a href="upcoming-ipo.html" class="bn"><span class="bn-ic">📅</span>Upcoming</a>',
'<a href="ipo-gmp.html" class="bn"><span class="bn-ic">📈</span>GMP</a>',
'<a href="allotment.html" class="bn"><span class="bn-ic">🎯</span>Allotment</a>',
'<a href="subscription.html" class="bn"><span class="bn-ic">📊</span>Sub Data</a>',
'</div></nav>'
].join('');

// ══════════════════════════════════════════════════════════════
//  SHELL INJECTOR — injects header+footer directly from strings
//  No XHR. No fetch. No file loading. Works everywhere.
// ══════════════════════════════════════════════════════════════
(function injectShell() {
  function inject() {
    var h = document.getElementById('site-header');
    var f = document.getElementById('site-footer');
    if (h) h.innerHTML = HEADER_HTML;
    if (f) f.innerHTML = FOOTER_HTML;

    // Mark active nav link
    var page = window.location.pathname.split('/').pop() || 'index.html';
    if (page === '') page = 'index.html';
    document.querySelectorAll('.nav-links a, .drawer-nav a').forEach(function(a) {
      a.classList.toggle('active', (a.getAttribute('href')||'').split('/').pop() === page);
    });
    document.querySelectorAll('.bn').forEach(function(b) {
      b.classList.toggle('active', (b.getAttribute('href')||'').split('/').pop() === page);
    });

    document.dispatchEvent(new CustomEvent('shellReady'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

// ══════════════════════════════════════════════════════════════
//  GAS API  — with sessionStorage cache (5 min)
//  Pages load from cache on revisit = near-instant
// ══════════════════════════════════════════════════════════════
var CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes in ms

function _cacheGet(key) {
  try {
    var raw = sessionStorage.getItem('ipo_' + key);
    if (!raw) return null;
    var obj = JSON.parse(raw);
    if (Date.now() - obj.ts > CACHE_TTL_MS) { sessionStorage.removeItem('ipo_' + key); return null; }
    return obj.data;
  } catch(e) { return null; }
}
function _cacheSet(key, data) {
  try { sessionStorage.setItem('ipo_' + key, JSON.stringify({ts: Date.now(), data: data})); } catch(e) {}
}

function gasGet(action, params) {
  var cacheKey = action + (params ? JSON.stringify(params) : '');
  var cached = _cacheGet(cacheKey);
  if (cached !== null) return Promise.resolve(cached);

  var url = GAS_URL + '?action=' + action;
  if (params) Object.keys(params).forEach(function(k){ url += '&'+encodeURIComponent(k)+'='+encodeURIComponent(params[k]); });

  // ★ FIX: 12-second timeout so pages never hang forever
  var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  var timer = controller ? setTimeout(function(){ controller.abort(); }, 12000) : null;
  var fetchOpts = controller ? { signal: controller.signal } : {};

  return fetch(url, fetchOpts)
    .then(function(r){
      if (timer) clearTimeout(timer);
      if(!r.ok) throw new Error('HTTP '+r.status);
      return r.json();
    })
    .then(function(data){ _cacheSet(cacheKey, data); return data; })
    .catch(function(err){
      if (timer) clearTimeout(timer);
      console.warn('[GAS]', action, err.message);
      // Return null (not []) so callers can detect failure vs empty data
      return null;
    });
}

// ★ FAST single-IPO detail — tries getIPO first, falls back to 4 calls
// Works with BOTH old and new GAS deployments automatically
function getIPODetail(name) {
  var cacheKey = 'getIPO_' + name;
  var cached = _cacheGet(cacheKey);
  if (cached !== null) return Promise.resolve(cached);

  var lc = name.toLowerCase().trim();

  // Try the fast single-call first (new GAS)
  var url = GAS_URL + '?action=getIPO&name=' + encodeURIComponent(name);

  // ★ FIX: 12-second timeout
  var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  var timer = controller ? setTimeout(function(){ controller.abort(); }, 12000) : null;
  var fetchOpts = controller ? { signal: controller.signal } : {};

  return fetch(url, fetchOpts)
    .then(function(r) {
      if (timer) clearTimeout(timer);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      if (data && data.error) throw new Error(data.error);
      if (data && (data.open !== undefined || data.upcoming !== undefined)) {
        _cacheSet(cacheKey, data);
        return data;
      }
      throw new Error('Unexpected response shape');
    })
    .catch(function(err) {
      if (timer) clearTimeout(timer);
      console.warn('[GAS] getIPO failed, falling back to 4-call method:', err.message);

      // FALLBACK: fetch all 4 sheets and filter client-side
      return Promise.all([
        gasGet('getOpenIPOs'),
        gasGet('getUpcoming'),
        gasGet('getGMP'),
        gasGet('getSubs'),
      ]).then(function(res) {
        // ★ FIX: handle null returns (network failure / timeout)
        var openList = Array.isArray(res[0]) ? res[0] : [];
        var upList   = Array.isArray(res[1]) ? res[1] : [];
        var gmpList  = Array.isArray(res[2]) ? res[2] : [];
        var subList  = Array.isArray(res[3]) ? res[3] : [];

        // ★ FIX: if ALL 4 calls failed (all null), throw so .catch() shows error
        if (res[0] === null && res[1] === null && res[2] === null && res[3] === null) {
          throw new Error('Cannot reach Google Apps Script. Check your GAS_URL and deployment.');
        }

        var openRow = null, upRow = null, gmpRow = null, subRows = [];
        openList.forEach(function(r) { if ((r.name||'').toLowerCase().trim() === lc) openRow = r; });
        upList.forEach(function(r)   { if ((r.name||'').toLowerCase().trim() === lc) upRow   = r; });
        gmpList.forEach(function(r)  { if ((r.company||'').toLowerCase().trim() === lc) gmpRow = r; });
        subList.forEach(function(r)  { if ((r.company||'').toLowerCase().trim() === lc) subRows.push(r); });

        var result = { open: openRow, upcoming: upRow, gmp: gmpRow, subs: subRows };
        _cacheSet(cacheKey, result);
        return result;
      });
    });
}

function gasPost(payload) {
  return fetch(GAS_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(function(r){return r.json();}).catch(function(){return null;});
}

// ══════════════════════════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════════════════════════
function e(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function gmpClass(v){return parseFloat(v)>=0?'gp':'gn';}
function gmpSign(v){return parseFloat(v)>=0?'+':'';}
function subPct(v){return Math.min(100,Math.round((parseFloat(v)||0)/5*100));}
function getParam(k){return new URLSearchParams(window.location.search).get(k)||'';}

function showMsg(id,type,html){
  var box=document.getElementById(id);if(!box)return;
  var p={success:{bg:'rgba(16,185,129,.1)',bd:'rgba(16,185,129,.3)',c:'var(--text)'},error:{bg:'rgba(239,68,68,.1)',bd:'rgba(239,68,68,.3)',c:'var(--red)'},warn:{bg:'rgba(245,158,11,.1)',bd:'rgba(245,158,11,.3)',c:'var(--orange)'},info:{bg:'rgba(79,110,247,.08)',bd:'rgba(79,110,247,.3)',c:'var(--text)'},loading:{bg:'rgba(79,110,247,.08)',bd:'rgba(79,110,247,.3)',c:'var(--accent)'}};
  var s=p[type]||p.info;
  box.style.cssText='display:block;padding:14px 18px;border-radius:10px;font-size:13px;line-height:1.7;background:'+s.bg+';border:1px solid '+s.bd+';color:'+s.c+';margin-top:14px';
  box.innerHTML=type==='loading'?'<span class="spinner"></span> '+html:html;
}

function openDrawer(){var d=document.getElementById('drawer'),o=document.getElementById('overlay');if(d)d.classList.add('open');if(o)o.classList.add('open');document.body.style.overflow='hidden';}
function closeDrawer(){var d=document.getElementById('drawer'),o=document.getElementById('overlay');if(d)d.classList.remove('open');if(o)o.classList.remove('open');document.body.style.overflow='';}

function toggleAllotField(val){
  var labels={pan:'PAN Number',app:'Application Number',dp:'DP / Client ID'};
  var phs={pan:'Enter PAN (e.g. ABCDE1234F)',app:'Enter Application Number',dp:'Enter DP ID / Client ID'};
  var lbl=document.getElementById('fieldLabel'),inp=document.getElementById('fieldVal');
  if(lbl)lbl.textContent=labels[val]||'PAN Number';
  if(inp){inp.placeholder=phs[val]||'';inp.maxLength=val==='pan'?10:20;}
}

function alertFor(name){
  var email=prompt('Enter email for allotment alert:\n"'+name+'"');
  if(!email)return;
  if(email.indexOf('@')===-1){alert('Please enter a valid email.');return;}
  gasPost({action:'subscribe',email:email,ipo:name,alertType:'allotment'}).then(function(res){alert(res&&res.success?'✅ Alert set!':'⚠️ Could not set alert.');});
}

function buildMarketStrip(label,value){
  var el=document.getElementById('stripOpenCount');
  if(el){el.textContent=value||'Live';var prev=el.previousElementSibling;if(prev)prev.textContent=label||'IPOs Open';}
}

// ══════════════════════════════════════════════════════════════
//  RENDER FUNCTIONS
// ══════════════════════════════════════════════════════════════

function renderOpenTable(rows,tbodyId){
  var tbody=document.getElementById(tbodyId||'openBody');if(!tbody)return;
  if(!rows||!rows.length){tbody.innerHTML='<tr><td colspan="7" class="no-data">No open IPOs. Add rows to <b>OpenIPOs</b> sheet tab.</td></tr>';return;}
  var sel=document.getElementById('allotIPO');
  if(sel)sel.innerHTML='<option value="">— Select IPO —</option>'+rows.map(function(r){return '<option value="'+e(r.name)+'">'+e(r.name)+'</option>';}).join('');
  var sm={open:'b-open',upcoming:'b-upcoming',closed:'b-closed',listed:'b-listed'};
  tbody.innerHTML=rows.map(function(r){
    var gmp=parseFloat(r.gmp)||0,sub=parseFloat(r.subscription)||0,st=(r.status||'open').toLowerCase();
    return '<tr><td class="tbl-name"><a href="ipo-detail.html?name='+encodeURIComponent(r.name)+'">'+e(r.name)+'</a></td>'
      +'<td>'+e(r.price_band||'—')+'</td><td>'+e(r.open_date||'—')+'</td><td>'+e(r.close_date||'—')+'</td>'
      +'<td class="'+gmpClass(gmp)+'">'+(gmp?gmpSign(gmp)+'₹'+gmp:'—')+'</td>'
      +'<td><div class="sub-bar-row"><span>'+(sub>0?sub.toFixed(2)+'x':'—')+'</span>'+(sub>0?'<div class="sub-bar"><div class="sub-fill" style="width:'+subPct(sub)+'%;background:var(--accent)"></div></div>':'')+'</div></td>'
      +'<td><span class="badge '+(sm[st]||'b-open')+'">'+e((r.status||'OPEN').toUpperCase())+'</span></td></tr>';
  }).join('');
}

function renderUpcomingCards(rows,gridId){
  var grid=document.getElementById(gridId||'upcomingGrid');if(!grid)return;
  if(!rows||!rows.length){grid.innerHTML='<p style="color:var(--text3);padding:12px;grid-column:1/-1">No upcoming IPOs. Add rows to <b>UpcomingIPOs</b> sheet tab.</p>';return;}
  grid.innerHTML=rows.map(function(r,i){
    var grad=GRADS[i%GRADS.length],init=(r.name||'').split(' ').slice(0,2).map(function(w){return w[0]||'';}).join('').toUpperCase();
    var gmp=parseFloat(r.gmp_est)||0;
    var gmpH=gmp?'<span class="'+gmpClass(gmp)+'" style="font-size:12px">GMP '+gmpSign(gmp)+'₹'+gmp+' est.</span>':'<span style="font-size:12px;color:var(--text3)">GMP: TBA</span>';
    var url='ipo-detail.html?name='+encodeURIComponent(r.name);
    return '<div class="card" onclick="location.href=\''+url+'\'" style="cursor:pointer">'
      +'<div class="card-hd"><div class="card-logo" style="background:linear-gradient(135deg,'+grad[0]+','+grad[1]+')">'+init+'</div><span class="badge b-upcoming">Upcoming</span></div>'
      +'<div class="card-t">'+e(r.name)+'</div><div class="card-s">'+e(r.sector||'')+'</div>'
      +'<div class="card-row"><span class="cr-l">Price Band</span><span class="cr-v">'+e(r.price_band||'TBA')+'</span></div>'
      +'<div class="card-row"><span class="cr-l">Issue Size</span><span class="cr-v">'+e(r.issue_size||'TBA')+'</span></div>'
      +'<div class="card-row"><span class="cr-l">Open Date</span><span class="cr-v">'+e(r.expected_open||'TBA')+'</span></div>'
      +'<div class="card-row"><span class="cr-l">Lot Size</span><span class="cr-v">'+e(r.lot_size?r.lot_size+' Shares':'TBA')+'</span></div>'
      +'<div class="card-ft">'+gmpH+'<button class="btn-alert" onclick="event.stopPropagation();alertFor(\''+e(r.name)+'\')">🔔 Alert</button></div>'
      +'</div>';
  }).join('');
}

function renderGMPGrid(rows,gridId){
  var grid=document.getElementById(gridId||'gmpGrid');if(!grid)return;
  if(!rows||!rows.length){grid.innerHTML='<p style="color:var(--text3);padding:12px">No GMP data. Add rows to <b>GMP</b> sheet tab.</p>';return;}
  grid.innerHTML=rows.map(function(r){
    var gmp=parseFloat(r.gmp)||0,est=parseFloat(r.estimated_listing)||0,ip=parseFloat((r.ipo_price||'').toString().replace(/[^\d.]/g,''))||0,pct=ip>0?((gmp/ip)*100).toFixed(1):null;
    return '<div class="gmp-card"><div class="gmp-co">'+e(r.company)+'</div><div class="gmp-val '+gmpClass(gmp)+'">'+gmpSign(gmp)+'₹'+gmp+'</div><div class="gmp-kostak">Kostak: ₹'+e(r.kostak||'—')+'</div>'+(est?'<div class="gmp-est" style="color:'+(gmp>=0?'var(--green)':'var(--red)')+'">Est. ₹'+est+(pct?' ('+gmpSign(gmp)+pct+'%)':'')+'</div>':'')+'</div>';
  }).join('');
}

function renderTicker(rows,tickerId){
  var ticker=document.getElementById(tickerId||'ticker');if(!ticker||!rows||!rows.length)return;
  var items=rows.concat(rows);
  ticker.innerHTML=items.map(function(r){var v=parseFloat(r.gmp)||0;return '<span class="t-item"><span class="t-name">'+e(r.company)+'</span><span class="t-gmp '+gmpClass(v)+'">GMP '+gmpSign(v)+'₹'+v+'</span></span>';}).join('');
}

function renderSubTable(rows,tbodyId){
  var tbody=document.getElementById(tbodyId||'subBody');if(!tbody)return;
  if(!rows||!rows.length){tbody.innerHTML='<tr><td colspan="8" class="no-data">No subscription data. Add rows to <b>Subscription</b> sheet tab.</td></tr>';return;}
  function subCell(v,color){var val=parseFloat(v)||0;return '<td>'+(val?'<div class="sub-bar-row"><span class="'+(val>=1?'up':'')+'">'+val.toFixed(2)+'x</span><div class="sub-bar"><div class="sub-fill" style="width:'+subPct(val)+'%;background:'+color+'"></div></div></div>':'—')+'</td>';}
  tbody.innerHTML=rows.map(function(r,i){var tot=parseFloat(r.total)||0;return '<tr><td style="color:var(--text3)">'+(i+1)+'</td><td class="tbl-name"><a href="ipo-detail.html?name='+encodeURIComponent(r.company)+'">'+e(r.company)+'</a></td>'+subCell(r.qib,'var(--accent)')+subCell(r.nii,'var(--green)')+subCell(r.rii,'var(--orange)')+'<td>'+(r.employee?parseFloat(r.employee).toFixed(2)+'x':'—')+'</td><td class="'+(tot>=1?'up':'')+'" style="font-weight:700">'+(tot>0?tot.toFixed(2)+'x':'—')+'</td><td>'+e(r.issue_size||'—')+'</td></tr>';}).join('');
}

function renderNewsGrid(rows,gridId,limit){
  var grid=document.getElementById(gridId||'newsGrid');if(!grid)return;
  if(!rows||!rows.length){grid.innerHTML='<p style="color:var(--text3);padding:12px;grid-column:1/-1">No news yet. Add rows to <b>News</b> sheet tab.</p>';return;}
  var items=limit?rows.slice(0,limit):rows;
  grid.innerHTML=items.map(function(r){
    var cat=r.category||'News',cc=CAT_COLORS[cat]||{bg:'rgba(79,110,247,.85)',text:'#fff'},icon=NEWS_ICONS[cat]||NEWS_ICONS.Default,link=r.slug?'news-detail.html?slug='+encodeURIComponent(r.slug):'#';
    return '<article class="blog-card"><div class="blog-img">'+(r.image_url?'<img src="'+e(r.image_url)+'" alt="'+e(r.title)+'" loading="lazy"/>':'<div class="blog-icon">'+icon+'</div>')+'<span class="blog-cat-badge" style="background:'+cc.bg+';color:'+cc.text+'">'+e(cat)+'</span></div><div class="blog-body"><div class="blog-meta">'+e(r.date||'')+(r.author?' · '+e(r.author):'')+'</div><div class="blog-title"><a href="'+link+'">'+e(r.title)+'</a></div><div class="blog-exc">'+e(r.excerpt||'')+'</div><a href="'+link+'" class="read-more">Read more →</a></div></article>';
  }).join('');
}

function renderFeaturedArticle(article,boxId){
  var box=document.getElementById(boxId||'featuredBox');if(!box||!article)return;
  var cat=article.category||'News',cc=CAT_COLORS[cat]||{bg:'rgba(79,110,247,.85)',text:'#fff'},icon=NEWS_ICONS[cat]||NEWS_ICONS.Default,link=article.slug?'news-detail.html?slug='+encodeURIComponent(article.slug):'#';
  box.innerHTML='<div class="featured"><div class="featured-img">'+(article.image_url?'<img src="'+e(article.image_url)+'" alt="'+e(article.title)+'" loading="lazy"/>':'<div style="font-size:60px">'+icon+'</div>')+'<span class="blog-cat-badge" style="background:'+cc.bg+';color:'+cc.text+'">'+e(cat)+'</span></div><div class="featured-body"><span class="feat-cat" style="background:rgba(79,110,247,.12);color:var(--accent)">Featured</span><h2><a href="'+link+'">'+e(article.title)+'</a></h2><p>'+e(article.excerpt||'')+'</p><div style="font-size:11px;color:var(--text3)">'+e(article.date||'')+(article.author?' · '+e(article.author):'')+'</div><a href="'+link+'" class="read-more">Read Full Article →</a></div></div>';
}
