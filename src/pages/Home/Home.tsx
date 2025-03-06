// src/pages/Home/Home.tsx
import React, { useState } from 'react';
import './Home.scss';
import ChatContainer from '../../components/chat/ChatContainer/ChatContainer';

const Home = () => {
  // État pour suivre si nous sommes en mode chat complet (uniquement après envoi d'un message)
  const [chatMode, setChatMode] = useState(false);
  
  // Fonction pour activer le mode chat
  const activateChatMode = () => {
    setChatMode(true);
  };

  return (
    <div className={`home-page ${chatMode ? 'chat-mode' : ''}`}>
      {!chatMode && (
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
      )}
      <ChatContainer onMessageSent={activateChatMode} />
    </div>
  );
};

export default Home;
