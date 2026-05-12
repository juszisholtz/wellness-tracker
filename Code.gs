// ============================================================
// WELLNESS TRACKER — Google Apps Script Backend
// Deploy as: Execute as "Me" | Access "Anyone"
// ============================================================

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { action, token, data } = body;

    const email = verifyGoogleToken(token);
    if (!email) return respond({ error: 'Unauthorized' });

    const sheet = getSheet();

    if (action === 'getEntries') {
      return respond({ entries: getUserEntries(sheet, email) });
    }
    if (action === 'addEntry') {
      addEntry(sheet, email, data);
      return respond({ success: true });
    }
    return respond({ error: 'Unknown action' });

  } catch (err) {
    return respond({ error: err.toString() });
  }
}

// ── Token Verification ──────────────────────────────────────
function verifyGoogleToken(token) {
  try {
    const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + token;
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const data = JSON.parse(res.getContentText());
    return data.email || null;
  } catch (e) {
    return null;
  }
}

// ── Sheet Setup ─────────────────────────────────────────────
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Entries');
  if (!sheet) {
    sheet = ss.insertSheet('Entries');
    sheet.appendRow(['Timestamp', 'Date', 'Email', 'Energy', 'Mental', 'Relationships', 'Meaning', 'Highlight']);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
  }
  return sheet;
}

// ── Read Entries ────────────────────────────────────────────
function getUserEntries(sheet, email) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const tz = Session.getScriptTimeZone();
  return data.slice(1)
    .filter(row => row[2] === email && row[1] !== '')
    .map(row => ({
      date: Utilities.formatDate(new Date(row[1]), tz, 'yyyy-MM-dd'),
      energy:        parseFloat(row[3]) || 0,
      mental:        parseFloat(row[4]) || 0,
      relationships: parseFloat(row[5]) || 0,
      meaning:       parseFloat(row[6]) || 0,
      highlight:     row[7] || ''
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ── Write Entry ─────────────────────────────────────────────
function addEntry(sheet, email, data) {
  const { date, energy, mental, relationships, meaning, highlight } = data;
  sheet.appendRow([
    new Date(),
    new Date(date + 'T12:00:00'),
    email,
    parseFloat(energy),
    parseFloat(mental),
    parseFloat(relationships),
    parseFloat(meaning),
    highlight || ''
  ]);
}

// ── Helper ──────────────────────────────────────────────────
function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
