import React from "react";
import "./Header.scss";
import { HeaderProps } from "./Header.types";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaHome } from "react-icons/fa";

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <header className="header">
      {/* Home Icon - visible uniquement quand la sidebar est fermée */}
      {!isSidebarOpen && (
        <div className="homeIconContainer" onClick={toggleSidebar}>
          <FaHome className="homeIcon" />
        </div>
      )}
      
      {/* Si la sidebar est ouverte, on met un div vide pour maintenir l'alignement */}
      {isSidebarOpen && <div className="placeholderLeft"></div>}

      {/* Logo centré */}
      <div className="logoContainer" data-testid="logo-container">
        <img src="/assets/images/logo.png" alt="ClickTalk Logo" className="logo" />
      </div>

      {/* Menu Button - ne contrôle plus la sidebar */}
      <button 
        className="menuButton" 
        onClick={() => console.log("Menu hamburger clicked - future functionality")}
        aria-label="Menu principal"
      >
        <GiHamburgerMenu />
      </button>
    </header>
  );
};

export default Header;
