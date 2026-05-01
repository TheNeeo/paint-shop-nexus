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
import { Eye, Edit, Trash2, AlertCircle, Hash, User, Phone, FileText, MapPin, Tag, IndianRupee, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { TableHeaderCell } from '@/components/shared/TableHeaderCell';
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
    <Card className="border-0 shadow-none">
      <CardHeader 
        className="border-b-2"
        style={{ 
          background: 'linear-gradient(135deg, #E8F5EE 0%, #D1F2E0 100%)',
          borderColor: '#35CA7B40'
        }}
      >
        <CardTitle className="flex items-center gap-2" style={{ color: '#1D7A4A' }}>
          Customer Directory
          <Badge 
            variant="secondary" 
            className="text-white font-semibold"
            style={{ backgroundColor: '#35CA7B' }}
          >
            {customers.length} customers
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow 
                className="hover:bg-transparent"
                style={{ background: 'linear-gradient(135deg, #35CA7B 0%, #2DB86A 100%)' }}
              >
                <TableHeaderCell icon={Hash} label="S.No" className="text-white" iconColor="#fde68a" />
                <TableHeaderCell icon={User} label="Name" className="text-white" iconColor="#fde68a" />
                <TableHeaderCell icon={Phone} label="Mobile No" className="text-white" iconColor="#bef264" />
                <TableHeaderCell icon={FileText} label="GST No" className="text-white" iconColor="#fbcfe8" />
                <TableHeaderCell icon={MapPin} label="Address" className="text-white" iconColor="#fdba74" />
                <TableHeaderCell icon={Tag} label="Type" className="text-white" iconColor="#a5f3fc" />
                <TableHeaderCell icon={IndianRupee} label="Total Sales" className="text-white" iconColor="#fde68a" />
                <TableHeaderCell icon={AlertTriangle} label="Outstanding" className="text-white" iconColor="#fecaca" />
                <TableHeaderCell icon={CheckCircle} label="Status" className="text-white" iconColor="#bbf7d0" />
                <TableHeaderCell icon={Settings} label="Actions" className="text-white text-center" iconColor="#e2e8f0" align="center" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8" style={{ color: '#35CA7B' }}>
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer, index) => (
                  <TableRow 
                    key={customer.id}
                    className="transition-colors hover:bg-emerald-50/50"
                    style={{ 
                      backgroundColor: customer.outstandingBalance > 10000 ? '#E8F5EE' : 'white'
                    }}
                  >
                    <TableCell className="font-medium" style={{ color: '#1D7A4A' }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      {customer.email && (
                        <div className="text-sm" style={{ color: '#35CA7B' }}>{customer.email}</div>
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
                          ? 'text-white hover:opacity-90' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        style={customer.customerType === 'wholesale' ? { backgroundColor: '#35CA7B' } : {}}
                      >
                        {customer.customerType === 'wholesale' ? 'Wholesale' : 'Retail'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium" style={{ color: '#1D7A4A' }}>
                      {formatCurrency(customer.totalSales)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {customer.outstandingBalance > 10000 && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={customer.outstandingBalance > 0 ? 'text-red-600 font-medium' : 'font-medium'} style={customer.outstandingBalance <= 0 ? { color: '#35CA7B' } : {}}>
                          {formatCurrency(customer.outstandingBalance)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={customer.status === 'active' ? 'default' : 'secondary'}
                        className={customer.status === 'active'
                          ? 'text-white hover:opacity-90'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                        style={customer.status === 'active' ? { backgroundColor: '#35CA7B' } : {}}
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
                          className="h-8 w-8 p-0 hover:bg-emerald-100"
                          style={{ color: '#35CA7B' }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditCustomer(customer)}
                          className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-100"
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
        <div 
          className="flex items-center justify-between p-4 border-t-2"
          style={{ 
            background: 'linear-gradient(135deg, #E8F5EE 0%, #D1F2E0 100%)',
            borderColor: '#35CA7B40'
          }}
        >
          <div className="text-sm" style={{ color: '#1D7A4A' }}>
            Total Outstanding: <span className="font-semibold text-red-600">
              {formatCurrency(customers.reduce((sum, c) => sum + c.outstandingBalance, 0))}
            </span>
          </div>
          <div className="text-sm" style={{ color: '#35CA7B' }}>
            Showing {customers.length} customers
          </div>
        </div>
      </CardContent>
    </Card>
  );
};