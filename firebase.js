/* ═══════════════════════════════════════════════════════════════
   iporesult.in — firebase.js
   Engagement & Retention Features powered by Firebase
   ─────────────────────────────────────────────────────────────
   Features:
   1. Email Alerts — subscribe to IPO notifications
   2. Personal Watchlist — save IPOs to follow
   3. Newsletter — weekly IPO digest signup
   4. IPO Calculator — lot size & investment calculator
   5. User Feedback — report error / ask question

   HOW TO SET UP FIREBASE:
   1. Go to https://console.firebase.google.com
   2. Create a project: "iporesult"
   3. Add a Web App → copy your firebaseConfig below
   4. Enable Firestore Database (production mode)
   5. Enable Authentication → Anonymous (for watchlist)
   6. Deploy Firestore Security Rules (see bottom of file)
   ═══════════════════════════════════════════════════════════════ */

// ─── ★ PASTE YOUR FIREBASE CONFIG HERE ───────────────────────
var FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ─── FIREBASE SDK (loaded from CDN) ──────────────────────────
var _fbApp = null, _fbDB = null, _fbAuth = null, _fbUser = null;
var _fbReady = false;
var _fbCallbacks = [];

function onFirebaseReady(cb) {
  if (_fbReady) { cb(); return; }
  _fbCallbacks.push(cb);
}

function _initFirebase() {
  if (FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
    console.warn('[Firebase] Not configured. Add your firebaseConfig to firebase.js');
    return;
  }

  // Dynamically load Firebase SDKs
  var sdks = [
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js',
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth-compat.js',
  ];

  var loaded = 0;
  sdks.forEach(function(src) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = function() {
      loaded++;
      if (loaded === sdks.length) _startFirebase();
    };
    document.head.appendChild(s);
  });
}

function _startFirebase() {
  try {
    _fbApp  = firebase.initializeApp(FIREBASE_CONFIG);
    _fbDB   = firebase.firestore();
    _fbAuth = firebase.auth();

    // Sign in anonymously so watchlist works without login
    _fbAuth.signInAnonymously().then(function(cred) {
      _fbUser = cred.user;
      _fbReady = true;
      _fbCallbacks.forEach(function(cb){ cb(); });
      _fbCallbacks = [];
      _loadWatchlistState();
    }).catch(function(err) {
      console.warn('[Firebase] Auth error:', err.message);
      _fbReady = true;
      _fbCallbacks.forEach(function(cb){ cb(); });
    });
  } catch(err) {
    console.warn('[Firebase] Init error:', err.message);
  }
}

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', _initFirebase);


// ═══════════════════════════════════════════════════════════════
//  1. EMAIL ALERTS — subscribe to IPO allotment/listing alerts
// ═══════════════════════════════════════════════════════════════

/**
 * Subscribe user to alerts for a specific IPO
 * Usage: subscribeAlert('Swiggy IPO', 'user@email.com', 'allotment')
 * alertType: 'allotment' | 'listing' | 'subscription' | 'all'
 */
function subscribeAlert(ipoName, email, alertType) {
  if (!email || email.indexOf('@') === -1) {
    showToast('❌ Please enter a valid email address.');
    return Promise.reject('Invalid email');
  }

  alertType = alertType || 'allotment';

  // Save to Firestore
  if (_fbDB) {
    return _fbDB.collection('alerts').add({
      ipo:       ipoName,
      email:     email.toLowerCase().trim(),
      alertType: alertType,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid:       _fbUser ? _fbUser.uid : 'anonymous',
      status:    'active'
    }).then(function() {
      showToast('✅ Alert set! You\'ll be notified about ' + ipoName);
      _trackEvent('alert_subscribed', { ipo: ipoName, type: alertType });
    }).catch(function(err) {
      console.warn('[Firebase] Alert save error:', err);
      showToast('⚠️ Could not save alert. Please try again.');
    });
  }

  // Fallback: use GAS email alert
  return gasPost({ action: 'subscribe', email: email, ipo: ipoName, alertType: alertType })
    .then(function(res) {
      if (res && res.success) showToast('✅ Alert set for ' + ipoName + '!');
    });
}

