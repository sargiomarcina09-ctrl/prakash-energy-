# Google Sheets Lead Capture Setup

This website already includes:

- Public lead form integration
- WhatsApp enquiry flow
- Admin dashboard lead viewer
- Google Apps Script backend file

## Files to use

- `google-sheets-lead-capture.gs`
- `config.js`
- `admin.html`

## 1. Create the Google Sheet

1. Open Google Sheets.
2. Create a new spreadsheet.
3. Copy the Sheet ID from the URL.

Example:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

## 2. Update the Sheet ID in Apps Script

Open `google-sheets-lead-capture.gs` and replace:

```js
const SPREADSHEET_ID = "PASTE_SHEET_ID";
```

with your real Sheet ID.

## 3. Create the Apps Script project

1. Open [script.google.com](https://script.google.com).
2. Create a new project.
3. Replace the default code with the full contents of `google-sheets-lead-capture.gs`.

## 4. Prepare the sheet and admin password

In Apps Script, run:

```js
setupLeadSheet()
```

This will:

- create or prepare the `Leads` sheet
- add the headers:
  - `Date`
  - `Name`
  - `Phone`
  - `Email`
  - `Message`
- sync the admin password hash

Current admin password in the local project:

```text
prakash369energy
```

If you want to change it later, update:

```js
const ADMIN_PASSWORD = "prakash369energy";
```

Then run:

```js
syncAdminPassword()
```

## 5. Deploy the Apps Script Web App

1. Click `Deploy`.
2. Click `New deployment`.
3. Choose `Web app`.
4. Set:
   - `Execute as`: `Me`
   - `Who has access`: `Anyone`
5. Deploy.
6. Copy the Web App URL.

## 6. Connect the website frontend

The local project is already updated with your deployed Web App URL in `config.js`:

```js
window.PRAKASH_CONFIG = {
  googleSheetsWebAppUrl: "https://script.google.com/macros/s/AKfycby--2XnY1KpsKUpwmUmzfZupQrIZubl6DGLXMJ37KPGfMbRLvjTgGZfz7BK8TvT-npsuQ/exec",
};
```

If you redeploy Apps Script later, replace this URL with the new one.

## 7. What happens after setup

When a user submits the enquiry form:

1. Lead is saved to Google Sheets
2. WhatsApp opens with the enquiry details
3. Admin dashboard can fetch and search leads

## 8. Request actions used by the website

The website now uses these Apps Script actions:

- `saveLead`
  - sent by the enquiry form
  - method: `POST`
  - transport: hidden background form submission
- `listLeads`
  - sent by the admin dashboard
  - primary method: `GET`
  - browser fallback: `JSONP`

If you update `google-sheets-lead-capture.gs`, deploy a new Web App version before testing again.

## Lead fields stored in Google Sheets

- Date
- Name
- Phone
- Email
- Message

## Admin dashboard

Open:

- `admin.html`

Use the admin password:

```text
prakash369energy
```

The dashboard shows:

- Date
- Name
- Phone
- Email
- Message
