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

  // Déclaration préliminaire pour résoudre la dépendance circulaire
  const loadMessagesRef = useCallback(async (convId: number) => {}, []);
  const loadConversationRef = useCallback(async (convId: number) => {}, []);

  // Charger les messages d'une conversation
  const loadMessages = useCallback(async (convId: number) => {
    if (!convId) {
      console.error("No conversation ID provided to loadMessages");
      return;
    }
    
    setState(prevState => ({ ...prevState, isLoading: true }));
    
    try {
      console.log(`🔄 Loading messages for conversation ID: ${convId}`);
      const response = await apiService.get<Message[]>(`/messages/conv/${convId}`);
      console.log(`✅ Received ${response?.length || 0} messages from API:`, response);
      
      if (Array.isArray(response)) {
        setState(prevState => ({
          ...prevState,
          messages: response,
          isLoading: false
        }));
      } else {
        console.error("❌ API returned non-array response for messages:", response);
        setState(prevState => ({
          ...prevState,
          error: 'Format de réponse invalide du serveur',
          isLoading: false,
          messages: [] // Réinitialiser les messages en cas d'erreur
        }));
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      setState(prevState => ({
        ...prevState,
        error: 'Échec du chargement des messages',
        isLoading: false
      }));
    }
  }, []);

  // Assigner la fonction réelle à la référence
  Object.assign(loadMessagesRef, { current: loadMessages });

  // Charger une conversation
  const loadConversation = useCallback(async (convId: number) => {
    if (!convId) {
      console.error("No conversation ID provided to loadConversation");
      return;
    }
    
    setState(prevState => ({ 
      ...prevState, 
      isLoading: true, 
      error: null,
      // Effacer les messages précédents pour éviter confusion
      messages: []
    }));
    
    try {
      console.log(`🔄 Loading conversation: ${convId}`);
      const response = await apiService.get<Conversation>(`/conversation/${convId}`);
      console.log("✅ Conversation loaded:", response);
      
      // Mettre à jour les détails de la conversation
      setState(prevState => ({
        ...prevState,
        currentConversation: response
      }));
      
      // Charger les messages de cette conversation
      await loadMessages(convId);
    } catch (error) {
      console.error("❌ Error loading conversation:", error);
      
      setState(prevState => ({
        ...prevState,
        error: 'Échec du chargement de la conversation',
        isLoading: false
      }));
    }
  }, [loadMessages]);
  
  // Assigner la fonction réelle à la référence
  Object.assign(loadConversationRef, { current: loadConversation });

  // Envoyer un message
  const sendMessage = useCallback(async (convId: number | undefined, content: string) => {
    if (!content.trim()) {
      console.warn("Empty message, not sending");
      return;
    }
    
    console.log(`📤 Sending message "${content}" to conversation: ${convId || 'new'}`);

    // Générer des IDs temporaires uniques
    const tempUserId = `temp-user-${Date.now()}`;
    
    // Ajouter le message utilisateur immédiatement à l'UI
    setState(prevState => ({
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
      error: null // Réinitialiser les erreurs précédentes
    }));
    
    // Ajouter l'indicateur "bot is typing"
    const tempBotId = `temp-bot-${Date.now()}`;
    const typingTimeout = setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        messages: [
          ...prevState.messages,
          {
            id: tempBotId,
            convId: convId || 0,
            content: "...",
            isBot: true,
            createdAt: new Date().toISOString()
          }
        ]
      }));
    }, 300);
    
    try {
      const payload = {
        conversationId: convId || null,
        message: content,
        projectId: null
      };
      
      console.log("📦 API payload:", payload);
      const response = await apiService.post<any>('/messages/add', payload);
      console.log("📩 API response:", response);
      
      // Annuler le timeout si la réponse arrive avant
      clearTimeout(typingTimeout);
      
      // Déterminer l'ID de conversation à partir de la réponse
      // Si nous avons un convId de la réponse, l'utiliser
      const responseConvId = response.convId || response.conversationId || null;
      
      if (responseConvId) {
        console.log(`✅ Message sent to conversation ID: ${responseConvId}`);
        
        // Nettoyer les messages temporaires
        setState(prevState => ({
          ...prevState,
          messages: prevState.messages.filter(m => {
            if (typeof m.id === 'number') return true;
            if (typeof m.id !== 'string') return true;
            return !m.id.includes('temp');
          })
        }));
        
        // Charger la conversation avec l'ID obtenu
        if (!convId || convId !== responseConvId) {
          // Si c'est une nouvelle conversation ou si l'ID a changé
          await loadConversation(responseConvId);
        } else {
          // Si c'est la même conversation, recharger les messages
          await loadMessages(convId);
        }
      } else {
        console.error("❌ No conversation ID found in response", response);
        setState(prevState => ({
          ...prevState,
          error: "Erreur: Impossible d'identifier la conversation",
          isLoading: false,
          messages: prevState.messages.filter(m => {
            if (typeof m.id !== 'string') return true;
            return !m.id.includes('temp-bot');
          })
        }));
      }
    } catch (error) {
      // Annuler le timeout en cas d'erreur
      clearTimeout(typingTimeout);
      
      console.error("❌ Error sending message:", error);
      
      setState(prevState => ({
        ...prevState,
        error: "Erreur lors de l'envoi du message. Veuillez réessayer.",
        isLoading: false,
        // Supprimer uniquement l'indicateur du bot, garder le message utilisateur
        messages: prevState.messages.filter(m => {
          if (typeof m.id !== 'string') return true;
          return !m.id.includes('temp-bot');
        })
      }));
    }
  }, [loadMessages, loadConversation]);

  // Créer une nouvelle conversation
  const createConversation = useCallback(async (title: string) => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));
    
    try {
      console.log(`🆕 Creating new conversation with title: "${title}"`);
      const response = await apiService.post<Conversation>('/conversation/add', { title });
      console.log("✅ Conversation created:", response);
      
      setState(prevState => ({ ...prevState, isLoading: false }));
      return response;
    } catch (error) {
      console.error("❌ Error creating conversation:", error);
      
      setState(prevState => ({
        ...prevState,
        error: 'Échec de création de la conversation',
        isLoading: false
      }));
      
      return null;
    }
  }, []);

  // Charger les messages au montage du composant
  useEffect(() => {
    if (conversationId && conversationId > 0) {
      console.log(`🔄 Initial load for conversation ID: ${conversationId}`);
      loadConversation(conversationId);
    } else {
      console.log("No conversation ID provided at mount, starting fresh");
    }
  }, [conversationId, loadConversation]);
  
  // Copier un message
  const copyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => console.log('✅ Message copied to clipboard'))
      .catch(err => console.error('❌ Could not copy message:', err));
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
