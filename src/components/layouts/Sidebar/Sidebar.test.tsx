import React from "react";
import { render } from "@testing-library/react";
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
  });

  it("handles conversation actions", () => {
    render(
      <Sidebar
        isOpen={false}
        conversations={conversations}
        projects={projects}
        {...mockFunctions}
      />
    );
  });
});
