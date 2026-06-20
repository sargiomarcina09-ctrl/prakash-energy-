const SHEET_NAME = "Leads";
const ADMIN_PASSWORD_HASH_PROPERTY = "ADMIN_PASSWORD_HASH";
const ADMIN_PASSWORD = "prakash369energy";

function doPost(e) {
  const data = e.parameter || {};
  const action = data.action || "saveLead";

  if (action === "saveLead") {
    return saveLead_(data);
  }

  return json_({ ok: false, message: "Unsupported action." });
}

function doGet(e) {
  const data = e.parameter || {};
  const action = data.action || "";

  if (action === "listLeads") {
    const response = listLeads_(data.passwordHash || "");
    return jsonp_(response, data.callback);
  }

  return jsonp_({ ok: false, message: "Unsupported action." }, data.callback);
}

function saveLead_(data) {
  const sheet = getLeadSheet_();

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.source || "Prakash Energy website",
    data.name || "",
    data.phone || "",
    data.address || "",
    data.bill || "",
    data.message || "",
    data.estimatedSolarSize || "",
    data.estimatedAnnualSavings || "",
    data.estimatedPayback || "",
    data.estimatedLifetimeSavings || "",
    data.page || "",
  ]);

  return json_({ ok: true });
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
      name: row[2] || "",
      phone: row[3] || "",
      message: row[6] || "",
    })),
  };
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
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Source",
      "Name",
      "Phone",
      "Address",
      "Monthly Bill",
      "Message",
      "Estimated Solar Size",
      "Estimated Annual Savings",
      "Estimated Payback",
      "Estimated Lifetime Savings",
      "Page",
    ]);
  }

  return sheet;
}

function normalizeDate_(value) {
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return value.toISOString();
  }

  return value || "";
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonp_(payload, callback) {
  const safeCallback = /^[a-zA-Z_$][\w$]*$/.test(callback || "") ? callback : "callback";

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
