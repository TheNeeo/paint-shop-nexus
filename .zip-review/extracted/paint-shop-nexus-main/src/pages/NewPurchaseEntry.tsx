
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { NewPurchaseModal } from '@/components/purchase/NewPurchaseModal';
import { useNavigate } from 'react-router-dom';

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
          <h1 className="text-3xl font-bold text-pink-800">New Purchase Entry</h1>
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