/**
 * Show the alert subscription modal/form for a given IPO
 * Usage: showAlertModal('Swiggy IPO')
 */
function showAlertModal(ipoName) {
  // Remove existing modal
  var existing = document.getElementById('alertModal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'alertModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:600;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)';
  modal.innerHTML =
    '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;padding:28px;max-width:380px;width:90%;position:relative">'
    + '<button onclick="document.getElementById(\'alertModal\').remove()" style="position:absolute;top:14px;right:14px;background:var(--card2);border:none;color:var(--text2);width:28px;height:28px;border-radius:7px;cursor:pointer;font-size:15px">✕</button>'
    + '<div style="font-size:22px;margin-bottom:12px">🔔</div>'
    + '<h3 style="font-family:Syne,sans-serif;font-size:17px;font-weight:700;margin-bottom:6px">Get IPO Alerts</h3>'
    + '<p style="font-size:13px;color:var(--text2);margin-bottom:18px">Get notified when <strong>' + ipoName + '</strong> allotment results are announced.</p>'
    + '<input id="alertEmail" type="email" placeholder="Enter your email" style="width:100%;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:11px 14px;border-radius:9px;font-size:14px;outline:none;font-family:DM Sans,sans-serif;margin-bottom:10px"/>'
    + '<select id="alertType" style="width:100%;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:11px 14px;border-radius:9px;font-size:14px;outline:none;font-family:DM Sans,sans-serif;margin-bottom:14px;-webkit-appearance:none">'
    + '<option value="allotment">Allotment Result</option>'
    + '<option value="listing">Listing Day</option>'
    + '<option value="all">All Updates</option>'
    + '</select>'
    + '<button onclick="_doAlertSubscribe(\'' + ipoName + '\')" style="width:100%;padding:12px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;color:#fff;font-size:14px;font-weight:600;border-radius:9px;cursor:pointer;font-family:DM Sans,sans-serif">Set Alert →</button>'
    + '<p style="font-size:11px;color:var(--text3);margin-top:10px;text-align:center">No spam. Unsubscribe anytime.</p>'
    + '</div>';

  document.body.appendChild(modal);
  modal.addEventListener('click', function(ev){ if(ev.target===modal) modal.remove(); });
  setTimeout(function(){ document.getElementById('alertEmail') && document.getElementById('alertEmail').focus(); }, 100);
}

function _doAlertSubscribe(ipoName) {
  var email = document.getElementById('alertEmail').value;
  var type  = document.getElementById('alertType').value;
  subscribeAlert(ipoName, email, type).then(function(){
    var m = document.getElementById('alertModal');
    if (m) m.remove();
  });
}


// ═══════════════════════════════════════════════════════════════
//  2. WATCHLIST — save IPOs to follow (stored per browser session)
// ═══════════════════════════════════════════════════════════════

var _watchlist = JSON.parse(localStorage.getItem('ipo_watchlist') || '[]');

function isWatchlisted(ipoName) {
  return _watchlist.indexOf(ipoName) !== -1;
}

function toggleWatchlist(ipoName, btnEl) {
  var idx = _watchlist.indexOf(ipoName);
  if (idx === -1) {
    _watchlist.push(ipoName);
    showToast('❤️ Added "' + ipoName + '" to your watchlist');
    if (btnEl) { btnEl.textContent = '❤️ Watching'; btnEl.classList.add('active'); }
    _saveWatchlistToFirebase(ipoName, true);
  } else {
    _watchlist.splice(idx, 1);
    showToast('🗑️ Removed from watchlist');
    if (btnEl) { btnEl.textContent = '🤍 Watch'; btnEl.classList.remove('active'); }
    _saveWatchlistToFirebase(ipoName, false);
  }
  localStorage.setItem('ipo_watchlist', JSON.stringify(_watchlist));
  _updateWatchlistButtons();
}

