// src/hooks/useChat/useChat.ts

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Message, Conversation, ChatState, ApiMessageResponse } from '../../types/chat.types';
import apiService from '../../services/api/api';
import usePerformanceMetrics from '../usePerformanceMetrics/usePerformanceMetrics';

const useChat = (conversationId?: number) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    currentConversation: null,
    error: null,
    streamingMessage: null
  });

  // Extraction des métriques de performance avec mémoïsation
  const metrics = usePerformanceMetrics();
  
  // Mémoïsation des fonctions de métriques pour éviter les re-rendus
  const {
    recordMessageStart,
    recordMessageEnd,
    recordStreamingChunk,
    recordRenderStart,
    recordRenderEnd,
    clearMetrics
  } = useMemo(() => metrics, [metrics]);

  // Ref pour accéder aux messages actuels sans créer de dépendances
  const messagesRef = useRef<Message[]>([]);
  
  // Mettre à jour la référence lorsque les messages changent
  useEffect(() => {
    messagesRef.current = state.messages;
  }, [state.messages]);

  // Références pour les fonctions pour résoudre les dépendances circulaires
  const loadMessagesRef = useRef(async (convId: number) => {});
  const loadConversationRef = useRef(async (convId: number) => {});

  // Version optimisée de setState avec fonction de mise à jour
  const safeSetState = useCallback((updater: (prevState: ChatState) => ChatState) => {
    setState(prevState => {
      try {
        return updater(prevState);
      } catch (error) {
        console.error('Error updating state:', error);
        return prevState;
      }
    });
  }, []);

  // Charger les messages d'une conversation - avec memoization optimisée
  const loadMessages = useCallback(async (convId: number) => {
    if (!convId) {
      console.error("No conversation ID provided to loadMessages");
      return;
    }
    
    safeSetState(prevState => ({ ...prevState, isLoading: true }));
    
    try {
      console.log(`🔄 Loading messages for conversation ID: ${convId}`);
      recordRenderStart(`loadMessages-${convId}`);
      const response = await apiService.get<Message[]>(`/messages/conv/${convId}`);
      recordRenderEnd(`loadMessages-${convId}`);
      
      if (Array.isArray(response)) {
        safeSetState(prevState => ({
          ...prevState,
          messages: response,
          isLoading: false
        }));
      } else if (response === null || response === undefined) {
        safeSetState(prevState => ({
          ...prevState,
          messages: [],
          isLoading: false
        }));
      } else {
        console.error("❌ API returned non-array response for messages:", response);
        safeSetState(prevState => ({
          ...prevState,
          error: 'Format de réponse invalide du serveur',
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      safeSetState(prevState => ({
        ...prevState,
        error: 'Échec du chargement des messages',
        isLoading: false
      }));
    }
  }, [safeSetState, recordRenderStart, recordRenderEnd]);

  // Assigner la fonction réelle à la référence
  useEffect(() => {
    loadMessagesRef.current = loadMessages;
  }, [loadMessages]);

  // Charger une conversation
  const loadConversation = useCallback(async (convId: number) => {
    if (!convId) {
      console.error("No conversation ID provided to loadConversation");
      return;
    }
    
    safeSetState(prevState => ({ 
      ...prevState, 
      isLoading: true, 
      error: null,
    }));
    
    try {
      console.log(`🔄 Loading conversation: ${convId}`);
      recordRenderStart(`loadConversation-${convId}`);
      const response = await apiService.get<Conversation>(`/conversation/${convId}`);
      recordRenderEnd(`loadConversation-${convId}`);
      
      // Mettre à jour les détails de la conversation
      safeSetState(prevState => ({
        ...prevState,
        currentConversation: response
      }));
      
      // Charger les messages de cette conversation
      await loadMessages(convId);
    } catch (error) {
      console.error("❌ Error loading conversation:", error);
      
      safeSetState(prevState => ({
        ...prevState,
        error: 'Échec du chargement de la conversation',
        isLoading: false
      }));
    }
  }, [loadMessages, recordRenderStart, recordRenderEnd, safeSetState]);
  
  // Assigner la fonction réelle à la référence
  useEffect(() => {
    loadConversationRef.current = loadConversation;
  }, [loadConversation]);

  // Gestionnaire de chunks optimisé
  const handleStreamChunk = useCallback((chunk: string) => {
    // Enregistrer les métriques seulement si nécessaire
    if (chunk.length > 0) {
      recordStreamingChunk(chunk);
      
      safeSetState(prevState => {
        // Ajouter le nouveau morceau au message en streaming
        const newStreamingContent = (prevState.streamingMessage || '') + chunk;
        return {
          ...prevState,
          streamingMessage: newStreamingContent
        };
      });
    }
  }, [recordStreamingChunk, safeSetState]);

  // Mémoïsation optimisée pour la création de conversation
  const createConversation = useCallback(async (title: string) => {
    if (!title.trim()) {
      console.warn("Empty title, not creating conversation");
      return null;
    }

    safeSetState(prevState => ({ ...prevState, isLoading: true, error: null }));
    
    try {
      recordRenderStart('createConversation');
      const response = await apiService.post<Conversation>('/conversation/add', { title });
      recordRenderEnd('createConversation');
      
      safeSetState(prevState => ({ ...prevState, isLoading: false }));
      return response;
    } catch (error) {
      console.error("❌ Error creating conversation:", error);
      
      safeSetState(prevState => ({
        ...prevState,
        error: 'Échec de création de la conversation',
        isLoading: false
      }));
      
      return null;
    }
  }, [recordRenderStart, recordRenderEnd, safeSetState]);

  // Envoyer un message avec support de streaming et métriques - optimisé
  const sendMessage = useCallback(async (convId: number | undefined, content: string, projectId?: number) => {
    if (!content.trim()) {
      console.warn("Empty message, not sending");
      return;
    }
    
    // Générer des IDs temporaires uniques une seule fois
    const tempUserId = `temp-user-${Date.now()}`;
    const tempBotId = `temp-bot-${Date.now()}`;
    
    // Garder une copie des messages actuels pour restaurer en cas d'erreur
    const currentMessages = [...messagesRef.current];
    
    // Commencer à mesurer le temps de livraison du message
    recordMessageStart(tempUserId);
    
    // Ajouter le message utilisateur immédiatement à l'UI
    safeSetState(prevState => ({
      ...prevState,
      messages: [
        ...prevState.messages, 
        {
          id: tempUserId,
          convId: convId || 0,
          content,
          isBot: false,
          createdAt: new Date().toISOString()
        }
      ],
      isLoading: true,
      error: null,
      streamingMessage: null
    }));
    
    // Ajouter un message bot vide avec requestAnimationFrame pour optimiser le rendu
    requestAnimationFrame(() => {
      safeSetState(prevState => ({
        ...prevState,
        messages: [
          ...prevState.messages,
          {
            id: tempBotId,
            convId: convId || 0,
            content: "",
            isBot: true,
            createdAt: new Date().toISOString()
          }
        ]
      }));
    });
    
    try {
      const payload = {
        conversationId: convId || null,
        message: content,
        projectId: projectId || null
      };
      
      // Appel API avec streaming
      recordRenderStart(`apiCall-${tempBotId}`);
      const response = await apiService.stream<ApiMessageResponse>(
        '/messages/add', 
        payload,
        handleStreamChunk
      );
      recordRenderEnd(`apiCall-${tempBotId}`);
      
      // Enregistrer la fin du message et sa taille
      recordMessageEnd(tempUserId, content.length);
      
      // Déterminer l'ID de conversation
      const responseConvId = response?.convId || response?.conversationId || 
                            (response?.id && response?.userId ? response.id : null) || 
                            convId || null;
      
      if (responseConvId) {
        // Intégrer le message en streaming dans la liste des messages avec une seule mise à jour d'état
        safeSetState(prevState => {
          const updatedMessages = prevState.messages.map(msg => {
            if (typeof msg.id === 'string' && msg.id === tempBotId && prevState.streamingMessage) {
              // Remplacer le message temporaire du bot
              return {
                ...msg,
                content: prevState.streamingMessage
              };
            }
            return msg;
          });
          
          // Enregistrer la taille finale du message reçu
          if (prevState.streamingMessage) {
            recordMessageEnd(tempBotId, prevState.streamingMessage.length);
          }
          
          return {
            ...prevState,
            messages: updatedMessages,
            streamingMessage: null,
            isLoading: false
          };
        });
        
        // Charger la conversation complète après un court délai avec requestIdleCallback si disponible
        const finalConvId = Number(responseConvId);
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => {
            try {
              if (!convId || convId !== finalConvId) {
                loadConversationRef.current(finalConvId);
              }
            } catch (err) {
              console.error("Error refreshing conversation after send:", err);
            }
          });
        } else {
          // Fallback pour les navigateurs qui ne supportent pas requestIdleCallback
          setTimeout(() => {
            try {
              if (!convId || convId !== finalConvId) {
                loadConversationRef.current(finalConvId);
              }
            } catch (err) {
              console.error("Error refreshing conversation after send:", err);
            }
          }, 200);
        }
      } else {
        console.error("❌ No conversation ID found in response", response);
        safeSetState(prevState => ({
          ...prevState,
          error: "Erreur: Impossible d'identifier la conversation",
          isLoading: false,
          streamingMessage: null,
          // Garder le message de l'utilisateur, supprimer juste le message temporaire du bot
          messages: prevState.messages.filter(m => {
            if (typeof m.id !== 'string') return true;
            return !m.id.includes('temp-bot');
          })
        }));
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      
      safeSetState(prevState => ({
        ...prevState,
        error: "Erreur lors de l'envoi du message. Veuillez réessayer.",
        isLoading: false,
        streamingMessage: null,
        messages: currentMessages
      }));
    }
  }, [handleStreamChunk, recordMessageStart, recordMessageEnd, recordRenderStart, recordRenderEnd, safeSetState]); 

  // Charger les messages au montage du composant
  useEffect(() => {
    if (conversationId && conversationId > 0) {
      loadConversation(conversationId);
    }
    
    // Clear metrics when conversation changes
    clearMetrics();
    
    // Cleanup function to cancel any pending operations
    return () => {
      clearMetrics();
    };
  }, [conversationId, loadConversation, clearMetrics]);
  
  // Copier un message - optimisé avec mémoïsation
  const copyMessage = useCallback((content: string) => {
    if (!content) return;
    
    navigator.clipboard.writeText(content)
      .then(() => console.log('✅ Message copied to clipboard'))
      .catch(err => console.error('❌ Could not copy message:', err));
  }, []);

  // Mémoïsation du résultat final pour éviter les re-rendus inutiles
  return useMemo(() => ({
    ...state,
    sendMessage,
    createConversation,
    loadConversation,
    copyMessage,
    performanceMetrics: metrics.metrics
  }), [
    state,
    sendMessage,
    createConversation,
    loadConversation,
    copyMessage,
    metrics.metrics
  ]);
};

export default useChat;
