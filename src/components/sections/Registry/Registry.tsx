import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variant } from '../../../versions';
import './Registry.css';

interface RegistryProps {
  variant?: Variant;
}

const IBAN = 'IT78 Y034 7501 605C C001 2462 559';
const INTESTATARIO = 'Mariavittoria e Andrea';
const SCRIPT_URL = ''; // DA INSERIRE: NUOVO URL APPS SCRIPT

// Fallback images in case the user hasn't provided Amazon links yet
const DEFAULT_IMG = 'https://m.media-amazon.com/images/I/41OvwY2a3rL._AC_SX679_.jpg';

interface Product {
  id: number;
  name: string;
  price: number;
  collected: number;
  completed: boolean;
  img?: string;
  link?: string;
  details?: string;
  imgPos?: string;
}

/** Converte il valore PosFoto del foglio in object-position CSS */
function imgObjectPosition(pos?: string): string {
  if (pos === 'top') return 'center top';
  if (pos === 'bottom') return 'center bottom';
  return 'center';
}

export default function Registry(_props: RegistryProps) {
  const [copied, setCopied] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const [guestName, setGuestName] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Fetch initial products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        if (data.result === 'success') {
          // Usa l'immagine restituita dal backend o il fallback se vuota
          const productsWithImages = data.products.map((p: Product) => ({
            ...p,
            img: p.img || DEFAULT_IMG,
          }));
          setProducts(productsWithImages);
        }
      } catch (error) {
        console.error('Errore nel caricamento dei regali:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Impedisci lo scroll del body quando il modale è aperto
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      setModalStep(1);
      setGuestName('');
      setCustomAmount('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct]);

  // Chiudi lo zoom con ESC
  useEffect(() => {
    if (!zoomImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomImage(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomImage]);

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(IBAN.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard non disponibile */
    }
  };

  const remaining = selectedProduct
    ? Math.max(selectedProduct.price - selectedProduct.collected, 0)
    : 0;
  const giftAmount = selectedProduct
    ? parseFloat(customAmount.replace(',', '.')) || remaining
    : 0;

  /** Step 1 → 2: validazione, nessun invio */
  const handleGoToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim() === '' || !selectedProduct) return;
    setModalStep(2);
  };

  /** Step 2 → 3: registra davvero il regalo */
  const handleConfirmGift = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);

    try {
      const formData = new URLSearchParams();
      formData.append('action', 'registry');
      formData.append('productId', selectedProduct.id.toString());
      formData.append('importo', giftAmount.toString());
      formData.append('donatore', guestName);

      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      // Aggiornamento ottimistico dello stato locale
      setProducts(prev => prev.map(p => {
        if (p.id === selectedProduct.id) {
          const newCollected = p.collected + giftAmount;
          return {
            ...p,
            collected: newCollected,
            completed: newCollected >= p.price,
          };
        }
        return p;
      }));

      setModalStep(3);
    } catch (error) {
      console.error("Errore nell'invio della donazione:", error);
      alert('Si è verificato un errore, riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-container registry-section">
      <motion.div
        className="registry-card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h2 className="section-title text-center">Regalo</h2>

        {/* E-commerce grid */}
        <div className="ecommerce-section">

          {loading ? (
            <div className="loading-registry">Caricamento regali...</div>
          ) : (
            <div className="products-grid">
              {products.map(product => {
                const progress = Math.min((product.collected / product.price) * 100, 100);

                return (
                  <div
                    key={product.id}
                    className={`product-card ${product.completed ? 'completed' : ''}`}
                    onClick={() => !product.completed && setSelectedProduct(product)}
                  >
                    <div className="product-image-container">
                      <img
                        src={product.img}
                        alt={product.name}
                        loading="lazy"
                        style={{ objectPosition: imgObjectPosition(product.imgPos) }}
                      />
                      {product.completed && <div className="product-completed-badge">Completato</div>}
                    </div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="product-price">€ {product.price.toFixed(2)}</p>

                      <div className="product-progress-container">
                        <div className="product-progress-bar" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="product-progress-text">
                        Raccolti € {product.collected.toFixed(2)} su € {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="registry-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="registry-modal-content"
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="registry-modal-close" onClick={() => setSelectedProduct(null)}>×</button>

              <div className="modal-header">
                <button
                  type="button"
                  className="modal-image-btn"
                  onClick={() => setZoomImage(selectedProduct.img || DEFAULT_IMG)}
                  aria-label="Ingrandisci immagine"
                >
                  <img
                    src={selectedProduct.img}
                    alt={selectedProduct.name}
                    style={{ objectPosition: imgObjectPosition(selectedProduct.imgPos) }}
                  />
                  <span className="modal-zoom-hint" aria-hidden>🔍</span>
                </button>
                <div className="modal-header-text">
                  <h3>{selectedProduct.name}</h3>
                  <p className="modal-price">€ {selectedProduct.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="modal-body">
                <AnimatePresence mode="wait">
                  {modalStep === 1 ? (
                    <motion.form
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleGoToConfirm}
                      className="modal-form"
                    >
                      {selectedProduct.details && (
                        <p className="modal-details">{selectedProduct.details}</p>
                      )}
                      {selectedProduct.link && (
                        <a
                          className="modal-product-link"
                          href={selectedProduct.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Vedi il prodotto ↗
                        </a>
                      )}

                      <div className="form-group">
                        <label>Nome Invitato/i *</label>
                        <input
                          type="text"
                          placeholder="Il tuo nome"
                          required
                          value={guestName}
                          onChange={e => setGuestName(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Importo contributo libero (opzionale)</label>
                        <div className="input-with-symbol">
                          <span className="currency-symbol">€</span>
                          <input
                            type="number"
                            min="1"
                            step="0.01"
                            placeholder={remaining.toFixed(2)}
                            value={customAmount}
                            onChange={e => setCustomAmount(e.target.value)}
                          />
                        </div>
                        <small className="amount-hint">Importo ancora mancante: € {remaining.toFixed(2)}</small>
                      </div>

                      <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={() => setSelectedProduct(null)}>
                          Annulla
                        </button>
                        <button type="submit" className="btn-continue">
                          Regala 🎁
                        </button>
                      </div>
                    </motion.form>
                  ) : modalStep === 2 ? (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="modal-step-2"
                    >
                      <p>
                        <strong>{guestName}</strong>, per completare il regalo effettua un
                        bonifico con queste coordinate e poi conferma:
                      </p>

                      <div className="bonifico-box">
                        <p><strong>Intestatario:</strong> {INTESTATARIO}</p>
                        <p><strong>Causale:</strong> Regalo {selectedProduct.name} da {guestName}</p>
                        <p><strong>Importo:</strong> € {giftAmount.toFixed(2)}</p>
                        <p className="iban">{IBAN}</p>
                      </div>

                      <button type="button" className="btn-copy-modal" onClick={copyIban}>
                        {copied ? '✓ IBAN Copiato!' : 'Copia IBAN'}
                      </button>

                      <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={() => setModalStep(1)}>
                          Indietro
                        </button>
                        <button
                          type="button"
                          className="btn-continue"
                          onClick={handleConfirmGift}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Attendere...' : 'Conferma Regalo ✓'}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="modal-step-3"
                    >
                      <div className="modal-success-icon" aria-hidden>🤍</div>
                      <h3>Grazie {guestName}!</h3>
                      <p>
                        Il tuo regalo è stato registrato. Mariavittoria e Andrea
                        ti ringraziano di cuore!
                      </p>
                      <button
                        type="button"
                        className="btn-continue btn-close-success"
                        onClick={() => setSelectedProduct(null)}
                      >
                        Chiudi
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom immagine a schermo intero */}
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            className="product-zoom-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomImage(null)}
          >
            <button className="registry-modal-close" onClick={() => setZoomImage(null)}>×</button>
            <motion.img
              src={zoomImage}
              alt="Immagine ingrandita"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
