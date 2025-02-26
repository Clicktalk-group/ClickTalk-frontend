import { render, screen, fireEvent } from "@testing-library/react";
import MainLayout from "./MainLayout";
import { BrowserRouter } from "react-router-dom";

describe("MainLayout Component", () => {
  it("renders the MainLayout correctly", () => {
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );

    // Vérifie si le bouton toggle est présent
    expect(
      screen.getByRole("button", { name: /Toggle Sidebar/i })
    ).toBeInTheDocument();
  });

  it("toggles Sidebar open/close when clicking the button", () => {
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );

    const toggleButton = screen.getByRole("button", { name: /Toggle Sidebar/i });
    const layoutContainer = screen.getByTestId("layout-container");

    // Ouverture de la Sidebar
    fireEvent.click(toggleButton);
    expect(layoutContainer).toHaveClass("sidebar-open");

    // Fermeture de la Sidebar
    fireEvent.click(toggleButton);
    expect(layoutContainer).not.toHaveClass("sidebar-open");
  });
});
