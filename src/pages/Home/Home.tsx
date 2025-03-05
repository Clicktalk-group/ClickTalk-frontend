// src/pages/Home/Home.tsx
import React from 'react';
import './Home.scss';

const Home = () => {
  return (
    <div className="home-page">
      <h1>Bienvenue sur ClickTalk</h1>
      <p>Votre plateforme de conversation intelligente.</p>
      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <ul>
          <li>Démarrer une nouvelle conversation</li>
          <li>Créer un nouveau projet</li>
          <li>Configurer vos préférences</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
