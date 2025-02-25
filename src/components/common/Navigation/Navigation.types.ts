export interface NavigationItem {
    id: string;
    label: string;
    path: string;
    icon?: React.ReactNode;
  }
  
  export interface NavigationProps {
    items: NavigationItem[];
    currentPath: string;
    onNavigate: (path: string) => void;
    className?: string;
  }
  