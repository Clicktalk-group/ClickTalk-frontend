// src/pages/Chat/Chat.tsx
import React from 'react';
import ChatContainer from '../../components/chat/ChatContainer/ChatContainer';
import './Chat.scss';

const Chat: React.FC = () => {
  return (
    <div className="chat-page">
      <ChatContainer />
    </div>
  );
};

export default Chat;
