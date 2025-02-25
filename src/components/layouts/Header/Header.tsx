import React from "react";
import "./Header.scss";
import { HeaderProps } from "./Header.types";
import { IconBaseProps } from "react-icons/lib"; // Typage des icônes
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";

// Forcer TypeScript à accepter les icônes
const ChevronLeft: React.FC<IconBaseProps> = GoChevronLeft;
const ChevronRight: React.FC<IconBaseProps> = GoChevronRight;

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <header className="header">
      {/* Toggle Sidebar */}
      <button
        className={`sidebarToggle ${isSidebarOpen ? "active" : ""}`}
        onClick={toggleSidebar}
        aria-label={
          isSidebarOpen ? "Réduire la barre latérale" : "Agrandir la barre latérale"
        }
      >
        {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>

      {/* Logo */}
      <div className="logoContainer" data-testid="logo-container">
        <img src="/assets/images/logo.png" alt="ClickTalk Logo" className="logo" />
      </div>

      {/* Menu Button */}
      <button className="menuButton" aria-label="Menu">
        <GiHamburgerMenu />
      </button>
    </header>
  );
};

export default Header;
