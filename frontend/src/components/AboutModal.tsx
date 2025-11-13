import React from 'react';

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="p-5 bg-white/70 dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
    <h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
      {title}
    </h4>
    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
      {children}
    </div>
  </div>
);

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* 🌍 Title Section */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            About <span className="text-emerald-700 dark:text-emerald-400">EcoSphere</span>
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            <strong>EcoSphere</strong> is an intelligent sustainability platform that merges{" "}
            <span className="text-emerald-600 font-medium">awareness, data, and community action</span> 
            — helping individuals and organizations measure, understand, and reduce their carbon footprint 
            while staying engaged with a vibrant eco-conscious community.
          </p>
        </div>

        {/* 🌿 Core Functionality */}
        <section>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
            🌿 Core Functionality
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoSection title="Carbon Footprint Calculator">
              Track emissions across domestic and transportation categories using intelligent analytics.
            </InfoSection>

            <InfoSection title="Real-time Climate Dashboard">
              Explore live global climate trends and CO₂ statistics through interactive visual dashboards.
            </InfoSection>

            <InfoSection title="AI-Powered Chatbot">
              Receive climate advice and personalized sustainability tips via our Gemini-powered assistant.
            </InfoSection>

            <InfoSection title="Gamification System">
              Earn badges, points, and rankings by completing eco-friendly challenges and daily actions.
            </InfoSection>

            <InfoSection title="News Curation">
              Access AI-summarized, categorized climate news updates to stay informed effortlessly.
            </InfoSection>

            <InfoSection title="Social Features">
              Connect with like-minded users, share progress, and join global sustainability initiatives.
            </InfoSection>
          </div>
        </section>

        {/* 👥 User Roles */}
        <section>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
            👥 User Roles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoSection title="Individual Users">
              Monitor your personal carbon emissions and join interactive sustainability missions.
            </InfoSection>

            <InfoSection title="NGO Accounts">
              Design community challenges, organize initiatives, and measure environmental impact.
            </InfoSection>

            <InfoSection title="Admin">
              Manage platform operations, ensure moderation, and oversee content integrity.
            </InfoSection>
          </div>
        </section>

        {/* ⚙️ Technical Features */}
        <section>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
            ⚙️ Technical Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoSection title="Real-time Notifications">
              Stay updated instantly with live activity streams powered by WebSockets.
            </InfoSection>

            <InfoSection title="Responsive Design">
              Optimized for seamless performance across all devices and resolutions.
            </InfoSection>

            <InfoSection title="Dark Mode">
              Elegant, full-theme switching to enhance readability in any environment.
            </InfoSection>

            <InfoSection title="Data Visualization">
              Explore dynamic charts and graphs visualizing your progress and global climate data.
            </InfoSection>

            <InfoSection title="Export Capabilities">
              Generate downloadable PDF reports with authentic EcoSphere branding and insights.
            </InfoSection>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
