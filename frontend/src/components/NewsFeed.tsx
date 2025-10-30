
import React, { useState } from 'react';
import type { NewsArticle } from '../types.tsx';
import { Card, CardHeader, CardTitle } from './common/Card';
import { Newspaper, Loader2, Sparkles } from 'lucide-react';
import { summarizeArticle } from '../services/geminiService';

const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: 'Breakthrough in Solar Panel Efficiency Reaches 40%',
    source: 'Tech Climate Today',
    publishedDate: '2024-07-20',
    category: 'Renewable Energy',
    content: 'Scientists at the National Renewable Energy Laboratory (NREL) have announced a major breakthrough in photovoltaic technology. Their new multi-junction solar cells have achieved a record-breaking 40% conversion efficiency under concentrated sunlight. This development could significantly lower the cost of solar energy and accelerate the transition away from fossil fuels. The new cells utilize a novel stacking technique with materials that capture a wider spectrum of sunlight.'
  },
  {
    id: 2,
    title: 'Global Carbon Tax Agreement Reached by 50 Nations',
    source: 'World Policy Journal',
    publishedDate: '2024-07-19',
    category: 'Policy',
    content: 'In a landmark decision, 50 countries, representing over 60% of global emissions, have agreed to implement a coordinated carbon tax. The agreement, brokered during the recent Climate Summit, sets a floor price of $50 per ton of CO2, rising to $100 by 2030. Economists believe this will create a powerful incentive for industries to decarbonize and invest in green technologies. However, critics worry about the impact on developing economies.'
  },
  {
    id: 3,
    title: 'Arctic Sea Ice Minimum Shatters Previous Records',
    source: 'Science Journal',
    publishedDate: '2024-07-18',
    category: 'Science',
    content: 'Satellite data from NASA and the ESA confirms that the Arctic sea ice has reached its lowest minimum extent ever recorded, falling below the previous record set in 2012. The rapid melt is attributed to unusually warm temperatures in the region and has significant implications for global weather patterns, sea levels, and the albedo effect. Researchers warn this is a clear sign that climate tipping points may be closer than previously thought.'
  },
];

const NewsCard: React.FC<{ article: NewsArticle, onSummarize: (article: NewsArticle) => void, isSummarizing: boolean, isSelected: boolean }> = ({ article, onSummarize, isSummarizing, isSelected }) => {
  const categoryColor = {
    'Renewable Energy': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Policy': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'Science': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'Conservation': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  };

  return (
    <Card className="mb-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${categoryColor[article.category]}`}>{article.category}</span>
          <h3 className="text-lg font-bold mt-2 text-gray-800 dark:text-white">{article.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{article.source} - {article.publishedDate}</p>
        </div>
        <button 
          onClick={() => onSummarize(article)} 
          disabled={isSummarizing}
          className="mt-4 sm:mt-0 flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-green rounded-md hover:bg-green-600 disabled:bg-gray-400 transition-colors"
        >
          {isSummarizing && isSelected ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
          {isSummarizing && isSelected ? 'Summarizing...' : 'AI Summary'}
        </button>
      </div>
      {article.summary && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200">Summary:</h4>
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            <ul>
                {article.summary.split('\n').filter(s => s.trim().length > 0).map((line, index) => <li key={index}>{line.replace(/^- /, '').replace(/^\* /, '')}</li>)}
            </ul>
          </div>
        </div>
      )}
    </Card>
  )
}

export const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>(mockNews);
  const [summarizingId, setSummarizingId] = useState<number | null>(null);

  const handleSummarize = async (articleToSummarize: NewsArticle) => {
    if (articleToSummarize.summary) {
        setArticles(articles.map(a => a.id === articleToSummarize.id ? {...a, summary: undefined} : a))
        return;
    };
    
    setSummarizingId(articleToSummarize.id);
    const summary = await summarizeArticle(articleToSummarize.content);
    setArticles(articles.map(a => a.id === articleToSummarize.id ? { ...a, summary } : a));
    setSummarizingId(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Climate News Feed</h1>
      <div>
        {articles.map(article => (
          <NewsCard 
            key={article.id} 
            article={article} 
            onSummarize={handleSummarize}
            isSummarizing={summarizingId !== null}
            isSelected={summarizingId === article.id}
          />
        ))}
      </div>
    </div>
  );
};
