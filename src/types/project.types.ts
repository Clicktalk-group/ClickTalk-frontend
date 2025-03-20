import { Conversation } from "./conversation.types";

// /src/types/project.types.ts
export interface Project {
  id: number;
  userId: number;
  title: string;
  context: string; // Le frontend utilise 'context', tandis que l'API utilise 'content'
  conversations: Conversation[];
}

export interface CreateProjectRequest {
  title: string;
  context: string; 
}

export interface UpdateProjectRequest {
  id: number;
  title?: string;
  context?: string;
}

export interface ProjectConversation {
  projectId: number;
  convId: number;
}
