import { motion } from 'framer-motion';
import './Reception.css';

export default function Reception() {
  return (
    <div className="section-container reception-section">
      <motion.div 
        className="reception-content"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        <h2 className="section-title">Ricevimento</h2>
        <div className="reception-details">
          <h3>Villa Esengrini Montalbano</h3>
          <p className="reception-address">Via degli Alpini 5, Varese (Ore 12:00)</p>
          
          <div className="ceremony-actions">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Villa+Esengrini+Montalbano%2C+Via+degli+Alpini+5%2C+Varese"
              target="_blank"
              rel="noreferrer"
              className="btn-action btn-maps"
            >
              Vedi su Google Maps
            </a>
          </div>

          <div className="parking-info reception-parking">
            <h4>Indicazioni Parcheggio</h4>
            <ul className="parking-list">
              <li>
                <a href="https://www.google.com/maps/search/?api=1&query=Parcheggio+Via+Gioacchino+Rossini%2C+Cassano+d%27Adda" target="_blank" rel="noreferrer">Via Gioacchino Rossini</a>
              </li>
              <li>
                <a href="https://www.google.com/maps/search/?api=1&query=Parcheggio+Via+Giuseppe+Mazzini%2C+Cassano+d%27Adda" target="_blank" rel="noreferrer">Via Giuseppe Mazzini</a>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
      <motion.div 
        className="reception-image-wrapper"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <img
          src="/images/Foto sito/villa_sketch.jpg"
          alt="Illustrazione della villa"
          className="reception-illustration"
        />
      </motion.div>
    </div>
  );
}
