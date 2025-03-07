export interface Conversation {
  id: number;
  title: string;
  userId: number;
  createdAt: string;
}

export interface Message {
  id: number;
  convId: number;
  content: string;
  isBot: boolean;
  createdAt: string;
}

export interface CreateConversationRequest {
  title: string;
  userId: number;
}

export interface SendMessageRequest {
  convId: number;
  content: string;
  isBot: boolean;
}
