
export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  source: string;
  publishedDate: string;
  category: 'Renewable Energy' | 'Policy' | 'Science' | 'Conservation';
  content: string;
  summary?: string;
}

export interface ClimateDataPoint {
  year: number;
  co2: number;
  tempAnomaly: number;
}