function _saveWatchlistToFirebase(ipoName, added) {
  if (!_fbDB || !_fbUser) return;
  var ref = _fbDB.collection('watchlists').doc(_fbUser.uid);
  if (added) {
    ref.set({ items: firebase.firestore.FieldValue.arrayUnion(ipoName) }, { merge: true });
  } else {
    ref.set({ items: firebase.firestore.FieldValue.arrayRemove(ipoName) }, { merge: true });
  }
}

function _loadWatchlistState() {
  if (!_fbDB || !_fbUser) return;
  _fbDB.collection('watchlists').doc(_fbUser.uid).get().then(function(doc) {
    if (doc.exists && doc.data().items) {
      _watchlist = doc.data().items;
      localStorage.setItem('ipo_watchlist', JSON.stringify(_watchlist));
      _updateWatchlistButtons();
    }
  });
}

function _updateWatchlistButtons() {
  document.querySelectorAll('[data-watchlist]').forEach(function(btn) {
    var name = btn.getAttribute('data-watchlist');
    var w = isWatchlisted(name);
    btn.textContent = w ? '❤️ Watching' : '🤍 Watch';
    btn.classList.toggle('active', w);
  });
}

/**
 * Create a watchlist button for any IPO
 * Usage: createWatchBtn('Swiggy IPO')
 * Returns: HTMLButtonElement
 */
function createWatchBtn(ipoName) {
  var btn = document.createElement('button');
  btn.className = 'watchlist-btn';
  btn.setAttribute('data-watchlist', ipoName);
  btn.textContent = isWatchlisted(ipoName) ? '❤️ Watching' : '🤍 Watch';
  if (isWatchlisted(ipoName)) btn.classList.add('active');
  btn.onclick = function() { toggleWatchlist(ipoName, btn); };
  return btn;
}


// ═══════════════════════════════════════════════════════════════
//  3. NEWSLETTER — weekly IPO digest subscription
// ═══════════════════════════════════════════════════════════════

/**
 * Subscribe to newsletter
 * Usage: subscribeNewsletter('user@email.com')
 */
function subscribeNewsletter(email) {
  if (!email || email.indexOf('@') === -1) {
    showToast('❌ Please enter a valid email address.');
    return;
  }

  var key = 'nl_subscribed';
  if (localStorage.getItem(key)) {
    showToast('✅ You\'re already subscribed!');
    return;
  }

  var save = _fbDB
    ? _fbDB.collection('newsletter').add({ email: email.toLowerCase().trim(), createdAt: firebase.firestore.FieldValue.serverTimestamp() })
    : gasPost({ action: 'newsletter', email: email });

  save.then(function() {
    localStorage.setItem(key, '1');
    showToast('🎉 Subscribed! Weekly IPO digest coming to your inbox.');
    _trackEvent('newsletter_signup', { email: email });
  }).catch(function(err) {
    console.warn('[Firebase] Newsletter error:', err);
    showToast('⚠️ Could not subscribe. Try again.');
  });
}

/**
 * Render newsletter section into a container
 * Usage: renderNewsletter('newsletterContainer')
 */
function renderNewsletter(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML =
    '<div class="newsletter-box">'
    + '<h3>📬 Weekly IPO Digest</h3>'
    + '<p>Get a weekly summary of upcoming IPOs, allotment results, GMP updates and market analysis — directly in your inbox.</p>'
    + '<div class="nl-form">'
    + '<input type="email" id="nlEmail" placeholder="Enter your email address"/>'
    + '<button onclick="subscribeNewsletter(document.getElementById(\'nlEmail\').value)">Subscribe Free →</button>'
    + '</div>'
    + '<p style="font-size:11px;color:var(--text3);margin-top:10px">No spam. Unsubscribe anytime. Every Sunday.</p>'
    + '</div>';
}


// ═══════════════════════════════════════════════════════════════
//  4. IPO CALCULATOR
// ═══════════════════════════════════════════════════════════════

/**
 * Render the IPO investment calculator into a container
 * Usage: renderCalculator('calcContainer', { priceBand: '100-110', lotSize: 15 })
 */
