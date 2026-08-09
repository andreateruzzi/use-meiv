import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Admin.css';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwljgrnBJ_Ya8SBnfrFAJtftzLnuAX77pb7kn55-IrThKvwSCfdQHid7S2491U3sM91/exec';
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1w7fiJ2FaDpgvGUQB745WTj52wB4Mw38dKRL5NRpizxA/edit'; // foglio "RSVP matrimonio"

// La foto viene compressa lato client e salvata come data-URL (base64)
// direttamente nella cella "img" del foglio Google: nessuna autenticazione
// Drive necessaria. Limite cella Google Sheets: 50.000 caratteri.
const MAX_DATAURL_CHARS = 45000;

interface Product {
  id: number;
  name: string;
  price: number;
  img?: string;
  link?: string;
  details?: string;
  imgPos?: string;
}

/** Comprime un'immagine in JPEG data-URL sotto MAX_DATAURL_CHARS. */
async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const attempts: Array<[number, number]> = [
    [500, 0.72],
    [400, 0.6],
    [320, 0.5],
    [260, 0.45],
  ];
  for (const [maxSide, quality] of attempts) {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas non disponibile');
    // sfondo bianco per PNG con trasparenza
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    if (dataUrl.length <= MAX_DATAURL_CHARS) {
      bitmap.close();
      return dataUrl;
    }
  }
  bitmap.close();
  throw new Error('Immagine troppo complessa da comprimere');
}

interface UploadBoxProps {
  image: string;
  onImage: (dataUrl: string) => void;
  onClear: () => void;
}

