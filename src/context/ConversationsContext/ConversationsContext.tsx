import { createContext, PropsWithChildren, useReducer } from "react";
import { Conversation, Message } from "../../types/conversation.types";

interface ConversationsContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  error: string | null;
  setConversations: (conversations: Conversation[]) => void;
  addToConversations: (conversation: Conversation) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  deleteConversation: (conversationId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
}

const defaultContext: ConversationsContextType  = {
  conversations: [],
  currentConversation: null,
  loading: false,
  error: null,
  setConversations: () => {},
  addToConversations: () => {},
  setCurrentConversation: () => {},
  deleteConversation: () => {},
  setLoading: () => {},
  setError: () => {},
};

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,
};

export const ConversationsContext = createContext(defaultContext);

function ConversationsContextProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer((prevState: any, action: any) => {
    switch (action.type) {
      case "set_conversations":
        return {
          ...prevState,
          conversations: action.payload,
        };
      case "add_conversation":
        return {
          ...prevState,
          conversations: [...prevState.conversations, action.payload],
        };
      case "set_current_conversation":
        return {
          ...prevState,
          currentConversation: action.payload,
        };
      case "delete_conversation":
        return {
          ...prevState,
          conversations: prevState.conversations.filter(
            (c: Conversation) => c.id !== action.payload
          ),
        };
      case "set_loading":
        return {
          ...prevState,
          loading: action.payload,
        };
      case "set_error":
        return {
          ...prevState,
          error: action.payload,
        };
      default:
        return prevState;
    }
  }, initialState);

  const conversationsContext = {
    conversations: state.conversations,
    currentConversation: state.currentConversation,
    loading: state.loading,
    error: state.error,
    setConversations: (conversations: Conversation[]) => {
      dispatch({ type: "set_conversations", payload: conversations });
    },
    addToConversations: (conversation: Conversation) => {
      // Check if the conversation already exists
      if (
        state.conversations.find((c: Conversation) => c.id === conversation.id)
      ) {
        return;
      }

      dispatch({ type: "add_conversation", payload: conversation });
    },
    setCurrentConversation: (conversation: Conversation | null) => {
      dispatch({ type: "set_current_conversation", payload: conversation });
    },
    deleteConversation: (conversationId: number) => {
      // if the conversation is the current conversation, set it to null
      if (state.currentConversation?.id === conversationId) {
        dispatch({ type: "set_current_conversation", payload: null });
      }
      dispatch({
        type: "set_conversations",
        payload: state.conversations.filter(
          (c: Conversation) => c.id !== conversationId
        ),
      });
    },
    setLoading: (loading: boolean) => {
      dispatch({ type: "set_loading", payload: loading });
    },
    setError: (error: string) => {
      dispatch({ type: "set_error", payload: error });
    },
  };

  return (
    <ConversationsContext.Provider value={conversationsContext}>
      {children}
    </ConversationsContext.Provider>
  );
}

export default ConversationsContextProvider;
