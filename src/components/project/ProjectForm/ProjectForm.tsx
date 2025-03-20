import React, { useState } from "react";
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
  
  const { createProject, updateProject, loading } = useProject();

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
        // Pour la mise à jour, s'assurer que tous les champs requis sont présents
        const updateData = {
          id: initialData.id,
          title: title.trim(),
          context: context.trim()
        };
        
        console.log("Mise à jour du projet avec données:", updateData);
        
        await updateProject(updateData);
        console.log("Projet mis à jour avec succès");
      } else {
        // Pour la création
        const createData = {
          title: title.trim(),
          context: context.trim()
        };
        
        console.log("Création d'un projet avec données:", createData);
        
        await createProject(createData);
        console.log("Projet créé avec succès");
      }
      onClose();
    } catch (error) {
      console.error(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} du projet`, error);
      setError(`Une erreur est survenue lors de ${isEditMode ? 'la modification' : 'la création'} du projet.`);
    }
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
            onClick={onClose}
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
