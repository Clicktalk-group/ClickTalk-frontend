export interface ModalProps {
  isOpen: boolean; // Contrôle l'ouverture/fermeture du modal
  onClose: () => void; // Fonction de fermeture (ex. clic hors modal ou Escape)
  title?: string; // Titre affiché au-dessus du modal
  children: React.ReactNode; // Contenu principal du modal
  size?: 'sm' | 'md' | 'lg'; // Taille du modal : sm (small), md (medium), lg (large)
  className?: string; // Classes additionnelles pour personnalisation
}
