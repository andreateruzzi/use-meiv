import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Registry from '../../components/sections/Registry/Registry';
import './RegistryPage.css';

export default function RegistryPage() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="registry-page-wrapper"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <motion.div 
        className="registry-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="btn-back-home" onClick={() => navigate('/')}>
          ← Torna alla Home
        </button>
      </motion.div>
      
      {/* Utilizziamo il componente Registry esistente */}
      <Registry />
    </motion.div>
  );
}
