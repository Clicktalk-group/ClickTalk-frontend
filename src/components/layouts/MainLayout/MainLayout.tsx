// src/components/layouts/MainLayout/MainLayout.tsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./MainLayout.scss";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Vérifier si nous sommes sur une page de chat
  const isChatPage = location.pathname.includes('/chat');
  
  // Données simulées pour la Sidebar
  const mockConversations = [
    { id: "1", title: "Conversation 1" },
    { id: "2", title: "Conversation 2" },
  ];
  
  const mockProjects = [
    { id: "a", title: "Projet A" },
    { id: "b", title: "Projet B" },
  ];
  
  // Gestionnaires d'événements
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = () => {
    console.log("Déconnexion");
    // Logique de déconnexion à implémenter
  };
  
  const handleNewConversation = () => {
    console.log("Nouvelle conversation");
  };
  
  const handleNewProject = () => {
    console.log("Nouveau projet");
  };
  
  const handleSelectConversation = (id: string) => {
    console.log(`Sélection conversation ${id}`);
  };
  
  const handleSelectProject = (id: string) => {
    console.log(`Sélection projet ${id}`);
  };
  
  // Fermer la sidebar en cliquant sur l'overlay (mobile)
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <div className="main-layout">
      {/* Overlay pour fermer la sidebar sur mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} 
        onClick={handleCloseSidebar}
      />
      
      <Sidebar
        isOpen={sidebarOpen}
        conversations={mockConversations}
        projects={mockProjects}
        onNewConversation={handleNewConversation}
        onNewProject={handleNewProject}
        onSelectConversation={handleSelectConversation}
        onSelectProject={handleSelectProject}
        onRenameConversation={() => {}}
        onDeleteConversation={() => {}}
        onMoveConversation={() => {}}
        onRenameProject={() => {}}
        onDeleteProject={() => {}}
        onLogout={handleLogout}
        onToggleSidebar={handleToggleSidebar}
      />
      
      <div className="layout-container">
        <Header 
          isSidebarOpen={sidebarOpen} 
          toggleSidebar={handleToggleSidebar} 
        />
        {/* Ne pas afficher le chat fixe si on est déjà sur une page de chat */}
        {isChatPage ? (
          <div className="main-content full-height">
            {children}
          </div>
        ) : (
          <>
            <div className="main-content">
              {children}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
