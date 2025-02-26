import React from "react";
import "./Header.scss";
import { HeaderProps } from "./Header.types";
import { GiHamburgerMenu } from "react-icons/gi";


const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <header className="header">
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
