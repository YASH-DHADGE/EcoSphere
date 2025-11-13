import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from './common/Card';
import { TrendingUp, Thermometer, Waves, Leaf, Globe, Cloud, X, Loader2 } from 'lucide-react';
import type {ClimateDataPoint } from '../types';
import { getStatCardDetails } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const climateData: ClimateDataPoint[] = [
  { year: 1980, co2: 338.7, tempAnomaly: 0.26 },
  { year: 1981, co2: 340.1, tempAnomaly: 0.32 },
  { year: 1982, co2: 341.2, tempAnomaly: 0.13 },
  { year: 1983, co2: 342.8, tempAnomaly: 0.30 },
  { year: 1984, co2: 344.4, tempAnomaly: 0.16 },
  { year: 1985, co2: 345.9, tempAnomaly: 0.12 },
  { year: 1986, co2: 347.2, tempAnomaly: 0.18 },
  { year: 1987, co2: 349.0, tempAnomaly: 0.32 },
  { year: 1988, co2: 351.4, tempAnomaly: 0.40 },
  { year: 1989, co2: 352.9, tempAnomaly: 0.27 },
  { year: 1990, co2: 354.2, tempAnomaly: 0.45 },
  { year: 1991, co2: 355.6, tempAnomaly: 0.42 },
  { year: 1992, co2: 356.3, tempAnomaly: 0.22 },
  { year: 1993, co2: 357.0, tempAnomaly: 0.25 },
  { year: 1994, co2: 358.8, tempAnomaly: 0.32 },
  { year: 1995, co2: 360.6, tempAnomaly: 0.47 },
  { year: 1996, co2: 362.4, tempAnomaly: 0.34 },
  { year: 1997, co2: 363.5, tempAnomaly: 0.52 },
  { year: 1998, co2: 366.5, tempAnomaly: 0.65 },
  { year: 1999, co2: 368.2, tempAnomaly: 0.47 },
  { year: 2000, co2: 369.4, tempAnomaly: 0.43 },
  { year: 2001, co2: 371.0, tempAnomaly: 0.57 },
  { year: 2002, co2: 373.1, tempAnomaly: 0.65 },
  { year: 2003, co2: 375.6, tempAnomaly: 0.64 },
  { year: 2004, co2: 377.4, tempAnomaly: 0.57 },
  { year: 2005, co2: 379.8, tempAnomaly: 0.70 },
  { year: 2006, co2: 381.8, tempAnomaly: 0.66 },
  { year: 2007, co2: 383.7, tempAnomaly: 0.69 },
  { year: 2008, co2: 385.5, tempAnomaly: 0.56 },
  { year: 2009, co2: 387.3, tempAnomaly: 0.68 },
  { year: 2010, co2: 389.9, tempAnomaly: 0.75 },
  { year: 2011, co2: 391.6, tempAnomaly: 0.62 },
  { year: 2012, co2: 393.8, tempAnomaly: 0.67 },
  { year: 2013, co2: 396.5, tempAnomaly: 0.70 },
  { year: 2014, co2: 398.6, tempAnomaly: 0.78 },
  { year: 2015, co2: 400.8, tempAnomaly: 0.93 },
  { year: 2016, co2: 404.2, tempAnomaly: 1.05 },
  { year: 2017, co2: 406.5, tempAnomaly: 0.95 },
  { year: 2018, co2: 408.5, tempAnomaly: 0.88 },
  { year: 2019, co2: 411.4, tempAnomaly: 1.00 },
  { year: 2020, co2: 414.2, tempAnomaly: 1.05 },
  { year: 2021, co2: 417.1, tempAnomaly: 0.89 },
  { year: 2022, co2: 419.3, tempAnomaly: 0.93 },
  { year: 2023, co2: 421.0, tempAnomaly: 1.18 },
  { year: 2024, co2: 423.5, tempAnomaly: 1.35 },
];

