import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText } from 'lucide-react';
import customerHistoryIcon from '@/assets/customer-history-icon.png';

// Ash Grey theme colors
const THEME_PRIMARY = "#6B7B65"; // Dark Ash Grey
const THEME_SECONDARY = "#8A9A84"; // Medium Ash Grey
const THEME_LIGHT = "#D5DDD1"; // Light Ash Grey
const THEME_BORDER = "#B6C2AE"; // Ash Grey border
const THEME_TEXT = "#4A5746"; // Dark text for Ash Grey

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
        background: `linear-gradient(to right, ${THEME_LIGHT}, #E8EDE5, ${THEME_LIGHT})`,
        borderColor: THEME_BORDER
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: THEME_PRIMARY }}></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: THEME_SECONDARY }}></div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-4xl font-bold flex items-center gap-3"
              style={{ color: THEME_TEXT }}
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
                style={{ background: `linear-gradient(to right, ${THEME_PRIMARY}, ${THEME_SECONDARY})` }}
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
            style={{ color: THEME_PRIMARY }}
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
              borderColor: THEME_BORDER,
              color: THEME_TEXT
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
                background: `linear-gradient(to right, ${THEME_PRIMARY}, ${THEME_SECONDARY})`,
                borderColor: THEME_BORDER
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
