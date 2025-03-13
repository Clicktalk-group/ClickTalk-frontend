import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import '@testing-library/jest-dom';

describe('Sidebar Component', () => {
  const mockConversations = [
    { id: '1', title: 'Conversation 1' },
    { id: 2, title: 'Conversation 2' } // Notez le id numérique pour tester les deux types
  ];
  
  const mockProjects = [
    { id: '3', title: 'Project 1' },
    { id: 4, title: 'Project 2' } // Notez le id numérique pour tester les deux types
  ];
  
  const mockProps = {
    isOpen: true,
    conversations: mockConversations,
    projects: mockProjects,
    onNewConversation: jest.fn(),
    onNewProject: jest.fn(),
    onSelectConversation: jest.fn(),
    onSelectProject: jest.fn(),
    onRenameConversation: jest.fn(),
    onDeleteConversation: jest.fn(),
    onMoveConversation: jest.fn(),
    onRenameProject: jest.fn(),
    onDeleteProject: jest.fn(),
    onLogout: jest.fn(),
    onToggleSidebar: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock la fonction window.confirm pour qu'elle retourne toujours true dans les tests
    global.confirm = jest.fn(() => true);
  });

  test('renders sidebar with all sections when open', () => {
    render(<Sidebar {...mockProps} />);
    
    // Vérifier que les sections sont rendues
    expect(screen.getByText('Conversations')).toBeInTheDocument();
    expect(screen.getByText('Projets')).toBeInTheDocument();
    
    // Vérifier que les conversations sont affichées
    expect(screen.getByText('Conversation 1')).toBeInTheDocument();
    expect(screen.getByText('Conversation 2')).toBeInTheDocument();
    
    // Vérifier que les projets sont affichés
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
    
    // Vérifier que le bouton de déconnexion est affiché
    expect(screen.getByText('Déconnexion')).toBeInTheDocument();
  });

  test('sidebar has open class when isOpen is true', () => {
    render(<Sidebar {...mockProps} />);
    const sidebarElement = screen.getByRole('complementary');
    expect(sidebarElement).toHaveClass('open');
  });
  
  test('sidebar does not have open class when isOpen is false', () => {
    render(<Sidebar {...mockProps} isOpen={false} />);
    const sidebarElement = screen.getByRole('complementary');
    expect(sidebarElement).not.toHaveClass('open');
  });
  
  test('calls onNewConversation when new conversation button is clicked', () => {
    render(<Sidebar {...mockProps} />);
    const newConversationButton = screen.getByText(/Nouvelle Conversation/);
    fireEvent.click(newConversationButton);
    expect(mockProps.onNewConversation).toHaveBeenCalledTimes(1);
  });
  
  test('calls onNewProject when new project button is clicked', () => {
    render(<Sidebar {...mockProps} />);
    const newProjectButton = screen.getByText(/Nouveau Projet/);
    fireEvent.click(newProjectButton);
    expect(mockProps.onNewProject).toHaveBeenCalledTimes(1);
  });
  
  test('calls onSelectConversation with conversation id when a conversation is clicked', () => {
    render(<Sidebar {...mockProps} />);
    const conversation1 = screen.getAllByText('Conversation 1')[0];
    fireEvent.click(conversation1);
    expect(mockProps.onSelectConversation).toHaveBeenCalledWith('1');
    
    const conversation2 = screen.getAllByText('Conversation 2')[0];
    fireEvent.click(conversation2);
    expect(mockProps.onSelectConversation).toHaveBeenCalledWith(2);
  });
  
  test('calls onSelectProject with project id when a project is clicked', () => {
    render(<Sidebar {...mockProps} />);
    const project1 = screen.getAllByText('Project 1')[0];
    fireEvent.click(project1);
    expect(mockProps.onSelectProject).toHaveBeenCalledWith('3');
    
    const project2 = screen.getAllByText('Project 2')[0];
    fireEvent.click(project2);
    expect(mockProps.onSelectProject).toHaveBeenCalledWith(4);
  });
  
  test('calls onLogout when logout button is clicked', () => {
    render(<Sidebar {...mockProps} />);
    const logoutButton = screen.getByText('Déconnexion');
    fireEvent.click(logoutButton);
    expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
  });

  test('calls onDeleteConversation when delete button is clicked on a conversation', () => {
    render(<Sidebar {...mockProps} />);
    
    // Trouver les titres de conversation et cliquer sur les boutons de suppression
    const conversationItems = screen.getAllByTitle('Supprimer la conversation');
    expect(conversationItems.length).toBe(2);
    
    fireEvent.click(conversationItems[0]);
    expect(mockProps.onDeleteConversation).toHaveBeenCalledWith('1');
    
    fireEvent.click(conversationItems[1]);
    expect(mockProps.onDeleteConversation).toHaveBeenCalledWith(2);
  });

  test('calls onRenameConversation when edit button is clicked on a conversation', () => {
    render(<Sidebar {...mockProps} />);
    
    const editButtons = screen.getAllByTitle('Modifier la conversation');
    expect(editButtons.length).toBe(2);
    
    fireEvent.click(editButtons[0]);
    expect(mockProps.onRenameConversation).toHaveBeenCalledWith('1', 'Conversation 1');
    
    fireEvent.click(editButtons[1]);
    expect(mockProps.onRenameConversation).toHaveBeenCalledWith(2, 'Conversation 2');
  });

  test('renders empty lists when no items are provided', () => {
    render(
      <Sidebar 
        {...mockProps} 
        conversations={[]} 
        projects={[]} 
      />
    );
    
    // Vérifier que les sections sont toujours rendues
    expect(screen.getByText('Conversations')).toBeInTheDocument();
    expect(screen.getByText('Projets')).toBeInTheDocument();
    
    // Vérifier que les boutons d'ajout sont toujours rendus
    expect(screen.getByText(/Nouvelle Conversation/)).toBeInTheDocument();
    expect(screen.getByText(/Nouveau Projet/)).toBeInTheDocument();
  });
});
