import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl p-6 mb-6 shadow-lg border-2 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(to right, #D1F1F9, #E8F8FC, #D1F1F9)',
        borderColor: '#0EACDD'
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: '#0EACDD' }}></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: '#0A8CB3' }}></div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-4xl font-bold flex items-center gap-3"
              style={{ color: '#087A9E' }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <img 
                  src={customerHistoryIcon} 
                  alt="Customer History" 
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain" 
                  style={{ mixBlendMode: 'multiply' }}
                />
              </motion.div>
              Customer History
            </motion.h1>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              <Badge 
                className="text-white border-none text-sm px-4 py-1 shadow-md"
                style={{ background: 'linear-gradient(to right, #0EACDD, #0A8CB3)' }}
              >
                Live Tracking
              </Badge>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-sm italic"
            style={{ color: '#0A8CB3' }}
          >
            Track customer purchase history ~ Analyze customer behavior patterns 📊
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="bg-white transition-all duration-300 shadow-sm hover:shadow-md"
            style={{ 
              borderColor: '#0EACDD',
              color: '#087A9E'
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleExportExcel}
              className="shadow-lg hover:shadow-xl border-2 transition-all duration-300 relative overflow-hidden group text-white"
              style={{ 
                background: 'linear-gradient(to right, #0EACDD, #0A8CB3)',
                borderColor: '#0EACDD'
              }}
            >
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <Download className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10">Export Excel</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
