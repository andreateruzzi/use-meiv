import Cover from '../sections/Cover/Cover';
import Quote from '../sections/Quote/Quote';
import Ceremony from '../sections/Ceremony/Ceremony';
import Reception from '../sections/Reception/Reception';
import RegistryLink from '../sections/RegistryLink/RegistryLink';
import Rsvp from '../sections/Rsvp/Rsvp';
import Gallery from '../sections/Gallery/Gallery';
import type { Variant } from '../../versions';
import { motion } from 'framer-motion';
import './VerticalLayout.css';

interface VerticalLayoutProps {
  variant: Variant;
}

export default function VerticalLayout({ variant }: VerticalLayoutProps) {
  return (
    <motion.div 
      className="vertical-wrapper"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Cover variant={variant} />
      <Quote />
      <Ceremony />
      {variant === 'completo' && <Reception />}
      <RegistryLink />
      {variant === 'completo' && <Rsvp />}
      <Gallery />
    </motion.div>
  );
}