function UploadBox({ image, onImage, onClear }: UploadBoxProps) {
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert('Seleziona un file immagine (JPG, PNG — HEIC non supportato dal browser).');
        return;
      }
      setBusy(true);
      try {
        onImage(await compressImage(file));
      } catch (err) {
        console.error(err);
        alert("Impossibile elaborare l'immagine. Prova con un'altra foto.");
      } finally {
        setBusy(false);
      }
    },
    [onImage]
  );

  if (image) {
    return (
      <div className="preview-container">
        <img src={image} alt="Anteprima" className="image-preview" />
        <button type="button" className="btn-remove-image" onClick={onClear}>
          Rimuovi foto
        </button>
      </div>
    );
  }

  return (
    <div
      className={`dropzone ${dragOver ? 'dropzone--over' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        type="file"
        accept="image/*"
        className="file-input"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <span className="dropzone-prompt">
        {busy ? 'Compressione in corso…' : '📷 Trascina qui una foto o clicca per sceglierla'}
      </span>
    </div>
  );
}

/** Selettore a tre opzioni per la posizione della foto nel riquadro */
function PosPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { v: 'top', label: 'Alto' },
    { v: '', label: 'Centro' },
    { v: 'bottom', label: 'Basso' },
  ];
  return (
    <div className="pos-picker" role="radiogroup" aria-label="Posizione foto">
      {options.map((o) => (
        <button
          key={o.label}
          type="button"
          className={`pos-option ${value === o.v ? 'active' : ''}`}
          onClick={() => onChange(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Add Product State
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductImg, setNewProductImg] = useState('');
  const [newProductLink, setNewProductLink] = useState('');
  const [newProductDetails, setNewProductDetails] = useState('');
  const [newProductImgPos, setNewProductImgPos] = useState('');

  // Manage Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editImgPos, setEditImgPos] = useState('');
  const [editImg, setEditImg] = useState(''); // nuova foto caricata (vuoto = non toccare)

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    try {
      const r = await fetch(SCRIPT_URL);
      const data = await r.json();
      if (data.result === 'success') {
        setProducts(data.products);
        return data.products as Product[];
      }
    } catch {
      /* la sezione gestione resterà vuota */
    }
    return null;
  }, []);

  useEffect(() => {
    if (isAuthenticated) refreshProducts();
  }, [isAuthenticated, refreshProducts]);

  // Quando si sceglie un prodotto da gestire, precompila i campi
  const selectProductToEdit = (id: string) => {
    setEditId(id);
    setEditImg('');
    const p = products.find((x) => String(x.id) === id);
    if (p) {
      setEditName(p.name);
      setEditPrice(String(p.price));
      setEditLink(p.link || '');
      setEditDetails(p.details || '');
      setEditImgPos(p.imgPos || '');
    }
  };

  const editingProduct = products.find((x) => String(x.id) === editId);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'amore') {
      setIsAuthenticated(true);
    } else {
      alert('Password errata');
    }
  };

  const postAction = async (actionName: string, additionalData?: URLSearchParams) => {
    const formData = additionalData || new URLSearchParams();
    formData.append('action', actionName);
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
    return response.json();
  };

  const scriptOutdatedMsg =
    'Il backend non supporta ancora questa azione.\n\n' +
    'Apri il foglio Google → Estensioni → Apps Script, incolla il codice aggiornato ' +
    'dal file apps-script/Code.gs del progetto e ripubblica il deployment ' +
    '(Deploy → Gestisci deployment → Nuova versione).';

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;

    setLoadingAction('add_product');
    try {
      const params = new URLSearchParams();
      params.append('name', newProductName);
      params.append('price', newProductPrice);
      if (newProductImg) params.append('img', newProductImg);
      if (newProductLink) params.append('link', newProductLink);
      if (newProductDetails) params.append('details', newProductDetails);
      if (newProductImgPos) params.append('imgPos', newProductImgPos);

      const data = await postAction('add_product', params);
      if (data.result !== 'success') {
        alert("Errore durante l'aggiunta: " + (data.error || 'Sconosciuto'));
        return;
      }

      // Verifica che gli eventuali campi extra siano stati salvati davvero
      const fresh = await refreshProducts();
      const added = fresh?.find((p) => p.id === Number(data.id));
      const extrasLost =
        added &&
        ((newProductLink && !added.link) ||
          (newProductDetails && !added.details) ||
          (newProductImgPos && !added.imgPos));

      if (extrasLost) {
        alert('Prodotto aggiunto, ma link/dettagli/posizione foto NON sono stati salvati.\n\n' + scriptOutdatedMsg);
      } else {
        alert('Prodotto aggiunto con successo!');
      }
      setNewProductName('');
      setNewProductPrice('');
      setNewProductImg('');
      setNewProductLink('');
      setNewProductDetails('');
      setNewProductImgPos('');
    } catch (error) {
      console.error(error);
      alert('Si è verificato un errore di rete.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;

    setLoadingAction('update_product');
    try {
      const params = new URLSearchParams();
      params.append('productId', editId);
      params.append('name', editName);
      params.append('price', editPrice);
      params.append('link', editLink);
      params.append('details', editDetails);
      params.append('imgPos', editImgPos);
      if (editImg) params.append('img', editImg);

      await postAction('update_product', params);

      // Il vecchio backend risponde "success" anche per azioni sconosciute:
      // verifichiamo rileggendo il prodotto.
      const fresh = await refreshProducts();
      const updated = fresh?.find((p) => String(p.id) === editId);
      const ok =
        updated &&
        updated.name === editName &&
        String(updated.price) === editPrice &&
        (updated.link || '') === editLink &&
        (updated.details || '') === editDetails &&
        (updated.imgPos || '') === editImgPos &&
        (!editImg || updated.img === editImg);

      if (ok) {
        alert('Prodotto aggiornato!');
        setEditImg('');
      } else {
        alert(scriptOutdatedMsg);
      }
    } catch (error) {
      console.error(error);
      alert('Si è verificato un errore di rete.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (!editId || !editingProduct) return;
    if (!window.confirm(`Eliminare DEFINITIVAMENTE "${editingProduct.name}" dalla lista?`)) return;

    setLoadingAction('delete_product');
    try {
      const params = new URLSearchParams();
      params.append('productId', editId);
      await postAction('delete_product', params);

      const fresh = await refreshProducts();
      const stillThere = fresh?.some((p) => String(p.id) === editId);
      if (stillThere) {
        alert(scriptOutdatedMsg);
      } else {
        alert('Prodotto eliminato.');
        setEditId('');
      }
    } catch (error) {
      console.error(error);
      alert('Si è verificato un errore di rete.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAction = async (actionName: string) => {
    setLoadingAction(actionName);
    try {
      const data = await postAction(actionName);
      if (data.result === 'success') {
        alert('Azione completata con successo!');
        refreshProducts();
      } else {
        alert("Errore durante l'azione: " + (data.error || 'Sconosciuto'));
      }
    } catch (error) {
      console.error(error);
      alert('Si è verificato un errore di rete.');
    } finally {
      setLoadingAction(null);
    }
  };

  const confirmAndExecute = (actionName: string, message: string) => {
    if (window.confirm(message)) {
      handleAction(actionName);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <motion.div
          className="admin-login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Area Riservata</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Inserisci la password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Accedi</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="admin-header">
          <h1>Pannello di Controllo Matrimonio</h1>
          <p>Gestisci regali e invitati in tempo reale.</p>
        </div>

        <div className="admin-section">
          <h2>Google Sheets</h2>
          <p>Tutti i dati sono salvati nel tuo foglio Google. Puoi visualizzarli o modificarli manualmente da lì.</p>
          <a href={SHEET_URL} target="_blank" rel="noopener noreferrer" className="btn-sheet">
            Apri Foglio di Lavoro 📊
          </a>
        </div>

        <div className="admin-section">
          <h2>Aggiungi Prodotto (Regali)</h2>
          <form className="add-product-form" onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Nome del prodotto"
              value={newProductName}
              onChange={e => setNewProductName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Prezzo (es. 150.50)"
              step="0.01"
              value={newProductPrice}
              onChange={e => setNewProductPrice(e.target.value)}
              required
            />
            <input
              type="url"
              placeholder="Link al prodotto (opzionale)"
              value={newProductLink}
              onChange={e => setNewProductLink(e.target.value)}
            />
            <textarea
              className="details-textarea"
              placeholder="Dettagli aggiuntivi (opzionale) — es. colore, modello, note per gli invitati"
              value={newProductDetails}
              onChange={e => setNewProductDetails(e.target.value)}
              rows={3}
            />

            <label className="upload-label">Foto del prodotto</label>
            <UploadBox
              image={newProductImg.startsWith('data:') ? newProductImg : ''}
              onImage={setNewProductImg}
              onClear={() => setNewProductImg('')}
            />
            {!newProductImg.startsWith('data:') && (
              <input
                type="url"
                placeholder="…oppure incolla l'URL diretto di un'immagine (deve finire con .jpg/.png)"
                value={newProductImg}
                onChange={e => setNewProductImg(e.target.value)}
              />
            )}

            <label className="upload-label">Posizione della foto nel riquadro</label>
            <PosPicker value={newProductImgPos} onChange={setNewProductImgPos} />

            <button type="submit" disabled={loadingAction === 'add_product'}>
              {loadingAction === 'add_product' ? 'Aggiunta in corso...' : 'Aggiungi Prodotto 🎁'}
            </button>
          </form>
        </div>

        <div className="admin-section">
          <h2>Gestisci Prodotti</h2>
          <p>Scegli un regalo per modificarne foto, nome, prezzo, link e dettagli — o per eliminarlo.</p>
          <form className="add-product-form" onSubmit={handleSaveProduct}>
            <select
              value={editId}
              onChange={(e) => selectProductToEdit(e.target.value)}
              className="product-select"
            >
              <option value="">— Scegli il prodotto —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}. {p.name} (€ {p.price})
                </option>
              ))}
            </select>

            {editingProduct && (
              <>
                <input
                  type="text"
                  placeholder="Nome del prodotto"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Prezzo"
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                />
                <input
                  type="url"
                  placeholder="Link al prodotto (opzionale)"
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                />
                <textarea
                  className="details-textarea"
                  placeholder="Dettagli aggiuntivi (opzionale)"
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  rows={3}
                />

                <label className="upload-label">Foto</label>
                {!editImg && editingProduct.img && (
                  <div className="current-photo-row">
                    <img src={editingProduct.img} alt="Foto attuale" className="current-photo-thumb" />
                    <span className="current-photo-note">Foto attuale — caricane una nuova per sostituirla</span>
                  </div>
                )}
                <UploadBox image={editImg} onImage={setEditImg} onClear={() => setEditImg('')} />

                <label className="upload-label">Posizione della foto nel riquadro</label>
                <PosPicker value={editImgPos} onChange={setEditImgPos} />

                <div className="edit-actions">
                  <button type="submit" disabled={loadingAction === 'update_product'}>
                    {loadingAction === 'update_product' ? 'Salvataggio...' : '💾 Salva Modifiche'}
                  </button>
                  <button
                    type="button"
                    className="btn-delete-product"
                    disabled={loadingAction === 'delete_product'}
                    onClick={handleDeleteProduct}
                  >
                    {loadingAction === 'delete_product' ? 'Eliminazione...' : '🗑 Elimina Prodotto'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        <div className="admin-section danger-zone">
          <h2>Zona Pericolosa ⚠️</h2>
          <p>Le seguenti azioni sono irreversibili. Usale con cautela.</p>

          <div className="danger-buttons">
            <button
              className="btn-danger"
              disabled={loadingAction === 'reset_payments'}
              onClick={() => confirmAndExecute('reset_payments', 'Sei SICURO di voler azzerare tutti i pagamenti ricevuti? La colonna "Raccolti" tornerà a 0 per tutti i regali.')}
            >
              {loadingAction === 'reset_payments' ? 'Azzeramento...' : 'Azzera Pagamenti Regali'}
            </button>

            <button
              className="btn-danger"
              disabled={loadingAction === 'clear_guests'}
              onClick={() => confirmAndExecute('clear_guests', 'Sei SICURO di voler svuotare la lista degli invitati? Tutte le conferme RSVP verranno eliminate.')}
            >
              {loadingAction === 'clear_guests' ? 'Eliminazione...' : 'Svuota Lista Invitati (RSVP)'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