function renderCalculator(containerId, ipoData) {
  var el = document.getElementById(containerId);
  if (!el) return;

  var price = ipoData ? (ipoData.price_band || '') : '';
  var lot   = ipoData ? (ipoData.lot_size || '') : '';
  var upper = parseFloat((price + '').split(/[-–]/).pop().replace(/[^\d.]/g,'')) || 0;

  el.innerHTML =
    '<div class="calc-box">'
    + '<h4>🧮 IPO Investment Calculator</h4>'
    + '<div class="form-row" style="grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'
    + '<div class="fg"><label>Price (Upper Band ₹)</label><input type="number" id="cPrice" value="' + (upper||'') + '" placeholder="e.g. 110" oninput="calcIPO()"/></div>'
    + '<div class="fg"><label>Lot Size (Shares)</label><input type="number" id="cLot" value="' + (lot||'') + '" placeholder="e.g. 15" oninput="calcIPO()"/></div>'
    + '</div>'
    + '<div class="form-row" style="grid-template-columns:1fr 1fr;gap:10px;margin-bottom:0">'
    + '<div class="fg"><label>No. of Lots (Retail max: 13)</label><input type="number" id="cLots" value="1" min="1" max="13" oninput="calcIPO()"/></div>'
    + '<div class="fg"><label>Expected GMP (₹)</label><input type="number" id="cGMP" placeholder="e.g. 20" oninput="calcIPO()"/></div>'
    + '</div>'
    + '<div class="calc-result" id="calcResult">Enter details above to calculate investment.</div>'
    + '</div>';

  if (upper && lot) calcIPO();
}

function calcIPO() {
  var price    = parseFloat(document.getElementById('cPrice').value)  || 0;
  var lot      = parseInt(document.getElementById('cLot').value)       || 0;
  var lots     = parseInt(document.getElementById('cLots').value)      || 1;
  var gmp      = parseFloat(document.getElementById('cGMP').value)     || 0;
  var res      = document.getElementById('calcResult');
  if (!res) return;

  if (!price || !lot) { res.textContent = 'Enter price and lot size to calculate.'; return; }

  var investment   = price * lot * lots;
  var shares       = lot * lots;
  var estListing   = price + gmp;
  var estReturn    = gmp * shares;
  var estReturnPct = price > 0 ? ((gmp / price) * 100).toFixed(2) : 0;

  res.innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + '<div><div style="font-size:11px;color:var(--text3);margin-bottom:2px">Total Investment</div><strong style="color:var(--accent)">₹' + investment.toLocaleString('en-IN') + '</strong></div>'
    + '<div><div style="font-size:11px;color:var(--text3);margin-bottom:2px">Total Shares</div><strong>' + shares + ' shares</strong></div>'
    + (gmp ? '<div><div style="font-size:11px;color:var(--text3);margin-bottom:2px">Est. Listing Price</div><strong>₹' + estListing + '</strong></div>'
           + '<div><div style="font-size:11px;color:var(--text3);margin-bottom:2px">Est. Listing Gain</div><strong style="color:' + (gmp>=0?'var(--green)':'var(--red)') + '">'+(gmp>=0?'+':'')+'₹' + estReturn.toLocaleString('en-IN') + ' ('+estReturnPct+'%)</strong></div>'
           : '')
    + '</div>'
    + '<div style="margin-top:10px;font-size:11px;color:var(--text3)">If you get allotment of 1 lot. GMP-based returns are estimates only.</div>';
}


// ═══════════════════════════════════════════════════════════════
//  5. USER FEEDBACK — report error / ask question
// ═══════════════════════════════════════════════════════════════

