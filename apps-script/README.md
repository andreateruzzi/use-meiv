# Backend Google Apps Script

Il sito usa un Google Apps Script (deployment `/exec`) come backend per
regali e RSVP, collegato al foglio **"RSVP matrimonio"**. Il codice di
riferimento è in [`Code.gs`](Code.gs), già configurato con i nomi reali
dei fogli:

| Foglio | Contenuto | Colonne |
|---|---|---|
| `ListaNozze` | prodotti | ID · Nome · Prezzo · Raccolti · Immagine |
| `Foglio1` | RSVP | Data · Nome · Quanti · Bambini · Intolleranze · Note |
| `LogDonazioni` | storico donazioni | Data · Donatore · ID Prodotto · Importo |

## Cosa funziona già senza aggiornare lo script

- **Aggiungi Prodotto con foto** da `/admin`: la foto viene compressa nel
  browser e salvata come `data:` URL (base64) nella colonna Immagine —
  nessuna autenticazione Drive necessaria.

## Perché aggiornare lo script

Lo script vecchio non conosce `update_product` / `delete_product` e
tratta le azioni sconosciute come conferme RSVP (aggiunge righe vuote al
Foglio1!). Con quello aggiornato funziona anche **"Modifica Foto di un
Prodotto"** dal pannello admin.

## Come aggiornare (2 minuti)

1. Apri il foglio "RSVP matrimonio" → **Estensioni → Apps Script**
2. Sostituisci tutto il codice con il contenuto di `Code.gs`
3. **Deploy → Gestisci deployment → ✏️ → Nuova versione → Deploy**
   — l'URL `/exec` resta identico, il sito riprende a funzionare subito

Se un nome di foglio non combacia, lo script ora prova a riconoscerlo
dalle intestazioni e, in caso di errore, l'errore elenca i fogli
disponibili invece del criptico `Cannot read properties of null`.
