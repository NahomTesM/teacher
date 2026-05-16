'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { 
  Building2, 
  Lock,
  ArrowRight,
  Mail,
  Chrome
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MOCK_INVITES } from '@/lib/mock-data';
import { useAuth } from '@/hooks/use-auth';

export default function OrganizationSignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignup = async (method: 'email' | 'google') => {
    if (method === 'email' && (!email || !password)) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create or get mock organization user
    const userData = {
      ...MOCK_INVITES.organization,
      email: method === 'email' ? email : 'google.user@example.com',
      isNew: true // Flag to trigger verification flow
    };
    
    login(userData);
    toast.success('Account created successfully!');
    router.push('/dashboard/organization');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8 space-y-2">
          <div className="bg-indigo-600 p-3 rounded-none shadow-indigo-200 shadow-xl">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display tracking-tight">Register Organization</h2>
          <p className="text-slate-500 text-sm font-medium">Start your school engagement journey</p>
        </div>

        <Card className="border border-slate-950 shadow-xl bg-white">
          <CardHeader className="pt-8 px-8 flex flex-col space-y-4">
             <Button 
                variant="outline" 
                className="w-full h-12 rounded-none border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 flex items-center justify-center space-x-3"
                onClick={() => handleSignup('google')}
                disabled={isLoading}
             >
                <Chrome className="w-5 h-5 text-[#4285F4]" />
                <span>Continue with Google</span>
             </Button>
             
             <div className="relative w-full py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                  <span className="bg-white px-3 text-slate-400">Or use email</span>
                </div>
             </div>
          </CardHeader>
          
          <CardContent className="px-8 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Business Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-12 rounded-none border-slate-200 focus-visible:ring-indigo-500" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                  type="password" 
                  placeholder="Create a strong password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-12 rounded-none border-slate-200 focus-visible:ring-indigo-500" 
                />
              </div>
            </div>

            <Button 
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none font-bold shadow-lg shadow-indigo-100 transition-all group mt-2"
              onClick={() => handleSignup('email')}
              disabled={isLoading}
            >
              <span>Create Account</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
          
          <CardFooter className="px-8 pb-8 pt-4 flex flex-col space-y-4 text-center">
            <p className="text-xs text-slate-400 font-medium">
              By signing up, you agree to our <button className="text-indigo-500 hover:underline">Terms of Service</button> and <button className="text-indigo-500 hover:underline">Privacy Policy</button>.
            </p>
            <div className="pt-2">
              <span className="text-sm text-slate-500">Already have an account? </span>
              <button 
                onClick={() => router.push('/auth/login')}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                Sign In
              </button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
