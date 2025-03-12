// src/pages/Chat/Chat.tsx
import React, { memo } from 'react';
import ChatContainer from '../../components/chat/ChatContainer/ChatContainer';
import './Chat.scss';

// Utilisation de React.memo pour éviter les rendus inutiles
const Chat: React.FC = memo(() => {
  // Pas d'état ou de logique complexe ici, ce qui fait de ce composant
  // un bon candidat pour la mémoïsation directe

  console.log('Rendering Chat page');
  
  return (
    <div className="chat-page">
      <ChatContainer />
    </div>
  );
});

// Ajout d'un displayName pour faciliter le débogage
Chat.displayName = 'ChatPage';

export default Chat;
