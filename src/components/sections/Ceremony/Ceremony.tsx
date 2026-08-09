import { motion } from 'framer-motion';
import './Ceremony.css';

export default function Ceremony() {
  const websiteUrl = window.location.origin + window.location.pathname + '#cerimonia';
  const calendarDetails = `Vi aspettiamo per celebrare il nostro matrimonio!%0A%0ATutte le info sul sito: ${websiteUrl}`;
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Cerimonia+Matrimonio+Maria+e+Lorenzo&dates=20261107T110000/20261107T123000&ctz=Europe/Rome&details=${calendarDetails}&location=Chiesa+di+Niguarda+Ca'+Granda,+Milano`;

  return (
    <div id="cerimonia" className="section-container ceremony-section">
      <motion.div 
        className="ceremony-image-wrapper"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <img
          src="/images/Foto sito/church_sketch.png"
          alt="Illustrazione della chiesa"
          className="ceremony-illustration"
        />
      </motion.div>
      <motion.div 
        className="ceremony-content"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        <h2 className="section-title">Cerimonia</h2>
        <div className="ceremony-details">
          <h3>Chiesa di San Martino in Niguarda</h3>
          <p className="ceremony-address">Piazza Belloveso, 5, 20162 Milano MI</p>
          <p className="ceremony-time">Ore 11:00</p>
          
          <div className="ceremony-actions">
            <a 
              href="https://maps.app.goo.gl/8nw5zH47DqodtRcy8" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-action btn-maps"
            >
              Vedi su Google Maps
            </a>
            <a 
              href={calendarUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-action btn-calendar"
            >
              Aggiungi al Calendario
            </a>
          </div>
          
          <div className="parking-info">
            <h4>Indicazioni Parcheggio</h4>
            <p>Non ci sono parcheggi dedicati; è possibile parcheggiare con facilità lungo le vie limitrofe alla chiesa.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
