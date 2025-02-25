import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
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
  };

  const conversations = [
    { id: "1", title: "Conversation 1" },
    { id: "2", title: "Conversation 2" },
  ];

  const projects = [
    { id: "1", title: "Project 1" },
    { id: "2", title: "Project 2" },
  ];

  it("renders conversations and projects", () => {
    render(
      <Sidebar
        conversations={conversations}
        projects={projects}
        {...mockFunctions}
      />
    );

    expect(screen.getByText("Conversation 1")).toBeInTheDocument();
    expect(screen.getByText("Project 1")).toBeInTheDocument();
  });

  it("handles conversation actions", () => {
    render(
      <Sidebar
        conversations={conversations}
        projects={projects}
        {...mockFunctions}
      />
    );

    fireEvent.click(screen.getByText("Conversation 1"));
    expect(mockFunctions.onSelectConversation).toHaveBeenCalledWith("1");

    fireEvent.click(screen.getByText("Rename"));
    expect(mockFunctions.onRenameConversation).toHaveBeenCalled();
  });

  it("handles project actions", () => {
    render(
      <Sidebar
        conversations={conversations}
        projects={projects}
        {...mockFunctions}
      />
    );

    fireEvent.click(screen.getByText("Project 1"));
    expect(mockFunctions.onSelectProject).toHaveBeenCalledWith("1");

    fireEvent.click(screen.getByText("Delete"));
    expect(mockFunctions.onDeleteProject).toHaveBeenCalled();
  });

  it("handles logout", () => {
    render(
      <Sidebar
        conversations={conversations}
        projects={projects}
        {...mockFunctions}
      />
    );

    fireEvent.click(screen.getByText("Logout"));
    expect(mockFunctions.onLogout).toHaveBeenCalled();
  });
});
