import React, { useState, useEffect } from 'react';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}> = ({ icon, title, description, delay }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`bg-white/90 dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-500 ease-out ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } hover:-translate-y-2 hover:shadow-xl`}
      style={{ transitionDelay: delay }}
    >
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

const Features: React.FC = () => (
  <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          A Platform for Sustainable Change
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          EcoSphere empowers individuals and communities to take measurable steps toward a greener
          tomorrow through data, action, and collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Carbon Tracking */}
        <FeatureCard
          delay="100ms"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z"
              />
            </svg>
          }
          title="Carbon Footprint Calculator"
          description="Track your daily and household emissions across domestic, lifestyle, and transportation categories with actionable reduction tips."
        />

        {/* Real-time Dashboard */}
        <FeatureCard
          delay="200ms"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3v18h18M9 17V9m4 8V5m4 12v-6"
              />
            </svg>
          }
          title="Real-time Climate Dashboard"
          description="Explore live global CO₂ levels, temperature trends, and sustainability stats visualized through interactive, dynamic charts."
        />

        {/* AI Chatbot */}
        <FeatureCard
          delay="300ms"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h5l2 2h4a2 2 0 012 2v7a2 2 0 01-2 2z"
              />
            </svg>
          }
          title="AI-Powered Chatbot"
          description="Get smart, conversational climate insights and sustainability guidance from our Gemini-powered virtual assistant."
        />

        {/* Gamification System */}
        <FeatureCard
          delay="400ms"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 21h8m-4-4v4m0-18a9 9 0 110 18 9 9 0 010-18z"
              />
            </svg>
          }
          title="Gamification & Rewards"
          description="Earn badges, unlock levels, and climb leaderboards by completing daily eco-actions and sustainable community missions."
        />

        {/* News Curation */}
        <FeatureCard
          delay="500ms"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v11a2 2 0 01-2 2z"
              />
            </svg>
          }
          title="AI-Powered News Curation"
          description="Stay informed with real-time, AI-summarized climate news curated by topic, urgency, and relevance — without the clutter."
        />

        {/* Social Features */}
        <FeatureCard
          delay="600ms"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2M7 20H2v-2a3 3 0 015.356-1.857"
              />
            </svg>
          }
          title="Social & Community Features"
          description="Connect with friends, join green teams, share achievements, and take part in collaborative sustainability challenges."
        />
      </div>
    </div>
  </section>
);

export default Features;
