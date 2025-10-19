import os
import google.generativeai as genai
from django.conf import settings
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class GeminiChatbotService:
    """Service for interacting with Google Gemini AI"""
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key and self.api_key != 'your-gemini-api-key-here':
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
            logger.warning("Gemini API key not configured, chatbot will use fallback responses")
    
    def generate_response(self, message: str, user_context: Dict = None) -> Dict:
        """Generate chatbot response using Gemini AI"""
        
        if not self.model:
            return self._get_fallback_response(message)
        
        try:
            # Build context-aware prompt
            system_prompt = self._build_system_prompt(user_context)
            
            # Generate response
            response = self.model.generate_content(
                f"{system_prompt}\n\nUser: {message}"
            )
            
            return {
                'content': response.text,
                'tokens_used': len(response.text.split()),
                'response_time': 0.5,  # Mock response time
                'source': 'gemini'
            }
            
        except Exception as e:
            logger.error(f"Error generating Gemini response: {e}")
            return self._get_fallback_response(message)
    
    def _build_system_prompt(self, user_context: Dict = None) -> str:
        """Build system prompt with EcoSphere context"""
        
        base_prompt = """You are the EcoSphere Assistant, an AI climate helper for the EcoSphere platform. 
        Your role is to help users understand climate change, reduce their carbon footprint, and navigate the platform.
        
        Key capabilities:
        - Answer questions about climate change and environmental science
        - Provide personalized carbon reduction tips
        - Guide users through the carbon calculator
        - Explain EcoSphere features and challenges
        - Share climate news and updates
        
        Guidelines:
        - Be encouraging and positive about environmental action
        - Provide practical, actionable advice
        - Use simple language that's accessible to everyone
        - Always be accurate and cite sources when possible
        - Focus on solutions rather than just problems"""
        
        if user_context:
            if user_context.get('carbon_data'):
                base_prompt += f"\n\nUser's current carbon footprint: {user_context['carbon_data']} kg CO2"
            
            if user_context.get('location'):
                base_prompt += f"\n\nUser's location: {user_context['location']}"
            
            if user_context.get('role'):
                base_prompt += f"\n\nUser role: {user_context['role']}"
        
        return base_prompt
    
    def _get_fallback_response(self, message: str) -> Dict:
        """Provide fallback responses when Gemini is not available"""
        
        fallback_responses = {
            'carbon': "I can help you understand carbon footprints! Try using our carbon calculator to track your emissions across different categories like transportation and energy use.",
            'calculator': "The carbon calculator helps you track emissions from electricity, water, gas, waste, and transportation. You can find it in the main navigation.",
            'challenge': "Check out our challenges section to join community initiatives and earn points for sustainable actions!",
            'news': "Visit our news section for the latest climate science and environmental updates, curated and summarized for easy reading.",
            'help': "I'm here to help with climate questions, carbon reduction tips, and navigating EcoSphere. What would you like to know?",
            'default': "I'm the EcoSphere Assistant! I can help you with climate information, carbon reduction tips, and guide you through our platform features. How can I assist you today?"
        }
        
        message_lower = message.lower()
        
        for keyword, response in fallback_responses.items():
            if keyword in message_lower:
                return {
                    'content': response,
                    'tokens_used': len(response.split()),
                    'response_time': 0.1,
                    'source': 'fallback'
                }
        
        return {
            'content': fallback_responses['default'],
            'tokens_used': len(fallback_responses['default'].split()),
            'response_time': 0.1,
            'source': 'fallback'
        }


class NewsCurationService:
    """Service for curating and summarizing climate news"""
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key and self.api_key != 'your-gemini-api-key-here':
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    def summarize_article(self, title: str, content: str) -> str:
        """Summarize a news article using Gemini AI"""
        
        if not self.model:
            return self._basic_summary(content)
        
        try:
            prompt = f"""Summarize this climate news article in 150-200 words, focusing on key facts and implications:

Title: {title}

Content: {content[:2000]}  # Limit content length

Provide a clear, informative summary that highlights:
- Main findings or developments
- Environmental impact
- Relevance to climate action
- Any actionable insights

Keep the tone informative but accessible to general audiences."""

            response = self.model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error summarizing article: {e}")
            return self._basic_summary(content)
    
    def categorize_article(self, title: str, content: str) -> str:
        """Categorize a news article using AI"""
        
        if not self.model:
            return self._basic_categorization(title, content)
        
        try:
            prompt = f"""Categorize this climate news article into one of these categories:
- POLICY: Government policies, regulations, international agreements
- SCIENCE: Research findings, scientific studies, climate data
- DISASTERS: Extreme weather events, natural disasters
- SOLUTIONS: Technology, innovations, renewable energy
- LOCAL: Regional or local environmental issues
- GLOBAL: International climate developments

Title: {title}
Content: {content[:1000]}

Return only the category name."""

            response = self.model.generate_content(prompt)
            category = response.text.strip().upper()
            
            # Validate category
            valid_categories = ['POLICY', 'SCIENCE', 'DISASTERS', 'SOLUTIONS', 'LOCAL', 'GLOBAL']
            if category in valid_categories:
                return category
            else:
                return self._basic_categorization(title, content)
                
        except Exception as e:
            logger.error(f"Error categorizing article: {e}")
            return self._basic_categorization(title, content)
    
    def _basic_summary(self, content: str) -> str:
        """Basic summarization when AI is not available"""
        sentences = content.split('.')[:3]
        summary = '. '.join(sentences) + '.'
        return summary[:200] + '...' if len(summary) > 200 else summary
    
    def _basic_categorization(self, title: str, content: str) -> str:
        """Basic categorization when AI is not available"""
        text = (title + ' ' + content).lower()
        
        if any(word in text for word in ['policy', 'government', 'regulation', 'agreement']):
            return 'POLICY'
        elif any(word in text for word in ['research', 'study', 'scientific', 'data']):
            return 'SCIENCE'
        elif any(word in text for word in ['disaster', 'hurricane', 'flood', 'drought', 'fire']):
            return 'DISASTERS'
        elif any(word in text for word in ['solution', 'technology', 'renewable', 'innovation']):
            return 'SOLUTIONS'
        elif any(word in text for word in ['local', 'city', 'regional', 'community']):
            return 'LOCAL'
        else:
            return 'GLOBAL'


class ClimateDataService:
    """Service for fetching and processing climate data"""
    
    def __init__(self):
        self.api_key = settings.OPENMETEO_API_KEY
    
    def fetch_climate_statistics(self) -> Dict:
        """Fetch current climate statistics"""
        
        # Mock data for demonstration
        # In production, this would fetch from Open-Meteo API
        return {
            'global_co2': 420.5,  # ppm
            'global_temp_anomaly': 1.2,  # °C above pre-industrial
            'arctic_ice_extent': 4.2,  # million km²
            'sea_level_rise': 3.4,  # mm/year
            'last_updated': '2024-01-15T10:30:00Z'
        }
    
    def fetch_historical_trends(self, data_type: str, months: int = 12) -> List[Dict]:
        """Fetch historical climate trends"""
        
        # Mock historical data
        trends = []
        for i in range(months):
            if data_type == 'co2':
                value = 415 + (i * 0.5) + (i % 3) * 0.2
            elif data_type == 'temperature':
                value = 0.8 + (i * 0.05) + (i % 4) * 0.1
            else:
                value = 100 + (i * 2) + (i % 5) * 1
            
            trends.append({
                'date': f'2024-{i+1:02d}-01',
                'value': round(value, 2),
                'unit': 'ppm' if data_type == 'co2' else '°C' if data_type == 'temperature' else 'mm'
            })
        
        return trends
