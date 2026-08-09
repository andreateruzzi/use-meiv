import { motion } from 'framer-motion';
import type { Variant } from '../../../versions';
import './Cover.css';

interface CoverProps {
  variant: Variant;
}

export default function Cover({ variant }: CoverProps) {
  const handleRsvpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const rsvpSection = document.querySelector('.rsvp-section');
    if (rsvpSection) {
      rsvpSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="section-container cover-section">
      <div className="cover-image-wrapper">
        <img
          src="/images/andy_diouf.jpg"
          alt="Mariavittoria e Andrea"
          className="cover-image"
        />
        <div className="cover-overlay"></div>
      </div>

      <motion.div
        className="cover-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <h1 className="cover-names">Mariavittoria &amp; Andrea</h1>

        <div className="cover-date-row">
          <span className="cover-rule" />
          <p className="cover-date">7 Novembre 2026</p>
          <span className="cover-rule" />
        </div>

        {variant === 'completo' && (
          <div className="rsvp-block">
            <a href="#rsvp" onClick={handleRsvpClick} className="btn-rsvp">
              Conferma la tua presenza
            </a>
          </div>
        )}
      </motion.div>

      <button
        type="button"
        className="cover-scroll"
        onClick={scrollDown}
        aria-label="Scorri verso il basso"
      >
        <span className="cover-scroll-text">Scopri</span>
        <span className="cover-scroll-arrow">⌄</span>
      </button>
    </div>
  );
}
