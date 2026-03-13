import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { CustomerSummaryCards } from '@/components/customer/CustomerSummaryCards';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Home, Users, Plus, Download, Search, X } from 'lucide-react';
import customerIcon from '@/assets/customer-icon.png';

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

  const [customers, setCustomers] = useState<Customer[]>([]);

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCustomers(data.map(c => ({
        id: c.id,
        name: c.name,
        mobile: c.mobile,
        email: c.email || undefined,
        gstNo: c.gst_no || undefined,
        address: c.address || '',
        customerType: (c.customer_type as 'retail' | 'wholesale') || 'retail',
        totalSales: Number(c.total_sales) || 0,
        outstandingBalance: Number(c.outstanding_balance) || 0,
        status: (c.status as 'active' | 'inactive') || 'active',
        createdAt: new Date(c.created_at),
      })));
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    await supabase.from('customers').delete().eq('id', customerId);
    fetchCustomers();
  };

  const handleSaveCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const dbData = {
      name: customerData.name,
      mobile: customerData.mobile,
      email: customerData.email || null,
      gst_no: customerData.gstNo || null,
      address: customerData.address,
      customer_type: customerData.customerType,
      total_sales: customerData.totalSales,
      outstanding_balance: customerData.outstandingBalance,
      status: customerData.status,
      created_by_user_id: user.id,
    };

    if (editingCustomer) {
      await supabase.from('customers').update(dbData).eq('id', editingCustomer.id);
    } else {
      await supabase.from('customers').insert([dbData]);
    }

    fetchCustomers();
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      customerType: 'all',
      balanceStatus: 'all'
    });
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
      <div className="min-h-screen" style={{ backgroundColor: '#E8F5EE' }}>
        <div className="p-6 space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList className="text-sm">
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="/" 
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Home className="h-4 w-4 text-cyan-600" />
                  <span className="text-cyan-600 font-medium">Dashboard</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="#" 
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Users className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-600 font-medium">Contact Management</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" style={{ color: '#35CA7B' }} />
                  <span className="font-semibold" style={{ color: '#35CA7B' }}>Customer Information</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header - Like Sales Activity */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-6 shadow-lg border-2 relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(to right, #E8F5EE, #D4F1E0, #E8F5EE)',
              borderColor: '#35CA7B'
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: '#35CA7B' }}></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: '#25A65C' }}></div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-2xl lg:text-4xl font-bold flex items-center gap-3"
                    style={{ color: '#1A7F42' }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <img 
                        src={customerIcon} 
                        alt="Customer" 
                        className="h-10 w-10 lg:h-12 lg:w-12 object-contain" 
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </motion.div>
                    Customer Information
                  </motion.h1>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <Badge 
                      className="text-white border-none text-sm px-4 py-1 shadow-md"
                      style={{ background: 'linear-gradient(to right, #35CA7B, #25A65C)' }}
                    >
                      Live Directory
                    </Badge>
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-sm italic"
                  style={{ color: '#2DB86A' }}
                >
                  Manage your customer database ~ Track outstanding balances 💼
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap gap-2"
              >
                <Button
                  variant="outline"
                  onClick={handleExportCSV}
                  className="bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                  style={{ 
                    borderColor: '#35CA7B',
                    color: '#1A7F42'
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleAddCustomer}
                    className="shadow-lg hover:shadow-xl border-2 transition-all duration-300 relative overflow-hidden group text-white"
                    style={{ 
                      background: 'linear-gradient(to right, #35CA7B, #25A65C)',
                      borderColor: '#35CA7B'
                    }}
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <Plus className="h-4 w-4 mr-2 relative z-10" />
                    <span className="relative z-10">Add Customer</span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Customer Summary Cards */}
          <CustomerSummaryCards customers={customers} />

          {/* Filters Section */}
          <div 
            className="rounded-xl shadow-md border-2 p-5"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#35CA7B40'
            }}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <Input
                  placeholder="Search by name, mobile, or GST number..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              
              <Select 
                value={filters.customerType} 
                onValueChange={(value: 'all' | 'retail' | 'wholesale') => 
                  setFilters(prev => ({ ...prev, customerType: value }))
                }
              >
                <SelectTrigger className="w-full lg:w-[180px] border-emerald-200 focus:border-emerald-500">
                  <SelectValue placeholder="Customer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={filters.balanceStatus} 
                onValueChange={(value: 'all' | 'due' | 'cleared') => 
                  setFilters(prev => ({ ...prev, balanceStatus: value }))
                }
              >
                <SelectTrigger className="w-full lg:w-[180px] border-emerald-200 focus:border-emerald-500">
                  <SelectValue placeholder="Balance Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="due">Payment Due</SelectItem>
                  <SelectItem value="cleared">Cleared</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Customer Table */}
          <div 
            className="rounded-xl shadow-md border-2 overflow-hidden"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#35CA7B40'
            }}
          >
            <CustomerTable 
              customers={filteredCustomers}
              onEditCustomer={handleEditCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          </div>

          {/* Add/Edit Customer Modal */}
          <AddEditCustomerModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            customer={editingCustomer}
            onSave={handleSaveCustomer}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default CustomerInformation;
