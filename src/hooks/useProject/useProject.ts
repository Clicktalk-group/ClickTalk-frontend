import { useContext } from "react";
import { ProjectContext } from "../../context/ProjectsContext/ProjectsContext";
import { projectService } from "../../services/project/project";
import {CreateProjectRequest, UpdateProjectRequest} from "../../types/project.types";

export const useProject = () => {
  const context = useContext(ProjectContext);

  async function fetchProjects() {
    try {
      context.setLoading(true);
      const data = await projectService.getAllProjects();
      context.setProjects(data);
      context.setError(null);
      return data;
    } catch (err) {
      context.setError("error while fetching projects");
      console.error(err);
      return [];
    } finally {
      context.setLoading(false);
    }
  }

  async function deleteProject(id: number) {
    try {
      context.setLoading(true);
      await projectService.deleteProject(id);
      context.deleteProject(id);
      context.setError(null);
    } catch (err) {
      context.setError(`Erreur while deleting project ${id}`);
      console.error(err);
    } finally {
      context.setLoading(false);
    }
  }

  async function updateProject(projectData: UpdateProjectRequest) {
    try {
      context.setLoading(true);

      // check if the project ID is provided
      if (!projectData.id) {
        throw new Error("project id is required");
      }

      // get the current project data
      const currentProject = context.projects.find(
        (p) => p.id === projectData.id
      );

      if (!currentProject) {
        throw new Error(`Project with ID ${projectData.id} not found`);
      }

      // if the title or context is not provided, keep the current value
      const updatedProjectRequest = {
        id: projectData.id,
        title: projectData.title || currentProject.title,
        context: projectData.context || currentProject.context,
      };

      const updatedProject = await projectService.updateProject(
        updatedProjectRequest
      );

      context.updateProject(updatedProject);

      context.setError(null);
      return updatedProject;
    } catch (err) {
      console.error(err);
      context.setError("Error while updating project");
    } finally {
      context.setLoading(false);
    }
  }

  async function createProject(projectData: CreateProjectRequest) {
    try {
      context.setLoading(true);
      const newProject = await projectService.createProject(projectData);
      context.addToProjects(newProject);
      context.setError(null);
      return newProject;
    } catch (err) {
      context.setError("Error while creating project");
      console.error(err);
    } finally {
      context.setLoading(false);
    }
  }
  console.log(context.projects)
  return {
    ...context,
    fetchProjects,
    updateProject,
    createProject,
    deleteProject,
  };
};