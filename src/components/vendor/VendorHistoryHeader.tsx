import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Palette, Home, ChevronRight } from 'lucide-react';

export const VendorHistoryHeader: React.FC = () => {
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
    <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Home className="h-4 w-4 mr-2" />
        <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="hover:text-blue-600 cursor-pointer">Vendor</span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-blue-600 font-medium">Vendor History</span>
      </div>

      {/* Header content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor History</h1>
          <p className="text-gray-600">Track vendor purchase history and analyze vendor behavior patterns</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>

          <Button
            variant="outline"
            onClick={handleThemeToggle}
            className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
          >
            <Palette className="h-4 w-4 mr-2" />
            Theme
          </Button>
        </div>
      </div>
    </div>
  );
};