import { createContext, PropsWithChildren, useReducer } from "react";
import { Project } from "../../types/project.types";

interface ProjectContextType {
projects: Project[];
currentProject: Project | null;
loading: boolean;
error: string | null;
setProjects: (projects: Project[]) => void;
addToProjects: (project: Project) => void;
setCurrentProject: (project: Project) => void;
setLoading: (loading: boolean) => void;
setError: (error: string) => void;
}

const defaultContext: ProjectContextType  = {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
    setProjects: () => {},
    addToProjects: () => {},
    setCurrentProject: () => {},
    setLoading: () => {},
    setError: () => {},
};

const initialState = {
  Project: [],
  currentProject: null,
  loading: false, 
  error: null,
};

export const ProjectContext = createContext(defaultContext);

function ProjectContextProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer((prevState: any, action: any) => {
    switch (action.type) {
        case "set_Projects":
            return {
            ...prevState,
            Projects: action.payload,
            };
        case "add_Project":
            return {
            ...prevState,
            Projects: [...prevState.Projects, action.payload],
            };
        case "set_current_Project":
            return {
            ...prevState,
            currentProject: action.payload,
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

  const projectContext: ProjectContextType= {
    projects: state.Projects,
    currentProject: state.currentProject,
    loading: state.loading,
    error: state.error,
    setProjects: (projects: Project[]) => {
      dispatch({ type: "set_Projects", payload: projects });
    },
    addToProjects: (project: Project) => {
      dispatch({ type: "add_Project", payload: project });
    },
    setCurrentProject: (project: Project) => {
      dispatch({ type: "set_current_Project", payload: project });
    },
    setLoading: (loading: boolean) => {
      dispatch({ type: "set_loading", payload: loading });
    },
    setError: (error: string) => {
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
