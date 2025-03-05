// src/hooks/useChat/useChat.ts
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
  const sendMessage = useCallback(async (convId: number, content: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Créer un message temporaire optimiste
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      convId: convId,
      content: content,
      isBot: false,
      createdAt: new Date().toISOString()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, tempMessage]
    }));
    
    try {
      const response = await apiService.post<Message>('/messages/add', {
        convId: convId,
        content: content,
        isBot: false
      });
      
      // Une fois que nous avons la réponse, nous remplaçons le message temporaire
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === tempMessage.id ? response : msg
        ),
        isLoading: false
      }));
      
      // Simuler la réception d'une réponse du bot (à remplacer par une réelle API)
      setState(prev => ({ ...prev, isLoading: true }));
      await new Promise(r => setTimeout(r, 1500)); // Attente artificielle
      
      const botResponse = await apiService.post<Message>('/messages/add', {
        convId: convId,
        content: 'Ceci est une réponse automatique du bot',
        isBot: true
      });
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, botResponse],
        isLoading: false
      }));
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to send message',
        isLoading: false
      }));
    }
  }, []);

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
    if (conversationId) {
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
