import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ScenarioResult } from '../types/financial';

interface FinancialChartProps {
  scenarioResult: ScenarioResult;
}

const FinancialChart: React.FC<FinancialChartProps> = ({ scenarioResult }) => {
  const chartData = [
    {
      category: 'Revenue',
      Current: scenarioResult.current.revenue,
      Adjusted: scenarioResult.adjusted.revenue,
    },
    {
      category: 'Expenses',
      Current: scenarioResult.current.expenses,
      Adjusted: scenarioResult.adjusted.expenses,
    },
    {
      category: 'Runway (Months)',
      Current: scenarioResult.current.runway * 10000, // Scale for visibility
      Adjusted: scenarioResult.adjusted.runway * 10000,
    },
  ];

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'Current' || name === 'Adjusted') {
      return value >= 100000 ? 
        [`${(value / 10000).toFixed(1)} months`, name] : 
        [`₹${value.toLocaleString()}`, name];
    }
    return [value, name];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Financial Impact Analysis</h3>
        <p className="text-sm text-gray-600">Comparison of current vs adjusted scenarios</p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis tickFormatter={(value) => value >= 100000 ? `${(value / 10000).toFixed(0)}M` : `₹${(value / 1000).toFixed(0)}K`} />
          <Tooltip formatter={formatTooltipValue} />
          <Legend />
          <Bar dataKey="Current" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Adjusted" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Key Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Key Changes</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {scenarioResult.adjusted.revenue > scenarioResult.current.revenue ? '+' : ''}
              ₹{(scenarioResult.adjusted.revenue - scenarioResult.current.revenue).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Revenue Impact</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {scenarioResult.adjusted.expenses > scenarioResult.current.expenses ? '+' : ''}
              ₹{(scenarioResult.adjusted.expenses - scenarioResult.current.expenses).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Expense Impact</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className={`text-lg font-semibold ${
              scenarioResult.adjusted.runway > scenarioResult.current.runway ? 'text-green-600' : 'text-red-600'
            }`}>
              {scenarioResult.adjusted.runway > scenarioResult.current.runway ? '+' : ''}
              {(scenarioResult.adjusted.runway - scenarioResult.current.runway).toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">Runway Change (months)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;