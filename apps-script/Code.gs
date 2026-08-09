/**
 * Backend Google Apps Script — Sito matrimonio Mariavittoria & Andrea
 *
 * COME AGGIORNARE (2 minuti):
 * 1. Apri il foglio Google "RSVP matrimonio" → Estensioni → Apps Script
 * 2. Sostituisci tutto il codice esistente con questo file
 * 3. Deploy → Gestisci deployment → ✏️ → Nuova versione → Deploy
 *    (l'URL /exec resta lo stesso, il sito continua a funzionare)
 *
 * Fogli attesi (nomi reali del foglio "RSVP matrimonio"):
 *   - ListaNozze:    A:ID | B:Nome | C:Prezzo | D:Raccolti | E:Immagine
 *                    F:Link | G:Dettagli | H:PosFoto   (F-H opzionali:
 *                    vengono creati da questo script quando servono)
 *   - Foglio1:       A:Data | B:Nome | C:Quanti | D:Bambini | E:Intolleranze | F:Note
 *   - LogDonazioni:  A:Data | B:Donatore | C:ID Prodotto | D:Importo
 */

var SHEET_REGALI = 'ListaNozze';
var SHEET_RSVP = 'Foglio1';
var SHEET_LOG = 'LogDonazioni';

var COL = { id: 1, name: 2, price: 3, collected: 4, img: 5, link: 6, details: 7, imgPos: 8 };

/**
 * Trova un foglio per nome; se non esiste prova a riconoscerlo dalle
 * intestazioni, altrimenti solleva un errore che ELENCA i fogli reali
 * (così l'errore dice subito cosa correggere).
 */
function _sheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (sheet) return sheet;

  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var lastCol = Math.max(1, sheets[i].getLastColumn());
    var headers = sheets[i].getRange(1, 1, 1, lastCol).getValues()[0].join('|').toLowerCase();
    if (name === SHEET_REGALI && /prezzo|price/.test(headers)) return sheets[i];
    if (name === SHEET_RSVP && /quanti|intolleranz/.test(headers)) return sheets[i];
    if (name === SHEET_LOG && /donatore/.test(headers)) return sheets[i];
  }
  var available = sheets.map(function (s) { return s.getName(); }).join(', ');
  throw new Error('Foglio "' + name + '" non trovato. Fogli disponibili: ' + available +
    '. Correggi i nomi in cima allo script.');
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** GET → elenco prodotti */
function doGet() {
  try {
    var sheet = _sheet(SHEET_REGALI);
    var rows = sheet.getDataRange().getValues();
    var products = [];
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (r[COL.id - 1] === '' || r[COL.id - 1] === null) continue;
      var price = Number(r[COL.price - 1]) || 0;
      var collected = Number(r[COL.collected - 1]) || 0;
      products.push({
        id: Number(r[COL.id - 1]),
        name: String(r[COL.name - 1]),
        price: price,
        collected: collected,
        completed: collected >= price && price > 0,
        img: String(r[COL.img - 1] || ''),
        link: String(r[COL.link - 1] || ''),
        details: String(r[COL.details - 1] || ''),
        imgPos: String(r[COL.imgPos - 1] || ''),
      });
    }
    return _json({ result: 'success', products: products });
  } catch (err) {
    return _json({ result: 'error', error: String(err) });
  }
}

/** POST → azioni */
function doPost(e) {
  try {
    var p = e.parameter;
    var action = p.action || '';

    if (action === 'registry') return actionRegistry(p);
    if (action === 'add_product') return actionAddProduct(p);
    if (action === 'update_product') return actionUpdateProduct(p);
    if (action === 'delete_product') return actionDeleteProduct(p);
    if (action === 'reset_payments') return actionResetPayments();
    if (action === 'clear_guests') return actionClearGuests();

    // default: conferma RSVP (il form invia i campi senza "action")
    if (p.nome) return actionRsvp(p);

    return _json({ result: 'error', error: 'Azione non riconosciuta: ' + action });
  } catch (err) {
    return _json({ result: 'error', error: String(err) });
  }
}

/** Registra un contributo: aggiorna "Raccolti" e logga su LogDonazioni */
function actionRegistry(p) {
  var sheet = _sheet(SHEET_REGALI);
  var rows = sheet.getDataRange().getValues();
  var id = Number(p.productId);
  for (var i = 1; i < rows.length; i++) {
    if (Number(rows[i][COL.id - 1]) === id) {
      var current = Number(rows[i][COL.collected - 1]) || 0;
      var amount = Number(p.importo) || 0;
      sheet.getRange(i + 1, COL.collected).setValue(current + amount);
      // log della donazione (Data, Donatore, ID Prodotto, Importo)
      try {
        _sheet(SHEET_LOG).appendRow([new Date(), p.donatore || '', id, amount]);
      } catch (logErr) {
        // il log è best-effort: non bloccare la donazione
      }
      return _json({ result: 'success', action: 'registry' });
    }
  }
  return _json({ result: 'error', error: 'Prodotto non trovato: ' + id });
}

