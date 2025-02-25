import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import { Sidebar } from "../Sidebar";
import "./MainLayout.scss";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

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
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`layout-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
        {/* Sidebar */}
        <Sidebar
  isOpen={isSidebarOpen}
  conversations={conversations}
  projects={projects}
  onNewConversation={() => console.log("Nouvelle conversation ajoutée")}
  onNewProject={() => console.log("Nouveau projet créé")}
  onSelectConversation={(id) => console.log(`Conversation sélectionnée : ${id}`)}
  onSelectProject={(id) => console.log(`Projet sélectionné : ${id}`)}
  onRenameConversation={(id, newTitle) =>
    console.log(`Renommage de la conversation ${id} en ${newTitle}`)
  }
  onDeleteConversation={(id) =>
    console.log(`Suppression conversation avec l'ID ${id}`)
  }
  onMoveConversation={(id, projectId) =>
    console.log(`Déplacement de la conversation ${id} vers le projet ${projectId}`)
  }
  onRenameProject={(id, newTitle) =>
    console.log(`Renommage du projet ${id} en ${newTitle}`)
  }
  onDeleteProject={(id) => console.log(`Projet avec l'ID ${id} supprimé`)}
  onLogout={() => console.log("Déconnexion effectuée")}
/>
        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
