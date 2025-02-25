export interface SidebarProps {
  isOpen: boolean;
  conversations: { id: string; title: string }[];
  projects: { id: string; title: string }[];
  onNewConversation: () => void;
  onNewProject: () => void;
  onSelectConversation: (id: string) => void;
  onSelectProject: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  onMoveConversation: (id: string, projectId: string) => void;
  onRenameProject: (id: string, newTitle: string) => void;
  onDeleteProject: (id: string) => void;
  onLogout: () => void;
}
