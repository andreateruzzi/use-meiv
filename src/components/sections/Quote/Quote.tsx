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
            Immaginate di essere una casa, una casa vivente; e viene Dio a ricostruirla. Dapprima, forse, capite quel che sta facendo. Aggiusta le tubature, ripara le crepe nel tetto e così via: sono lavori che andavano fatti; lo sapevate, e non siete sorpresi. Ma ecco che egli comincia a mettere la casa sottosopra, a sconquassarla in modo orripilante […]. Dove diamine vuole andare a parare? La spiegazione è che Egli sta costruendo una casa tutta diversa da quella che avevate in mente voi: creando qui un’ala nuova, là aggiungendo un piano, innalzando torri, aprendo cortili. Pensavate di diventare una casetta ammodo: ma lui sta costruendo un palazzo. Intende venirci a vivere Lui stesso
          </p>
          <footer>— C.S. Lewis</footer>
        </blockquote>
      </motion.div>
    </div>
  );
}
