import React from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Clock, Users } from 'lucide-react';
import { FinancialData } from '../types/financial';

interface FinancialSnapshotProps {
  data: FinancialData;
  onRefresh: () => void;
  loading: boolean;
}

const FinancialSnapshot: React.FC<FinancialSnapshotProps> = ({ data, onRefresh, loading }) => {
  const runway = data.cashBalance / data.monthlyBurn;
  const profitMargin = ((data.revenue - data.expenses) / data.revenue) * 100;

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Financial Snapshot</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Fetch Latest Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Monthly Revenue</p>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(data.revenue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-800">{formatCurrency(data.expenses)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Cash Runway</p>
              <p className="text-2xl font-bold text-amber-800">
                {runway.toFixed(1)} <span className="text-sm font-medium">months</span>
              </p>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Team Size</p>
              <p className="text-2xl font-bold text-blue-800">{data.employees}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Profit Margin:</span>
          <span className={`font-medium ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profitMargin.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Cash Balance:</span>
          <span className="font-medium text-gray-900">{formatCurrency(data.cashBalance)}</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialSnapshot;