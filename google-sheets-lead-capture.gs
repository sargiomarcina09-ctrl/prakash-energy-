const SHEET_NAME = "Leads";

function doPost(e) {
  const sheet = getLeadSheet_();
  const data = e.parameter || {};

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

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
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
