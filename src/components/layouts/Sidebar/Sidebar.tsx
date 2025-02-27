import React from "react";
import { SidebarProps } from "./Sidebar.types";
import "./Sidebar.scss";
import { FaSignOutAlt, FaComments, FaFolder } from "react-icons/fa";

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
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Bouton de fermeture */}

      {/* Contenu */}
      <div className="content">
        {/* Conversations Section */}
        <SidebarSection
          icon={<FaComments />}
          title="Conversations"
          items={conversations}
          onAdd={onNewConversation}
          onSelect={onSelectConversation}
          addButtonLabel="+ Nouvelle Conversation"
        />

        <hr className="divider" />

        {/* Projects Section */}
        <SidebarSection
          icon={<FaFolder />}
          title="Projets"
          items={projects}
          onAdd={onNewProject}
          onSelect={onSelectProject}
          addButtonLabel="+ Nouveau Projet"
        />

        <hr className="divider" />

        {/* Bouton de déconnexion */}
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt className="logout-icon" /> Déconnexion
        </button>
      </div>
    </div>
  );
};

// Section générique pour afficher des groupes de contenus (Conversations, Projets)
const SidebarSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  items: { id: string; title: string }[];
  onAdd: () => void;
  onSelect: (id: string) => void;
  addButtonLabel: string;
}> = ({ icon, title, items, onAdd, onSelect, addButtonLabel }) => (
  <div className="section">
    <div className="section-header">
      {icon}
      <span className="section-title">{title}</span>
    </div>
    <button className="add-btn" onClick={onAdd}>
      {addButtonLabel}
    </button>
    <ul className="section-list">
      {items.map((item) => (
        <li
          key={item.id}
          className="list-item"
          onClick={() => onSelect(item.id)}
        >
          {item.title}
        </li>
      ))}
    </ul>
  </div>
);
