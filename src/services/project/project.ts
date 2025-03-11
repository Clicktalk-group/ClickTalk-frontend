// /src/services/project/project.ts
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
        context: project.content || project.context || "" 
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },
  
  // Récupérer un projet spécifique - en filtrant parmi tous les projets
  getProjectById: async (id: number): Promise<Project | null> => {
    try {
      const projects = await projectService.getAllProjects();
      const project = projects.find(p => p.id === id);
      
      if (!project) {
        console.warn(`Project with id ${id} not found in the list of all projects`);
        return null;
      }
      
      return project;
    } catch (error) {
      console.error(`Error fetching project with id ${id}:`, error);
      return null;
    }
  },
  
  // Créer un nouveau projet
  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    try {
      // Convertir les données pour correspondre au format attendu par l'API
      const requestData = {
        userId: data.userId,
        title: data.title,
        context: data.context // Le backend attend "context" et non "content"
      };
      
      console.log('Sending project data to API:', requestData);
      
      const response = await apiService.post<any>('/project/add', requestData);
      
      if (!response) {
        throw new Error('Empty response from API');
      }
      
      return {
        id: response.id || response.projectId,
        userId: response.userId,
        title: response.title,
        context: response.context || ""
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  // Mettre à jour un projet
  updateProject: async (data: UpdateProjectRequest): Promise<Project> => {
    try {
      // IMPORTANT: Le backend attend les mêmes champs que dans l'entité Project
      const requestData = {
        id: data.id,
        userId: data.userId, 
        title: data.title,
        context: data.context // Utiliser "context" comme dans Project.java
      };
      
      // Debug avant envoi pour vérifier les données
      console.log("Données envoyées pour mise à jour:", requestData);
      
      const response = await apiService.put<any>('/project/update', requestData);
      
      return {
        id: response.id || 0,
        userId: response.userId,
        title: response.title,
        context: response.context
      };
    } catch (error) {
      console.error(`Error updating project with id ${data.id}:`, error);
      throw error;
    }
  },
  
  // Supprimer un projet
  deleteProject: async (id: number): Promise<void> => {
    try {
      await apiService.delete(`/project/delete/${id}`);
    } catch (error) {
      console.error(`Error deleting project with id ${id}:`, error);
      throw error;
    }
  },
  
  // Récupérer toutes les conversations d'un projet
  getProjectConversations: async (projectId: number): Promise<any[]> => {
    try {
      const response = await apiService.get<any[]>(`/project/${projectId}/conversations`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error(`Error fetching conversations for project ${projectId}:`, error);
      return [];
    }
  },
  
  // Ajouter une conversation à un projet
  addConversationToProject: async (projectId: number, convId: number): Promise<void> => {
    try {
      await apiService.post(`/project/${projectId}/add-conversation/${convId}`);
    } catch (error) {
      console.error(`Error adding conversation ${convId} to project ${projectId}:`, error);
      throw error;
    }
  },
  
  // Supprimer une conversation d'un projet
  removeConversationFromProject: async (projectId: number, convId: number): Promise<void> => {
    try {
      if (!projectId || !convId) {
        throw new Error('Invalid project ID or conversation ID');
      }
      
      console.log(`Attempting to delete conversation ${convId}`);
      await apiService.delete(`/project/${projectId}/remove-conversation/${convId}`);
      console.log('Conversation successfully removed from project');
    } catch (error) {
      console.error(`Error removing conversation ${convId} from project ${projectId}:`, error);
      throw error;
    }
  }
};
