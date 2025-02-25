import React from "react";
import "./Sidebar.scss";
import { SidebarProps } from "./Sidebar.types";

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  projects,
  activeConversationId,
  activeProjectId,
  onNewConversation,
  onNewProject,
  onSelectConversation,
  onSelectProject,
  onRenameConversation,
  onDeleteConversation,
  onMoveConversation,
  onRenameProject,
  onDeleteProject,
  onLogout,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">ClickTalk</div>

      {/* Conversations */}
      <div className="section-title">Conversations</div>
      <button className="new-chat-btn" onClick={onNewConversation}>
        + New Conversation
      </button>
      <div>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`list-item ${
              activeConversationId === conv.id ? "active" : ""
            }`}
            onClick={() => onSelectConversation(conv.id)}
          >
            <span>{conv.title}</span>
            <div className="item-options">
              <button onClick={() => onRenameConversation(conv.id, "New Title")}>
                Rename
              </button>
              <button onClick={() => onDeleteConversation(conv.id)}>
                Delete
              </button>
              <button onClick={() => onMoveConversation(conv.id, activeProjectId || "")}>
                Move
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="section-title">Projects</div>
      <button className="new-chat-btn" onClick={onNewProject}>
        + New Project
      </button>
      <div>
        {projects.map((proj) => (
          <div
            key={proj.id}
            className={`list-item ${
              activeProjectId === proj.id ? "active" : ""
            }`}
            onClick={() => onSelectProject(proj.id)}
          >
            <span>{proj.title}</span>
            <div className="item-options">
              <button onClick={() => onRenameProject(proj.id, "New Project Name")}>
                Rename
              </button>
              <button onClick={() => onDeleteProject(proj.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};
