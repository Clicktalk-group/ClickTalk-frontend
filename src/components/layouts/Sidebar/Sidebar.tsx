import React from "react";
import { SidebarProps } from "./Sidebar.types";
import "./Sidebar.scss";
import { FaSignOutAlt, FaComments, FaFolder, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { BiHomeAlt } from "react-icons/bi";

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  conversations,
  projects,
  onNewConversation,
  onNewProject,
  onSelectConversation,
  onSelectProject,
  onRenameProject,
  onDeleteProject,
  onLogout,
  onToggleSidebar,
}) => {
  console.log("Projects in sidebar:", projects); // Debugging
  
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="home-icon-container" onClick={onToggleSidebar}>
          <BiHomeAlt className="home-icon" />
        </div>
      </div>

      <div className="content">
        <div className="section">
          <div className="section-header">
            <FaComments />
            <span className="section-title">Conversations</span>
          </div>
          <button className="add-btn" onClick={onNewConversation}>
            <FaPlus className="add-icon" /> Nouvelle Conversation
          </button>
          <div className="section-list-container">
            <ul className="section-list">
              {conversations.map((item) => (
                <li
                  key={item.id}
                  className="list-item"
                  onClick={() => onSelectConversation(item.id)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="divider" />

        <div className="section">
          <div className="section-header">
            <FaFolder />
            <span className="section-title">Projets</span>
          </div>
          <button className="add-btn" onClick={onNewProject}>
            <FaPlus className="add-icon" /> Nouveau Projet
          </button>
          <div className="section-list-container">
            <ul className="section-list">
              {projects.map((item) => (
                <li
                  key={item.id}
                  className="list-item project-item"
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
                >
                  <FaEdit />
                </button>
                    <button 
                      className="action-btn delete-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Voulez-vous vraiment supprimer le projet "${item.title}" ?`)) {
                          onDeleteProject(item.id);
                        }
                      }}
                      title="Supprimer le projet"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="divider" />
      </div>

      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt className="logout-icon" /> Déconnexion
      </button>
    </div>
  );
};
