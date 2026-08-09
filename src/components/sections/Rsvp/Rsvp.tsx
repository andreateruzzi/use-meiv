import { useState } from 'react';
import { motion } from 'framer-motion';
import './Rsvp.css';

export default function Rsvp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(false);

  // Actual URL from user's Google Apps Script setup
  const SCRIPT_URL = ''; // DA INSERIRE: NUOVO URL APPS SCRIPT

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    const formData = new FormData(e.currentTarget);
    
    // Convert FormData to URLSearchParams for x-www-form-urlencoded
    const data = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      data.append(key, value.toString());
    }

    try {
      // Use no-cors to avoid CORS issues with Google Apps Script
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // With no-cors we can't read the response, so we assume success if no exception
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setError(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="section-container rsvp-section">
        <motion.div 
          className="rsvp-card text-center fade-in"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Grazie!</h2>
          <p className="rsvp-success-message">La tua conferma è stata registrata con successo. Non vediamo l'ora di festeggiare con te!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="section-container rsvp-section">
      <motion.div 
        className="rsvp-card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h2 className="section-title text-center">RSVP</h2>
        <p className="registry-intro text-center">
          Conferma la tua presenza compilando il modulo sottostante.
        </p>

        <form className="rsvp-form" onSubmit={handleSubmit}>
          {error && (
            <div className="rsvp-error">
              Si è verificato un errore durante l'invio. Riprova più tardi.
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nome">Nome e Cognome *</label>
            <input type="text" id="nome" name="nome" required placeholder="Es. Mario Rossi" />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="quanti">Quanti sarete? *</label>
              <input type="number" id="quanti" name="quanti" min="1" required defaultValue="1" />
            </div>
            
            <div className="form-group half">
              <label htmlFor="bambini">Di cui bambini</label>
              <input type="number" id="bambini" name="bambini" min="0" defaultValue="0" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="intolleranze">Intolleranze / Allergie</label>
            <textarea id="intolleranze" name="intolleranze" rows={2} placeholder="Nessuna"></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="altro">Altro / Note</label>
            <textarea id="altro" name="altro" rows={2} placeholder="Hai altre necessità o domande?"></textarea>
          </div>

          <div className="form-actions text-center">
            <button type="submit" className="btn-rsvp" disabled={isSubmitting}>
              {isSubmitting ? 'Invio in corso...' : 'Conferma Presenza'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
