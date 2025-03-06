import { useState, useEffect, useCallback } from 'react';
import { Message, Conversation, ChatState } from '../../types/chat.types';
import apiService from '../../services/api/api';

const useChat = (conversationId?: number) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    currentConversation: null,
    error: null
  });

  // Charger les messages d'une conversation
  const loadMessages = useCallback(async (convId: number) => {
    if (!convId) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Spécifier que la réponse sera un tableau de messages
      const response = await apiService.get<Message[]>(`/messages/conv/${convId}`);
      setState(prev => ({
        ...prev,
        messages: response,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load messages',
        isLoading: false
      }));
    }
  }, []);

  // Envoyer un message
  const sendMessage = useCallback(async (convId: number | undefined, content: string) => {
    if (!content.trim()) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Créer un message temporaire optimiste
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      convId: convId || 0,
      content: content,
      isBot: false,
      createdAt: new Date().toISOString()
    };
    
    // Ajouter le message temporaire à l'UI pour une expérience plus réactive
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, tempMessage]
    }));
    
    try {
      // Envoyer le message au backend avec le format attendu par l'API
      // Utiliser le DTO correct qui correspond à SendMessageRequestDTO du backend
      await apiService.post('/messages/add', {
        conversationId: convId || null,  // Si 0 ou undefined, envoyer null pour créer une nouvelle conversation
        message: content,
        projectId: null  // Pas de projet associé pour l'instant
      });
      
      // Charger tous les messages mis à jour (y compris la réponse du bot)
      // Seulement si nous avons un ID de conversation valide
      if (convId) {
        await loadMessages(convId);
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setState(prev => ({
        ...prev,
        error: "Erreur lors de l'envoi du message",
        isLoading: false
      }));
    }
  }, [loadMessages]);

  // Créer une nouvelle conversation
  const createConversation = useCallback(async (title: string) => {
    try {
      const response = await apiService.post<Conversation>('/conversation/add', {
        title
      });
      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create conversation'
      }));
      return null;
    }
  }, []);

  // Charger une conversation
  const loadConversation = useCallback(async (convId: number) => {
    try {
      const response = await apiService.get<Conversation>(`/conversation/${convId}`);
      setState(prev => ({
        ...prev,
        currentConversation: response
      }));
      await loadMessages(convId);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load conversation'
      }));
    }
  }, [loadMessages]);

  // Charger les messages au montage du composant
  useEffect(() => {
    if (conversationId && conversationId > 0) {
      loadConversation(conversationId);
    }
  }, [conversationId, loadConversation]);
  
  // Copier un message
  const copyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => console.log('Message copied to clipboard'))
      .catch(err => console.error('Could not copy message: ', err));
  }, []);

  return {
    ...state,
    sendMessage,
    createConversation,
    loadConversation,
    copyMessage
  };
};

export default useChat;
