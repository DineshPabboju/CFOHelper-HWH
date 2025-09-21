import React, { useState, useEffect } from 'react';
import FinancialSnapshot from './FinancialSnapshot';
import ScenarioControls from './ScenarioControls';
import FinancialChart from './FinancialChart';
import AIAssistant from './AIAssistant';
import UsageCounter from './UsageCounter';
import ExportReport from './ExportReport';
import { FinancialData, ScenarioResult } from '../types/financial';

const Dashboard: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/financial-data');
      const result = await response.json();
      if (result.success) {
        setFinancialData(result.data);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioChange = async (hiring: number, marketingSpend: number, priceChange: number) => {
    if (!financialData) return;

    setLoading(true);
    try {
      const response = await fetch('/api/calculate-scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hiring, marketingSpend, priceChange }),
      });
      const result = await response.json();
      if (result.success) {
        setScenarioResult(result.data);
      }
    } catch (error) {
      console.error('Error calculating scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAiResponse = (response: string) => {
    setAiSummary(response);
  };

  if (!financialData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Row - Financial Snapshot and Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FinancialSnapshot 
            data={financialData} 
            onRefresh={fetchFinancialData} 
            loading={loading} 
          />
        </div>
        <div>
          <UsageCounter />
        </div>
      </div>

      {/* Scenario Controls */}
      <ScenarioControls onScenarioChange={handleScenarioChange} loading={loading} />

      {/* Results Row */}
      {scenarioResult && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <FinancialChart scenarioResult={scenarioResult} />
          </div>
          <div className="space-y-6">
            <AIAssistant 
              scenarioData={scenarioResult} 
              onAiResponse={handleAiResponse}
            />
            <ExportReport 
              scenarioData={scenarioResult} 
              aiSummary={aiSummary}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;