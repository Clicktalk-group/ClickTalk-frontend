import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../hooks/useProject/useProject";
import "./ProjectForm.scss";
import { Button } from "../../../components/common/Button";

interface ProjectFormProps {
  onClose: () => void;
  initialData?: {
    id: number;
    title: string;
    context: string;
  };
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onClose, initialData }) => {
  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [context, setContext] = useState<string>(initialData?.context || "");
  const [error, setError] = useState<string>("");
  
  const { createProject, updateProject, loading, fetchProjects } = useProject();
  const navigate = useNavigate();

  const isEditMode = !!initialData && initialData.id > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!title.trim()) {
      setError("Le titre est requis");
      return;
    }
    
    try {
      if (isEditMode && initialData) {
        // Mise à jour d'un projet existant
        const updateData = {
          id: initialData.id,
          title: title.trim(),
          context: context.trim()
        };
        
        await updateProject(updateData);
        console.log("Projet mis à jour avec succès");
        onClose();
      } else {
        // Création d'un nouveau projet
        const createData = {
          title: title.trim(),
          context: context.trim() || "you are a helpful assistant",
        };
        
        await createProject(createData);
        console.log("Projet créé avec succès");
        
        // Récupérer la liste mise à jour des projets
        const updatedProjects = await fetchProjects();
        
        // Trouver le projet qui a le même titre que celui qu'on vient de créer
        // On utilise find pour récupérer le premier projet qui a ce titre
        const newProject = updatedProjects.find(p => p.title === title.trim());
        
        if (newProject) {
          // Rediriger vers le nouveau projet
          navigate(`/project/${newProject.id}`);
          // Fermer le modal
          onClose();
        } else {
          // Si on ne trouve pas le projet, fermer le modal
          console.warn("Projet créé mais non trouvé dans la liste mise à jour");
          onClose();
        }
      }
    } catch (error) {
      console.error(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} du projet`, error);
      setError(`Une erreur est survenue lors de ${isEditMode ? 'la modification' : 'la création'} du projet.`);
    }
  };

  // Fonction pour gérer l'annulation
  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="project-form">
      <h3>{isEditMode ? "Modifier le projet" : "Nouveau Projet"}</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez un titre pour le projet"
            required
            className="textarea-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="context">Contexte du projet</label>
          <textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Décrivez le contexte de ce projet pour guider les conversations"
            rows={4}
            className="textarea-input"
          />
          <p className="context-hint">
            Décrivez l'objectif et les spécificités de ce projet pour guider les conversations
          </p>
        </div>
        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary"
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading || !title.trim()}
          >
            {loading ? (isEditMode ? "Modification..." : "Création...") : (isEditMode ? "Modifier" : "Créer")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
