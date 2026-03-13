import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Download, RefreshCw, Users, ClipboardList } from 'lucide-react';
import dashboardHomeIcon from '@/assets/smart-home-3d-icon-2.png';
import vendorHistoryIcon from '@/assets/vendor-history-icon.png';

interface VendorHistoryHeaderProps {
  vendorCount?: number;
  onExport?: () => void;
}

export const VendorHistoryHeader: React.FC<VendorHistoryHeaderProps> = ({
  vendorCount = 0,
  onExport,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Breadcrumb - Outside Header Box */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-3"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate("/")}
                className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5"
              >
                <img src={dashboardHomeIcon} alt="Dashboard" className="h-5 w-5 object-contain bg-transparent" style={{ mixBlendMode: 'multiply' }} />
                <span className="text-cyan-600 font-medium">Dashboard</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 font-medium">Contact Management</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1.5">
                <img src={vendorHistoryIcon} alt="Vendor History" className="h-5 w-5 object-contain" style={{ mixBlendMode: 'multiply' }} />
                <span className="font-semibold" style={{ color: '#4a9ba8' }}>Vendor History</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Enhanced Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl p-6 mb-8 shadow-lg border-2 relative overflow-hidden"
        style={{
          background: 'linear-gradient(to right, #d4eeef, #e8f5f5, #f0fafa)',
          borderColor: '#9ECAD6',
        }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: '#9ECAD6' }}></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: '#7ab8c6' }}></div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl sm:text-4xl font-bold flex items-center gap-3"
                style={{ color: '#2a7a8a' }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <img src={vendorHistoryIcon} alt="Vendor History" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                </motion.div>
                <div className="flex flex-col">
                  <span>Vendor History</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-sm font-normal italic ml-[3.5ch]"
                    style={{ color: '#4a9ba8' }}
                  >
                    Track vendor purchase history & behavior patterns
                  </motion.span>
                </div>
              </motion.h1>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <Badge className="text-white border-none text-sm px-4 py-1 shadow-md" style={{ background: 'linear-gradient(to right, #5ba8b5, #3d8f9e)' }}>
                  {vendorCount} vendors
                </Badge>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto bg-white transition-all duration-300 shadow-sm hover:shadow-md group"
              style={{ borderColor: '#9ECAD6', color: '#3d8f9e' }}
            >
              <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 border-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};
