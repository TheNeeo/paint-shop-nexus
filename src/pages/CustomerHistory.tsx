import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { CustomerHistoryHeader } from '@/components/customer/CustomerHistoryHeader';
import { CustomerHistorySummary } from '@/components/customer/CustomerHistorySummary';
import { CustomerHistoryFilters } from '@/components/customer/CustomerHistoryFilters';
import { CustomerHistoryTable } from '@/components/customer/CustomerHistoryTable';
import { CustomerDetailModal } from '@/components/customer/CustomerDetailModal';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Home, Users, History } from 'lucide-react';

export interface CustomerHistoryData {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  customerType: 'retail' | 'wholesale';
  totalInvoices: number;
  totalPurchaseValue: number;
  lastPurchaseDate: Date | null;
  outstandingBalance: number;
  invoiceHistory: InvoiceHistory[];
  createdAt: Date;
}

export interface InvoiceHistory {
  invoiceNo: string;
  date: Date;
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

export interface CustomerHistoryFilters {
  searchTerm: string;
  dateRange: 'all' | '30days' | '90days' | '1year';
  customerType: 'all' | 'retail' | 'wholesale';
  outstandingAmount: 'all' | 'zero' | 'low' | 'high';
}

const CustomerHistory: React.FC = () => {
  const [filters, setFilters] = useState<CustomerHistoryFilters>({
    searchTerm: '',
    dateRange: 'all',
    customerType: 'all',
    outstandingAmount: 'all'
  });
  
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerHistoryData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data
  const [customersData, setCustomersData] = useState<CustomerHistoryData[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      mobile: '+91 98765 43210',
      email: 'rajesh@example.com',
      customerType: 'wholesale',
      totalInvoices: 15,
      totalPurchaseValue: 125000,
      lastPurchaseDate: new Date('2024-02-15'),
      outstandingBalance: 15000,
      createdAt: new Date('2024-01-15'),
      invoiceHistory: [
        { invoiceNo: 'INV-001', date: new Date('2024-02-15'), amount: 8500, paymentStatus: 'pending' },
        { invoiceNo: 'INV-002', date: new Date('2024-02-10'), amount: 12000, paymentStatus: 'paid' },
        { invoiceNo: 'INV-003', date: new Date('2024-01-28'), amount: 9500, paymentStatus: 'paid' }
      ]
    },
    {
      id: '2', 
      name: 'Priya Sharma',
      mobile: '+91 87654 32109',
      email: 'priya@example.com',
      customerType: 'retail',
      totalInvoices: 8,
      totalPurchaseValue: 45000,
      lastPurchaseDate: new Date('2024-02-20'),
      outstandingBalance: 0,
      createdAt: new Date('2024-02-20'),
      invoiceHistory: [
        { invoiceNo: 'INV-004', date: new Date('2024-02-20'), amount: 5500, paymentStatus: 'paid' },
        { invoiceNo: 'INV-005', date: new Date('2024-02-15'), amount: 7200, paymentStatus: 'paid' }
      ]
    },
    {
      id: '3',
      name: 'Amit Patel',
      mobile: '+91 76543 21098',
      email: 'amit@example.com',
      customerType: 'wholesale',
      totalInvoices: 22,
      totalPurchaseValue: 185000,
      lastPurchaseDate: new Date('2024-02-18'),
      outstandingBalance: 25000,
      createdAt: new Date('2023-12-10'),
      invoiceHistory: [
        { invoiceNo: 'INV-006', date: new Date('2024-02-18'), amount: 15000, paymentStatus: 'overdue' },
        { invoiceNo: 'INV-007', date: new Date('2024-02-12'), amount: 18500, paymentStatus: 'paid' }
      ]
    }
  ]);

  const handleViewDetails = (customer: CustomerHistoryData) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleEditCustomer = (customer: CustomerHistoryData) => {
    // TODO: Implement edit functionality
    console.log('Edit customer:', customer);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomersData(prev => prev.filter(c => c.id !== customerId));
  };

  const filteredCustomers = customersData.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         customer.mobile.includes(filters.searchTerm) ||
                         (customer.email && customer.email.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    
    const matchesType = filters.customerType === 'all' || customer.customerType === filters.customerType;
    
    const matchesOutstanding = filters.outstandingAmount === 'all' || 
                              (filters.outstandingAmount === 'zero' && customer.outstandingBalance === 0) ||
                              (filters.outstandingAmount === 'low' && customer.outstandingBalance > 0 && customer.outstandingBalance <= 10000) ||
                              (filters.outstandingAmount === 'high' && customer.outstandingBalance > 10000);
    
    let matchesDate = true;
    if (filters.dateRange !== 'all' && customer.lastPurchaseDate) {
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - customer.lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24));
      
      matchesDate = (filters.dateRange === '30days' && daysDiff <= 30) ||
                    (filters.dateRange === '90days' && daysDiff <= 90) ||
                    (filters.dateRange === '1year' && daysDiff <= 365);
    }
    
    return matchesSearch && matchesType && matchesOutstanding && matchesDate;
  });

  return (
    <AppLayout>
      <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #E8F8FC 0%, #D1F1F9 50%, #B8EAF5 100%)' }}>
        {/* Breadcrumbs - styled like Sales Activity */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" style={{ color: '#0EACDD' }}>
                  <Home className="h-4 w-4" style={{ color: '#0EACDD' }} />
                  <span className="font-medium">Dashboard</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator style={{ color: '#0EACDD' }} />
              <BreadcrumbItem>
                <BreadcrumbLink href="/customers" className="flex items-center gap-2 hover:opacity-80 transition-opacity" style={{ color: '#0EACDD' }}>
                  <Users className="h-4 w-4" style={{ color: '#0EACDD' }} />
                  <span className="font-medium">Contact Management</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator style={{ color: '#0EACDD' }} />
              <BreadcrumbPage className="font-semibold flex items-center gap-2" style={{ color: '#087A9E' }}>
                <History className="h-4 w-4" style={{ color: '#087A9E' }} />
                Customer History
              </BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Header */}
        <CustomerHistoryHeader />

        {/* Summary Cards */}
        <CustomerHistorySummary customers={customersData} />

        {/* Filters */}
        <CustomerHistoryFilters filters={filters} setFilters={setFilters} />

        {/* Customer History Table */}
        <CustomerHistoryTable 
          customers={filteredCustomers}
          onViewDetails={handleViewDetails}
          onEditCustomer={handleEditCustomer}
          onDeleteCustomer={handleDeleteCustomer}
        />

        {/* Customer Detail Modal */}
        <CustomerDetailModal 
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          customer={selectedCustomer}
        />
      </div>
    </AppLayout>
  );
};

export default CustomerHistory;
