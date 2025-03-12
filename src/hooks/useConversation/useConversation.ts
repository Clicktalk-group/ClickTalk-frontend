import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Conversation, Message, CreateConversationRequest, SendMessageRequest } from '../../types/conversation.types';
import { conversationService } from '../../services/conversation/conversation';

export const useConversation = () => {
  // États groupés pour une meilleure organisation
  const [state, setState] = useState({
    conversations: [] as Conversation[],
    currentConversation: null as Conversation | null,
    messages: [] as Message[],
    loading: false,
    error: null as string | null
  });

  // Refs pour éviter les appels inutiles et garder les références
  const conversationsRef = useRef<Conversation[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Définir un setter d'état plus sûr
  const safeSetState = useCallback((updater: (prevState: typeof state) => typeof state) => {
    setState(prevState => {
      try {
        return updater(prevState);
      } catch (err) {
        console.error('Error updating conversation state:', err);
        return prevState;
      }
    });
  }, []);

  // Mise à jour de la ref quand conversations change
  useEffect(() => {
    conversationsRef.current = state.conversations;
  }, [state.conversations]);

  // Nettoyer les requêtes en cours lors du démontage
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Charger toutes les conversations avec gestion des annulations
  const fetchConversations = useCallback(async () => {
    // Annuler toute requête existante
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    safeSetState(prev => ({ ...prev, loading: true }));
    
    try {
      const data = await conversationService.getAllConversations();
      
      if (!controller.signal.aborted) {
        safeSetState(prev => ({ 
          ...prev, 
          conversations: data, 
          loading: false,
          error: null 
        }));
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error('Error fetching conversations:', err);
        safeSetState(prev => ({
          ...prev,
          loading: false,
          error: 'Erreur lors du chargement des conversations'
        }));
      }
    }
  }, [safeSetState]);

  // Charger une conversation par ID avec optimisation des appels
  const fetchConversationById = useCallback(async (id: number) => {
    if (!id) return;
    
    // Vérifier si nous avons déjà la conversation en mémoire
    const existingConv = conversationsRef.current.find(conv => conv.id === id);
    
    if (existingConv) {
      safeSetState(prev => ({ 
        ...prev, 
        currentConversation: existingConv 
      }));
    }
    
    // Annuler toute requête existante
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    safeSetState(prev => ({ ...prev, loading: true }));
    
    try {
      // Requêtes parallèles pour améliorer les performances
      const [conversationData, messagesData] = await Promise.all([
        conversationService.getConversationById(id),
        conversationService.getConversationMessages(id)
      ]);
      
      if (!controller.signal.aborted) {
        safeSetState(prev => ({
          ...prev,
          currentConversation: conversationData,
          messages: messagesData,
          loading: false,
          error: null
        }));
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        console.error(`Error fetching conversation ${id}:`, err);
        safeSetState(prev => ({
          ...prev,
          loading: false,
          error: `Erreur lors du chargement de la conversation ${id}`
        }));
      }
    }
  }, [safeSetState]);

  // Créer une nouvelle conversation avec validation
  const createConversation = useCallback(async (data: CreateConversationRequest) => {
    if (!data.title?.trim()) {
      throw new Error("Le titre de la conversation est requis");
    }
    
    safeSetState(prev => ({ ...prev, loading: true }));
    
    try {
      const newConversation = await conversationService.createConversation(data);
      
      safeSetState(prev => ({
        ...prev,
        conversations: [...prev.conversations, newConversation],
        currentConversation: newConversation,
        messages: [],
        loading: false,
        error: null
      }));
      
      return newConversation;
    } catch (err) {
      console.error('Error creating conversation:', err);
      safeSetState(prev => ({
        ...prev,
        loading: false,
        error: 'Erreur lors de la création de la conversation'
      }));
      throw err;
    }
  }, [safeSetState]);

  // Supprimer une conversation avec confirmation d'action
  const deleteConversation = useCallback(async (id: number) => {
    if (!id) return;
    
    safeSetState(prev => ({ ...prev, loading: true }));
    
    try {
      await conversationService.deleteConversation(id);
      
      safeSetState(prev => {
        const newState = { 
          ...prev,
          conversations: prev.conversations.filter(conv => conv.id !== id),
          loading: false,
          error: null
        };
        
        // Réinitialiser la conversation actuelle et les messages si nécessaire
        if (prev.currentConversation?.id === id) {
          newState.currentConversation = null;
          newState.messages = [];
        }
        
        return newState;
      });
    } catch (err) {
      console.error(`Error deleting conversation ${id}:`, err);
      safeSetState(prev => ({
        ...prev,
        loading: false,
        error: `Erreur lors de la suppression de la conversation ${id}`
      }));
    }
  }, [safeSetState]);

  // Envoyer un message avec validation du contenu
  const sendMessage = useCallback(async (data: SendMessageRequest) => {
    if (!data.content?.trim()) {
      throw new Error("Le contenu du message est vide");
    }
    
    try {
      const newMessage = await conversationService.sendMessage(data);
      
      safeSetState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        error: null
      }));
      
      return newMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      safeSetState(prev => ({
        ...prev,
        error: 'Erreur lors de l\'envoi du message'
      }));
      throw err;
    }
  }, [safeSetState]);

  // Charger les conversations d'un projet avec mise en cache
  const fetchProjectConversations = useCallback(async (projectId: number): Promise<Conversation[]> => {
    if (!projectId) return [];
    
    safeSetState(prev => ({ ...prev, loading: true }));
    
    try {
      const data = await conversationService.getProjectConversations(projectId);
      
      safeSetState(prev => ({
        ...prev,
        loading: false,
        error: null
      }));
      
      // On ne modifie pas l'état, mais on renvoie les données directement
      return data;
    } catch (err) {
      console.error(`Error fetching project conversations ${projectId}:`, err);
      safeSetState(prev => ({
        ...prev,
        loading: false,
        error: `Erreur lors du chargement des conversations du projet ${projectId}`
      }));
      return [];
    }
  }, [safeSetState]);

  // Charger les conversations au montage du composant
  useEffect(() => {
    fetchConversations();
    
    return () => {
      // Cleanup
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchConversations]);

  // Mémoisation du résultat pour éviter les re-rendus inutiles
  return useMemo(() => ({
    ...state,
    fetchConversations,
    fetchConversationById,
    createConversation,
    deleteConversation,
    sendMessage,
    fetchProjectConversations
  }), [
    state,
    fetchConversations,
    fetchConversationById,
    createConversation,
    deleteConversation,
    sendMessage,
    fetchProjectConversations
  ]);
};
