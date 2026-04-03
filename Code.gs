// ═══════════════════════════════════════════════════════════════
//  iporesult.in — Google Apps Script Backend (Code.gs)
//  Deploy as: Web App → Execute as: Me → Access: Anyone
// ═══════════════════════════════════════════════════════════════

// ── CONFIG ──
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Replace with your Sheet ID
const CACHE_TTL = 300; // seconds (5 min)

// ── CORS HEADERS ──
function setCORSHeaders(output) {
  return output
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── MAIN ROUTER ──
function doGet(e) {
  const action = e.parameter.action || 'ping';
  let result;

  try {
    switch (action) {
      case 'ping':         result = { status: 'ok', ts: new Date().toISOString() }; break;
      case 'getOpenIPOs':  result = getOpenIPOs(); break;
      case 'getUpcoming':  result = getUpcomingIPOs(); break;
      case 'getGMP':       result = getGMPData(); break;
      case 'getSubs':      result = getSubscriptionData(); break;
      case 'checkAllot':   result = checkAllotment(e.parameter); break;
      case 'getNews':      result = getNews(); break;
      case 'getStats':     result = getDashboardStats(); break;
      default:             result = { error: 'Unknown action' };
    }
  } catch (err) {
    result = { error: err.message };
  }

  const output = ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);

  return setCORSHeaders(output);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');
  const action = body.action || '';
  let result = { error: 'Unknown POST action' };

  if (action === 'subscribe') {
    result = addEmailAlert(body);
  }

  const output = ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);

  return setCORSHeaders(output);
}

// ═══════════════════════════════════════════════════════════════
//  DATA FUNCTIONS — reads from Google Sheets
// ═══════════════════════════════════════════════════════════════

function getSheet(name) {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(name);
}

function sheetToJSON(sheetName) {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(sheetName);
  if (cached) return JSON.parse(cached);

  const sheet = getSheet(sheetName);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => h.toString().trim().toLowerCase().replace(/ /g, '_'));
  const rows = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });

  cache.put(sheetName, JSON.stringify(rows), CACHE_TTL);
  return rows;
}

// ── OPEN IPOs ──
function getOpenIPOs() {
  return sheetToJSON('OpenIPOs');
  /* Expected sheet columns:
     name | price_band | open_date | close_date | issue_size | lot_size | gmp | subscription | status | registrar | category
  */
}

// ── UPCOMING IPOs ──
function getUpcomingIPOs() {
  return sheetToJSON('UpcomingIPOs');
  /* Expected sheet columns:
     name | price_band | expected_open | issue_size | lot_size | sector | gmp_est | description
  */
}

// ── GMP DATA ──
function getGMPData() {
  return sheetToJSON('GMP');
  /* Expected sheet columns:
     company | ipo_price | gmp | kostak | subject | estimated_listing | last_updated
  */
}

// ── SUBSCRIPTION DATA ──
function getSubscriptionData() {
  return sheetToJSON('Subscription');
  /* Expected sheet columns:
     company | day | qib | nii | rii | employee | total | issue_size
  */
}

// ── NEWS / BLOG ──
function getNews() {
  return sheetToJSON('News');
  /* Expected sheet columns:
     title | slug | category | author | date | excerpt | content | image_url | tags
  */
}

// ── DASHBOARD STATS ──
function getDashboardStats() {
  const open   = getOpenIPOs();
  const upcoming = getUpcomingIPOs();
  // Calculate from listed sheet if available
  return {
    iposThisYear: 312,
    currentlyOpen: open.length,
    upcomingCount: upcoming.length,
    avgListingGain: '24.6%'
  };
}

// ═══════════════════════════════════════════════════════════════
//  ALLOTMENT STATUS CHECKER
//  Scrapes registrar sites (KFin / Link Intime) on server-side
// ═══════════════════════════════════════════════════════════════

