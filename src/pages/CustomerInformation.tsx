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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>({
    searchTerm: '',
    customerType: 'all',
    balanceStatus: 'all'
  });

  // Fetch customers from database
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("created_by_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(c => ({
        id: c.id,
        name: c.name,
        mobile: c.mobile,
        email: c.email || '',
        gstNo: c.gst_no || '',
        address: c.address,
        customerType: c.customer_type as 'retail' | 'wholesale',
        totalSales: Number(c.total_sales) || 0,
        outstandingBalance: Number(c.outstanding_balance) || 0,
        status: c.status as 'active' | 'inactive',
        createdAt: new Date(c.created_at)
      }));
    },
  });

  // Mutation to create customer
  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("customers")
        .insert([
          {
            name: customerData.name,
            mobile: customerData.mobile,
            email: customerData.email,
            gst_no: customerData.gstNo,
            address: customerData.address,
            customer_type: customerData.customerType,
            total_sales: customerData.totalSales,
            outstanding_balance: customerData.outstandingBalance,
            status: customerData.status,
            created_by_user_id: user.id,
          },
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({
        title: "Success",
        description: "Customer created successfully",
      });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create customer",
        variant: "destructive",
      });
    },
  });

  // Mutation to update customer
  const updateCustomerMutation = useMutation({
    mutationFn: async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
      if (!editingCustomer?.id) throw new Error("No customer selected");

      const { error } = await supabase
        .from("customers")
        .update({
          name: customerData.name,
          mobile: customerData.mobile,
          email: customerData.email,
          gst_no: customerData.gstNo,
          address: customerData.address,
          customer_type: customerData.customerType,
          total_sales: customerData.totalSales,
          outstanding_balance: customerData.outstandingBalance,
          status: customerData.status,
        })
        .eq("id", editingCustomer.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
      setIsModalOpen(false);
      setEditingCustomer(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update customer",
        variant: "destructive",
      });
    },
  });

  // Mutation to delete customer
  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: string) => {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete customer",
        variant: "destructive",
      });
    },
  });

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      deleteCustomerMutation.mutate(customerId);
    }
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    if (editingCustomer) {
      // Update existing customer
      updateCustomerMutation.mutate(customerData);
    } else {
      // Add new customer
      createCustomerMutation.mutate(customerData);
    }
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
