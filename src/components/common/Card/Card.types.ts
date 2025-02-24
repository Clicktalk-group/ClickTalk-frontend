export interface CardProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
    icon?: React.ReactNode;
  }
  