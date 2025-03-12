import React, { useState, useCallback, useMemo } from "react";
import { useConversation } from "../../../hooks/useConversation/useConversation";
import "./ConversationForm.scss";

interface ConversationFormProps {
  onClose: () => void;
  userId: number;
}

const ConversationForm = React.memo(({ onClose, userId }: ConversationFormProps) => {
  const [title, setTitle] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { createConversation, loading } = useConversation();

  // Validation de titre mémoïsée
  const titleIsValid = useMemo(() => title.trim().length > 0, [title]);

  // Optimisation du gestionnaire de changement
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Validation en temps réel
    if (newTitle.trim().length === 0) {
      setValidationError("Le titre est requis");
    } else if (newTitle.length > 100) {
      setValidationError("Le titre ne doit pas dépasser 100 caractères");
    } else {
      setValidationError(null);
    }
  }, []);

  // Optimisation du gestionnaire de soumission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titleIsValid) {
      setValidationError("Le titre est requis");
      return;
    }
    
    try {
      await createConversation({ 
        title: title.trim(),
        userId 
      });
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création de la conversation", error);
      setValidationError("Erreur lors de la création de la conversation");
    }
  }, [title, userId, createConversation, onClose, titleIsValid]);

  // Mémoïsation du texte du bouton
  const buttonText = useMemo(() => loading ? "Création..." : "Créer", [loading]);

  // Attributs d'accessibilité pour l'input
  const ariaAttributes = useMemo(() => {
    const attrs: {[key: string]: string} = {};
    
    if (validationError) {
      attrs['aria-invalid'] = 'true';
      attrs['aria-describedby'] = 'title-error';
    }
    
    return attrs;
  }, [validationError]);

  return (
    <div className="conversation-form">
      <h3>Nouvelle Conversation</h3>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Entrez un titre pour la conversation"
            required
            maxLength={100}
            {...ariaAttributes}
          />
          {validationError && (
            <p className="error-message" id="title-error" role="alert">
              {validationError}
            </p>
          )}
        </div>
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-cancel"
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading || !titleIsValid}
          >
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
});

ConversationForm.displayName = 'ConversationForm';

export default ConversationForm;
