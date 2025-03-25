export interface CardProps {
  title?: string; // Titre optionnel
  subtitle?: string; // Sous-titre optionnel
  children: React.ReactNode; // Contenu principal requis
  footer?: React.ReactNode; // Contenu optionnel pour le bas de la carte
  className?: string; // Classes additionnelles pour customisation
  onClick?: React.MouseEventHandler<HTMLDivElement>; // Fonction pour les événements clic
  hover?: boolean; // Active l'état survol dynamique
  icon?: React.ReactNode; // Icône optionnelle dans le header
}
