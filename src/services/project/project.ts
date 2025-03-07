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
      
      // Convertir la réponse API en format compatible avec notre frontend
      return response.map(project => ({
        id: project.projectId,
        userId: project.userId || 0,
        title: project.title,
        context: project.content // API renvoie 'content' mais notre modèle utilise 'context'
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },
  
  // Créer un nouveau projet
  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    try {
      // Adaptation au format attendu par l'API
      // Le backend Project.java attend 'context', mais le DTO utilise 'content'
      const requestData = {
        userId: data.userId,
        title: data.title,
        context: data.context // Utiliser 'context' comme dans l'entité Project.java
      };
      
      console.log('Sending project data to API:', requestData);
      
      const response = await apiService.post<any>('/project/add', requestData);
      
      // Vérifier si la réponse est valide
      if (!response) {
        throw new Error('Empty response from API');
      }
      
      // Convertir la réponse API au format frontend
      return {
        id: response.id || response.projectId,
        userId: response.userId,
        title: response.title,
        context: response.context || response.content // Handle both formats
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  // Mettre à jour un projet
  updateProject: async (data: UpdateProjectRequest): Promise<Project> => {
    try {
      // Adaptation au format attendu par l'API
      const requestData = {
        id: data.id,
        userId: data.userId,
        title: data.title,
        context: data.context
      };
      
      const response = await apiService.put<any>('/project/update', requestData);
      
      // Convertir la réponse API au format frontend
      return {
        id: response.id || response.projectId,
        userId: response.userId,
        title: response.title,
        context: response.context || response.content
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
      await apiService.delete(`/project/${projectId}/remove-conversation/${convId}`);
    } catch (error) {
      console.error(`Error removing conversation ${convId} from project ${projectId}:`, error);
      throw error;
    }
  }
};
