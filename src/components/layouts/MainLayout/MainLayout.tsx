import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import { Sidebar } from "../Sidebar";
import "./MainLayout.scss";

// Import d'icônes
import { PiSidebarSimple } from "react-icons/pi";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const conversations = [
    { id: "1", title: "Conversation 1" },
    { id: "2", title: "Conversation 2" },
  ];
  const projects = [
    { id: "p1", title: "Projet A" },
    { id: "p2", title: "Projet B" },
  ];

  return (
    <div className="main-layout">
      {/* Header */}
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={isSidebarOpen ? closeSidebar : openSidebar}
      />

      {/* Conteneur principal */}
      <div
        className={`layout-container ${isSidebarOpen ? "sidebar-open" : ""}`}
        data-testid="layout-container"
      >
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          conversations={conversations}
          projects={projects}
          onNewConversation={() => console.log("Nouvelle conversation ajoutée")}
          onNewProject={() => console.log("Nouveau projet créé")}
          onSelectConversation={(id) =>
            console.log(`Conversation sélectionnée : ${id}`)
          }
          onSelectProject={(id) => console.log(`Projet sélectionné : ${id}`)}
          onLogout={() => console.log("Déconnexion effectuée")}
          onToggleSidebar={closeSidebar}
          onRenameConversation={(id) => console.log(`Conversation renommée : ${id}`)}
          onDeleteConversation={(id) => console.log(`Conversation supprimée : ${id}`)}
          onMoveConversation={(id) => console.log(`Conversation déplacée : ${id}`)}
          onRenameProject={(id) => console.log(`Projet renommé : ${id}`)}
          onDeleteProject={(id) => console.log(`Projet supprimé : ${id}`)}
        />

        {/* Contenu principal */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Icône d'ouverture/fermeture de la Sidebar */}
      {isSidebarOpen ? (
        <button
          className="toggle-sidebar close"
          onClick={closeSidebar}
          aria-label="Fermer la Sidebar"
        >
          <PiSidebarSimple />
        </button>
      ) : (
        <button
          className="toggle-sidebar open"
          onClick={openSidebar}
          aria-label="Ouvrir la Sidebar"
        >
          <PiSidebarSimple />
        </button>
      )}
    </div>
  );
};

export default MainLayout;
