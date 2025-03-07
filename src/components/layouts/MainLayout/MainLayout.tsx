import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { useConversation } from "../../../hooks/useConversation/useConversation";
import { useProject } from "../../../hooks/useProject/useProject";
import { useAuth } from "../../../hooks/useAuth/useAuth";
import ProjectForm from "../../../components/project/ProjectForm/ProjectForm";
import "./MainLayout.scss";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Utilisation des hooks réels pour les données
  const { conversations, fetchConversationById } = useConversation();
  const { projects, fetchProjects, deleteProject } = useProject();
  
  // Charger les projets au début
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  // Vérifier si nous sommes sur une page de chat ou de projet
  const isChatPage = location.pathname.includes('/chat');
  const isProjectPage = location.pathname.includes('/project');
  
  // Gestionnaires d'événements
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = () => {
    console.log("Déconnexion");
    // Logique de déconnexion à implémenter
  };
  
  const handleNewConversation = useCallback(() => {
    console.log("Nouvelle conversation");
    navigate('/chat/new');
    setSidebarOpen(false);
  }, [navigate]);
  
  const handleNewProject = useCallback(() => {
    console.log("Nouveau projet");
    setEditingProject(null); // Assurez-vous de ne pas être en mode édition
    setShowProjectForm(true); // Afficher le formulaire de création
  }, []);
  
  const handleEditProject = useCallback((project: any) => {
    console.log("Édition du projet", project);
    setEditingProject(project);
    setShowProjectForm(true);
  }, []);
  
  const handleCloseProjectForm = useCallback(() => {
    setShowProjectForm(false);
    setEditingProject(null);
    // Rafraîchir les projets après la fermeture du formulaire
    fetchProjects();
  }, [fetchProjects]);
  
  // Gérer la sélection d'une conversation
  const handleSelectConversation = useCallback((id: string | number) => {
    console.log(`Sélection conversation ${id}`);
    // Si l'ID est une chaîne, convertissez-la en nombre
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    fetchConversationById(numericId);
    navigate(`/chat/${numericId}`);
    setSidebarOpen(false);
  }, [fetchConversationById, navigate]);
  
  // Gérer la sélection d'un projet
  const handleSelectProject = useCallback((id: string | number) => {
    console.log(`Sélection projet ${id}`, typeof id);
    
    // Si l'ID est une chaîne, convertissez-la en nombre
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    // Debug supplémentaire
    console.log("Projects available:", projects);
    
    // Navigation directe
    navigate(`/project/${numericId}`);
    setSidebarOpen(false);
  }, [navigate, projects]);
  
  const handleDeleteProject = useCallback((id: string | number) => {
    // Convertir en numérique si nécessaire
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    console.log(`Suppression du projet ${numericId}`);
    
    deleteProject(numericId)
      .then(() => {
        console.log(`Projet ${numericId} supprimé avec succès`);
        fetchProjects(); // Rafraîchir la liste après suppression
      })
      .catch(error => {
        console.error(`Erreur lors de la suppression du projet ${numericId}`, error);
      });
  }, [deleteProject, fetchProjects]);
  
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Log pour debug
  console.log("Rendered MainLayout with projects:", projects);
  console.log("User ID from auth:", user?.id);
  
  return (
    <div className="main-layout">
      <div 
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} 
        onClick={handleCloseSidebar}
      />
      
      <Sidebar
        isOpen={sidebarOpen}
        conversations={conversations || []}
        projects={projects || []}
        onNewConversation={handleNewConversation}
        onNewProject={handleNewProject}
        onSelectConversation={handleSelectConversation}
        onSelectProject={handleSelectProject}
        onRenameConversation={() => {}}
        onDeleteConversation={() => {}}
        onMoveConversation={() => {}}
        onRenameProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        onLogout={handleLogout}
        onToggleSidebar={handleToggleSidebar}
      />
      
      <div className="layout-container">
        <Header 
          isSidebarOpen={sidebarOpen} 
          toggleSidebar={handleToggleSidebar} 
        />
        {isChatPage || isProjectPage ? (
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
      
      {/* Modal pour la création/édition de projet */}
      {showProjectForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <ProjectForm 
              onClose={handleCloseProjectForm} 
              userId={user?.id || 0} 
              initialData={editingProject}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
