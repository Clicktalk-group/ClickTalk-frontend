import React from "react";
import "./Sidebar.scss";
import { SidebarProps } from "./Sidebar.types";

// Icônes pour les sections
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
      {/* Section Conversations */}
      <SidebarSection
        icon={<FaComments />}
        title="Conversations"
        items={conversations}
        onAdd={onNewConversation}
        onSelect={onSelectConversation}
        addButtonLabel="+ Nouvelle Conversation"
      />

      <hr className="divider" />

      {/* Section Projets */}
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
  );
};

// Composant d'aide pour chaque section
const SidebarSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  items: { id: string; title: string }[];
  onAdd: () => void;
  onSelect: (id: string) => void;
  addButtonLabel: string;
}> = ({ icon, title, items, onAdd, onSelect, addButtonLabel }) => (
  <div className="section">
    <div className="section-header">{icon} {title}</div>
    <button className="add-btn" onClick={onAdd}>
      {addButtonLabel}
    </button>
    <ul className="section-list">
      {items.map((item) => (
        <li key={item.id} className="list-item" onClick={() => onSelect(item.id)}>
          {item.title}
        </li>
      ))}
    </ul>
  </div>
);
