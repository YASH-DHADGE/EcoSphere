import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full object-cover transform -translate-x-1/2 -translate-y-1/2 z-0"
        src="https://videos.pexels.com/video-files/3254013/3254013-hd_1920_1080_25fps.mp4"
      ></video>

      {/* Hero Content */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-8">
        <h1
          className={`text-4xl md:text-6xl font-bold tracking-tight mb-4 transition-all duration-700 ease-out ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
        >
          Welcome to <span className="text-primary-green">EcoSphere</span>
        </h1>

        <p
          className={`max-w-3xl mx-auto text-lg md:text-xl text-gray-200 mb-8 transition-all duration-700 ease-out delay-200 ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
        >
          A new way to understand and combat climate change. Track your carbon footprint, engage with a community, and drive real-world impact.
        </p>

        <div
          className={`transition-all duration-700 ease-out delay-300 ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <Link
            to="/auth"
            className="px-8 py-3 bg-primary-green text-white font-semibold rounded-lg shadow-lg hover:bg-green-500 transform hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
