
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Home,
  Activity,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock activity data
const mockActivityData = [
  {
    id: "1",
    productName: "Premium Paint Brush Set",
    activityType: "stock_update",
    description: "Stock increased by 20 units",
    oldValue: "25",
    newValue: "45",
    timestamp: "2024-01-15T10:30:00Z",
    user: "Admin",
    category: "Tools",
  },
  {
    id: "2",
    productName: "Acrylic Paint Collection",
    activityType: "price_change",
    description: "Price updated from ₹10.00 to ₹12.50",
    oldValue: "10.00",
    newValue: "12.50",
    timestamp: "2024-01-14T15:45:00Z",
    user: "Manager",
    category: "Paint",
  },
  {
    id: "3",
    productName: "Canvas Pack",
    activityType: "sale",
    description: "5 units sold",
    oldValue: "13",
    newValue: "8",
    timestamp: "2024-01-14T09:20:00Z",
    user: "Sales Rep",
    category: "Canvas",
  },
  {
    id: "4",
    productName: "Premium Paint Brush Set",
    activityType: "restock",
    description: "Low stock alert triggered - restocked",
    oldValue: "5",
    newValue: "45",
    timestamp: "2024-01-13T14:15:00Z",
    user: "Inventory Manager",
    category: "Tools",
  },
  {
    id: "5",
    productName: "Acrylic Paint Collection",
    activityType: "new_product",
    description: "New product added to inventory",
    oldValue: "0",
    newValue: "120",
    timestamp: "2024-01-12T11:30:00Z",
    user: "Admin",
    category: "Paint",
  },
];

const activityTypes = ["All", "stock_update", "price_change", "sale", "restock", "new_product"];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "stock_update":
      return <Package className="h-4 w-4 text-blue-600" />;
    case "price_change":
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "sale":
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    case "restock":
      return <Package className="h-4 w-4 text-orange-600" />;
    case "new_product":
      return <Package className="h-4 w-4 text-purple-600" />;
    default:
      return <Activity className="h-4 w-4 text-gray-600" />;
  }
};

const getActivityBadge = (type: string) => {
  const colors = {
    stock_update: "bg-blue-100 text-blue-800 border-blue-200",
    price_change: "bg-green-100 text-green-800 border-green-200",
    sale: "bg-red-100 text-red-800 border-red-200",
    restock: "bg-orange-100 text-orange-800 border-orange-200",
    new_product: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
};

export default function ProductActivity() {
  const [activities] = useState(mockActivityData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState("All");

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = activity.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = activityFilter === "All" || activity.activityType === activityFilter;
      
      return matchesSearch && matchesType;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [activities, searchTerm, activityFilter]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Home className="h-4 w-4" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Product Activity</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-8 w-8 text-green-600" />
            Product Activity
          </h1>
          <Badge className="bg-green-100 text-green-800">
            {filteredActivities.length} activities
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === "All" ? "All Activities" : type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActivityIcon(activity.activityType)}
                      <Badge className={getActivityBadge(activity.activityType)}>
                        {activity.activityType.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{activity.productName}</div>
                    <div className="text-sm text-muted-foreground">{activity.category}</div>
                  </TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {activity.oldValue !== activity.newValue && (
                        <span>
                          <span className="text-red-600">{activity.oldValue}</span>
                          {" → "}
                          <span className="text-green-600">{activity.newValue}</span>
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{activity.user}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Stock Updates</p>
                <p className="text-2xl font-bold text-blue-900">
                  {activities.filter(a => a.activityType === "stock_update").length}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Price Changes</p>
                <p className="text-2xl font-bold text-green-900">
                  {activities.filter(a => a.activityType === "price_change").length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Sales</p>
                <p className="text-2xl font-bold text-red-900">
                  {activities.filter(a => a.activityType === "sale").length}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">New Products</p>
                <p className="text-2xl font-bold text-purple-900">
                  {activities.filter(a => a.activityType === "new_product").length}
                </p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
