import React, { useState } from 'react';
import { Download, FileText, Loader } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ScenarioResult } from '../types/financial';

interface ExportReportProps {
  scenarioData: ScenarioResult | null;
  aiSummary: string;
}

const ExportReport: React.FC<ExportReportProps> = ({ scenarioData, aiSummary }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!scenarioData) return;

    setLoading(true);
    try {
      // Call backend to track export
      await fetch('/api/export-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenarioData,
          aiSummary,
        }),
      });

      // Generate PDF
      const pdf = new jsPDF();
      
      // Header
      pdf.setFontSize(20);
      pdf.text('CFO Helper Agent - Financial Report', 20, 30);
      
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Scenario Inputs
      pdf.setFontSize(16);
      pdf.text('Scenario Inputs:', 20, 65);
      
      pdf.setFontSize(12);
      pdf.text(`• Additional Hiring: ${scenarioData.changes.hiring} employees`, 25, 80);
      pdf.text(`• Marketing Spend Change: ₹${scenarioData.changes.marketingSpend.toLocaleString()}`, 25, 95);
      pdf.text(`• Price Change: ${scenarioData.changes.priceChange}%`, 25, 110);
      
      // Financial Results
      pdf.setFontSize(16);
      pdf.text('Financial Impact:', 20, 135);
      
      pdf.setFontSize(12);
      pdf.text('Current Scenario:', 25, 150);
      pdf.text(`• Revenue: ₹${scenarioData.current.revenue.toLocaleString()}`, 30, 165);
      pdf.text(`• Expenses: ₹${scenarioData.current.expenses.toLocaleString()}`, 30, 180);
      pdf.text(`• Runway: ${scenarioData.current.runway} months`, 30, 195);
      
      pdf.text('Adjusted Scenario:', 25, 215);
      pdf.text(`• Revenue: ₹${scenarioData.adjusted.revenue.toLocaleString()}`, 30, 230);
      pdf.text(`• Expenses: ₹${scenarioData.adjusted.expenses.toLocaleString()}`, 30, 245);
      pdf.text(`• Runway: ${scenarioData.adjusted.runway} months`, 30, 260);
      
      // AI Summary
      if (aiSummary) {
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text('AI Analysis & Recommendations:', 20, 30);
        
        pdf.setFontSize(12);
        const splitText = pdf.splitTextToSize(aiSummary, 170);
        pdf.text(splitText, 20, 50);
      }
      
      pdf.save(`CFO_Report_${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Export Financial Report</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Report Contents:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Scenario inputs and parameters</li>
            <li>• Current vs adjusted financial metrics</li>
            <li>• Cash runway analysis</li>
            <li>• AI-generated insights and recommendations</li>
            <li>• Chart visualizations</li>
          </ul>
        </div>

        <button
          onClick={handleExport}
          disabled={!scenarioData || loading}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{loading ? 'Generating Report...' : 'Export PDF Report'}</span>
        </button>

        {!scenarioData && (
          <p className="text-sm text-gray-500 text-center">
            Run a scenario analysis to enable report export
          </p>
        )}
      </div>
    </div>
  );
};

export default ExportReport;