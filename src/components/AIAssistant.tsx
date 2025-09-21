import React, { useState } from 'react';
import { MessageCircle, Send, Loader } from 'lucide-react';
import { ScenarioResult } from '../types/financial';

interface AIAssistantProps {
  scenarioData: ScenarioResult | null;
  onAiResponse: (response: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ scenarioData, onAiResponse }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    try {
      const apiResponse = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          scenarioData,
        }),
      });

      const result = await apiResponse.json();
      if (result.success) {
        setResponse(result.data.response);
        onAiResponse(result.data.response);
      }
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Financial Assistant</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Ask a financial question about your scenario
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What if I reduce marketing spend by 20%?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Suggested questions:</label>
          <div className="flex flex-wrap gap-2">
            {[
              "How can I improve cash runway?",
              "What's the ROI of hiring more people?",
              "Should I increase or decrease pricing?",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuestion(suggestion)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </form>

      {response && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">AI Response:</h4>
            <p className="text-sm text-blue-700 leading-relaxed whitespace-pre-wrap">{response}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;