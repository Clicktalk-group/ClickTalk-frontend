import React from "react";
import { SidebarProps } from "./Sidebar.types";
import "./Sidebar.scss";
import { FaSignOutAlt, FaComments, FaFolder, FaPlus } from "react-icons/fa";
import { BiHomeAlt } from "react-icons/bi";

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  conversations,
  projects,
  onNewConversation,
  onNewProject,
  onSelectConversation,
  onSelectProject,
  onLogout,
  onToggleSidebar,
}) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Icône home en haut de la sidebar - ferme la sidebar lorsqu'elle est cliquée */}
      <div className="sidebar-header">
        <div className="home-icon-container" onClick={onToggleSidebar}>
          <BiHomeAlt className="home-icon" />
        </div>
      </div>

      {/* Contenu de la sidebar */}
      <div className="content">
        {/* Conversations Section */}
        <div className="section">
          <div className="section-header">
            <FaComments />
            <span className="section-title">Conversations</span>
          </div>
          <button className="add-btn" onClick={onNewConversation}>
            <FaPlus className="add-icon" /> Nouvelle Conversation
          </button>
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

        <hr className="divider" />

        {/* Projects Section */}
        <div className="section">
          <div className="section-header">
            <FaFolder />
            <span className="section-title">Projets</span>
          </div>
          <button className="add-btn" onClick={onNewProject}>
            <FaPlus className="add-icon" /> Nouveau Projet
          </button>
          <ul className="section-list">
            {projects.map((item) => (
              <li
                key={item.id}
                className="list-item"
                onClick={() => onSelectProject(item.id)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        <hr className="divider" />
      </div>

      {/* Bouton déconnexion en bas */}
      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt className="logout-icon" /> Déconnexion
      </button>
    </div>
  );
};
