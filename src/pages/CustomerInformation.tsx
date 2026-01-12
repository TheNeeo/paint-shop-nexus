import React, { useState } from 'react';
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
      setCustomers(prev => prev.map(c => 
        c.id === editingCustomer.id 
          ? { ...customerData, id: c.id, createdAt: c.createdAt }
          : c
      ));
    } else {
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      setCustomers(prev => [...prev, newCustomer]);
    }
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
                  className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-emerald-400" />
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="#" 
                  className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>Contact Management</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-emerald-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold" style={{ color: '#35CA7B' }}>
                  Customer Information
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header - Like Purchase Activity */}
          <div 
            className="rounded-xl shadow-lg border-2 p-6"
            style={{ 
              background: 'linear-gradient(135deg, #35CA7B 0%, #2DB86A 50%, #25A65C 100%)',
              borderColor: '#2DB86A'
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg animate-bounce hover:animate-pulse transition-all duration-300">
                  <img 
                    src={customerIcon} 
                    alt="Customer" 
                    className="w-12 h-12 object-contain drop-shadow-lg filter brightness-0 invert" 
                  />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-md">
                    Customer Information
                  </h1>
                  <p className="text-emerald-100 text-sm lg:text-base mt-1">
                    Manage your customer database and track outstanding balances
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleExportCSV}
                  className="bg-white/20 border-white/40 text-white hover:bg-white/30 hover:border-white/60"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                
                <Button
                  onClick={handleAddCustomer}
                  className="text-emerald-800 font-semibold shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: 'white' }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </div>
          </div>

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
