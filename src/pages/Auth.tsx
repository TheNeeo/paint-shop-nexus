import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { signInSchema, signUpSchema, validateInput } from '@/lib/validation';
import { Mail, Lock, User, Building2, Palette, Brush, Droplets, Sparkles } from 'lucide-react';


const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate input
      const validation = validateInput(signInSchema, {
        email: signInData.email,
        password: signInData.password,
      });
      
      if (!validation.success) {
        setError(validation.error || 'Invalid input');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: validation.data.email,
        password: validation.data.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.');
        } else {
          setError(error.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Validate input
      const validation = validateInput(signUpSchema, {
        email: signUpData.email,
        password: signUpData.password,
        fullName: signUpData.fullName,
        companyName: signUpData.companyName,
      });
      
      if (!validation.success) {
        setError(validation.error || 'Invalid input');
        return;
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: validation.data.email,
        password: validation.data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: validation.data.fullName,
            company_name: validation.data.companyName || '',
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(error.message);
        }
      } else {
        setMessage('Account created successfully! Please check your email to confirm your account.');
        setSignUpData({ email: '', password: '', fullName: '', companyName: '' });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Floating Paint Drops */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Droplets className="absolute top-20 left-20 w-6 h-6 text-blue-400/30 animate-bounce" style={{ animationDelay: '0s' }} />
        <Droplets className="absolute top-40 right-40 w-4 h-4 text-green-400/30 animate-bounce" style={{ animationDelay: '1s' }} />
        <Droplets className="absolute bottom-32 left-32 w-5 h-5 text-primary/30 animate-bounce" style={{ animationDelay: '2s' }} />
        <Sparkles className="absolute top-32 left-1/2 w-4 h-4 text-blue-500/40 animate-pulse" />
        <Sparkles className="absolute bottom-40 right-20 w-3 h-3 text-green-500/40 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="relative">
                <Palette className="w-12 h-12 text-primary drop-shadow-lg" />
                <Brush className="absolute -top-1 -right-1 w-6 h-6 text-blue-600 rotate-45" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent">
                NEO COLOR FACTORY
              </h1>
              <p className="text-lg font-medium text-slate-600">
                Professional Paint Shop Management
              </p>
              <p className="text-sm text-muted-foreground">
                Streamline your paint business operations
              </p>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive" className="backdrop-blur-sm bg-destructive/95 border-destructive/50">
              <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
            </Alert>
          )}
          
          {message && (
            <Alert className="backdrop-blur-sm bg-green-50/95 border-green-200/50 text-green-800">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Card className="w-full backdrop-blur-sm bg-white/95 border-white/50 shadow-2xl shadow-blue-500/10">
            <Tabs defaultValue="signin" className="w-full">
              <CardHeader className="pb-4">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100/80">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
                </TabsList>
              </CardHeader>

            <CardContent className="px-6 pb-6">
              <TabsContent value="signin" className="space-y-6 mt-6">
                <div className="text-center space-y-2">
                  <CardTitle className="text-xl font-semibold text-slate-800">Welcome Back</CardTitle>
                  <CardDescription className="text-slate-600">
                    Sign in to access your paint shop dashboard
                  </CardDescription>
                </div>
                
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm font-medium text-slate-700">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className="pl-10 bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-medium text-slate-700">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className="pl-10 bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 mt-6" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Palette className="w-4 h-4" />
                        <span>Sign In to Dashboard</span>
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6 mt-6">
                <div className="text-center space-y-2">
                  <CardTitle className="text-xl font-semibold text-slate-800">Create Account</CardTitle>
                  <CardDescription className="text-slate-600">
                    Start managing your paint shop efficiently
                  </CardDescription>
                </div>
                
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-sm font-medium text-slate-700">Full Name</Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Smith"
                          value={signUpData.fullName}
                          onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                          className="pl-10 bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-company" className="text-sm font-medium text-slate-700">Paint Shop Name</Label>
                      <div className="relative group">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                          id="signup-company"
                          type="text"
                          placeholder="Premium Paint Co. (Optional)"
                          value={signUpData.companyName}
                          onChange={(e) => setSignUpData({ ...signUpData, companyName: e.target.value })}
                          className="pl-10 bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium text-slate-700">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@paintshop.com"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className="pl-10 bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium text-slate-700">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className="pl-10 bg-white/50 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-600/90 hover:to-green-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 mt-6" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Brush className="w-4 h-4" />
                        <span>Create Paint Shop Account</span>
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

          <div className="text-center space-y-2">
            <p className="text-sm text-slate-500 flex items-center justify-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Trusted by paint professionals worldwide</span>
              <Sparkles className="w-3 h-3" />
            </p>
            <p className="text-xs text-slate-400">
              By signing in, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;