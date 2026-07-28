/**
 * Google Apps Script — append rows to a Google Sheet.
 *
 * Supports multiple tabs in the same spreadsheet via `payload.sheet`.
 * Defaults to "RSVPs" if not specified (backward compatible).
 *
 * Setup:
 * 1. Create a Google Sheet (e.g. "Wedding RSVPs").
 * 2. Extensions → Apps Script → paste this file → Save.
 * 3. (Optional) Project settings → Script properties → add RSVP_SECRET.
 * 4. Deploy → New deployment → Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL (ends in /exec) into RSVP_GOOGLE_SCRIPT_URL and
 *    WEDDING_TRAIN_GOOGLE_SCRIPT_URL (they are the same URL).
 */

var DEFAULT_SHEET_NAME = "RSVPs";

var RSVP_HEADERS = [
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

var WEDDING_TRAIN_HEADERS = [
  "Submitted At",
  "Full Name",
  "Role",
  "Accommodation",
  "Outfit",
  "Commit: Attend",
  "Commit: Outfit",
  "Commit: Travel",
  "Commit: Contact",
  "Commit: Church",
  "Final Decision",
];

function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function ensureHeaders_(sheet, sheetName) {
  if (sheet.getLastRow() > 0) return;
  var headers = sheetName === "Wedding Train" ? WEDDING_TRAIN_HEADERS : RSVP_HEADERS;
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
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

function rowFromRsvpGuest_(r) {
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

function rowFromWeddingTrainGuest_(r) {
  return [
    r.submitted_at || "",
    r.full_name || "",
    r.role || "",
    r.accommodation || "",
    r.outfit || "",
    r.commit_attend || "",
    r.commit_outfit || "",
    r.commit_travel || "",
    r.commit_contact || "",
    r.commit_church || "",
    r.final_decision || "",
  ];
}

function buildRow_(sheetName, record) {
  if (sheetName === "Wedding Train") {
    return rowFromWeddingTrainGuest_(record);
  }
  return rowFromRsvpGuest_(record);
}

function doPost(e) {
  try {
    var expectedSecret = PropertiesService.getScriptProperties().getProperty("RSVP_SECRET");
    var payload = JSON.parse(e.postData.contents);

    if (expectedSecret && payload.secret !== expectedSecret) {
      return jsonResponse_({ ok: false, error: "unauthorized" });
    }

    var sheetName = payload.sheet || DEFAULT_SHEET_NAME;
    var sheet = getSheet_(sheetName);
    ensureHeaders_(sheet, sheetName);

    var rows = payload.rows;
    if (!rows || !rows.length) {
      return jsonResponse_({ ok: false, error: "no rows" });
    }

    for (var i = 0; i < rows.length; i++) {
      sheet.appendRow(buildRow_(sheetName, rows[i]));
    }

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}
