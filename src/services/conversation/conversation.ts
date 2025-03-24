import { apiService } from '../api/api';
import { Conversation, CreateConversationRequest, Message, SendMessageRequest } from '../../types/conversation.types';

export const conversationService = {
  // Récupérer toutes les conversations
  getAllConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await apiService.get<Conversation[]>('/conversation/all');
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Récupérer une conversation par ID
  getConversationById: async (id: number): Promise<Conversation> => {
    try {
      const response = await apiService.get<Conversation>(`/conversation/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Créer une nouvelle conversation
  createConversation: async (data: CreateConversationRequest): Promise<Conversation> => {
    try {
      const response = await apiService.post<Conversation>('/conversation/add', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Supprimer une conversation
  deleteConversation: async (id: number): Promise<void> => {
    try {
      await apiService.delete(`/conversation/delete/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Récupérer les messages d'une conversation
  getConversationMessages: async (convId: number): Promise<Message[]> => {
    try {
      const response = await apiService.get<Message[]>(`/messages/conv/${convId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Envoyer un message dans une conversation
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    try {
      const response = await apiService.post<Message>('/messages/add', data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Récupérer les conversations d'un projet
  getProjectConversations: async (projectId: number): Promise<Conversation[]> => {
    try {
      const response = await apiService.get<Conversation[]>(`/conversation/project/${projectId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
