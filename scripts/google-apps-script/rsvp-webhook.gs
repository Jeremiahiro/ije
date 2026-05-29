/**
 * Google Apps Script — append RSVP rows to a Google Sheet.
 *
 * One sheet row per guest (plus ones get their own row so you can count rows = headcount).
 *
 * Setup:
 * 1. Create a Google Sheet (e.g. "Wedding RSVPs").
 * 2. Extensions → Apps Script → paste this file → Save.
 * 3. (Optional) Project settings → Script properties → add RSVP_SECRET (match RSVP_SCRIPT_SECRET in .env).
 * 4. Deploy → New deployment → Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL (ends in /exec) into RSVP_GOOGLE_SCRIPT_URL.
 */

var SHEET_NAME = "RSVPs";

var HEADERS = [
  "Submitted At",
  "Full Name",
  "Guest",
  "Primary Guest",
  "Email",
  "Phone",
  "Country",
  "Other Country",
  "Traditional Wedding",
  "White Wedding",
  "Expected Arrival",
  "Expected Departure",
  "Guest Notes",
  "Relationship",
  "Message to Couple",
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow(HEADERS);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** Prefix with ' so Sheets keeps +country codes as text (avoids formula errors). */
function sheetText_(value) {
  if (value == null || value === "") return "";
  var s = String(value);
  if (s.charAt(0) === "'") return s;
  return "'" + s;
}

function rowFromGuest_(r) {
  return [
    r.submitted_at || "",
    r.full_name || "",
    r.guest_role || "",
    r.primary_guest || "",
    r.email || "",
    sheetText_(r.phone),
    r.country || "",
    r.other_country || "",
    r.event_traditional || "",
    r.event_white || "",
    r.expected_arrival || "",
    r.expected_departure || "",
    r.guest_notes || "",
    r.relationship || "",
    r.message_couple || "",
  ];
}

function doPost(e) {
  try {
    var expectedSecret = PropertiesService.getScriptProperties().getProperty("RSVP_SECRET");
    var payload = JSON.parse(e.postData.contents);

    if (expectedSecret && payload.secret !== expectedSecret) {
      return jsonResponse_({ ok: false, error: "unauthorized" });
    }

    var sheet = getSheet_();
    ensureHeaders_(sheet);

    var rows = payload.rows;
    if (!rows || !rows.length) {
      return jsonResponse_({ ok: false, error: "no rows" });
    }

    for (var i = 0; i < rows.length; i++) {
      sheet.appendRow(rowFromGuest_(rows[i]));
    }

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}
