import React, { useEffect } from "react";
import { useProject } from "../../../hooks/useProject/useProject";
import "./ProjectList.scss";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Project } from "../../../types/project.types";

interface ProjectListProps {
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  onSelect, 
  onDelete,
  onEdit 
}) => {
  const { projects, fetchProjects, loading, error } = useProject();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return <div className="loading">Chargement des projets...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (projects.length === 0) {
    return <div className="empty">Aucun projet trouvé</div>;
  }

  return (
    <div className="project-list">
      <ul>
        {projects.map((project) => (
          <li key={project.id} onClick={() => onSelect(project.id)}>
            <span className="title">{project.title}</span>
            <div className="actions">
              <button 
                className="edit-btn" 
                aria-label={`Modifier le projet ${project.title}`}
                title={`Modifier le projet ${project.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-btn" 
                aria-label={`Supprimer le projet ${project.title}`}
                title={`Supprimer le projet ${project.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.id);
                }}
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
