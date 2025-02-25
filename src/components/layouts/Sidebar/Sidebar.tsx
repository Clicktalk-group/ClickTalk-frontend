import React from "react";
import { SidebarProps } from "./Sidebar.types";
import "./Sidebar.scss";

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  conversations,
  projects,
  onNewConversation,
  onNewProject,
  onSelectConversation,
  onSelectProject,
  onLogout,
}) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">Menu</div>

      <div>
        <div className="section-title">Conversations</div>
        <ul>
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              className="list-item"
              onClick={() => onSelectConversation(conversation.id)}
            >
              {conversation.title}
            </li>
          ))}
        </ul>
        <button className="logout-btn" onClick={onNewConversation}>
          + Nouvelle Conversation
        </button>
      </div>

      <div>
        <div className="section-title">Projets</div>
        <ul>
          {projects.map((project) => (
            <li
              key={project.id}
              className="list-item"
              onClick={() => onSelectProject(project.id)}
            >
              {project.title}
            </li>
          ))}
        </ul>
        <button className="logout-btn" onClick={onNewProject}>
          + Nouveau Projet
        </button>
      </div>

      <button className="logout-btn" onClick={onLogout}>
        Déconnexion
      </button>
    </div>
  );
};
