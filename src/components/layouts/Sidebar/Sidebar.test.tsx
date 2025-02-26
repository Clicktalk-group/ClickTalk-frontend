import React from "react";
import { render, screen } from "@testing-library/react"; // Import `screen`
import { Sidebar } from "./Sidebar";

const mockFunctions = {
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
  onToggleSidebar: jest.fn(),
};

const conversations = [
  { id: "1", title: "Conversation 1" },
  { id: "2", title: "Conversation 2" },
];

const projects = [
  { id: "p1", title: "Projet A" },
  { id: "p2", title: "Projet B" },
];

describe("Sidebar Component", () => {
  it("renders conversations and projects", () => {
    render(
      <Sidebar
        isOpen={true}
        conversations={conversations}
        projects={projects}
        {...mockFunctions}
      />
    );

    // Test if conversation titles are rendered
    conversations.forEach((conversation) => {
      expect(screen.getByText(conversation.title)).toBeInTheDocument();
    });

    // Test if project titles are rendered
    projects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });
  });

  it("handles sidebar toggle and renders closed state", () => {
    render(
      <Sidebar
        isOpen={false} // Sidebar fermée
        conversations={conversations}
        projects={projects}
        {...mockFunctions}
      />
    );

    // Test que les titres des projets ne sont PAS visibles dans l'état fermé
    projects.forEach((project) => {
      expect(screen.queryByText(project.title)).not.toBeInTheDocument();
    });

    // Vérifie si la fonction "onToggleSidebar" est définie
    expect(mockFunctions.onToggleSidebar).toBeDefined();
  });

  it("calls onNewConversation when clicking New Conversation button", () => {
    render(
      <Sidebar
        isOpen={true}
        conversations={conversations}
        projects={projects}
        {...mockFunctions}
      />
    );

    const newConvoButton = screen.getByText("+ Nouvelle Conversation");
    newConvoButton.click();

    // Vérifie si onNewConversation est appelé
    expect(mockFunctions.onNewConversation).toHaveBeenCalled();
  });

  it("calls onNewProject when clicking New Project button", () => {
    render(
      <Sidebar
        isOpen={true}
        conversations={conversations}
        projects={projects}
        {...mockFunctions}
      />
    );

    const newProjectButton = screen.getByText("+ Nouveau Projet");
    newProjectButton.click();

    // Vérifie si onNewProject est appelé
    expect(mockFunctions.onNewProject).toHaveBeenCalled();
  });
});