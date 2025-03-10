// /src/components/project/ProjectList/ProjectList.tsx
import React, { useEffect } from "react";
import { useProject } from "../../../hooks/useProject/useProject";
import "./ProjectList.scss";
import { FaTrash, FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import { Project } from "../../../types/project.types"; 

interface ProjectListProps {
  onSelect?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (project: Project) => void;
  showActions?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  onSelect, 
  onDelete,
  onEdit,
  showActions = true
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
    return (
      <div className="empty-project-list">
        <p>Aucun projet trouvé</p>
        {onEdit && (
          <button 
            className="create-project-btn"
            onClick={() => onEdit({ id: 0, userId: 0, title: "", context: "" })}
          >
            <FaEdit /> Créer un projet
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="project-list">
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <div 
              className="project-item" 
              onClick={() => onSelect && onSelect(project.id)}
            >
              <span className="title">{project.title}</span>
              {project.context && <p className="context">{project.context}</p>}
            </div>

            {showActions && (
              <div className="actions">
                {onSelect && (
                  <button 
                    className="view-btn" 
                    aria-label={`Voir le projet ${project.title}`}
                    title={`Voir le projet ${project.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(project.id);
                    }}
                  >
                    <FaExternalLinkAlt />
                  </button>
                )}
                {onEdit && (
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
                )}
                {onDelete && (
                  <button 
                    className="delete-btn" 
                    aria-label={`Supprimer le projet ${project.title}`}
                    title={`Supprimer le projet ${project.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Voulez-vous vraiment supprimer le projet "${project.title}" ?`)) {
                        onDelete(project.id);
                      }
                    }}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
