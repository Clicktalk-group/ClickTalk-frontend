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
        id: project.projectId || project.id,
        userId: project.userId || 0,
        title: project.title || "Sans titre",
        context: project.content || project.context || "" // API renvoie 'content' mais notre modèle utilise 'context'
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },
  
  // Récupérer un projet spécifique
  getProjectById: async (id: number): Promise<Project | null> => {
    try {
      const response = await apiService.get<any>(`/project/${id}`);
      
      if (!response) {
        return null;
      }
      
      return {
        id: response.projectId || response.id,
        userId: response.userId || 0,
        title: response.title || "Sans titre",
        context: response.content || response.context || ""
      };
    } catch (error) {
      console.error(`Error fetching project with id ${id}:`, error);
      return null;
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
        content: data.context // Adapter le nom du champ pour l'API
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
        context: response.context || response.content || "" // Handle both formats
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
        content: data.context // Adapter le nom du champ pour l'API
      };
      
      const response = await apiService.put<any>('/project/update', requestData);
      
      // Convertir la réponse API au format frontend
      return {
        id: response.id || response.projectId,
        userId: response.userId,
        title: response.title,
        context: response.context || response.content || ""
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
      // Vérification des paramètres
      if (!projectId || !convId) {
        throw new Error('Invalid project ID or conversation ID');
      }
      
      console.log(`Attempting to delete conversation ${convId}`);
      // Utiliser l'endpoint de suppression de conversation directement
      await apiService.delete(`/conversation/delete/${convId}`);
      console.log('Conversation successfully deleted');
    } catch (error) {
      console.error(`Error deleting conversation ${convId}:`, error);
      throw error;
    }
  }
};
