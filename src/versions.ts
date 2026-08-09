export type Variant = 'completo' | 'messa';

export interface Version {
  path: string;
  variant: Variant;
  /** Content scope, e.g. "Completo" */
  scope: string;
  /** Short descriptor shown on the landing cards */
  blurb: string;
  /** What this version includes */
  features: string[];
}

export const VERSIONS: Version[] = [
  {
    path: '/completo',
    variant: 'completo',
    scope: 'Completo',
    blurb:
      'La cerimonia in chiesa, il ricevimento al Castello Visconteo e la conferma di presenza.',
    features: ['Cerimonia', 'Ricevimento', 'Regalo', 'Conferma presenza'],
  },
  {
    path: '/messa',
    variant: 'messa',
    scope: 'Solo Messa',
    blurb: 'Solo la cerimonia in chiesa, senza ricevimento.',
    features: ['Cerimonia', 'Regalo'],
  },
];
