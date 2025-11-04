
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AboutModal from './components/AboutModal';
import ContactModal from './components/ContactModal';

const App: React.FC = () => {
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
          {/* Header stays on all pages */}
          <Header />

          <main className="flex-grow">
            <Routes>
              {/* Home Page */}
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <Features />
                  </>
                }
              />

              {/* About Page */}
              <Route path="/about" element={<AboutModal />} />

              {/* Contact Page */}
              <Route path="/contact" element={<ContactModal />} />

              {/* Auth Page */}
              <Route path="/auth" element={<AuthModal />} />
            </Routes>
          </main>

          {/* Footer stays on all pages */}
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
