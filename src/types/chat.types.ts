// src/types/chat.types.ts
// Message standard
export interface Message {
  id: string;
  convId: number;
  content: string; 
  isBot: boolean;
  createdAt: string;
}

// État pour la conversation actuelle
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentConversation: Conversation | null;
  error: string | null;
}

// Type pour une conversation
export interface Conversation {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
}

// Type pour un projet
export interface Project {
  id: number;
  userId: number;
  title: string;
  context: string;
}

// Association projet-conversation
export interface ProjectConversation {
  projectId: number;
  convId: number;
}
