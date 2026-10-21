
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { NewPurchaseModal } from '@/components/purchase/NewPurchaseModal';
import { useNavigate } from 'react-router-dom';
import purchaseInvoicePageIcon from '@/assets/purchase-invoice-page-icon.png';

const NewPurchaseEntry = () => {
  const navigate = useNavigate();

  const handlePurchaseCreated = () => {
    // Navigate back to purchase management after successful creation
    navigate('/purchase');
  };

  const handleClose = () => {
    // Navigate back to purchase management when modal is closed
    navigate('/purchase');
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-pink-800 flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={purchaseInvoicePageIcon}
                alt="New Purchase Entry"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain neo-icon-3d"
                style={{ mixBlendMode: 'multiply' }}
              />
            </motion.div>
            New Purchase Entry
          </h1>
          <p className="text-pink-600 mt-1">Create a new purchase entry for your inventory</p>
        </div>
        
        <NewPurchaseModal
          isOpen={true}
          onClose={handleClose}
          onPurchaseCreated={handlePurchaseCreated}
        />
      </div>
    </AppLayout>
  );
};

export default NewPurchaseEntry;
