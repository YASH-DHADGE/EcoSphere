import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import AboutModal from '../components/AboutModal';
import ContactModal from '../components/ContactModal';

const AppPublic: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div
          className={`min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500 ${
            !isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Header />

          <main className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <Features />
                  </>
                }
              />

              <Route path="/about" element={<AboutModal />} />
              <Route path="/contact" element={<ContactModal />} />
              <Route path="/auth" element={<AuthModal />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default AppPublic;
