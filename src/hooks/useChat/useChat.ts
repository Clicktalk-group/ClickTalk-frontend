import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Message,
  ChatState,
  ApiMessageResponse,
} from "../../types/chat.types";
import apiService from "../../services/api/api";
import { useConversation } from "../useConversation/useConversation";
import { conversationService } from "../../services/conversation/conversation";
import { useProject } from "../useProject/useProject";
import { useNavigate } from "react-router-dom";

const useChat = (conversationId?: number) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    currentConversationId: null,
    error: null,
    streamingMessage: null
  });
  const { fetchConversationById } = useConversation();
  const {addConversationToProject} = useProject();
  const navigate  = useNavigate();
  
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
        return prevState;
      }
    });
  }, []);

  // Charger les messages d'une conversation - avec memoization optimisée
  const loadMessages = useCallback(async (convId: number) => {
    if (!convId) {
      return;
    }
    
    safeSetState(prevState => ({ ...prevState, isLoading: true }));
    
    try {
      const response = await apiService.get<Message[]>(`/messages/conv/${convId}`);
      
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
        safeSetState(prevState => ({
          ...prevState,
          error: 'Format de réponse invalide du serveur',
          isLoading: false
        }));
      }
    } catch (error) {
      safeSetState(prevState => ({
        ...prevState,
        error: 'Échec du chargement des messages',
        isLoading: false
      }));
    }
  }, [safeSetState]);

  // Assigner la fonction réelle à la référence
  useEffect(() => {
    loadMessagesRef.current = loadMessages;
  }, [loadMessages]);

  // Gestionnaire de chunks optimisé
  const handleStreamChunk = useCallback((chunk: string) => {
    // Enregistrer les métriques seulement si nécessaire
    if (chunk.length > 0) {
      safeSetState(prevState => {
        // Ajouter le nouveau morceau au message en streaming
        const newStreamingContent = (prevState.streamingMessage || '') + chunk;
        return {
          ...prevState,
          streamingMessage: newStreamingContent
        };
      });
    }
  }, [safeSetState]);

  // Envoyer un message avec support de streaming et métriques - optimisé
  const sendMessage = useCallback(async (convId: number | undefined, content: string, projectId?: number) => {
    if (!content.trim()) {
      return;
    }
    
    // Générer des IDs temporaires uniques une seule fois
    const tempUserId = `temp-user-${Date.now()}`;
    const tempBotId = `temp-bot-${Date.now()}`;
    
    // Garder une copie des messages actuels pour restaurer en cas d'erreur
    const currentMessages = [...messagesRef.current];
    
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
      const response = await apiService.stream<ApiMessageResponse>(
        '/messages/add', 
        payload,
        handleStreamChunk
      );
      
      // Déterminer l'ID de conversation
      const responseConvId = response?.convId || response?.conversationId ||
        (response?.id && response?.user ? response.id : null) ||
        convId || null;

      // if first message fetch the conversation
      if (responseConvId && !convId) {
        if(projectId){
          try{
            const conversation = await conversationService.getConversationById(responseConvId)
            await addConversationToProject(projectId, conversation)
          }catch(err){
            // Gestion silencieuse des erreurs
          }
        }else{
          fetchConversationById(responseConvId);
          navigate(`/chat/${responseConvId}`);
        }
      }

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
          
          return {
            ...prevState,
            currentConversationId: responseConvId,
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
              // Gestion silencieuse des erreurs
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
              // Gestion silencieuse des erreurs
            }
          }, 200);
        }
      } else {
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
      safeSetState(prevState => ({
        ...prevState,
        error: "Erreur lors de l'envoi du message. Veuillez réessayer.",
        isLoading: false,
        streamingMessage: null,
        messages: currentMessages
      }));
    }
  },
    [
      handleStreamChunk,
      safeSetState,
      fetchConversationById,
      navigate,
      addConversationToProject
    ]
  );

  // Charger les messages au montage du composant
  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
    } else {
      setState((prevState) => ({
        ...prevState,
        messages: [],
      }))
    }
    
    // Cleanup function to cancel any pending operations
    return () => {
      // Cleanup code
    };
  }, [conversationId, loadMessages]);
  
  // Copier un message - optimisé avec mémoïsation
  const copyMessage = useCallback((content: string) => {
    if (!content) return;
    
    navigator.clipboard.writeText(content)
      .catch(() => {
        // Gestion silencieuse des erreurs de copie
      });
  }, []);

  // Mémoïsation du résultat final pour éviter les re-rendus inutiles
  return useMemo(() => ({
    ...state,
    sendMessage,
    copyMessage
  }), [
    state,
    sendMessage,
    copyMessage
  ]);
};

export default useChat;
