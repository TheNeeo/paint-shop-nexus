import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Edit, Trash2, RotateCcw } from "lucide-react";

const mockUsers = [
  { id: 1, username: "admin", email: "admin@paintshop.com", role: "Admin", status: "Active" },
  { id: 2, username: "manager", email: "manager@paintshop.com", role: "Manager", status: "Active" },
  { id: 3, username: "staff1", email: "staff1@paintshop.com", role: "Staff", status: "Inactive" },
];

export default function UserManagementTab() {
  const [users, setUsers] = useState(mockUsers);
  const [showAddUser, setShowAddUser] = useState(false);

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
        : user
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-cadet-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </h3>
          <p className="text-cadet-gray-600">Manage admin and staff accounts</p>
        </div>
        <Button 
          onClick={() => setShowAddUser(true)}
          className="bg-cadet-gray-700 hover:bg-cadet-gray-800 text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* User List */}
      <Card className="border-cadet-gray-200">
        <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
          <CardTitle className="text-cadet-gray-900">Current Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cadet-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cadet-gray-700 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cadet-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cadet-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cadet-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cadet-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-cadet-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-cadet-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cadet-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cadet-gray-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cadet-gray-700">
                      <Badge 
                        variant={user.role === "Admin" ? "default" : "secondary"}
                        className={user.role === "Admin" ? "bg-cadet-gray-700" : "bg-cadet-gray-200 text-cadet-gray-800"}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.status === "Active"}
                          onCheckedChange={() => toggleUserStatus(user.id)}
                        />
                        <span className="text-sm text-cadet-gray-700">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cadet-gray-700">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-cadet-gray-600 hover:text-cadet-gray-900">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-cadet-gray-600 hover:text-cadet-gray-900">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add New User Form */}
      {showAddUser && (
        <Card className="border-cadet-gray-200">
          <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
            <CardTitle className="text-cadet-gray-900">Add New User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newUsername" className="text-cadet-gray-700">Username</Label>
                <Input
                  id="newUsername"
                  placeholder="Enter username"
                  className="border-cadet-gray-300 focus:border-cadet-gray-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newEmail" className="text-cadet-gray-700">Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="Enter email"
                  className="border-cadet-gray-300 focus:border-cadet-gray-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newRole" className="text-cadet-gray-700">Role</Label>
                <Select>
                  <SelectTrigger className="border-cadet-gray-300 focus:border-cadet-gray-500">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-cadet-gray-700">Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter password"
                  className="border-cadet-gray-300 focus:border-cadet-gray-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAddUser(false)}
                className="border-cadet-gray-300 text-cadet-gray-700 hover:bg-cadet-gray-50"
              >
                Cancel
              </Button>
              <Button className="bg-cadet-gray-700 hover:bg-cadet-gray-800 text-white">
                Add User
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}