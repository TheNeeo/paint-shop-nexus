import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { CustomerHeader } from '@/components/customer/CustomerHeader';
import { CustomerSummaryCards } from '@/components/customer/CustomerSummaryCards';
import { CustomerFilters } from '@/components/customer/CustomerFilters';
import { CustomerTable } from '@/components/customer/CustomerTable';
import { AddEditCustomerModal } from '@/components/customer/AddEditCustomerModal';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Home, Users, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  gstNo?: string;
  address: string;
  customerType: 'retail' | 'wholesale';
  totalSales: number;
  outstandingBalance: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface CustomerFilters {
  searchTerm: string;
  customerType: 'all' | 'retail' | 'wholesale';
  balanceStatus: 'all' | 'due' | 'cleared';
}

const CustomerInformation: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>({
    searchTerm: '',
    customerType: 'all',
    balanceStatus: 'all'
  });

  // Mock data - replace with actual data fetching
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      mobile: '+91 98765 43210',
      email: 'rajesh@example.com',
      gstNo: '07AABCU9603R1ZX',
      address: '123 MG Road, Delhi - 110001',
      customerType: 'wholesale',
      totalSales: 125000,
      outstandingBalance: 15000,
      status: 'active',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Priya Sharma',
      mobile: '+91 87654 32109',
      email: 'priya@example.com',
      address: '456 Park Street, Mumbai - 400001',
      customerType: 'retail',
      totalSales: 45000,
      outstandingBalance: 0,
      status: 'active',
      createdAt: new Date('2024-02-20')
    }
  ]);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(prev => prev.map(c => 
        c.id === editingCustomer.id 
          ? { ...customerData, id: c.id, createdAt: c.createdAt }
          : c
      ));
    } else {
      // Add new customer
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      setCustomers(prev => [...prev, newCustomer]);
    }
    setIsModalOpen(false);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         customer.mobile.includes(filters.searchTerm) ||
                         (customer.gstNo && customer.gstNo.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    
    const matchesType = filters.customerType === 'all' || customer.customerType === filters.customerType;
    
    const matchesBalance = filters.balanceStatus === 'all' || 
                          (filters.balanceStatus === 'due' && customer.outstandingBalance > 0) ||
                          (filters.balanceStatus === 'cleared' && customer.outstandingBalance === 0);
    
    return matchesSearch && matchesType && matchesBalance;
  });

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <Home className="h-4 w-4" />
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <Users className="h-4 w-4" />
                  Customer Management
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage className="text-blue-800 font-medium">
                Customer Information
              </BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Header */}
        <CustomerHeader onAddCustomer={handleAddCustomer} />

        {/* Customer Summary Cards */}
        <CustomerSummaryCards customers={customers} />

        {/* Search & Filter Bar */}
        <CustomerFilters filters={filters} setFilters={setFilters} />

        {/* Customer Table */}
        <CustomerTable 
          customers={filteredCustomers}
          onEditCustomer={handleEditCustomer}
          onDeleteCustomer={handleDeleteCustomer}
        />

        {/* Add/Edit Customer Modal */}
        <AddEditCustomerModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          customer={editingCustomer}
          onSave={handleSaveCustomer}
        />
      </div>
    </AppLayout>
  );
};

export default CustomerInformation;