/** Aggiunge un prodotto (name, price, img opzionale — URL o data-URL base64) */
function actionAddProduct(p) {
  var sheet = _sheet(SHEET_REGALI);
  var last = sheet.getLastRow();
  var maxId = 0;
  if (last > 1) {
    var ids = sheet.getRange(2, COL.id, last - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      maxId = Math.max(maxId, Number(ids[i][0]) || 0);
    }
  }
  sheet.appendRow([
    maxId + 1,
    p.name,
    Number(p.price) || 0,
    0,
    p.img || '',
    p.link || '',
    p.details || '',
    p.imgPos || '',
  ]);
  return _json({ result: 'success', action: 'add_product', id: maxId + 1 });
}

/** Aggiorna la foto (o nome/prezzo) di un prodotto esistente */
function actionUpdateProduct(p) {
  var sheet = _sheet(SHEET_REGALI);
  var rows = sheet.getDataRange().getValues();
  var id = Number(p.productId);
  for (var i = 1; i < rows.length; i++) {
    if (Number(rows[i][COL.id - 1]) === id) {
      if (p.img !== undefined) sheet.getRange(i + 1, COL.img).setValue(p.img);
      if (p.name !== undefined && p.name !== '') sheet.getRange(i + 1, COL.name).setValue(p.name);
      if (p.price !== undefined && p.price !== '') sheet.getRange(i + 1, COL.price).setValue(Number(p.price));
      // campi opzionali: possono anche essere svuotati
      if (p.link !== undefined) sheet.getRange(i + 1, COL.link).setValue(p.link);
      if (p.details !== undefined) sheet.getRange(i + 1, COL.details).setValue(p.details);
      if (p.imgPos !== undefined) sheet.getRange(i + 1, COL.imgPos).setValue(p.imgPos);
      return _json({ result: 'success', action: 'update_product' });
    }
  }
  return _json({ result: 'error', error: 'Prodotto non trovato: ' + id });
}

/** Elimina un prodotto per id */
function actionDeleteProduct(p) {
  var sheet = _sheet(SHEET_REGALI);
  var rows = sheet.getDataRange().getValues();
  var id = Number(p.productId);
  for (var i = 1; i < rows.length; i++) {
    if (Number(rows[i][COL.id - 1]) === id) {
      sheet.deleteRow(i + 1);
      return _json({ result: 'success', action: 'delete_product' });
    }
  }
  return _json({ result: 'error', error: 'Prodotto non trovato: ' + id });
}

/** Azzera la colonna "Raccolti" di tutti i regali (il log resta come storico) */
function actionResetPayments() {
  var sheet = _sheet(SHEET_REGALI);
  var last = sheet.getLastRow();
  if (last > 1) {
    sheet.getRange(2, COL.collected, last - 1, 1).setValue(0);
  }
  return _json({ result: 'success', action: 'reset_payments' });
}

/** Svuota il foglio RSVP (tiene le intestazioni) */
function actionClearGuests() {
  var sheet = _sheet(SHEET_RSVP);
  var last = sheet.getLastRow();
  if (last > 1) {
    sheet.deleteRows(2, last - 1);
  }
  return _json({ result: 'success', action: 'clear_guests' });
}

/** Salva una conferma RSVP (Data, Nome, Quanti, Bambini, Intolleranze, Note) */
function actionRsvp(p) {
  var sheet = _sheet(SHEET_RSVP);
  sheet.appendRow([
    new Date(),
    p.nome || '',
    p.quanti || '',
    p.bambini || '',
    p.intolleranze || '',
    p.altro || '',
  ]);
  return _json({ result: 'success', action: 'rsvp' });
}

/** ==========================================
 *  FUNZIONE MAGICA DI SETUP AUTOMATICO
 *  Esegui questa funzione una sola volta per creare
 *  tutti i fogli e le colonne necessarie!
 *  ========================================== */
function autoSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Setup ListaNozze
  var sheetRegali = ss.getSheetByName(SHEET_REGALI);
  if (!sheetRegali) {
    sheetRegali = ss.insertSheet(SHEET_REGALI);
  }
  sheetRegali.getRange("A1:H1").setValues([["ID", "Nome", "Prezzo", "Raccolti", "Immagine", "Link", "Dettagli", "PosFoto"]]);
  sheetRegali.getRange("A1:H1").setFontWeight("bold");

  // 2. Setup Foglio1 (RSVP)
  var sheetRsvp = ss.getSheetByName(SHEET_RSVP);
  if (!sheetRsvp) {
    // Se non esiste Foglio1, magari lo script è stato appena creato e c'è Foglio 1 o Sheet1
    var defaultSheet = ss.getSheets()[0];
    if (defaultSheet.getName() !== SHEET_REGALI && defaultSheet.getName() !== SHEET_LOG) {
      defaultSheet.setName(SHEET_RSVP);
      sheetRsvp = defaultSheet;
    } else {
      sheetRsvp = ss.insertSheet(SHEET_RSVP);
    }
  }
  sheetRsvp.getRange("A1:F1").setValues([["Data", "Nome", "Quanti", "Bambini", "Intolleranze", "Note"]]);
  sheetRsvp.getRange("A1:F1").setFontWeight("bold");

  // 3. Setup LogDonazioni
  var sheetLog = ss.getSheetByName(SHEET_LOG);
  if (!sheetLog) {
    sheetLog = ss.insertSheet(SHEET_LOG);
  }
  sheetLog.getRange("A1:D1").setValues([["Data", "Donatore", "ID Prodotto", "Importo"]]);
  sheetLog.getRange("A1:D1").setFontWeight("bold");

  SpreadsheetApp.getUi().alert("Setup Completato! I fogli e le colonne sono pronti.");
}
