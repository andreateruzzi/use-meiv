import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import VerticalLayout from './components/VerticalLayout/VerticalLayout';
import { Analytics } from '@vercel/analytics/react';
import Admin from './pages/Admin/Admin';
import RegistryPage from './pages/RegistryPage/RegistryPage';
import Tentative from './pages/Tentative/Tentative';
import './App.css';

function App() {
  const location = useLocation();
  // Controlliamo l'hostname per capire da quale dominio arriva l'utente
  const hostname = window.location.hostname;
  
  // Se l'utente usa il dominio per sola cerimonia
  const isCerimonia = hostname.includes('mariaelorenzo.click');

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Mostriamo la versione messa solo se esplicitamente su mariaelorenzo.click */}
          {isCerimonia ? (
            <Route path="/" element={<VerticalLayout variant="messa" />} />
          ) : (
            <Route path="/" element={<VerticalLayout variant="completo" />} />
          )}

          {/* Manteniamo le rotte esplicite se qualcuno ci naviga direttamente */}
          <Route path="/completo" element={<VerticalLayout variant="completo" />} />
          <Route path="/messa" element={<VerticalLayout variant="messa" />} />
          
          {/* Lista Nozze separata */}
          <Route path="/lista-nozze" element={<RegistryPage />} />
          
          {/* Rotta Admin Segreta */}
          <Route path="/admin" element={<Admin />} />

          {/* Proposta di design nascosta */}
          <Route path="/tentative" element={<Tentative />} />
        </Routes>
      </AnimatePresence>
      <Analytics />
    </>
  );
}

export default App;
