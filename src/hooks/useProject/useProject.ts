import { useState, useEffect, useCallback } from 'react';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../../types/project.types';
import { projectService } from '../../services/project/project';

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
    } catch (err) {
      setError('Erreur lors du chargement des projets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

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
      const updatedProject = await projectService.updateProject(data);
      
      setProjects(prev => 
        prev.map(project => project.id === updatedProject.id ? updatedProject : project)
      );
      
      if (currentProject?.id === updatedProject.id) {
        setCurrentProject(updatedProject);
      }
      
      setError(null);
      return updatedProject;
    } catch (err) {
      setError(`Erreur lors de la mise à jour du projet ${data.id}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

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

  // Ajouter une conversation à un projet
  const addConversationToProject = useCallback(async (projectId: number, convId: number) => {
    try {
      await projectService.addConversationToProject(projectId, convId);
      setError(null);
    } catch (err) {
      setError(`Erreur lors de l'ajout de la conversation ${convId} au projet ${projectId}`);
      console.error(err);
      throw err;
    }
  }, []);

  // Supprimer une conversation d'un projet
  const removeConversationFromProject = useCallback(async (projectId: number, convId: number) => {
    try {
      await projectService.removeConversationFromProject(projectId, convId);
      setError(null);
    } catch (err) {
      setError(`Erreur lors de la suppression de la conversation ${convId} du projet ${projectId}`);
      console.error(err);
      throw err;
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
    createProject,
    updateProject,
    deleteProject,
    addConversationToProject,
    removeConversationFromProject
  };
};
