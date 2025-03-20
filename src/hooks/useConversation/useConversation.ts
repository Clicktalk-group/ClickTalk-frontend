import { useContext, useEffect } from "react";
import { ConversationsContext } from "../../context/ConversationsContext/ConversationsContext";
import { conversationService } from "../../services/conversation/conversation";

export const useConversation = () => {
  const context = useContext(ConversationsContext);

  const fetchConversations = async () => {
    try {
      const data = await conversationService.getAllConversations();
      context.setConversations(data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  const fetchConversationById = async (id: number) => {
    if (!id) return;
    try {
      const conversation = await conversationService.getConversationById(id);
      context.addToConversations(conversation);
    } catch (err) {
      console.error(`Error fetching conversation ${id}:`, err);
    }
  };

  const deleteConversation = async (id: number) => {
    if (!id) return;
    try {
      await conversationService.deleteConversation(id);
      context.deleteConversation(id);
    } catch (err) {
      console.error(`Error deleting conversation ${id}:`, err);
    }
  };

    // load the conversations from the API on mount
    useEffect(() => {
        fetchConversations();
    },[]);

  return {
    ...context,
    fetchConversations,
    fetchConversationById,
    deleteConversation,
  };
};
