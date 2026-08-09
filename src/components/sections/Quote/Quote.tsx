import { motion } from 'framer-motion';
import './Quote.css';

export default function Quote() {
  return (
    <div className="section-container quote-section">
      <motion.div 
        className="quote-content"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="quote-icon">❝</div>
        <blockquote>
          <p>
            a mela pena ti vediamo tu sei il sardo di milnao con la motot con tre ruote e la tessera d'azione in quel giorno maledetto sei arrivato col traghetto ora sali sul barcone ti rispedimao a guamaggiore
          </p>
          <footer>— Ciccio Pasticcio</footer>
        </blockquote>
      </motion.div>
    </div>
  );
}