function checkAllotment(params) {
  const { ipo, checkType, value } = params;
  if (!ipo || !checkType || !value) {
    return { error: 'Missing parameters' };
  }

  // Map IPO to registrar
  const registrarMap = {
    'Swiggy Limited IPO':        { reg: 'kfintech', code: 'SWIGGY' },
    'NTPC Green Energy IPO':     { reg: 'kfintech', code: 'NTPCGREEN' },
    'Sagility India IPO':        { reg: 'linkintime', code: 'SAGILITY' },
    'Bajaj Housing Finance IPO': { reg: 'kfintech', code: 'BAJAJHF' },
    'Hyundai India IPO':         { reg: 'kfintech', code: 'HYUNDAI' },
  };

  const info = registrarMap[ipo];
  if (!info) return { error: 'IPO not found or allotment not started' };

  // KFin Technologies API (example endpoint)
  if (info.reg === 'kfintech') {
    return fetchKFinAllotment(info.code, checkType, value);
  }

  // Link Intime API (example endpoint)
  if (info.reg === 'linkintime') {
    return fetchLinkIntimeAllotment(info.code, checkType, value);
  }

  return { error: 'Registrar not supported' };
}

function fetchKFinAllotment(code, type, value) {
  // Replace with actual KFin endpoint when available
  const url = `https://ipostatus.kfintech.com/ipostatus/allotment?ipoName=${code}&type=${type}&value=${value}`;
  try {
    const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const text = resp.getContentText();
    // Parse response HTML or JSON as per KFin format
    return { raw: text.substring(0, 500), registrar: 'KFin Technologies' };
  } catch (e) {
    return { error: 'Could not reach KFin: ' + e.message };
  }
}

function fetchLinkIntimeAllotment(code, type, value) {
  const url = `https://linkintime.co.in/MWAL00/client.html`;
  // Link Intime requires POST with form params
  try {
    const resp = UrlFetchApp.fetch(url, {
      method: 'post',
      payload: { scrip: code, type: type, val: value },
      muteHttpExceptions: true
    });
    return { raw: resp.getContentText().substring(0, 500), registrar: 'Link Intime' };
  } catch (e) {
    return { error: 'Could not reach Link Intime: ' + e.message };
  }
}

// ═══════════════════════════════════════════════════════════════
//  EMAIL ALERTS
// ═══════════════════════════════════════════════════════════════

function addEmailAlert(body) {
  const { email, ipo, alertType } = body;
  if (!email || !ipo) return { error: 'Missing email or IPO' };

  const sheet = getSheet('Alerts') || SpreadsheetApp.openById(SHEET_ID).insertSheet('Alerts');
  sheet.appendRow([new Date(), email, ipo, alertType || 'allotment', 'active']);
  return { success: true, message: 'Alert set for ' + ipo };
}

// ═══════════════════════════════════════════════════════════════
//  SCHEDULED TRIGGERS — set via Apps Script editor
// ═══════════════════════════════════════════════════════════════

// Run every 30 mins to refresh GMP from external source
function refreshGMPData() {
  // Fetch from a GMP aggregator or update manually in the sheet
  Logger.log('GMP refresh triggered at ' + new Date());
  // Clear cache so next request gets fresh data
  CacheService.getScriptCache().remove('GMP');
}

// Daily trigger: Send allotment result notifications
function sendAllotmentAlerts() {
  const alerts = sheetToJSON('Alerts');
  const allotted = alerts.filter(a => a.status === 'active');

  allotted.forEach(alert => {
    try {
      MailApp.sendEmail({
        to: alert.email,
        subject: `[iporesult.in] Allotment Update: ${alert.ipo}`,
        body: `Dear Investor,\n\nAllotment results for ${alert.ipo} are now available.\n\nCheck your status at: https://iporesult.in/allotment\n\n– Team iporesult.in`
      });
    } catch (e) {
      Logger.log('Mail error for ' + alert.email + ': ' + e.message);
    }
  });
}

// ═══════════════════════════════════════════════════════════════
//  SETUP HELPER — run once to create all required sheets
// ═══════════════════════════════════════════════════════════════

function setupSheets() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheets = {
    OpenIPOs:     ['name','price_band','open_date','close_date','issue_size','lot_size','gmp','subscription','status','registrar','category'],
    UpcomingIPOs: ['name','price_band','expected_open','issue_size','lot_size','sector','gmp_est','description'],
    GMP:          ['company','ipo_price','gmp','kostak','subject','estimated_listing','last_updated'],
    Subscription: ['company','day','qib','nii','rii','employee','total','issue_size'],
    News:         ['title','slug','category','author','date','excerpt','content','image_url','tags'],
    Alerts:       ['timestamp','email','ipo','alert_type','status'],
  };

  Object.entries(sheets).forEach(([name, headers]) => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setBackground('#1a1a2e').setFontColor('#ffffff').setFontWeight('bold');
      Logger.log('Created sheet: ' + name);
    }
  });

  Logger.log('✅ All sheets ready!');
}
