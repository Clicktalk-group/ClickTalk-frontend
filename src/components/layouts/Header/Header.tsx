// src/components/layout/Header/Header.tsx
import React, { useState } from "react";
import "./Header.scss";
import { HeaderProps } from "./Header.types";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaHome } from "react-icons/fa";
import HeaderMenu from "../../common/HeaderMenu/HeaderMenu";

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

      {/* Menu Button - ouvre maintenant le menu déroulant */}
      <button 
        className="menuButton" 
        onClick={toggleMenu}
        aria-label="Menu principal"
      >
        <GiHamburgerMenu />
      </button>
      
      {/* Menu déroulant */}
      <HeaderMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </header>
  );
};

export default Header;
