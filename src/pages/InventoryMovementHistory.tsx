import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Clock, Search, Filter, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

export default function InventoryMovementHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  // Mock data - replace with actual Supabase query
  const movements = [
    {
      id: "1",
      date: "2024-01-15 10:30 AM",
      productName: "Asian Paints Apex",
      quantityChange: 50,
      type: "Purchase",
      reason: "Restock",
      notes: "New stock arrival",
      user: "Admin",
    },
    {
      id: "2",
      date: "2024-01-15 02:15 PM",
      productName: "Berger Easy Clean",
      quantityChange: -25,
      type: "Sale",
      reason: "Customer Sale",
      notes: "Invoice #INV-1234",
      user: "Cashier 1",
    },
    {
      id: "3",
      date: "2024-01-14 11:00 AM",
      productName: "Nerolac Excel",
      quantityChange: -5,
      type: "Manual Adjust",
      reason: "Damage",
      notes: "Container damaged during handling",
      user: "Manager",
    },
    {
      id: "4",
      date: "2024-01-14 09:45 AM",
      productName: "Dulux Weathershield",
      quantityChange: 30,
      type: "Purchase",
      reason: "Restock",
      notes: "Regular stock replenishment",
      user: "Admin",
    },
    {
      id: "5",
      date: "2024-01-13 03:30 PM",
      productName: "Nippon Odour-Less",
      quantityChange: -15,
      type: "Sale",
      reason: "Customer Sale",
      notes: "Invoice #INV-1230",
      user: "Cashier 2",
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Purchase":
        return "bg-green-100 text-green-800";
      case "Sale":
        return "bg-blue-100 text-blue-800";
      case "Manual Adjust":
        return "bg-coral-100 text-coral-800";
      case "Return":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getQuantityIcon = (quantity: number) => {
    if (quantity > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600 inline mr-1" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-600 inline mr-1" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Title Bar with Breadcrumbs */}
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/inventory">Inventory Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Movement History</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            <Clock className="inline-block mr-2 h-8 w-8" />
            Inventory Movement History
          </h1>
          <p className="text-gray-600 mt-1">
            Track all inventory changes and stock movements
          </p>
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="manual">Manual Adjust</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Movement History Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Stock Movement Records</CardTitle>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity In/Out</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>User/Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="font-medium">{movement.date}</TableCell>
                    <TableCell>{movement.productName}</TableCell>
                    <TableCell>
                      {getQuantityIcon(movement.quantityChange)}
                      <span
                        className={`font-bold ${
                          movement.quantityChange > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {movement.quantityChange > 0 ? "+" : ""}
                        {movement.quantityChange}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(movement.type)}>
                        {movement.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{movement.reason}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {movement.notes}
                    </TableCell>
                    <TableCell>{movement.user}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Inventory List
          </Button>
          <p className="text-sm text-muted-foreground">
            Showing {movements.length} records
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
