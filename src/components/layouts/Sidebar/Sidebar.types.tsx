export interface SidebarProps {
  isOpen: boolean;
  conversations: { id: string | number; title: string }[];
  projects: { id: string | number; title: string }[];
  onNewConversation: () => void;
  onNewProject: () => void;
  onSelectConversation: (id: string | number) => void;
  onSelectProject: (id: string | number) => void;
  onRenameConversation: (id: string | number, newTitle: string) => void;
  onDeleteConversation: (id: string | number) => void;
  onMoveConversation: (id: string, projectId: string) => void;
  onRenameProject: (project: any) => void;
  onDeleteProject: (id: string | number) => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  selectedConversationId?: string | number | null;
  selectedProjectId?: string | number | null;
}
