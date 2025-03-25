import { apiService } from '../api/api';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../../types/project.types';

export const projectService = {
  // Récupérer tous les projets
  getAllProjects: async (): Promise<Project[]> => {
    try {
      const response = await apiService.get<any[]>('/project/all');
      
      if (!response || !Array.isArray(response)) {
        return [];
      }
      
      return response.map(project => ({
        id: project.projectId || project.id,
        userId: project.userId || 0, 
        title: project.title || "Sans titre",
        context: project.content || project.context || "",
        conversations: project.conversations || []
      }));
    } catch (error) {
      return [];
    }
  },
  
  // Récupérer un projet spécifique - en filtrant parmi tous les projets
  getProjectById: async (id: number): Promise<Project | null> => {
    try {
      const projects = await projectService.getAllProjects();
      const project = projects.find(p => p.id === id);
      
      if (!project) {
        return null;
      }
      
      return project;
    } catch (error) {
      return null;
    }
  },
  
  // Créer un nouveau projet
  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    try {
      // Convertir les données pour correspondre au format attendu par l'API
      const requestData = {
        title: data.title,
        context: data.context // Le backend attend "context" et non "content"
      };
      
      const response = await apiService.post<any>('/project/add', requestData);
      
      if (!response) {
        throw new Error('Empty response from API');
      }
      
      return {
        id: response.id || response.projectId,
        userId: response.userId,
        title: response.title,
        context: response.context || "",
        conversations: response.conversations || []
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Mettre à jour un projet
  updateProject: async (data: UpdateProjectRequest): Promise<Project> => {
    try {
      // IMPORTANT: Le backend attend les mêmes champs que dans l'entité Project
      const requestData = {
        id: data.id,
        title: data.title,
        context: data.context // Utiliser "context" comme dans Project.java
      };
      
      const response = await apiService.put<any>('/project/update', requestData);
      
      return {
        id: response.id || 0,
        userId: response.userId,
        title: response.title,
        context: response.context,
        conversations: response.conversations || []
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Supprimer un projet
  deleteProject: async (id: number): Promise<void> => {
    try {
      await apiService.delete(`/project/delete/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Récupérer toutes les conversations d'un projet
  getProjectConversations: async (projectId: number): Promise<any[]> => {
    try {
      // Correction: utiliser l'endpoint correct pour récupérer les conversations d'un projet
      const response = await apiService.get<any[]>(`/conversation/project/${projectId}`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return [];
    }
  },
  
  // Fonctionnalité qui n'est plus supportée par l'API backend - à conserver pour rétrocompatibilité
  addConversationToProject: async (projectId: number, convId: number): Promise<void> => {
    // Cette fonction est conservée pour rétrocompatibilité mais ne fait rien
  },
  
  // Supprimer une conversation (utilisation de l'endpoint conversation/delete/{id})
  removeConversationFromProject: async (projectId: number, convId: number): Promise<void> => {
    try {
      if (!convId) {
        throw new Error('Invalid conversation ID');
      }
      
      // Utiliser l'endpoint de suppression de conversation standard
      await apiService.delete(`/conversation/delete/${convId}`);
    } catch (error) {
      throw error;
    }
  }
};
