// src/components/modals/HelpModal.tsx
import React from 'react';
import './HelpModal.scss';

interface HelpModalContentProps {
  onClose: () => void;
}

const HelpModalContent: React.FC<HelpModalContentProps> = ({ onClose }) => {
  return (
    <div className="help-modal-content">
      <h3>Bienvenue dans l'aide de ClickTalk</h3>
      <p>
        ClickTalk est un chatbot intelligent utilisant le Machine Learning pour interagir avec vous et répondre à vos questions. Voici quelques informations pour vous aider à tirer le meilleur parti de ClickTalk.
      </p>
      
      <h4>Fonctionnalités principales</h4>
      <ul>
        <li><strong>Conversations</strong> - Discutez avec notre IA et obtenez des réponses instantanées</li>
        <li><strong>Projects</strong> - Organisez vos conversations par projets avec des instructions spécifiques</li>
        <li><strong>Personnalisation</strong> - Adaptez l'apparence de l'application selon vos préférences</li>
      </ul>
      
      <h4>Comment utiliser ClickTalk</h4>
      <ol>
        <li>Créez un nouveau projet ou sélectionnez un projet existant</li>
        <li>Commencez à discuter avec ClickTalk en tapant vos questions</li>
        <li>Explorez les options de personnalisation dans les paramètres</li>
      </ol>
      
      <div className="button-group">
        <button className="close-button" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
};

export default HelpModalContent;