function showFeedbackForm(ipoName) {
  var existing = document.getElementById('feedbackModal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'feedbackModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:600;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)';
  modal.innerHTML =
    '<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;padding:28px;max-width:400px;width:90%;position:relative">'
    + '<button onclick="document.getElementById(\'feedbackModal\').remove()" style="position:absolute;top:14px;right:14px;background:var(--card2);border:none;color:var(--text2);width:28px;height:28px;border-radius:7px;cursor:pointer;font-size:15px">✕</button>'
    + '<h3 style="font-family:Syne,sans-serif;font-size:17px;font-weight:700;margin-bottom:6px">💬 Report / Ask</h3>'
    + '<p style="font-size:13px;color:var(--text2);margin-bottom:16px">' + (ipoName ? 'Regarding: <strong>' + ipoName + '</strong>' : 'General feedback') + '</p>'
    + '<select id="fbType" style="width:100%;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:11px 14px;border-radius:9px;font-size:13px;outline:none;font-family:DM Sans,sans-serif;margin-bottom:10px;-webkit-appearance:none">'
    + '<option value="error">🔴 Report an Error</option>'
    + '<option value="question">❓ Ask a Question</option>'
    + '<option value="suggestion">💡 Suggestion</option>'
    + '</select>'
    + '<textarea id="fbMsg" placeholder="Describe the issue or question…" style="width:100%;height:90px;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:11px 14px;border-radius:9px;font-size:13px;outline:none;font-family:DM Sans,sans-serif;resize:none;margin-bottom:10px"></textarea>'
    + '<input id="fbEmail" type="email" placeholder="Your email (optional, for reply)" style="width:100%;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:11px 14px;border-radius:9px;font-size:13px;outline:none;font-family:DM Sans,sans-serif;margin-bottom:14px"/>'
    + '<button onclick="_submitFeedback(\'' + (ipoName||'') + '\')" style="width:100%;padding:12px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;color:#fff;font-size:14px;font-weight:600;border-radius:9px;cursor:pointer;font-family:DM Sans,sans-serif">Submit Feedback →</button>'
    + '</div>';

  document.body.appendChild(modal);
  modal.addEventListener('click', function(ev){ if(ev.target===modal) modal.remove(); });
}

function _submitFeedback(ipoName) {
  var type  = document.getElementById('fbType').value;
  var msg   = document.getElementById('fbMsg').value.trim();
  var email = document.getElementById('fbEmail').value.trim();

  if (!msg) { showToast('⚠️ Please enter your feedback.'); return; }

  var data = {
    type:      type,
    message:   msg,
    email:     email || 'anonymous',
    ipo:       ipoName || 'general',
    page:      window.location.href,
    createdAt: _fbDB ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
  };

  var save = _fbDB
    ? _fbDB.collection('feedback').add(data)
    : Promise.resolve();

  save.then(function() {
    showToast('✅ Feedback submitted! Thank you.');
    var m = document.getElementById('feedbackModal');
    if (m) m.remove();
    _trackEvent('feedback_submitted', { type: type });
  }).catch(function() {
    showToast('⚠️ Could not submit. Please try again.');
  });
}


// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

// Toast notification (bottom of screen)
var _toastTimer = null;
function showToast(msg) {
  var toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--card);border:1px solid var(--border);border-radius:12px;padding:13px 20px;font-size:13px;color:var(--text);box-shadow:0 8px 32px rgba(0,0,0,.3);z-index:700;white-space:nowrap;max-width:90vw;text-align:center;transition:opacity .3s';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.display = 'block';
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function(){ toast.style.opacity='0'; setTimeout(function(){toast.style.display='none';},300); }, 3500);
}

// Analytics event tracking (stub — connect to your analytics)
function _trackEvent(event, data) {
  // Connect to Google Analytics, Mixpanel, etc.
  if (window.gtag) window.gtag('event', event, data);
  console.log('[Track]', event, data);
}


/* ═══════════════════════════════════════════════════════════════
   FIRESTORE SECURITY RULES
   Paste these in Firebase Console → Firestore → Rules
   ═══════════════════════════════════════════════════════════════

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Alerts: anyone can create, only auth can read their own
    match /alerts/{doc} {
      allow create: if request.resource.data.email is string;
      allow read: if false;
    }

    // Watchlists: each user can only read/write their own
    match /watchlists/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // Newsletter: anyone can create
    match /newsletter/{doc} {
      allow create: if request.resource.data.email is string;
      allow read: if false;
    }

    // Feedback: anyone can create
    match /feedback/{doc} {
      allow create: if request.resource.data.message is string;
      allow read: if false;
    }
  }
}

═══════════════════════════════════════════════════════════════ */
