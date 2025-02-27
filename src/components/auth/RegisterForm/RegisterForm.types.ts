export interface RegisterFormProps {
    onSubmit: (data: { username: string; email: string; password: string; confirmPassword: string }) => void;
  }
  