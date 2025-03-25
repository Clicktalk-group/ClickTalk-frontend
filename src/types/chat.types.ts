// Message standard
export interface Message {
  id: string | number;
  convId: number;
  content: string; 
  isBot: boolean;
  createdAt: string;
}

// État pour la conversation actuelle
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentConversationId: Number | null;
  error: string | null;
  streamingMessage: string | null; // NOUVEAU: pour suivre le message en streaming
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

// Type pour la réponse API avec message bot
export interface ApiMessageResponse {
  botResponse?: {
    content: string;
    id?: string | number;
    convId?: number;
  };
  convId?: number;
  conversationId?: number;
  id?: number;
  userId?: number;
  [key: string]: any; // Pour les autres champs possibles
}
