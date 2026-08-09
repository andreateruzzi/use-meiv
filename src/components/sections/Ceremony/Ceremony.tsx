import { motion } from 'framer-motion';
import './Ceremony.css';

export default function Ceremony() {
  const websiteUrl = window.location.origin + window.location.pathname + '#cerimonia';
  const calendarDetails = `Vi aspettiamo per celebrare il nostro matrimonio!%0A%0ATutte le info sul sito: ${websiteUrl}`;
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Cerimonia+Matrimonio+Mariavittoria+e+Andrea&dates=20261219T100000/20261219T113000&ctz=Europe/Rome&details=${calendarDetails}&location=Chiesa+di+San+Ferdinando,+Via+Ulisse+Gobbi+5,+Milano`;

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
          src="/images/Foto sito/church_sketch.jpg"
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
          <h3>Chiesa San Ferdinando</h3>
          <p className="ceremony-address">Via Ulisse Gobbi 5, Milano</p>
          <p className="ceremony-time">Ore 10:00</p>
          
          <div className="ceremony-actions">
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Chiesa+San+Ferdinando%2C+Via+Ulisse+Gobbi+5%2C+Milano" 
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
