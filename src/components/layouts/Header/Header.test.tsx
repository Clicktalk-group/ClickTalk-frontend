import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";

describe("Header Component", () => {
  const mockToggleSidebar = jest.fn();

  // Vérifie si le Header est bien affiché avec ses composants principaux
  it("renders the Header correctly", () => {
    render(<Header isSidebarOpen={false} toggleSidebar={mockToggleSidebar} />);
    expect(
      screen.getByRole("button", { name: /Agrandir la barre latérale/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /ClickTalk Logo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Menu/i })).toBeInTheDocument();
  });

  // Vérifie si la fonction toggleSidebar est appelée lorsqu'on clique sur le bouton sidebar
  it("calls toggleSidebar function when Sidebar button is clicked", () => {
    render(<Header isSidebarOpen={false} toggleSidebar={mockToggleSidebar} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Agrandir la barre latérale/i })
    );
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  // Ajout d'une classe active lorsque la sidebar est ouverte
  it("applies 'active' class to Sidebar button when isSidebarOpen is true", () => {
    render(<Header isSidebarOpen={true} toggleSidebar={mockToggleSidebar} />);
    expect(
      screen.getByRole("button", { name: /Réduire la barre latérale/i })
    ).toHaveClass("active");
  });

  // Vérifie si le logo est centré correctement dans la vue mobile
  it("centers the logo correctly in mobile view", () => {
    render(<Header isSidebarOpen={false} toggleSidebar={mockToggleSidebar} />);
    
    // Localiser le conteneur du logo grâce au test ID
    const logoContainer = screen.getByTestId("logo-container");

    // Vérifications des styles
    expect(logoContainer).toHaveStyle("position: absolute");
    expect(logoContainer).toHaveStyle("left: 50%");
    expect(logoContainer).toHaveStyle("transform: translateX(-50%)");
  });

  // Vérifie l'espacement (padding) du bouton menu
  it("applies correct padding for the menu button", () => {
    render(<Header isSidebarOpen={false} toggleSidebar={mockToggleSidebar} />);
    const menuButton = screen.getByRole("button", { name: /Menu/i });
    expect(menuButton).toHaveStyle("padding: 0.5rem");
  });

  it("applies correct padding and margin to the Menu button", () => {
    render(<Header isSidebarOpen={false} toggleSidebar={mockToggleSidebar} />);
    const menuButton = screen.getByRole("button", { name: /Menu/i });
    expect(menuButton).toHaveStyle("margin-right: 1rem");
    expect(menuButton).toHaveStyle("padding: 0.5rem");
  });
  
  it("centers the logo correctly with flexbox", () => {
    render(<Header isSidebarOpen={false} toggleSidebar={mockToggleSidebar} />);
    const logoContainer = screen.getByTestId("logo-container");
    expect(logoContainer).toHaveStyle("margin: 0 auto");
    expect(logoContainer).toHaveStyle("position: static");
  });
  
});
