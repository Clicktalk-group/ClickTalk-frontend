import React, { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Ce console.error est intentionnellement conservé pour journaliser les erreurs
    // critiques qui doivent être visibles dans la console de production
    console.error("Uncaught error:", error, errorInfo);
    
    // Appeler le gestionnaire d'erreurs personnalisé si fourni
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Vous pourriez ajouter ici un service de suivi d'erreurs
    // comme Sentry, LogRocket, etc.
  }
  
  // Reset l'état d'erreur
  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Afficher le fallback personnalisé ou l'interface par défaut
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-boundary-container">
          <h1>Une erreur est survenue !</h1>
          <p>Nous sommes désolés pour la gêne occasionnée.</p>
          {this.state.error && (
            <details>
              <summary>Détails de l'erreur</summary>
              <p>{this.state.error.toString()}</p>
            </details>
          )}
          <button onClick={this.resetErrorBoundary}>
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
