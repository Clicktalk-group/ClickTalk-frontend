// src/components/layouts/MainLayout/MainLayout.tsx

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import { Sidebar } from "../Sidebar";

// Composant MainLayout
const MainLayout: React.FC = () => {
  // Données fictives pour tester les "Conversations" et les "Projets"
  const conversations = [
    { id: "1", title: "Conversation 1" },
    { id: "2", title: "Conversation 2" },
  ];

  const projects = [
    { id: "p1", title: "Projet A" },
    { id: "p2", title: "Projet B" },
  ];

  // Gestionnaires de fonctions minimaux (implémentations mockées)
  const handleNoop = () => {
    console.log("Action non implémentée."); // Fonction qui ne fait rien.
  };

  const handleNoopWithId = (id: string) => {
    console.log(`Action avec ID ${id} non implémentée.`);
  };

  const handleNoopWithIdAndTitle = (id: string, newTitle: string) => {
    console.log(
      `Action avec ID ${id} et titre "${newTitle}" non implémentée.`
    );
  };

  const handleNoopWithTwoIds = (id: string, projectId: string) => {
    console.log(
      `Action avec ID ${id} déplacé dans projet avec ID ${projectId}, non implémentée.`
    );
  };

  return (
    <div className="main-layout">
      {/* Header (barre de navigation ou titre principal) */}
      <Header />

      <div className="main-content">
        {/* Sidebar (menu latéral) avec des props passées */}
        <Sidebar
          conversations={conversations} // Liste de conversations
          projects={projects}           // Liste de projets

          /* Gestionnaires pour interactions */
          onNewConversation={() => console.log("Nouvelle conversation créée")}
          onNewProject={() => console.log("Nouveau projet créé")}
          onSelectConversation={handleNoopWithId}
          onSelectProject={handleNoopWithId}
          onRenameConversation={handleNoopWithIdAndTitle}
          onDeleteConversation={handleNoopWithId}
          onMoveConversation={handleNoopWithTwoIds}
          onRenameProject={handleNoopWithIdAndTitle}
          onDeleteProject={handleNoopWithId}
          onLogout={handleNoop} // Gérer une déconnexion
        />

        {/* Zone principale pour afficher les sous-composants */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
