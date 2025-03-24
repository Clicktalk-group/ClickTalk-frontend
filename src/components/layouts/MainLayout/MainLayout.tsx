import React, { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { useConversation } from "../../../hooks/useConversation/useConversation";
import { useProject } from "../../../hooks/useProject/useProject";
import { useAuth } from "../../../hooks/useAuth/useAuth";
import "./MainLayout.scss";

// Lazy loaded components
const ProjectForm = lazy(
  () => import("../../../components/project/ProjectForm/ProjectForm")
);

// Fallback pour le ProjectForm
const FormLoading = () => (
  <div className="form-loading">
    <div className="spinner"></div>
    <p>Chargement du formulaire...</p>
  </div>
);

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const {logout } = useAuth();

  // Utilisation des hooks réels pour les données
  const { conversations, fetchConversations, deleteConversation } =
    useConversation();
  const { projects, fetchProjects, deleteProject,setCurrentConversationId } = useProject();

  // Vérifier si nous sommes sur une page de chat ou de projet
  const isChatPage = location.pathname.includes("/chat");
  const isProjectPage = location.pathname.includes("/project");

  // Extraire les IDs actuels depuis l'URL
  const currentConversationId = isChatPage
    ? location.pathname.split("/").pop()
    : null;
  const currentProjectId = isProjectPage
    ? location.pathname.split("/").pop()
    : null;

  // fetch the projects and conversations when the component mounts
  useEffect(() => {
    fetchProjects();
    fetchConversations();
  }, []);
  
  // Gestionnaires d'événements - Memoized with useCallback
  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  const handleLogout = useCallback(() => {
    logout(); // Utiliser la fonction logout du contexte auth
  }, [logout]);

  const handleNewConversation = useCallback(() => {
    navigate("/chat/new");
    setSidebarOpen(false);
  }, [navigate]);

  const handleNewProject = useCallback(() => {
    setEditingProject(null); // Assurez-vous de ne pas être en mode édition
    setShowProjectForm(true); // Afficher le formulaire de création
  }, []);

  const handleEditProject = useCallback((project: any) => {
    setEditingProject(project);
    setShowProjectForm(true);
  }, []);

  const handleCloseProjectForm = useCallback(() => {
    setShowProjectForm(false);
    setEditingProject(null);
  
  }, []);

  // Gérer la sélection d'une conversation
  const handleSelectConversation = useCallback(
    (id: string | number) => {
      // Si l'ID est une chaîne, convertissez-la en nombre
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      navigate(`/chat/${numericId}`);
      setSidebarOpen(false);
    },
    [navigate]
  );

  // Gérer la sélection d'un projet
  const handleSelectProject = useCallback(
    (id: string | number) => {
      // Si l'ID est une chaîne, convertissez-la en nombre
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;

      // Navigation directe
      setCurrentConversationId(null); // Réinitialiser l'ID de conversation actuelle
      navigate(`/project/${numericId}`);
      setSidebarOpen(false);
    },
    [navigate]
  );

  // Gérer la suppression d'une conversation
  const handleDeleteConversation = useCallback(
    (id: string | number) => {
      // Convertir en numérique si nécessaire
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;

      deleteConversation(numericId);

      // Si nous sommes sur la page de la conversation supprimée, rediriger vers /chat
      const currentConversationId = location.pathname.split("/").pop();
      if (currentConversationId === String(numericId)) {
        navigate("/chat/new");
      }
    },
    [deleteConversation, navigate, location.pathname]
  );

  // Gérer le renommage d'une conversation
  const handleRenameConversation = useCallback(
    (id: string | number, newTitle: string) => {
      // todo: Implémenter la logique de renommage
    },
    []
  );

  const handleDeleteProject = useCallback(
    (id: string | number) => {
      // Convertir en numérique si nécessaire
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;

      deleteProject(numericId);

      // Si nous sommes sur la page du projet supprimé, rediriger
      const currentProjectId = location.pathname.split("/").pop();
      if (currentProjectId === String(numericId)) {
        navigate("/projects");
      }
    },
    [deleteProject, navigate, location.pathname]
  );

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Fonction fictive pour gérer le déplacement de conversation (non implémentée)
  const handleMoveConversation = useCallback(
    (id: string, projectId: string) => {
      // Implémentation réelle à faire
    },
    []
  );

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
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        onMoveConversation={handleMoveConversation}
        onRenameProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        onLogout={handleLogout}
        onToggleSidebar={handleToggleSidebar}
        selectedConversationId={currentConversationId}
        selectedProjectId={currentProjectId}
      />

      <div className="layout-container">
        <Header
          isSidebarOpen={sidebarOpen}
          toggleSidebar={handleToggleSidebar}
        />
        {isChatPage || isProjectPage ? (
          <div className="main-content full-height">{children}</div>
        ) : (
          <div className="main-content">{children}</div>
        )}
      </div>

      {/* Modal pour la création/édition de projet - lazy loaded */}
      {showProjectForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <Suspense fallback={<FormLoading />}>
              <ProjectForm
                onClose={handleCloseProjectForm}
                initialData={editingProject}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MainLayout);
