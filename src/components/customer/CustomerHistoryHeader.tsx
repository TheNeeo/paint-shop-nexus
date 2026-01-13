import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import customerHistoryIcon from '@/assets/customer-history-icon.png';

export const CustomerHistoryHeader: React.FC = () => {
  const handleExportPDF = () => {
    console.log('Exporting PDF...');
  };

  const handleExportExcel = () => {
    console.log('Exporting Excel...');
  };

  return (
    <div 
      className="rounded-xl shadow-lg border p-6 mb-6"
      style={{
        background: 'linear-gradient(135deg, #0EACDD 0%, #0A8CB3 50%, #087A9E 100%)',
        borderColor: '#0EACDD'
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg animate-bounce hover:animate-pulse"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <img 
              src={customerHistoryIcon} 
              alt="Customer History" 
              className="w-10 h-10 object-contain filter brightness-0 invert" 
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Customer History</h1>
            <p className="text-white/80">Track customer purchase history and analyze customer behavior patterns</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>
    </div>
  );
};
