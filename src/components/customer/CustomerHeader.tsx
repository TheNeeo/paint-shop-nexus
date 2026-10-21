import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter } from 'lucide-react';
import customerIcon from '@/assets/customer-icon.png';

interface CustomerHeaderProps {
  onAddCustomer: () => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({ onAddCustomer }) => {
  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality
    console.log('Exporting CSV...');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900 mb-2 flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={customerIcon}
                alt="Customer Information"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain neo-icon-3d"
                style={{ mixBlendMode: 'multiply' }}
              />
            </motion.div>
            Customer Information
          </h1>
          <p className="text-blue-600">Manage your customer database and track outstanding balances</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          
          <Button
            onClick={onAddCustomer}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>
    </div>
  );
};