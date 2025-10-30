import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle } from './common/Card';
import { Home, Car, Plane, Droplets, Zap, Sparkles, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCarbonFootprintSuggestions } from '../services/geminiService';
import { ReactMarkdown } from 'react-markdown';

const emissionFactors = {
  electricity: 0.233, // kg CO2e per kWh
  naturalGas: 0.184, // kg CO2e per kWh
  car: 0.171, // kg CO2e per km (petrol)
  flight: 0.255, // kg CO2e per km (short-haul)
};

const InputField = ({ label, value, onChange, unit, icon }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, unit: string, icon: React.ReactNode }) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                {icon}
            </div>
            <input 
                type="number"
                value={value}
                onChange={onChange}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-primary-green focus:border-primary-green"
                placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 text-sm">
                {unit}
            </div>
        </div>
    </div>
);

export const CarbonCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    electricity: '',
    naturalGas: '',
    car: '',
    flight: '',
  });

  const [suggestions, setSuggestions] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof typeof inputs) => {
    setInputs(prev => ({ ...prev, [name]: e.target.value }));
    setSuggestions('');
  };

  const results = useMemo(() => {
    const electricity = (parseFloat(inputs.electricity) || 0) * emissionFactors.electricity;
    const naturalGas = (parseFloat(inputs.naturalGas) || 0) * emissionFactors.naturalGas;
    const car = (parseFloat(inputs.car) || 0) * emissionFactors.car;
    const flight = (parseFloat(inputs.flight) || 0) * emissionFactors.flight;
    
    const domestic = electricity + naturalGas;
    const transport = car + flight;
    const total = domestic + transport;

    return {
      domestic: (domestic / 1000).toFixed(2),
      transport: (transport / 1000).toFixed(2),
      total: (total / 1000).toFixed(2),
      breakdown: [
          { name: 'Domestic', value: parseFloat((domestic / 1000).toFixed(2)) || 0 },
          { name: 'Transport', value: parseFloat((transport / 1000).toFixed(2)) || 0 },
      ]
    };
  }, [inputs]);

  const handleGetSuggestions = async () => {
    setIsLoadingSuggestions(true);
    setSuggestions('');
    const suggestionData = {
      ...inputs,
      total: results.total,
      domestic: results.domestic,
      transport: results.transport
    };
    const response = await getCarbonFootprintSuggestions(suggestionData);
    setSuggestions(response);
    setIsLoadingSuggestions(false);
  };
  
  const COLORS = ['#3B82F6', '#10B981'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Carbon Footprint Calculator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle icon={<Home size={24}/>}>Domestic Emissions (Monthly)</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Electricity Usage" value={inputs.electricity} onChange={(e) => handleInputChange(e, 'electricity')} unit="kWh" icon={<Zap size={16}/>}/>
              <InputField label="Natural Gas" value={inputs.naturalGas} onChange={(e) => handleInputChange(e, 'naturalGas')} unit="kWh" icon={<Droplets size={16}/>}/>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle icon={<Car size={24}/>}>Transportation Emissions (Monthly)</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Car Mileage" value={inputs.car} onChange={(e) => handleInputChange(e, 'car')} unit="km" icon={<Car size={16}/>}/>
              <InputField label="Flights" value={inputs.flight} onChange={(e) => handleInputChange(e, 'flight')} unit="km" icon={<Plane size={16}/>}/>
            </div>
          </Card>
        </div>

        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Your Results</CardTitle>
          </CardHeader>
          <div className="flex flex-col items-center justify-center flex-grow text-center">
            <p className="text-gray-500 dark:text-gray-400">Total Monthly Footprint</p>
            <p className="text-5xl font-bold text-primary-green my-2">{results.total}</p>
            <p className="text-gray-500 dark:text-gray-400">tonnes CO₂e</p>

            <div className="w-full h-48 mt-4">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={results.breakdown.filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {results.breakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleGetSuggestions}
              disabled={isLoadingSuggestions || parseFloat(results.total) <= 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary-blue rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingSuggestions ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {isLoadingSuggestions ? 'Analyzing...' : 'Get AI Suggestions'}
            </button>
            {suggestions && !isLoadingSuggestions && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-left">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{suggestions}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
