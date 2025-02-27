export interface InputProps {
  id?: string;
  name: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'search';
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  autoComplete?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}