import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { UserPlus, ArrowLeft, Eye, EyeOff, Trash2 } from 'lucide-react';

interface AddUserProps {
  onBackToDashboard: () => void;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'User' | 'Admin';
  dateAdded: string;
  status: 'Active' | 'Inactive';
}

const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    role: 'User',
    dateAdded: '2024-01-15',
    status: 'Active'
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Admin',
    dateAdded: '2024-01-10',
    status: 'Active'
  },
  {
    id: '3',
    fullName: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'User',
    dateAdded: '2024-01-20',
    status: 'Inactive'
  }
];

export default function AddUser({ onBackToDashboard }: AddUserProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'User' | 'Admin'>('User');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const validateForm = () => {
    if (!fullName.trim()) {
      toast({ title: "Error", description: "Full name is required", variant: "destructive" });
      return false;
    }
    if (!email.trim()) {
      toast({ title: "Error", description: "Email is required", variant: "destructive" });
      return false;
    }
    if (!email.includes('@')) {
      toast({ title: "Error", description: "Please enter a valid email", variant: "destructive" });
      return false;
    }
    if (!password.trim()) {
      toast({ title: "Error", description: "Password is required", variant: "destructive" });
      return false;
    }
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return false;
    }

    // Check if email already exists
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
      toast({ title: "Error", description: "Email already exists", variant: "destructive" });
      return false;
    }

    return true;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(password);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: User = {
      id: (users.length + 1).toString(),
      fullName,
      email,
      role,
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    setUsers(prev => [newUser, ...prev]);

    toast({ 
      title: "Success", 
      description: `User ${fullName} has been added successfully!` 
    });

    // Reset form
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('User');
    setShowPassword(false);
    setIsLoading(false);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({ 
      title: "User Deleted", 
      description: "User has been removed successfully" 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold">User Management</h1>
                <p className="text-sm text-muted-foreground">Add and manage system users</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add User Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Add New User
              </CardTitle>
              <CardDescription>
                Create a new user account with appropriate permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value: 'User' | 'Admin') => setRole(value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={generatePassword}
                      className="text-xs"
                    >
                      Generate
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                  {isLoading ? 'Adding User...' : 'Add User'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Users ({users.length})</CardTitle>
              <CardDescription>
                Manage existing user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-medium">{user.fullName}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                            <Badge variant={user.status === 'Active' ? 'success' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-muted-foreground">
                        Added: {user.dateAdded}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}