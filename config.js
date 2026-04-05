/* ═══════════════════════════════════════════════════════════════
   iporesult.in — config.js  v2.0
   ─────────────────────────────────────────────────────────────
   HOW TO USE IN ANY NEW PAGE:
   <head>:  <link rel="stylesheet" href="style.css"/>
   <body>:  <div id="site-header"></div>
            <main>...</main>
            <div id="site-footer"></div>
            <script src="config.js"></script>
            <script>/* page script */</script>
   ═══════════════════════════════════════════════════════════════ */

// ─── CONFIG ──────────────────────────────────────────────────
var GAS_URL = 'https://script.google.com/macros/s/AKfycbzXmyGZBJwN7ImsBb3NXpso5A33UbPDoubKsxtdlMnpb9QXb0mNGfvVsZEV8VY4DFQT/exec';

var GRADS = [['#4f6ef7','#7c3aed'],['#f59e0b','#ef4444'],['#10b981','#06b6d4'],['#ec4899','#8b5cf6'],['#f97316','#eab308'],['#06b6d4','#3b82f6']];
var NEWS_ICONS = {Analysis:'📈',News:'🏦',Upcoming:'📅',Policy:'⚖️',Market:'📊',Default:'📰'};
var CAT_COLORS = {Analysis:{bg:'rgba(79,110,247,.85)',text:'#fff'},News:{bg:'rgba(16,185,129,.85)',text:'#fff'},Upcoming:{bg:'rgba(245,158,11,.85)',text:'#fff'},Policy:{bg:'rgba(239,68,68,.85)',text:'#fff'},Market:{bg:'rgba(124,58,237,.85)',text:'#fff'}};

// ─── HEADER / FOOTER LOADER ──────────────────────────────────
// IMPORTANT: capture currentScript HERE, outside the IIFE,
// because inside a function it becomes null after execution.
var _configScriptSrc = (document.currentScript && document.currentScript.src)
  ? document.currentScript.src
  : (function(){
      var tags = document.getElementsByTagName('script');
      for (var i = 0; i < tags.length; i++) {
        if ((tags[i].src||'').indexOf('config.js') !== -1) return tags[i].src;
      }
      return '';
    })();

// basePath = folder containing config.js
// e.g. "https://user.github.io/iporesult/" or "https://iporesult.in/" or "http://localhost/mysite/"
var _basePath = _configScriptSrc
  ? _configScriptSrc.substring(0, _configScriptSrc.lastIndexOf('/') + 1)
  : window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);

