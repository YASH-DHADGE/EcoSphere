
import React from 'react';
import LogoIcon from './icons/LogoIcon';

const Footer: React.FC = () => (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center">
                    <LogoIcon className="h-6 w-auto" />
                    <span className="ml-2 text-lg font-semibold text-gray-700 dark:text-gray-200">EcoSphere</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} EcoSphere. All rights reserved.
                </div>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-500 hover:text-primary-green dark:hover:text-primary-green transition-colors">Privacy</a>
                    <a href="#" className="text-gray-500 hover:text-primary-green dark:hover:text-primary-green transition-colors">Terms</a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
