import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Palette } from 'lucide-react';

export const CustomerHistoryHeader: React.FC = () => {
  const handleExportPDF = () => {
    console.log('Exporting PDF...');
  };

  const handleExportExcel = () => {
    console.log('Exporting Excel...');
  };

  const handleThemeToggle = () => {
    console.log('Theme toggle...');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer History</h1>
          <p className="text-gray-600">Track customer purchase history and analyze customer behavior patterns</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>

          <Button
            variant="outline"
            onClick={handleThemeToggle}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          >
            <Palette className="h-4 w-4 mr-2" />
            Theme
          </Button>
        </div>
      </div>
    </div>
  );
};