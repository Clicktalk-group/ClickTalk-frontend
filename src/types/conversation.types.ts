// /src/types/conversation.types.ts
export interface Conversation {
  id: number;
  userId: number;
  title: string;
  createdAt: string; // Ajout de cette propriété
  updatedAt?: string; // Ajout de cette propriété optionnelle
}

export interface Message {
  id: number;
  conversationId: number;
  content: string;
  userId: number;
  isUserMessage: boolean;
  timestamp: string;
}

export interface CreateConversationRequest {
  userId: number;
  title?: string;
}

export interface SendMessageRequest {
  conversationId: number;
  content: string;
  userId: number;
  projectId?: number; // Pour support des messages liés à un projet
}
