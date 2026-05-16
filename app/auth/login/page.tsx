'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { 
  Building2, 
  Lock,
  ArrowRight,
  Mail,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MOCK_INVITES, Role } from '@/lib/mock-data';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (role: Role) => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, verify credentials. 
    // For demo, we just log in with the mock data for that role if the email matches or just by role if demoing.
    const userData = Object.values(MOCK_INVITES).find(u => u.role === role) || MOCK_INVITES.us;
    
    login(userData);
    toast.success(`Welcome back, ${userData.name}!`);
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8 space-y-2">
          <div className="bg-indigo-600 p-3 rounded-none shadow-indigo-200 shadow-xl">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-display tracking-tight">Kelem.co</h2>
          <p className="text-slate-500 text-sm font-medium">Access your enterprise dashboard</p>
        </div>

        <Card className="border border-slate-950 shadow-xl bg-white">
          <CardHeader className="pt-8 px-8">
            <div className="space-y-6">
              <div className="space-y-4">
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
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</Label>
                    <button className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 uppercase tracking-wider">Forgot?</button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-12 rounded-none border-slate-200 focus-visible:ring-indigo-500" 
                    />
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none font-bold shadow-lg shadow-indigo-100 transition-all group"
                onClick={() => handleLogin('organization')}
                disabled={isLoading}
              >
                <span>Sign in as Organization</span>
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardHeader>
          
          <CardFooter className="px-8 pb-8 pt-4 flex flex-col space-y-4 text-center">
             <div className="pt-2">
                <span className="text-sm text-slate-500">New organization? </span>
                <button 
                  onClick={() => router.push('/auth/signup')}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Register Here
                </button>
             </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
