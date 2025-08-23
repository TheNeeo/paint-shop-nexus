import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Eye, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Customer } from '@/pages/CustomerInformation';

interface CustomerTableProps {
  customers: Customer[];
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ 
  customers, 
  onEditCustomer, 
  onDeleteCustomer 
}) => {
  const handleViewCustomer = (customer: Customer) => {
    // TODO: Implement view customer details
    console.log('View customer:', customer);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <Card className="border-blue-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50 border-b border-blue-200">
        <CardTitle className="text-blue-900 flex items-center gap-2">
          Customer Directory
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {customers.length} customers
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-100 to-sky-100">
                <TableHead className="text-blue-900 font-semibold">S.No</TableHead>
                <TableHead className="text-blue-900 font-semibold">Name</TableHead>
                <TableHead className="text-blue-900 font-semibold">Mobile No</TableHead>
                <TableHead className="text-blue-900 font-semibold">GST No</TableHead>
                <TableHead className="text-blue-900 font-semibold">Address</TableHead>
                <TableHead className="text-blue-900 font-semibold">Type</TableHead>
                <TableHead className="text-blue-900 font-semibold">Total Sales</TableHead>
                <TableHead className="text-blue-900 font-semibold">Outstanding</TableHead>
                <TableHead className="text-blue-900 font-semibold">Status</TableHead>
                <TableHead className="text-blue-900 font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-blue-600">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer, index) => (
                  <TableRow 
                    key={customer.id}
                    className={`hover:bg-blue-50/50 transition-colors ${
                      customer.outstandingBalance > 10000 ? 'bg-blue-100/40' : 'bg-blue-50/20'
                    }`}
                  >
                    <TableCell className="font-medium text-blue-800">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      {customer.email && (
                        <div className="text-sm text-blue-600">{customer.email}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-700">{customer.mobile}</TableCell>
                    <TableCell className="text-gray-700">
                      {customer.gstNo || <span className="text-gray-400">-</span>}
                    </TableCell>
                    <TableCell className="text-gray-700 max-w-48 truncate" title={customer.address}>
                      {customer.address}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={customer.customerType === 'wholesale' ? 'default' : 'secondary'}
                        className={customer.customerType === 'wholesale' 
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      >
                        {customer.customerType === 'wholesale' ? 'Wholesale' : 'Retail'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrency(customer.totalSales)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {customer.outstandingBalance > 10000 && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={customer.outstandingBalance > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                          {formatCurrency(customer.outstandingBalance)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={customer.status === 'active' ? 'default' : 'secondary'}
                        className={customer.status === 'active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      >
                        {customer.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCustomer(customer)}
                          className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditCustomer(customer)}
                          className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteCustomer(customer.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-4 border-t border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50">
          <div className="text-sm text-blue-700">
            Total Outstanding: <span className="font-semibold text-red-600">
              {formatCurrency(customers.reduce((sum, c) => sum + c.outstandingBalance, 0))}
            </span>
          </div>
          <div className="text-sm text-blue-600">
            Showing {customers.length} customers
          </div>
        </div>
      </CardContent>
    </Card>
  );
};