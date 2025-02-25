export interface Conversation {
    id: string;
    title: string;
  }
  
  export interface Project {
    id: string;
    title: string;
  }
  
  export interface SidebarProps {
    conversations: Conversation[];
    projects: Project[];
    activeConversationId?: string;
    activeProjectId?: string;
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
  