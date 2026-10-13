import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { CustomerHistoryHeader } from '@/components/customer/CustomerHistoryHeader';
import { CustomerHistorySummary } from '@/components/customer/CustomerHistorySummary';
import { CustomerHistoryFilters } from '@/components/customer/CustomerHistoryFilters';
import { CustomerHistoryTable } from '@/components/customer/CustomerHistoryTable';
import { CustomerDetailModal } from '@/components/customer/CustomerDetailModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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

const mapPaymentStatus = (status: string | null): 'paid' | 'pending' | 'overdue' => {
  const s = (status || '').toLowerCase();
  if (s === 'paid') return 'paid';
  if (s === 'overdue') return 'overdue';
  return 'pending';
};

const CustomerHistory: React.FC = () => {
  const [filters, setFilters] = useState<CustomerHistoryFilters>({
    searchTerm: '',
    dateRange: 'all',
    customerType: 'all',
    outstandingAmount: 'all'
  });
  
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerHistoryData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [customersData, setCustomersData] = useState<CustomerHistoryData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id, name, mobile, email, customer_type, total_sales, outstanding_balance, status, created_at')
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;

      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('invoice_number, invoice_date, total_amount, payment_status, customer_id');

      if (salesError) throw salesError;

      const mapped: CustomerHistoryData[] = (customers || []).map((c) => {
        const customerSales = (sales || []).filter((s) => s.customer_id === c.id);
        const totalInvoices = customerSales.length;
        const totalPurchaseValue = customerSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
        const lastPurchaseDate = customerSales.length > 0
          ? new Date(Math.max(...customerSales.map((s) => new Date(s.invoice_date).getTime())))
          : null;

        const invoiceHistory: InvoiceHistory[] = customerSales
          .sort((a, b) => new Date(b.invoice_date).getTime() - new Date(a.invoice_date).getTime())
          .map((s) => ({
            invoiceNo: s.invoice_number,
            date: new Date(s.invoice_date),
            amount: s.total_amount || 0,
            paymentStatus: mapPaymentStatus(s.payment_status),
          }));

        return {
          id: c.id,
          name: c.name,
          mobile: c.mobile,
          email: c.email || undefined,
          customerType: (c.customer_type === 'wholesale' ? 'wholesale' : 'retail') as 'retail' | 'wholesale',
          totalInvoices,
          totalPurchaseValue,
          lastPurchaseDate,
          outstandingBalance: c.outstanding_balance || 0,
          invoiceHistory,
          createdAt: new Date(c.created_at),
        };
      });

      setCustomersData(mapped);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleViewDetails = (customer: CustomerHistoryData) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleEditCustomer = (customer: CustomerHistoryData) => {
    // TODO: Implement edit functionality
    console.log('Edit customer:', customer);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;

      setCustomersData(prev => prev.filter(c => c.id !== customerId));
      toast.success('Customer deleted');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
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
      <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #E8EDE5 0%, #D5DDD1 50%, #C8D4C2 100%)' }}>
        {/* Breadcrumbs - styled like Sales Activity */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer">
                  <Home className="h-4 w-4 text-cyan-600" />
                  <span className="text-cyan-600 font-medium">Dashboard</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/customers" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer">
                  <Users className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-600 font-medium">Contact Management</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <History className="h-4 w-4" style={{ color: '#6B7B65' }} />
                  <span className="font-semibold" style={{ color: '#4A5746' }}>Customer History</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
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
