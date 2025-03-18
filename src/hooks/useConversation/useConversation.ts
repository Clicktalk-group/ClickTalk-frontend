import { useContext } from "react";
import { ConversationsContext } from "../../context/ConversationsContext/ConversationsContext";
import { conversationService } from "../../services/conversation/conversation";

export const useConversation = () => {
  const context = useContext(ConversationsContext);

  const fetchConversations = async () => {
    try {
      context.setLoading(true);
      const data = await conversationService.getAllConversations();
      context.setConversations(data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      context.setLoading(false);
    }
  };

  const fetchConversationById = async (id: number) => {
    if (!id) return;
    try {
      context.setLoading(true);
      const conversation = await conversationService.getConversationById(id);
      context.setCurrentConversation(conversation);
      context.addToConversations(conversation);
    } catch (err) {
      console.error(`Error fetching conversation ${id}:`, err);
      context.setError(`Erreur lors du chargement de la conversation ${id}`);
    } finally {
      context.setLoading(false);
    }
  };

  const deleteConversation = async (id: number) => {
    if (!id) return;
    try {
      context.setLoading(true);
      await conversationService.deleteConversation(id);
      context.deleteConversation(id);
    } catch (err) {
      console.error(`Error deleting conversation ${id}:`, err);
      context.setError(
        `Erreur lors de la suppression de la conversation ${id}`
      );
    } finally {
      context.setLoading(false);
    }
  };
  return {
    ...context,
    fetchConversations,
    fetchConversationById,
    deleteConversation,
  };
};
