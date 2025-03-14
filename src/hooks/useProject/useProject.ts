import { useState, useEffect, useCallback } from 'react';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../../types/project.types';
import { projectService } from '../../services/project/project';
import { conversationService } from '../../services/conversation/conversation';

export const useProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les projets
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
      setError(null);
      return data;
    } catch (err) {
      setError('Erreur lors du chargement des projets');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger un projet spécifique
  const fetchProjectById = useCallback(async (id: number) => {
    setLoading(true);
    try {
      // Chercher dans les projets déjà chargés
      let projectData = projects.find(p => p.id === id);
      
      if (!projectData) {
        // Si pas trouvé, charger tous les projets
        const allProjects = await projectService.getAllProjects();
        setProjects(allProjects);
        projectData = allProjects.find(p => p.id === id);
      }
      
      // Si on a trouvé le projet, on le définit comme projet courant
      if (projectData) {
        setCurrentProject(projectData);
      } else {
        setCurrentProject(null);
      }
      
      setError(null);
      return projectData || null;
    } catch (err) {
      setError(`Erreur lors du chargement du projet ${id}`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [projects]);

  // Créer un nouveau projet
  const createProject = useCallback(async (data: CreateProjectRequest) => {
    setLoading(true);
    try {
      const newProject = await projectService.createProject(data);
      setProjects(prev => [...prev, newProject]);
      setCurrentProject(newProject);
      setError(null);
      return newProject;
    } catch (err) {
      setError('Erreur lors de la création du projet');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour un projet
  const updateProject = useCallback(async (data: UpdateProjectRequest) => {
    setLoading(true);
    try {
      // Vérifier que tous les champs requis sont présents
      if (!data.id) {
        throw new Error('ID du projet manquant pour la mise à jour');
      }
      
      // Trouver le projet existant pour récupérer les champs manquants
      const existingProject = projects.find(p => p.id === data.id);
      if (!existingProject) {
        throw new Error(`Projet avec l'ID ${data.id} non trouvé pour la mise à jour`);
      }
      
      // Fusionner les données existantes avec les nouvelles
      const completeData: Project = {
        id: data.id,
        userId: data.userId || existingProject.userId,
        title: data.title || existingProject.title,
        context: data.context !== undefined ? data.context : existingProject.context
      };
      
      console.log('Mise à jour du projet avec les données:', completeData);
      
      const updatedProject = await projectService.updateProject(completeData);
      
      setProjects(prev => 
        prev.map(project => project.id === updatedProject.id ? updatedProject : project)
      );
      
      if (currentProject?.id === updatedProject.id) {
        setCurrentProject(updatedProject);
      }
      
      setError(null);
      return updatedProject;
    } catch (err) {
      const errorMsg = `Erreur lors de la mise à jour du projet ${data.id}`;
      console.error(errorMsg, err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject, projects]);

  // Supprimer un projet
  const deleteProject = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
      
      setError(null);
    } catch (err) {
      setError(`Erreur lors de la suppression du projet ${id}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Ajouter une conversation à un projet - cette fonctionnalité est maintenant gérée 
  // automatiquement par le backend lors de la création d'une conversation
  const addConversationToProject = useCallback(async (projectId: number, convId: number) => {
    console.warn("Cette fonctionnalité n'est plus supportée par l'API. La liaison de conversation à un projet doit être faite lors de la création de la conversation.");
  }, []);

  // Récupérer les conversations d'un projet
  const getProjectConversations = useCallback(async (projectId: number) => {
    try {
      return await conversationService.getProjectConversations(projectId);
    } catch (err) {
      setError(`Erreur lors de la récupération des conversations du projet ${projectId}`);
      console.error(err);
      return [];
    }
  }, []);

  // Supprimer une conversation (d'un projet)
  const removeConversationFromProject = useCallback(async (projectId: number, convId: number) => {
    setLoading(true);
    try {
      console.log(`Removing conversation ${convId}`);
      if (!convId) {
        throw new Error('Conversation ID is invalid');
      }
      
      // CORRECTION: Utiliser l'API standard de suppression de conversation
      await conversationService.deleteConversation(convId);
      console.log('Successfully deleted conversation');
      setError(null);
    } catch (err: any) {
      const errorMessage = `Erreur lors de la suppression de la conversation ${convId}: ${err.message}`;
      console.error(errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les projets au montage du composant
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    addConversationToProject,
    removeConversationFromProject,
    getProjectConversations
  };
};
