import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import { Sidebar } from "../Sidebar";
import "./MainLayout.scss";

// Import des nouvelles icônes
import { PiSidebarSimple } from "react-icons/pi";

const MainLayout: React.FC = () => {
  // État de la Sidebar (ouverte ou fermée)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Basculer l'état de la Sidebar
  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Données fictives pour les conversations
  const conversations = [
    { id: "1", title: "Conversation 1" },
    { id: "2", title: "Conversation 2" },
  ];

  // Données fictives pour les projets
  const projects = [
    { id: "p1", title: "Projet A" },
    { id: "p2", title: "Projet B" },
  ];

  return (
    <div className="main-layout">
      {/* Header */}
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

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
          onSelectProject={(id) =>
            console.log(`Projet sélectionné : ${id}`)
          }
          onRenameConversation={(id, newTitle) =>
            console.log(`Renommage de la conversation ${id} en ${newTitle}`)
          }
          onDeleteConversation={(id) =>
            console.log(`Suppression de la conversation ${id}`)
          }
          onMoveConversation={(id, projectId) =>
            console.log(
              `Déplacement de la conversation ${id} vers le projet ${projectId}`
            )
          }
          onRenameProject={(id, newTitle) =>
            console.log(`Renommage du projet ${id} en ${newTitle}`)
          }
          onDeleteProject={(id) =>
            console.log(`Suppression du projet ${id}`)
          }
          onLogout={() => console.log("Déconnexion effectuée")}
          onToggleSidebar={toggleSidebar}
        />

        {/* Main Content */}
        <main className="main-content" data-testid="main-content">
          <Outlet />
        </main>
      </div>

      {/* Bouton Toggle Sidebar */}
      <button
        className={`sidebar-toggle ${isSidebarOpen ? "open" : ""}`}
        onClick={toggleSidebar}
        title={isSidebarOpen ? "Replier la Sidebar" : "Déplier la Sidebar"}
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? (
          <PiSidebarSimple className="toggle-icon" />
        ) : (
          <PiSidebarSimple className="toggle-icon" />
        )}
      </button>
    </div>
  );
};

export default MainLayout;
