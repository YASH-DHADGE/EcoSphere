
// import React, { useState, useCallback } from 'react';
// import { Sidebar } from './components/Sidebar';
// import { Header } from './components/Header';
// import { Dashboard } from './components/Dashboard';
// import { CarbonCalculator } from './components/CarbonCalculator';
// import { Chatbot } from './components/Chatbot';
// import { NewsFeed } from './components/NewsFeed';
// import { Gamification } from './components/Gamification';
// import { ThemeProvider } from './context/ThemeContext';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Hero from './components/Hero';
// import Features from './components/Features';
// import Footer from './components/Footer';
// import AuthModal from './components/AuthModal';
// import AboutModal from './components/AboutModal';
// import ContactModal from './components/ContactModal';


// type View = 'dashboard' | 'calculator' | 'chatbot' | 'news' | 'gamification';

// const App: React.FC = () => {
//   const [currentView, setCurrentView] = useState<View>('dashboard');
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   const renderView = useCallback(() => {
//     switch (currentView) {
//       case 'dashboard':
//         return <Dashboard />;
//       case 'calculator':
//         return <CarbonCalculator />;
//       case 'chatbot':
//         return <Chatbot />;
//       case 'news':
//         return <NewsFeed />;
//       case 'gamification':
//         return <Gamification />;
//       default:
//         return <Dashboard />;
//     }
//   }, [currentView]);

//   return (
//     <ThemeProvider>
//       <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
//         <Sidebar currentView={currentView} setCurrentView={setCurrentView} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
//           <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
//             {renderView()}
//           </main>
//         </div>
//       </div>
//     </ThemeProvider>
//   );
// };



// const App: React.FC = () => {
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     setIsLoaded(true);
//   }, []);


//   return (
//     <ThemeProvider>
//       <Router>
//         <div
//           className={`min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500 ${
//             !isLoaded ? 'opacity-0' : 'opacity-100'
//           }`}
//         >
//           {/* Header stays on all pages */}
//           <Header />

//           <main className="flex-grow">
//             <Routes>
//               {/* Home Page */}
//               <Route
//                 path="/"
//                 element={
//                   <>
//                     <Hero />
//                     <Features />
//                   </>
//                 }
//               />

//               {/* About Page */}
//               <Route path="/about" element={<AboutModal />} />

//               {/* Contact Page */}
//               <Route path="/contact" element={<ContactModal />} />

//               {/* Auth Page */}
//               <Route path="/auth" element={<AuthModal />} />
//             </Routes>
//           </main>

//           {/* Footer stays on all pages */}
//           <Footer />
//         </div>
//       </Router>
//     </ThemeProvider>
//   );
// };

// export default App;
import React from "react";
import AppLoggedIn from "./apps/AppLoggedIn";
import AppPublic from "./apps/AppPublic";

const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem("token") !== null;

  return isLoggedIn ? <AppLoggedIn /> : <AppPublic />;
};

export default App;

