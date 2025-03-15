import React, { memo, useCallback, useState } from "react";
import { SidebarProps } from "./Sidebar.types";
import "./Sidebar.scss";
import { FaSignOutAlt, FaComments, FaFolder, FaPlus, FaEdit, FaTrash, FaChevronLeft } from "react-icons/fa";

export const Sidebar: React.FC<SidebarProps> = memo(({
  isOpen,
  conversations,
  projects,
  onNewConversation,
  onNewProject,
  onSelectConversation,
  onSelectProject,
  onRenameConversation = () => {}, // Valeur par défaut pour éviter les erreurs
  onDeleteConversation = () => {}, // Valeur par défaut pour éviter les erreurs
  onRenameProject,
  onDeleteProject,
  onLogout,
  onToggleSidebar,
  selectedConversationId = null,
  selectedProjectId = null,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  console.log("Sidebar props - selected conversation:", selectedConversationId, "selected project:", selectedProjectId);
  
  // Gestionnaire pour la suppression de conversation
  const handleDeleteConversation = useCallback((e: React.MouseEvent, itemId: number | string, itemTitle: string) => {
    e.stopPropagation();

    // Éviter le traitement multiple
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      if (window.confirm(`Voulez-vous vraiment supprimer la conversation "${itemTitle}" ?`)) {
        // Conversion de l'ID en string pour assurer la compatibilité
        const stringId = String(itemId);
        
        // Appel de la fonction avec un délai minimal pour permettre à l'UI de se mettre à jour
        setTimeout(() => {
          onDeleteConversation(stringId);
          setIsProcessing(false);
        }, 10);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la conversation:", error);
      setIsProcessing(false);
    }
  }, [onDeleteConversation, isProcessing]);

  // Gestionnaire pour le renommage de conversation
  const handleRenameConversation = useCallback((e: React.MouseEvent, itemId: number | string, currentTitle: string) => {
    e.stopPropagation();
    
    // Éviter le traitement multiple
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      const newTitle = window.prompt("Entrez le nouveau nom de la conversation :", currentTitle);
      
      if (newTitle && newTitle.trim() !== "" && newTitle !== currentTitle) {
        // Conversion de l'ID en string pour assurer la compatibilité
        const stringId = String(itemId);
        
        // Appel de la fonction avec un délai minimal pour permettre à l'UI de se mettre à jour
        setTimeout(() => {
          onRenameConversation(stringId, newTitle.trim());
          setIsProcessing(false);
        }, 10);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Erreur lors du renommage de la conversation:", error);
      setIsProcessing(false);
    }
  }, [onRenameConversation, isProcessing]);
  
  const renderConversationItem = useCallback((item: any) => {
    // Vérifier si cette conversation est actuellement sélectionnée
    const isActive = selectedConversationId !== null && 
                     String(selectedConversationId) === String(item.id);
    
    return (
      <li
        key={item.id}
        className={`list-item conversation-item ${isActive ? 'active' : ''}`}
        data-conversation-id={item.id}
      >
        <span 
          className="conversation-title" 
          onClick={() => onSelectConversation(item.id)}
        >
          {item.title}
        </span>
        <div className="conversation-actions">
          <button 
            className="action-btn edit-btn" 
            onClick={(e) => handleRenameConversation(e, item.id, item.title)}
            title="Modifier la conversation"
            disabled={isProcessing}
          >
            <FaEdit />
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={(e) => handleDeleteConversation(e, item.id, item.title)}
            title="Supprimer la conversation"
            disabled={isProcessing}
          >
            <FaTrash />
          </button>
        </div>
      </li>
    );
  }, [onSelectConversation, handleRenameConversation, handleDeleteConversation, isProcessing, selectedConversationId]);

  const handleDeleteProject = useCallback((e: React.MouseEvent, itemId: number | string, itemTitle: string) => {
    e.stopPropagation();
    
    // Éviter le traitement multiple
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      if (window.confirm(`Voulez-vous vraiment supprimer le projet "${itemTitle}" ?`)) {
        // Conversion de l'ID en string pour assurer la compatibilité
        const stringId = String(itemId);
        
        // Appel de la fonction avec un délai minimal pour permettre à l'UI de se mettre à jour
        setTimeout(() => {
          onDeleteProject(stringId);
          setIsProcessing(false);
        }, 10);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du projet:", error);
      setIsProcessing(false);
    }
  }, [onDeleteProject, isProcessing]);
  
  const renderProjectItem = useCallback((item: any) => {
    // Vérifier si ce projet est actuellement sélectionné
    const isActive = selectedProjectId !== null && 
                     String(selectedProjectId) === String(item.id);
                     
    return (
      <li
        key={item.id}
        className={`list-item project-item ${isActive ? 'active' : ''}`}
        data-project-id={item.id}
      >
        <span 
          className="project-title" 
          onClick={() => onSelectProject(item.id)}
        >
          {item.title}
        </span>
        <div className="project-actions">
          <button 
            className="action-btn edit-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onRenameProject(item);
            }}
            title="Modifier le projet"
            disabled={isProcessing}
          >
            <FaEdit />
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={(e) => handleDeleteProject(e, item.id, item.title)}
            title="Supprimer le projet"
            disabled={isProcessing}
          >
            <FaTrash />
          </button>
        </div>
      </li>
    );
  }, [onSelectProject, onRenameProject, handleDeleteProject, isProcessing, selectedProjectId]);
  
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`} role="complementary">
      <div className="sidebar-header">
        <div className="home-icon-container" onClick={onToggleSidebar}>
          <FaChevronLeft className="home-icon" />
        </div>
      </div>

      <div className="content">
        <div className="section">
          <div className="section-header">
            <FaComments />
            <span className="section-title">Conversations</span>
          </div>
          <button 
            className="add-btn" 
            onClick={onNewConversation} 
            disabled={isProcessing}
          >
            <FaPlus className="add-icon" /> Nouvelle Conversation
          </button>
          <div className="section-list-container">
            <ul className="section-list">
              {conversations.map(renderConversationItem)}
            </ul>
          </div>
        </div>

        <hr className="divider" />

        <div className="section">
          <div className="section-header">
            <FaFolder />
            <span className="section-title">Projets</span>
          </div>
          <button 
            className="add-btn" 
            onClick={onNewProject}
            disabled={isProcessing}
          >
            <FaPlus className="add-icon" /> Nouveau Projet
          </button>
          <div className="section-list-container">
            <ul className="section-list">
              {projects.map(renderProjectItem)}
            </ul>
          </div>
        </div>

        <hr className="divider" />
      </div>

      <button 
        className="logout-btn" 
        onClick={onLogout}
        disabled={isProcessing}
      >
        <FaSignOutAlt className="logout-icon" /> Déconnexion
      </button>
    </div>
  );
});
