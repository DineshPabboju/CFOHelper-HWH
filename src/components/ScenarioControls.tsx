import React, { useState } from 'react';
import { Users, DollarSign, Percent, Play } from 'lucide-react';

interface ScenarioControlsProps {
  onScenarioChange: (hiring: number, marketingSpend: number, priceChange: number) => void;
  loading: boolean;
}

const ScenarioControls: React.FC<ScenarioControlsProps> = ({ onScenarioChange, loading }) => {
  const [hiring, setHiring] = useState(0);
  const [marketingSpend, setMarketingSpend] = useState(15000);
  const [priceChange, setPriceChange] = useState(0);

  const handleRunScenario = () => {
    onScenarioChange(hiring, marketingSpend, priceChange);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Scenario Planning Controls</h2>
        <button
          onClick={handleRunScenario}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          <span>Run Scenario</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hiring Slider */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <label className="text-sm font-medium text-gray-700">Additional Hiring</label>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="-5"
              max="10"
              value={hiring}
              onChange={(e) => setHiring(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>-5</span>
              <span className="font-medium text-gray-900">{hiring} employees</span>
              <span>+10</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Impact: {hiring > 0 ? '+' : ''}{hiring * 5000 >= 0 ? '+' : ''}₹{Math.abs(hiring * 5000).toLocaleString()}/month
          </div>
        </div>

        {/* Marketing Spend Slider */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <label className="text-sm font-medium text-gray-700">Marketing Budget</label>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={marketingSpend}
              onChange={(e) => setMarketingSpend(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>₹5K</span>
              <span className="font-medium text-gray-900">₹{(marketingSpend / 1000).toFixed(0)}K</span>
              <span>₹50K</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Monthly marketing investment
          </div>
        </div>

        {/* Price Change Slider */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Percent className="w-5 h-5 text-purple-600" />
            <label className="text-sm font-medium text-gray-700">Price Adjustment</label>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="-50"
              max="100"
              value={priceChange}
              onChange={(e) => setPriceChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>-50%</span>
              <span className="font-medium text-gray-900">{priceChange > 0 ? '+' : ''}{priceChange}%</span>
              <span>+100%</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {priceChange >= 0 ? 'Price increase' : 'Price decrease'} impact
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioControls;