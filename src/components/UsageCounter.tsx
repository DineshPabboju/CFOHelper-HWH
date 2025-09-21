import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, Activity } from 'lucide-react';

interface UsageData {
  scenariosTested: number;
  reportsExported: number;
  timestamp: string;
}

const UsageCounter: React.FC = () => {
  const [usageData, setUsageData] = useState<UsageData | null>(null);

  useEffect(() => {
    fetchUsageData();
    // Refresh usage data every 30 seconds
    const interval = setInterval(fetchUsageData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsageData = async () => {
    try {
      const response = await fetch('/api/usage');
      const result = await response.json();
      if (result.success) {
        setUsageData(result.data);
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
    }
  };

  if (!usageData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Usage Analytics</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-blue-800">Scenarios Tested</div>
              <div className="text-xs text-blue-600">Financial simulations run</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-800">{usageData.scenariosTested}</div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm font-medium text-green-800">Reports Exported</div>
              <div className="text-xs text-green-600">PDF reports generated</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-800">{usageData.reportsExported}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(usageData.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default UsageCounter;