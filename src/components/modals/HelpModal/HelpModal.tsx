// src/components/modals/HelpModal.tsx
import React, { memo, useMemo } from 'react';
import './HelpModal.scss';

interface HelpModalContentProps {
  onClose: () => void;
}

// Composant de section d'aide réutilisable
const HelpSection = memo(({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode 
}) => (
  <>
    <h4>{title}</h4>
    {children}
  </>
));

HelpSection.displayName = 'HelpSection';

const HelpModalContent: React.FC<HelpModalContentProps> = memo(({ onClose }) => {
  // Contenu mémorisé pour éviter les recréations inutiles
  const helpContent = useMemo(() => [
    {
      id: 'features',
      title: 'Fonctionnalités principales',
      content: (
        <ul>
          <li><strong>Conversations</strong> - Discutez avec notre IA et obtenez des réponses instantanées</li>
          <li><strong>Projects</strong> - Organisez vos conversations par projets avec des instructions spécifiques</li>
          <li><strong>Personnalisation</strong> - Adaptez l'apparence de l'application selon vos préférences</li>
        </ul>
      )
    },
    {
      id: 'howto',
      title: 'Comment utiliser ClickTalk',
      content: (
        <ol>
          <li>Créez un nouveau projet ou sélectionnez un projet existant</li>
          <li>Commencez à discuter avec ClickTalk en tapant vos questions</li>
          <li>Explorez les options de personnalisation dans les paramètres</li>
        </ol>
      )
    }
  ], []);

  return (
    <div className="help-modal-content">
      <h3>Bienvenue dans l'aide de ClickTalk</h3>
      <p>
        ClickTalk est un chatbot intelligent utilisant le Machine Learning pour interagir avec vous et répondre à vos questions. Voici quelques informations pour vous aider à tirer le meilleur parti de ClickTalk.
      </p>
      
      {helpContent.map(section => (
        <HelpSection key={section.id} title={section.title}>
          {section.content}
        </HelpSection>
      ))}
      
      <div className="button-group">
        <button 
          className="close-button" 
          onClick={onClose}
          aria-label="Fermer l'aide"
        >
          Fermer
        </button>
      </div>
    </div>
  );
});

HelpModalContent.displayName = 'HelpModalContent';

export default HelpModalContent;
