import React from 'react';
import { TrendingUp, Calculator } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CFO Helper Agent</h1>
              <p className="text-sm text-gray-600">Financial Scenario Planning & AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span>Professional Financial Planning Tool</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;