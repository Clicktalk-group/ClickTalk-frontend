import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message, CreateConversationRequest, SendMessageRequest } from '../../types/conversation.types';
import { conversationService } from '../../services/conversation/conversation';

export const useConversation = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les conversations
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await conversationService.getAllConversations();
      setConversations(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des conversations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger une conversation par ID
  const fetchConversationById = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await conversationService.getConversationById(id);
      setCurrentConversation(data);
      
      // Charger les messages de cette conversation
      const messagesData = await conversationService.getConversationMessages(id);
      setMessages(messagesData);
      
      setError(null);
    } catch (err) {
      setError(`Erreur lors du chargement de la conversation ${id}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une nouvelle conversation
  const createConversation = useCallback(async (data: CreateConversationRequest) => {
    setLoading(true);
    try {
      const newConversation = await conversationService.createConversation(data);
      setConversations(prev => [...prev, newConversation]);
      setCurrentConversation(newConversation);
      setMessages([]);
      setError(null);
      return newConversation;
    } catch (err) {
      setError('Erreur lors de la création de la conversation');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer une conversation
  const deleteConversation = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await conversationService.deleteConversation(id);
      setConversations(prev => prev.filter(conv => conv.id !== id));
      
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
        setMessages([]);
      }
      
      setError(null);
    } catch (err) {
      setError(`Erreur lors de la suppression de la conversation ${id}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentConversation]);

  // Envoyer un message
  const sendMessage = useCallback(async (data: SendMessageRequest) => {
    try {
      const newMessage = await conversationService.sendMessage(data);
      setMessages(prev => [...prev, newMessage]);
      setError(null);
      return newMessage;
    } catch (err) {
      setError('Erreur lors de l\'envoi du message');
      console.error(err);
      throw err;
    }
  }, []);

  // Charger les conversations d'un projet
  const fetchProjectConversations = useCallback(async (projectId: number): Promise<Conversation[]> => {
    setLoading(true);
    try {
      const data = await conversationService.getProjectConversations(projectId);
      setError(null);
      return data; // Renvoie les données au lieu de les définir dans l'état
    } catch (err) {
      setError(`Erreur lors du chargement des conversations du projet ${projectId}`);
      console.error(err);
      return []; // Renvoie un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les conversations au montage du composant
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    fetchConversations,
    fetchConversationById,
    createConversation,
    deleteConversation,
    sendMessage,
    fetchProjectConversations
  };
};
