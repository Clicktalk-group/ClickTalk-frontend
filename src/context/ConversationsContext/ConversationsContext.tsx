import { createContext, PropsWithChildren, useReducer } from "react";
import { Conversation } from "../../types/conversation.types";

interface ConversationsContextType {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  addToConversations: (conversation: Conversation) => void;
  deleteConversation: (conversationId: number) => void;
}

const defaultContext: ConversationsContextType  = {
  conversations: [],
  setConversations: () => {},
  addToConversations: () => {},
  deleteConversation: () => {},
};

const initialState = {
  conversations: [],
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
      case "delete_conversation":
        return {
          ...prevState,
          conversations: prevState.conversations.filter(
            (c: Conversation) => c.id !== action.payload
          ),
        };
      
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
    deleteConversation: (conversationId: number) => {
      dispatch({
        type: "set_conversations",
        payload: state.conversations.filter(
          (c: Conversation) => c.id !== conversationId
        ),
      });
    }
  };

  return (
    <ConversationsContext.Provider value={conversationsContext}>
      {children}
    </ConversationsContext.Provider>
  );
}

export default ConversationsContextProvider;
