import { createContext, PropsWithChildren, useReducer } from "react";
import { Project } from "../../types/project.types";
import { Conversation } from "../../types/conversation.types";

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  currentConversationId: number | null;
  loading: boolean;
  error: string | null;
  setProjects: (projects: Project[]) => void;
  addToProjects: (project: Project) => void;
  updateProject: (updatedProject: Project) => void;
  deleteProject: (id: number) => void;
  setCurrentProject: (project: Project) => void;
  setCurrentConversationId: (id: number | null) => void;
  addConversationToProject: (projectId: number, conversation: Conversation) => void;
  deleteConversationFromProject: (projectId: number, conversationId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const defaultContext: ProjectContextType = {
  projects: [],
  currentProject: null,
  currentConversationId: null,
  loading: false,
  error: null,
  setProjects: () => {},
  addToProjects: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  setCurrentProject: () => {},
  setCurrentConversationId: () => {},
  addConversationToProject: () => {},
  deleteConversationFromProject: () => {},
  setLoading: () => {},
  setError: () => {},
};

const initialState = {
  projects: [],
  currentProject: null,
  currentConversationId: null,
  loading: false,
  error: null,
};

export const ProjectContext = createContext(defaultContext);

function ProjectContextProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer((prevState: any, action: any) => {
    switch (action.type) {
      case "set_projects":
        return {
          ...prevState,
          projects: action.payload,
        };
      case "add_Project":
        return {
          ...prevState,
          projects: [...prevState.projects, action.payload],
          currentProject: action.payload,
        };
      case "update_Project":
        return {
          ...prevState,
          projects: prevState.projects.map((project: Project) =>
            project.id === action.payload.id ? action.payload : project
          ),
        };
      case "delete_Project":
        return {
          ...prevState,
          projects: prevState.projects.filter(
            (project: Project) => project.id !== action.payload
          ),
        };
      case "set_current_Project":
        return {
          ...prevState,
          currentProject: action.payload,
        };
      case "set_current_Conversation_Id":
        return {
          ...prevState,
          currentConversationId: action.payload,
        };
      case "delete_conversation":
        const isCurrentConversation =
          prevState.currentConversationId === action.payload.conversationId;

        return {
          ...prevState,
          projects: prevState.projects.map((project: Project) => {
            if (project.id === action.payload.projectId) {
              return {
                ...project,
                conversations: project.conversations.filter(
                  (conversation: Conversation) =>
                    conversation.id !== action.payload.conversationId
                ),
              };
            }
            return project;
          }),
          currentConversationId: isCurrentConversation
            ? null
            : prevState.currentConversationId, // Update this outside the map loop
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

  const projectContext: ProjectContextType = {
    projects: state.projects,
    currentProject: state.currentProject,
    currentConversationId: state.currentConversationId,
    loading: state.loading,
    error: state.error,
    setProjects: (projects: Project[]) => {
      dispatch({ type: "set_projects", payload: projects });
    },
    addToProjects: (project: Project) => {
      // Check if the project already exists
      const projectExists = state.projects.some(
        (p: Project) => p.id === project.id
      );

      if (projectExists) return;

      // Add the new project to the list
      dispatch({ type: "add_Project", payload: project });
    },
    updateProject: (updatedProject: Project) => {
      // Check if the current project is the one being updated
      if (state.currentProject?.id === updatedProject.id) {
        dispatch({ type: "set_current_Project", payload: updatedProject });
      }

      dispatch({
        type: "update_Project",
        payload: updatedProject,
      });
    },
    deleteProject: (id: number) => {
      // Check if the current project is the one being deleted
      if (state.currentProject?.id === id) {
        dispatch({ type: "set_current_Project", payload: null });
      }

      dispatch({
        type: "delete_Project",
        payload: id,
      });
    },
    setCurrentProject: (project: Project) => {
      dispatch({ type: "set_current_Project", payload: project });
    },
    setCurrentConversationId: (id: number | null) => {
      dispatch({ type: "set_current_Conversation_Id", payload: id });
    },
    addConversationToProject: (projectId: number, conversation: Conversation) => {
      // get the project by id
      const project = state.projects.find(
        (project: Project) => project.id === projectId
      );

      if (!project) {
        // Projet avec l'ID spécifié non trouvé
        return;
      }

      // update the project with the new conversation
      const updatedProject = {
        ...project,
        conversations: [...(project?.conversations || []), conversation],
      };

      dispatch({ type: "update_Project", payload: updatedProject });
      dispatch({ type: "set_current_Conversation_Id", payload: conversation.id });
    },
    deleteConversationFromProject: (projectId: number, conversationId: number) => {
      dispatch({
        type: "delete_conversation",
        payload: { projectId, conversationId }
      });
    },
    setLoading: (loading: boolean) => {
      dispatch({ type: "set_loading", payload: loading });
    },
    setError: (error: string | null) => {
      dispatch({ type: "set_error", payload: error });
    },
  };

  return (
    <ProjectContext.Provider value={projectContext}>
      {children}
    </ProjectContext.Provider>
  );
}

export default ProjectContextProvider;
