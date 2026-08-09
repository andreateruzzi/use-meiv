import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './RegistryLink.css';

const IBAN = 'IT78 Y034 7501 605C C001 2462 559';
const INTESTATARIO = 'Mariavittoria e Andrea';

export default function RegistryLink() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(IBAN.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard non disponibile */
    }
  };

  return (
    <div className="section-container registry-link-section">
      <motion.div
        className="registry-link-card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h2 className="section-title text-center">Regalo</h2>
        
        <p className="registry-link-intro">
          Se desideri partecipare alla realizzazione della nostra nuova casa o contribuire 
          a rendere il nostro viaggio di nozze in Messico ancora più bello, puoi farlo nei seguenti modi:
        </p>

        <div className="registry-options">
          <div className="registry-option">
            <div className="option-icon">🏦</div>
            <h3>Bonifico Bancario</h3>
            <div className="bonifico-details">
              <p><strong>Intestatario:</strong> {INTESTATARIO}</p>
              <p><strong>Causale:</strong> Regalo viaggio di nozze</p>
              <p className="iban">{IBAN}</p>
            </div>
            <button type="button" className="btn-copy" onClick={copyIban}>
              {copied ? '✓ Copiato!' : 'Copia IBAN'}
            </button>
          </div>
        </div>
        
        <div className="ecommerce-section-link">
          <button 
            className="btn-go-registry" 
            onClick={() => navigate('/lista-nozze')}
          >
            Lista Nozze
          </button>
        </div>
      </motion.div>
    </div>
  );
}
