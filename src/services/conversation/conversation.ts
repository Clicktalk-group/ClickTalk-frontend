import { apiService } from '../api/api';
import { Conversation, CreateConversationRequest, Message, SendMessageRequest } from '../../types/conversation.types';

export const conversationService = {
  // Récupérer toutes les conversations
  getAllConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await apiService.get<Conversation[]>('/conversation/all');
      return response;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },
  
  // Récupérer une conversation par ID
  getConversationById: async (id: number): Promise<Conversation> => {
    try {
      const response = await apiService.get<Conversation>(`/conversation/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching conversation with id ${id}:`, error);
      throw error;
    }
  },
  
  // Créer une nouvelle conversation
  createConversation: async (data: CreateConversationRequest): Promise<Conversation> => {
    try {
      const response = await apiService.post<Conversation>('/conversation/add', data);
      return response;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },
  
  // Supprimer une conversation
  deleteConversation: async (id: number): Promise<void> => {
    try {
      await apiService.delete(`/conversation/delete/${id}`);
    } catch (error) {
      console.error(`Error deleting conversation with id ${id}:`, error);
      throw error;
    }
  },
  
  // Récupérer les messages d'une conversation
  getConversationMessages: async (convId: number): Promise<Message[]> => {
    try {
      const response = await apiService.get<Message[]>(`/messages/conv/${convId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching messages for conversation ${convId}:`, error);
      throw error;
    }
  },
  
  // Envoyer un message dans une conversation
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    try {
      const response = await apiService.post<Message>('/messages/add', data);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  // Récupérer les conversations d'un projet
  getProjectConversations: async (projectId: number): Promise<Conversation[]> => {
    try {
      const response = await apiService.get<Conversation[]>(`/conversation/project/${projectId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching conversations for project ${projectId}:`, error);
      throw error;
    }
  }
};
