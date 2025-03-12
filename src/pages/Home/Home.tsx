// src/pages/Home/Home.tsx
import React, { useState, useCallback, useMemo } from 'react';
import './Home.scss';
import ChatContainer from '../../components/chat/ChatContainer/ChatContainer';

const Home: React.FC = () => {
  // État pour suivre si nous sommes en mode chat complet (uniquement après envoi d'un message)
  const [chatMode, setChatMode] = useState(false);
  
  // Utilisation de useCallback pour optimiser la fonction
  const activateChatMode = useCallback(() => {
    console.log('Activating chat mode');
    // Utilisation d'une fonction d'état pour être sûr d'avoir la valeur la plus récente
    setChatMode(true);
  }, []);

  // Mémoïsation des éléments de l'introduction pour éviter les recreations inutiles
  const introContent = useMemo(() => {
    if (chatMode) return null;
    
    return (
      <>
        <h1>Bienvenue sur ClickTalk</h1>
        <p>Votre plateforme de conversation intelligente.</p>

        <div className="quick-actions">
          <h2>Actions rapides</h2>
          <ul>
            <li>Créer un nouveau projet</li>
            <li>Configurer vos préférences</li>
          </ul>
        </div>
      </>
    );
  }, [chatMode]);

  // Classe CSS optimisée avec useMemo pour éviter les recalculs inutiles
  const pageClassName = useMemo(() => 
    `home-page ${chatMode ? 'chat-mode' : ''}`,
    [chatMode]
  );

  console.log('Rendering Home page, chat mode:', chatMode);

  return (
    <div className={pageClassName}>
      {introContent}
      <ChatContainer onMessageSent={activateChatMode} />
    </div>
  );
};

export default React.memo(Home);
