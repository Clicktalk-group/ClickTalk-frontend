// /src/types/project.types.ts
export interface Project {
  id: number;
  userId: number;
  title: string;
  context: string; // Le frontend utilise 'context', tandis que l'API utilise 'content'
}

export interface CreateProjectRequest {
  title: string;
  userId: number;
  context: string; 
}

export interface UpdateProjectRequest {
  id: number;
  userId?: number;
  title?: string;
  context?: string;
}

export interface ProjectConversation {
  projectId: number;
  convId: number;
}