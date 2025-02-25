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

    expect(screen.getByRole("button", { name: /Toggle Sidebar/i })).toBeInTheDocument();
  });

  it("toggles Sidebar open/close when clicking the button", () => {
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    );

    const toggleButton = screen.getByRole("button", { name: /Toggle Sidebar/i });
    
    fireEvent.click(toggleButton);
    const layoutContainer = screen.getByTestId("layout-container");
    expect(layoutContainer).toHaveClass("sidebar-open");

    fireEvent.click(toggleButton);
    expect(layoutContainer).not.toHaveClass("sidebar-open");
  });
});
