const SPREADSHEET_ID = "PASTE_SHEET_ID";
const SHEET_NAME = "Leads";
const LEAD_HEADERS = ["Date", "Name", "Phone", "Email", "Message"];
const ADMIN_PASSWORD_HASH_PROPERTY = "ADMIN_PASSWORD_HASH";
const ADMIN_PASSWORD = "prakash369energy";

function doPost(e) {
  const data = extractRequestData_(e);
  const action = data.action || "saveLead";

  if (action === "saveLead") {
    return respond_(saveLead_(data), data.callback);
  }

  return respond_({ ok: false, message: "Unsupported action." }, data.callback);
}

function doGet(e) {
  const data = extractRequestData_(e);
  const action = data.action || "";

  if (action === "saveLead") {
    return respond_(saveLead_(data), data.callback);
  }

  if (action === "listLeads") {
    return respond_(listLeads_(data.passwordHash || ""), data.callback);
  }

  return respond_({ ok: false, message: "Unsupported action." }, data.callback);
}

function saveLead_(data) {
  const sheet = getLeadSheet_();

  sheet.appendRow([
    parseLeadDate_(data.timestamp),
    data.name || "",
    data.phone || "",
    data.email || "",
    data.message || "",
  ]);

  return { ok: true };
}

function listLeads_(passwordHash) {
  const expectedHash = PropertiesService.getScriptProperties().getProperty(ADMIN_PASSWORD_HASH_PROPERTY);

  if (!expectedHash) {
    return {
      ok: false,
      message: "Admin password is not configured in Apps Script.",
    };
  }

  if (!passwordHash || passwordHash !== expectedHash) {
    return {
      ok: false,
      message: "Incorrect admin password.",
    };
  }

  const sheet = getLeadSheet_();
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1).reverse();

  return {
    ok: true,
    leads: rows.map((row) => ({
      date: normalizeDate_(row[0]),
      name: row[1] || "",
      phone: row[2] || "",
      email: row[3] || "",
      message: row[4] || "",
    })),
  };
}

function setupLeadSheet() {
  getLeadSheet_();
  syncAdminPassword();
  Logger.log("Lead sheet is ready and admin password hash is synced.");
}

function syncAdminPassword() {
  const hash = sha256_(ADMIN_PASSWORD);
  PropertiesService.getScriptProperties().setProperty(ADMIN_PASSWORD_HASH_PROPERTY, hash);
  Logger.log("Admin password hash synced. Run this once after changing ADMIN_PASSWORD, then redeploy.");
}

function setAdminPassword() {
  syncAdminPassword();
}

function getLeadSheet_() {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  ensureHeaders_(sheet);
  return sheet;
}

function getSpreadsheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === "PASTE_SHEET_ID") {
    throw new Error("Replace PASTE_SHEET_ID with your real Google Sheet ID.");
  }

  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(LEAD_HEADERS);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, LEAD_HEADERS.length).getValues()[0];
  const matches = LEAD_HEADERS.every((header, index) => currentHeaders[index] === header);

  if (!matches) {
    sheet.getRange(1, 1, 1, LEAD_HEADERS.length).setValues([LEAD_HEADERS]);
  }
}

function parseLeadDate_(value) {
  const parsed = new Date(value || Date.now());
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function normalizeDate_(value) {
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return value.toISOString();
  }

  return value || "";
}

function extractRequestData_(e) {
  const data = Object.assign({}, (e && e.parameter) || {});
  const contents = e && e.postData && e.postData.contents;

  if (contents) {
    if (/application\/json/i.test((e.postData.type || ""))) {
      try {
        const jsonData = JSON.parse(contents);
        Object.keys(jsonData || {}).forEach((key) => {
          if (!(key in data)) data[key] = jsonData[key];
        });
      } catch (error) {
        // Ignore malformed JSON and fall back to standard parameters.
      }
    } else if (Object.keys(data).length === 0) {
      contents.split("&").forEach((pair) => {
        if (!pair) return;
        const parts = pair.split("=");
        const key = decodeURIComponent((parts.shift() || "").replace(/\+/g, " "));
        if (!key || key in data) return;
        data[key] = decodeURIComponent(parts.join("=").replace(/\+/g, " "));
      });
    }
  }

  return data;
}

function respond_(payload, callback) {
  return callback ? jsonp_(payload, callback) : json_(payload);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonp_(payload, callback) {
  const safeCallback = /^[a-zA-Z_$][\w$]*$/.test(callback || "") ? callback : "";

  if (!safeCallback) {
    return json_(payload);
  }

  return ContentService
    .createTextOutput(`${safeCallback}(${JSON.stringify(payload)});`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function sha256_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value)
    .map((byte) => {
      const unsigned = byte < 0 ? byte + 256 : byte;
      return unsigned.toString(16).padStart(2, "0");
    })
    .join("");
}
