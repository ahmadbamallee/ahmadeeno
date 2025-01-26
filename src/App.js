// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Resume from './pages/Resume';
import Skills from './pages/Skills';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Certificates from './pages/Certificates'; // Import the Certificates page
import './index.css';

function App() {
  // Get the base URL from the homepage in package.json, or default to '/'
  const basename = process.env.NODE_ENV === 'production' ? '/ahmadeeno' : '';

  return (
    <Router basename={basename}>
      <div className="app-wrapper">
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/certificates" element={<Certificates />} /> {/* Add route for Certificates */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
