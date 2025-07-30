import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (userType: 'user' | 'admin') => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication logic
    if (email === 'admin@exam.com' && password === 'admin123') {
      toast({ title: "Success", description: "Admin login successful!" });
      onLogin('admin');
    } else if (email === 'user@exam.com' && password === 'user123') {
      toast({ title: "Success", description: "User login successful!" });
      onLogin('user');
    } else {
      toast({ title: "Error", description: "Invalid credentials", variant: "destructive" });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">ExamPro Login</CardTitle>
          <CardDescription>
            Sign in to access your exams and results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
            </div>

            <Button type="submit" className="w-full" disabled={isLoading} size="lg">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p><strong>User:</strong> user@exam.com / user123</p>
            <p><strong>Admin:</strong> admin@exam.com / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}