const StatCard = ({ icon, title, value, unit, color, onClick }: { icon: React.ReactNode, title: string, value: string, unit: string, color: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full text-left transition-transform duration-200 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-xl"
    >
        <Card className="flex-1 min-w-[200px] h-full hover:shadow-xl cursor-pointer">
            <div className="flex items-center">
                <div className={`p-3 rounded-full bg-${color}/10 text-${color}`}>
                    {icon}
                </div>
                <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                        {value} <span className="text-base font-normal">{unit}</span>
                    </p>
                </div>
            </div>
        </Card>
    </button>
)

export const Dashboard: React.FC = () => {
    const [selectedIndex, setSelectedIndex] = useState(climateData.length - 1);
    const selectedData = climateData[selectedIndex];
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalContent, setModalContent] = useState('');
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const latestData = climateData[climateData.length - 1];

    const stats = [
        { type: 'co2', icon: <TrendingUp />, title: `CO2 Concentration (${latestData.year})`, value: latestData.co2.toFixed(1), unit: "ppm", color: "secondary-blue" },
        { type: 'temp', icon: <Thermometer />, title: `Temp Anomaly (${latestData.year})`, value: `+${latestData.tempAnomaly.toFixed(2)}`, unit: "°C", color: "red-500" },
        { type: 'sea', icon: <Waves />, title: "Sea Level Rise", value: "+102.0", unit: "mm", color: "blue-500" },
        { type: 'footprint', icon: <Leaf />, title: "Your Footprint", value: "5.2", unit: "tCO2e", color: "primary-green" }
    ];

    const handleStatCardClick = async (stat: (typeof stats)[0]) => {
      setActiveModal(stat.type);
      setIsLoadingModal(true);
      setModalContent('');
      const content = await getStatCardDetails(stat);
      setModalContent(content);
      setIsLoadingModal(false);
    };

    const getTempColor = (anomaly: number) => {
        const minAnomaly = Math.min(...climateData.map(d => d.tempAnomaly));
        const maxAnomaly = Math.max(...climateData.map(d => d.tempAnomaly));
        const percentage = (anomaly - minAnomaly) / (maxAnomaly - minAnomaly);
        
        const hue = 240 - (percentage * 240);
        const saturation = 70 + (percentage * 20);
        const lightness = 55;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };
    
    const currentModalStat = stats.find(s => s.type === activeModal);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Climate Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
            <StatCard 
                key={stat.type}
                {...stat}
                onClick={() => handleStatCardClick(stat)}
            />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle icon={<Globe size={24}/>}>Climate Change Over Time: A Visual History</CardTitle>
        </CardHeader>
        <div className="p-4 sm:p-6 flex flex-col items-center">
            <p className="text-center text-sm font-medium mb-4 text-gray-600 dark:text-gray-300">Each stripe represents a year's temperature anomaly from {climateData[0].year} to {latestData.year}. Hover to see details.</p>
            
            <div className="w-full flex h-24 rounded-lg overflow-hidden shadow-inner bg-gray-200 dark:bg-gray-700">
                {climateData.map((dataPoint, index) => (
                    <div
                        key={dataPoint.year}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex-1 transition-all duration-100 ease-in-out ${index === selectedIndex ? 'ring-2 ring-offset-2 ring-primary-green dark:ring-offset-gray-800 z-10' : ''}`}
                        style={{ backgroundColor: getTempColor(dataPoint.tempAnomaly) }}
                        title={`${dataPoint.year}: ${dataPoint.tempAnomaly.toFixed(2)}°C`}
                    ></div>
                ))}
            </div>

            <div className="w-full max-w-lg mt-8 p-6 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                <p className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Data for <span className="text-primary-green">{selectedData.year}</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Temperature Anomaly</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2 mt-1">
                            <Thermometer size={24} style={{color: getTempColor(selectedData.tempAnomaly)}} />
                            {selectedData.tempAnomaly >= 0 ? '+' : ''}{selectedData.tempAnomaly.toFixed(2)} °C
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">CO₂ Concentration</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2 mt-1">
                            <Cloud size={24} className="text-secondary-blue" />
                            {selectedData.co2.toFixed(1)} ppm
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </Card>

      {/* Modal */}
        {activeModal && (
            <div 
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                onClick={() => setActiveModal(null)}
            >
                <div 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md relative"
                    onClick={(e) => e.stopPropagation()}
                    role="dialog" 
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <button 
                        onClick={() => setActiveModal(null)} 
                        className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                    {currentModalStat && (
                        <div className="p-6">
                            <CardTitle id="modal-title" icon={React.cloneElement(currentModalStat.icon, {className: `text-${currentModalStat.color}`})}>{currentModalStat.title}</CardTitle>
                            <div className="mt-4 text-gray-600 dark:text-gray-300 min-h-[100px] flex items-center justify-center">
                                {isLoadingModal ? (
                                    <Loader2 className="animate-spin h-8 w-8 text-primary-green" />
                                ) : (
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown>{modalContent}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};
export default Dashboard;