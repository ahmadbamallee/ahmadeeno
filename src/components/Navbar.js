// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/assets/logo.png" alt="Logo" className="navbar-logo"/>
      </div>
      <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={toggleMenu}>Home</Link>
        <Link to="/about" onClick={toggleMenu}>About</Link>
        <Link to="/resume" onClick={toggleMenu}>Resume</Link>
        <Link to="/contact" onClick={toggleMenu}>Contact</Link>
        <Link to="/skills" onClick={toggleMenu}>Skills</Link>
        <Link to="/services" onClick={toggleMenu}>Services</Link>
        <Link to="/blog" onClick={toggleMenu}>Blog</Link>
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
}

export default Navbar;