(function loadShell() {

  // ── Inject header/footer HTML into a target element ───────
  function inject(filename, targetId, cb) {
    var url = _basePath + filename;
    var el  = document.getElementById(targetId);
    if (!el) { if (typeof cb === 'function') cb(); return; }

    // Use XHR — works on http/https (Hostinger, GitHub Pages, any server)
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        el.innerHTML = xhr.responseText;
      } else {
        // Show a visible error inside the placeholder so you know what failed
        el.innerHTML = '<div style="background:#ef444420;color:#ef4444;padding:12px;font-size:12px;font-family:monospace">'
          + '⚠️ Could not load ' + filename + ' (status ' + xhr.status + ')<br>'
          + 'URL tried: ' + url + '</div>';
        console.error('[Shell] Failed to load', url, 'status:', xhr.status);
      }
      if (typeof cb === 'function') cb();
    };
    xhr.onerror = function() {
      // Network error (e.g. file:// protocol, CORS)
      // Fallback: try fetch() which may work in some file:// setups
      if (typeof fetch !== 'undefined') {
        fetch(url)
          .then(function(r) { return r.text(); })
          .then(function(html) { el.innerHTML = html; if (typeof cb === 'function') cb(); })
          .catch(function() {
            el.innerHTML = '<div style="background:#ef444420;color:#ef4444;padding:12px;font-size:12px">'
              + '⚠️ ' + filename + ' failed to load. Are you opening from a web server? '
              + '(file:// protocol blocks XHR — use Live Server or upload to Hostinger)</div>';
            if (typeof cb === 'function') cb();
          });
      } else {
        if (typeof cb === 'function') cb();
      }
    };
    xhr.send();
  }

  // ── Mark active nav link ───────────────────────────────────
  function markActive() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    if (page === '') page = 'index.html';
    document.querySelectorAll('.nav-links a, .drawer-nav a').forEach(function(a) {
      var href = (a.getAttribute('href') || '').split('/').pop();
      a.classList.toggle('active', href === page);
    });
    document.querySelectorAll('.bn').forEach(function(b) {
      var href = (b.getAttribute('href') || '').split('/').pop();
      b.classList.toggle('active', href === page);
    });
  }

  // ── Inject both files, fire shellReady when both done ─────
  function run() {
    var hDone = false, fDone = false;
    function check() {
      if (!hDone || !fDone) return;
      markActive();
      document.dispatchEvent(new CustomEvent('shellReady'));
    }
    inject('header.html', 'site-header', function() { hDone = true; check(); });
    inject('footer.html', 'site-footer', function() { fDone = true; check(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();

// ─── GAS API ─────────────────────────────────────────────────
function gasGet(action,params){
  var url=GAS_URL+'?action='+action;
  if(params){Object.keys(params).forEach(function(k){url+='&'+encodeURIComponent(k)+'='+encodeURIComponent(params[k]);});}
  return fetch(url).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).catch(function(err){console.warn('[GAS] '+action+' failed:',err.message);return [];});
}
function gasPost(payload){
  return fetch(GAS_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(function(r){return r.json();}).catch(function(err){console.warn('[GAS POST]',err.message);return null;});
}

// ─── UTILITIES ───────────────────────────────────────────────
function e(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function gmpClass(v){return parseFloat(v)>=0?'gp':'gn';}
function gmpSign(v){return parseFloat(v)>=0?'+':'';}
function subPct(v){return Math.min(100,Math.round((parseFloat(v)||0)/5*100));}
function getParam(k){return new URLSearchParams(window.location.search).get(k)||'';}
function setPageTitle(t){document.title=t+' – iporesult.in';}

function showMsg(id,type,html){
  var box=document.getElementById(id);if(!box)return;
  var p={success:{bg:'rgba(16,185,129,.1)',bd:'rgba(16,185,129,.3)',c:'var(--text)'},error:{bg:'rgba(239,68,68,.1)',bd:'rgba(239,68,68,.3)',c:'var(--red)'},warn:{bg:'rgba(245,158,11,.1)',bd:'rgba(245,158,11,.3)',c:'var(--orange)'},info:{bg:'rgba(79,110,247,.08)',bd:'rgba(79,110,247,.3)',c:'var(--text)'},loading:{bg:'rgba(79,110,247,.08)',bd:'rgba(79,110,247,.3)',c:'var(--accent)'}};
  var s=p[type]||p.info;
  box.style.cssText='display:block;padding:14px 18px;border-radius:10px;font-size:13px;line-height:1.7;background:'+s.bg+';border:1px solid '+s.bd+';color:'+s.c+';margin-top:14px';
  box.innerHTML=type==='loading'?'<span class="spinner"></span> '+html:html;
}

function buildBreadcrumb(items,cid){
  var el=document.getElementById(cid||'breadcrumb');if(!el)return;
  el.innerHTML=items.map(function(item,i){
    if(i===items.length-1)return '<span style="color:var(--text2)">'+e(item.label)+'</span>';
    return '<a href="'+e(item.href||'#')+'">'+e(item.label)+'</a><span style="margin:0 6px;color:var(--text3)">›</span>';
  }).join('');
}

// ─── DRAWER ──────────────────────────────────────────────────
function openDrawer(){
  var d=document.getElementById('drawer'),o=document.getElementById('overlay'),b=document.getElementById('hamburgerBtn');
  if(d)d.classList.add('open');if(o)o.classList.add('open');if(b)b.setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden';
}
function closeDrawer(){
  var d=document.getElementById('drawer'),o=document.getElementById('overlay'),b=document.getElementById('hamburgerBtn');
  if(d)d.classList.remove('open');if(o)o.classList.remove('open');if(b)b.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}

// ─── ALLOTMENT FORM ──────────────────────────────────────────
function toggleAllotField(val){
  var labels={pan:'PAN Number',app:'Application Number',dp:'DP / Client ID'};
  var phs={pan:'Enter PAN (e.g. ABCDE1234F)',app:'Enter Application Number',dp:'Enter DP ID / Client ID'};
  var lbl=document.getElementById('fieldLabel'),inp=document.getElementById('fieldVal');
  if(lbl)lbl.textContent=labels[val]||'PAN Number';
  if(inp){inp.placeholder=phs[val]||'';inp.maxLength=val==='pan'?10:20;}
}

// ─── ALERT ───────────────────────────────────────────────────
function alertFor(name){
  var email=prompt('Enter email for allotment alert:\n"'+name+'"');
  if(!email)return;
  if(email.indexOf('@')===-1){alert('Please enter a valid email.');return;}
  gasPost({action:'subscribe',email:email,ipo:name,alertType:'allotment'}).then(function(res){
    if(res&&res.success)alert('✅ Alert set! You\'ll be emailed when allotment results for "'+name+'" are out.');
    else alert('⚠️ Could not set alert. Please try again.');
  });
}

// ─── RENDER: OPEN IPOs TABLE ─────────────────────────────────
function renderOpenTable(rows,tbodyId){
  var tbody=document.getElementById(tbodyId||'openBody');if(!tbody)return;
  if(!rows||!rows.length){tbody.innerHTML='<tr><td colspan="7" class="no-data">No open IPOs. Add rows to <b>OpenIPOs</b> sheet tab.</td></tr>';return;}
  var sel=document.getElementById('allotIPO');
  if(sel){sel.innerHTML='<option value="">— Select IPO —</option>'+rows.map(function(r){return '<option value="'+e(r.name)+'">'+e(r.name)+'</option>';}).join('');}
  var sm={open:'b-open',upcoming:'b-upcoming',closed:'b-closed',listed:'b-listed'};
  tbody.innerHTML=rows.map(function(r){
    var gmp=parseFloat(r.gmp)||0,sub=parseFloat(r.subscription)||0,st=(r.status||'open').toLowerCase();
    return '<tr>'
      +'<td class="tbl-name"><a href="ipo-detail.html?name='+encodeURIComponent(r.name)+'">'+e(r.name)+'</a></td>'
      +'<td>'+e(r.price_band||'—')+'</td><td>'+e(r.open_date||'—')+'</td><td>'+e(r.close_date||'—')+'</td>'
      +'<td class="'+gmpClass(gmp)+'">'+(gmp?gmpSign(gmp)+'₹'+gmp:'—')+'</td>'
      +'<td><div class="sub-bar-row"><span>'+(sub>0?sub.toFixed(2)+'x':'—')+'</span>'+(sub>0?'<div class="sub-bar"><div class="sub-fill" style="width:'+subPct(sub)+'%;background:var(--accent)"></div></div>':'')+'</div></td>'
      +'<td><span class="badge '+(sm[st]||'b-open')+'">'+e((r.status||'OPEN').toUpperCase())+'</span></td>'
      +'</tr>';
  }).join('');
}

// ─── RENDER: UPCOMING CARDS ──────────────────────────────────
function renderUpcomingCards(rows,gridId){
  var grid=document.getElementById(gridId||'upcomingGrid');if(!grid)return;
  if(!rows||!rows.length){grid.innerHTML='<p style="color:var(--text3);padding:12px;grid-column:1/-1">No upcoming IPOs. Add rows to <b>UpcomingIPOs</b> sheet tab.</p>';return;}
  grid.innerHTML=rows.map(function(r,i){
    var grad=GRADS[i%GRADS.length];
    var init=(r.name||'').split(' ').slice(0,2).map(function(w){return w[0]||'';}).join('').toUpperCase();
    var gmp=parseFloat(r.gmp_est)||0;
    var gmpH=gmp?'<span class="'+gmpClass(gmp)+'" style="font-size:12px">GMP '+gmpSign(gmp)+'₹'+gmp+' est.</span>':'<span style="font-size:12px;color:var(--text3)">GMP: TBA</span>';
    var url='ipo-detail.html?name='+encodeURIComponent(r.name)+'&type=upcoming';
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

// ─── RENDER: GMP GRID ────────────────────────────────────────
function renderGMPGrid(rows,gridId){
  var grid=document.getElementById(gridId||'gmpGrid');if(!grid)return;
  if(!rows||!rows.length){grid.innerHTML='<p style="color:var(--text3);padding:12px">No GMP data. Add rows to <b>GMP</b> sheet tab.</p>';return;}
  grid.innerHTML=rows.map(function(r){
    var gmp=parseFloat(r.gmp)||0,est=parseFloat(r.estimated_listing)||0,ip=parseFloat((r.ipo_price||'').toString().replace(/[^\d.]/g,''))||0;
    var pct=ip>0?((gmp/ip)*100).toFixed(1):null;
    return '<div class="gmp-card"><div class="gmp-co">'+e(r.company)+'</div><div class="gmp-val '+gmpClass(gmp)+'">'+gmpSign(gmp)+'₹'+gmp+'</div><div class="gmp-kostak">Kostak: ₹'+e(r.kostak||'—')+'</div>'+(est?'<div class="gmp-est" style="color:'+(gmp>=0?'var(--green)':'var(--red)')+'">Est. ₹'+est+(pct?' ('+gmpSign(gmp)+pct+'%)':'')+'</div>':'')+'</div>';
  }).join('');
}

// ─── RENDER: TICKER ──────────────────────────────────────────
function renderTicker(rows,tickerId){
  var ticker=document.getElementById(tickerId||'ticker');if(!ticker||!rows||!rows.length)return;
  var items=rows.concat(rows);
  ticker.innerHTML=items.map(function(r){var v=parseFloat(r.gmp)||0;return '<span class="t-item"><span class="t-name">'+e(r.company)+'</span><span class="t-gmp '+gmpClass(v)+'">GMP '+gmpSign(v)+'₹'+v+'</span></span>';}).join('');
}

// ─── RENDER: SUBSCRIPTION TABLE ──────────────────────────────
function renderSubTable(rows,tbodyId){
  var tbody=document.getElementById(tbodyId||'subBody');if(!tbody)return;
  if(!rows||!rows.length){tbody.innerHTML='<tr><td colspan="8" class="no-data">No subscription data. Add rows to <b>Subscription</b> sheet tab.</td></tr>';return;}
  function subCell(v,color){var val=parseFloat(v)||0;return '<td>'+(val?'<div class="sub-bar-row"><span class="'+(val>=1?'up':'')+'">'+val.toFixed(2)+'x</span><div class="sub-bar"><div class="sub-fill" style="width:'+subPct(val)+'%;background:'+color+'"></div></div></div>':'—')+'</td>';}
  tbody.innerHTML=rows.map(function(r,i){var tot=parseFloat(r.total)||0;return '<tr><td style="color:var(--text3)">'+(i+1)+'</td><td class="tbl-name"><a href="ipo-detail.html?name='+encodeURIComponent(r.company)+'">'+e(r.company)+'</a></td>'+subCell(r.qib,'var(--accent)')+subCell(r.nii,'var(--green)')+subCell(r.rii,'var(--orange)')+'<td>'+(r.employee?parseFloat(r.employee).toFixed(2)+'x':'—')+'</td><td class="'+(tot>=1?'up':'')+'" style="font-weight:700">'+(tot>0?tot.toFixed(2)+'x':'—')+'</td><td>'+e(r.issue_size||'—')+'</td></tr>';}).join('');
}

// ─── RENDER: NEWS GRID ───────────────────────────────────────
function renderNewsGrid(rows,gridId,limit){
  var grid=document.getElementById(gridId||'newsGrid');if(!grid)return;
  if(!rows||!rows.length){grid.innerHTML='<p style="color:var(--text3);padding:12px;grid-column:1/-1">No news yet. Add rows to <b>News</b> sheet tab.</p>';return;}
  var items=limit?rows.slice(0,limit):rows;
  grid.innerHTML=items.map(function(r){
    var cat=r.category||'News',cc=CAT_COLORS[cat]||{bg:'rgba(79,110,247,.85)',text:'#fff'},icon=NEWS_ICONS[cat]||NEWS_ICONS.Default;
    var link=r.slug?'news-detail.html?slug='+encodeURIComponent(r.slug):'#';
    return '<article class="blog-card" itemscope itemtype="https://schema.org/Article"><div class="blog-img">'+(r.image_url?'<img src="'+e(r.image_url)+'" alt="'+e(r.title)+'" loading="lazy" itemprop="image"/>':'<div class="blog-icon">'+icon+'</div>')+'<span class="blog-cat-badge" style="background:'+cc.bg+';color:'+cc.text+'">'+e(cat)+'</span></div><div class="blog-body"><div class="blog-meta"><time itemprop="datePublished" datetime="'+e(r.date)+'">'+e(r.date||'')+'</time>'+(r.author?' · '+e(r.author):'')+'</div><div class="blog-title" itemprop="headline"><a href="'+link+'" itemprop="url">'+e(r.title)+'</a></div><div class="blog-exc" itemprop="description">'+e(r.excerpt||'')+'</div><a href="'+link+'" class="read-more">Read more →</a></div></article>';
  }).join('');
}

// ─── RENDER: FEATURED ARTICLE ────────────────────────────────
function renderFeaturedArticle(article,boxId){
  var box=document.getElementById(boxId||'featuredBox');if(!box||!article)return;
  var cat=article.category||'News',cc=CAT_COLORS[cat]||{bg:'rgba(79,110,247,.85)',text:'#fff'},icon=NEWS_ICONS[cat]||NEWS_ICONS.Default;
  var link=article.slug?'news-detail.html?slug='+encodeURIComponent(article.slug):'#';
  box.innerHTML='<div class="featured"><div class="featured-img">'+(article.image_url?'<img src="'+e(article.image_url)+'" alt="'+e(article.title)+'" loading="lazy"/>':'<div style="font-size:60px">'+icon+'</div>')+'<span class="blog-cat-badge" style="background:'+cc.bg+';color:'+cc.text+'">'+e(cat)+'</span></div><div class="featured-body"><span class="feat-cat" style="background:rgba(79,110,247,.12);color:var(--accent)">Featured</span><h2><a href="'+link+'">'+e(article.title)+'</a></h2><p>'+e(article.excerpt||'')+'</p><div style="font-size:11px;color:var(--text3)">'+e(article.date||'')+(article.author?' · '+e(article.author):'')+'</div><a href="'+link+'" class="read-more">Read Full Article →</a></div></div>';
}

// ─── MARKET STRIP UPDATE ─────────────────────────────────────
// Called by each page to update the "IPOs Open" count in the strip.
// Usage: buildMarketStrip('IPOs Open', '3 Active')
function buildMarketStrip(label, value) {
  // Update the dynamic count span in the strip (injected via header.html)
  var el = document.getElementById('stripOpenCount');
  if (el) {
    el.textContent = value || 'Live';
    // Update the label span just before it (its previousElementSibling)
    var prev = el.previousElementSibling;
    if (prev && prev.classList.contains('ms-l')) {
      prev.textContent = label || 'IPOs Open';
    }
  }
}
