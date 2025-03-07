import React, { useState } from "react";
import { useConversation } from "../../../hooks/useConversation/useConversation";
import "./ConversationForm.scss";

interface ConversationFormProps {
  onClose: () => void;
  userId: number;
}

const ConversationForm: React.FC<ConversationFormProps> = ({ onClose, userId }) => {
  const [title, setTitle] = useState<string>("");
  const { createConversation, loading } = useConversation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
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
    }
  };

  return (
    <div className="conversation-form">
      <h3>Nouvelle Conversation</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entrez un titre pour la conversation"
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn-cancel">
            Annuler
          </button>
          <button type="submit" className="btn-submit" disabled={loading || !title.trim()}>
            {loading ? "Création..." : "Créer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConversationForm;
