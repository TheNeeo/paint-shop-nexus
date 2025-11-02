import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, X } from "lucide-react";
import { useUserRoles, AppRole } from "@/hooks/useUserRoles";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UserManagementTab() {
  const { isAdmin, allUsersWithRoles, usersLoading, addRole, removeRole } = useUserRoles();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("staff");

  if (!isAdmin) {
    return (
      <Alert>
        <AlertDescription>
          You need administrator privileges to manage users.
        </AlertDescription>
      </Alert>
    );
  }

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleAddRole = () => {
    if (!selectedUserId || !selectedRole) return;
    addRole({ userId: selectedUserId, role: selectedRole });
    setSelectedUserId("");
  };

  const handleRemoveRole = (userId: string, role: AppRole) => {
    removeRole({ userId, role });
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </h3>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
      </div>

      {/* Add Role Section */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Assign Role to User</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="user-select">Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user-select">
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {allUsersWithRoles?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email || user.fullName || user.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="role-select">Select Role</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAddRole} disabled={!selectedUserId}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Users and Their Roles</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!allUsersWithRoles || allUsersWithRoles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <div className="space-y-4">
              {allUsersWithRoles.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{user.email || user.fullName || 'Unknown User'}</p>
                    <p className="text-sm text-muted-foreground">{user.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.roles.length === 0 ? (
                      <Badge variant="outline">No Roles</Badge>
                    ) : (
                      user.roles.map((role) => (
                        <div key={role} className="flex items-center gap-1">
                          <Badge variant={getRoleBadgeVariant(role)}>
                            {role}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveRole(user.id, role)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          <strong>Note:</strong> New users must sign up through the authentication page. 
          Use this interface to assign roles to existing users. Only administrators can delete data.
          Managers and admins can modify most business records.
        </AlertDescription>
      </Alert>
    </div>
  );
}
