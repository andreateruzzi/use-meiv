import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Tentative.css';

/**
 * /tentative — proposta di design nascosta.
 * Concept: la citazione di C.S. Lewis parla di una casa che viene
 * ricostruita in palazzo. Il sito diventa quindi un "dossier di
 * cantiere": tipografia architettonica, filetti sottili, schede
 * numerate. Minimale, monocromo, editoriale.
 */

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Tentative() {
  return (
    <div className="tnt">
      {/* header minimale fisso */}
      <header className="tnt-topbar">
        <span className="tnt-mark">M·A</span>
        <span className="tnt-topdate">07.11.2026</span>
      </header>

      {/* ------ Atto I — monumento tipografico ------ */}
      <section className="tnt-hero">
        <motion.p
          className="tnt-eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          Una casa in costruzione
        </motion.p>
        <motion.h1
          className="tnt-names"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Mariavittoria
          <span className="tnt-amp">&amp;</span>
          Andrea
        </motion.h1>
        <motion.div
          className="tnt-hero-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <span>Milano</span>
          <span className="tnt-rule" aria-hidden />
          <span>19 Dicembre 2026</span>
        </motion.div>
      </section>

      {/* ------ Atto II — la citazione ------ */}
      <section className="tnt-quote">
        <motion.span className="tnt-quote-mark" {...fadeUp} aria-hidden>
          “
        </motion.span>
        <motion.blockquote {...fadeUp}>
          <p>
            a mela pena ti vediamo tu sei il sardo di milnao con la motot con tre ruote e la tessera d'azione in quel giorno maledetto sei arrivato col traghetto ora sali sul barcone ti rispedimao a guamaggiore
          </p>
          <footer>— Ciccio Pasticcio</footer>
        </motion.blockquote>
      </section>

      {/* ------ Atto III — scheda di progetto ------ */}
      <section className="tnt-dossier">
        <motion.h2 className="tnt-dossier-title" {...fadeUp}>
          Il progetto
        </motion.h2>

        <motion.div className="tnt-row" {...fadeUp}>
          <span className="tnt-num">01</span>
          <div className="tnt-row-body">
            <h3>Cerimonia</h3>
            <p>
              Chiesa San Ferdinando
              <br />
              Via Ulisse Gobbi 5, Milano — ore 10:00
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Chiesa+San+Ferdinando%2C+Via+Ulisse+Gobbi+5%2C+Milano"
              target="_blank"
              rel="noreferrer"
            >
              Indicazioni ↗
            </a>
          </div>
        </motion.div>

        <motion.div className="tnt-row" {...fadeUp}>
          <span className="tnt-num">02</span>
          <div className="tnt-row-body">
            <h3>Ricevimento</h3>
            <p>
              Villa Esengrini Montalbano
              <br />
              Via degli Alpini 5, Varese (Ore 12:00)
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Villa+Esengrini+Montalbano%2C+Via+degli+Alpini+5%2C+Varese"
              target="_blank"
              rel="noreferrer"
            >
              Indicazioni ↗
            </a>
          </div>
        </motion.div>

        <motion.div className="tnt-row" {...fadeUp}>
          <span className="tnt-num">03</span>
          <div className="tnt-row-body">
            <h3>Regalo</h3>
            <p>
              Per chi volesse regalare un cuscino, un pezzo di tetto
              <br />
              o un tratto di strada verso lo Sri Lanka e le Maldive.
            </p>
            <Link to="/lista-nozze">La lista ↗</Link>
          </div>
        </motion.div>

        <motion.div className="tnt-row" {...fadeUp}>
          <span className="tnt-num">04</span>
          <div className="tnt-row-body">
            <h3>Presenza</h3>
            <p>
              Ogni palazzo ha bisogno dei suoi ospiti:
              <br />
              fateci sapere se ci sarete.
            </p>
            <Link to="/#rsvp">Conferma ↗</Link>
          </div>
        </motion.div>
      </section>

      {/* ------ chiusura ------ */}
      <footer className="tnt-footer">
        <motion.div {...fadeUp}>
          <span className="tnt-footer-rule" aria-hidden />
          <p className="tnt-footer-names">Mariavittoria &amp; Andrea</p>
          <p className="tnt-footer-note">cantiere aperto dal 7 · 11 · 2026</p>
        </motion.div>
      </footer>
    </div>
  );
}
