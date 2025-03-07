export interface Project {
  id: number;
  userId: number;
  title: string;
  context: string; // Le backend utilise 'context', pas 'content'
}

export interface CreateProjectRequest {
  title: string;
  userId: number;
  context: string; // Le backend utilise 'context', pas 'content'
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
