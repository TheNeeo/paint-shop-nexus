
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import dashboardHomeIcon from '@/assets/dashboard-home-icon.png';
import reorderIcon from '@/assets/reorder-icon.png';

export function ReorderHeader() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
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
              <BreadcrumbLink 
                onClick={() => navigate("/purchase")} 
                className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5"
              >
                <ShoppingCart className="h-4 w-4 text-orange-400" />
                <span className="text-orange-600 font-medium">Purchase</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1.5">
                <Package className="h-4 w-4" style={{ color: '#af0568' }} />
                <span className="font-semibold" style={{ color: '#af0568' }}>Reorder Product List</span>
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
          background: 'linear-gradient(to right, #fce7f3, #fdf2f8, #fff1f2)',
          borderColor: '#f9a8d4'
        }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: '#af0568' }}></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl sm:text-4xl font-bold flex items-center gap-3"
                style={{ color: '#831843' }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <img 
                    src={reorderIcon} 
                    alt="Reorder Products" 
                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain" 
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </motion.div>
                Reorder Product List
              </motion.h1>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <Badge 
                  className="text-white border-none text-sm px-4 py-1 shadow-md"
                  style={{ background: 'linear-gradient(to right, #af0568, #db2777)' }}
                >
                  Low Stock Alert
                </Badge>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-sm italic"
              style={{ color: '#9d174d' }}
            >
              Track low-stock items ~ Never run out of inventory 📦
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => navigate('/purchase/generate-order')}
                className="shadow-lg hover:shadow-xl border-2 transition-all duration-300 relative overflow-hidden group text-white"
                style={{ 
                  background: 'linear-gradient(to right, #af0568, #db2777)',
                  borderColor: '#f472b6'
                }}
              >
                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <ShoppingCart className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">Generate Purchase Order</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
