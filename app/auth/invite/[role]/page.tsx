'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  User as UserIcon, 
  ShieldCheck, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  Lock,
  ArrowRight,
  School
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { MOCK_INVITES, Role, User } from '@/lib/mock-data';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const { login } = useAuth();
  const role = params.role as Role;
  const userData = MOCK_INVITES[role] || MOCK_INVITES.parent;
  
  const [showPassword, setShowPassword] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');
  const [fatherName, setFatherName] = React.useState('');
  const [grandFatherName, setGrandFatherName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState(userData.phone || '');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isActivating, setIsActivating] = React.useState(false);

  const handleActivate = async () => {
    if (role === 'branch_admin') {
      if (!firstName || !fatherName || !grandFatherName || !phoneNumber) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    if (!password) {
      toast.error('Please enter a password');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsActivating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const finalUser: User = {
      ...userData,
      name: role === 'branch_admin' ? `${firstName} ${fatherName}` : userData.name,
      firstName: role === 'branch_admin' ? firstName : undefined,
      fatherName: role === 'branch_admin' ? fatherName : undefined,
      grandFatherName: role === 'branch_admin' ? grandFatherName : undefined,
      phone: phoneNumber || userData.phone,
    };

    login(finalUser);
    toast.success('Account activated successfully!');
    
    // Redirect to dashboard (to be built)
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-[#1a237e] p-4 rounded-none shadow-lg ring-4 ring-blue-50">
            <School className="w-8 h-8 text-white" />
          </div>
        </div>

        <Card className="border border-slate-950 shadow-2xl bg-white/90 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pt-8 pb-6 px-8 flex flex-col items-center text-center space-y-2">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold tracking-tight text-slate-900 font-display"
            >
              {role === 'branch_admin' ? 'Complete Branch Admin Signup' : `Welcome, ${userData.name}!`}
            </motion.h1>
            <p className="text-slate-500 text-sm max-w-[280px]">
              {role === 'branch_admin' 
                ? `Finish setting up your account for ${userData.branchName} at ${userData.organizationName}.`
                : `You have been invited to join ${userData.organizationName} as a ${role.replace('_', ' ')}.`
              }
            </p>
          </CardHeader>

          <CardContent className="px-8 space-y-6">
            {role !== 'branch_admin' && (
              /* Identity Verification Block for non-branch-admins who might already have their profile partly set */
              <div className="relative p-5 rounded-none bg-slate-50/50 border border-slate-100 flex flex-col space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-none">
                      Identity Verification
                    </span>
                    <span className="text-xs text-slate-400 italic">Is this you?</span>
                 </div>

                 <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                        {userData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{userData.name}</span>
                      <span className="text-xs text-slate-500 flex items-center">
                        {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')} • {userData.organizationName}
                      </span>
                    </div>
                 </div>

                 {userData.studentName && (
                   <>
                     <Separator className="bg-slate-200/50" />
                     <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-none bg-emerald-50 text-emerald-600">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Linked Student</span>
                          <span className="text-sm font-semibold text-slate-700">{userData.studentName} ({userData.studentGrade})</span>
                        </div>
                     </div>
                   </>
                 )}
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500 pl-1 uppercase tracking-wider">Email Address</Label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                     <ShieldCheck className="w-4 h-4" />
                   </div>
                   <Input 
                     disabled
                     value={userData.email}
                     className="pl-11 h-12 bg-slate-50 border-slate-200 rounded-none font-medium text-slate-400 cursor-not-allowed"
                   />
                </div>
              </div>

              {role === 'branch_admin' && (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-500 pl-1 uppercase tracking-wider">First Name</Label>
                      <Input 
                        placeholder="e.g. Abebe"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-12 border-slate-200 focus-visible:ring-indigo-500 rounded-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-500 pl-1 uppercase tracking-wider">Father Name</Label>
                      <Input 
                        placeholder="e.g. Bikila"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        className="h-12 border-slate-200 focus-visible:ring-indigo-500 rounded-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-500 pl-1 uppercase tracking-wider">Grandfather Name</Label>
                      <Input 
                        placeholder="e.g. Demissie"
                        value={grandFatherName}
                        onChange={(e) => setGrandFatherName(e.target.value)}
                        className="h-12 border-slate-200 focus-visible:ring-indigo-500 rounded-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-500 pl-1 uppercase tracking-wider">Phone Number</Label>
                      <Input 
                        placeholder="+251 911..."
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="h-12 border-slate-200 focus-visible:ring-indigo-500 rounded-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500 pl-1 uppercase tracking-wider">Password</Label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                     <Lock className="w-4 h-4" />
                   </div>
                   <Input 
                     type={showPassword ? 'text' : 'password'}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••"
                     className="pl-11 h-12 border-slate-200 focus-visible:ring-indigo-500 rounded-none"
                   />
                   <button 
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                   >
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500 pl-1 uppercase tracking-wider">Confirm Password</Label>
                <div className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                     <Lock className="w-4 h-4" />
                   </div>
                   <Input 
                     type={showPassword ? 'text' : 'password'}
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     placeholder="••••••••"
                     className="pl-11 h-12 border-slate-200 focus-visible:ring-indigo-500 rounded-none"
                   />
                </div>
              </div>
            </div>

            {/* Role Switcher Demo */}
            <div className="space-y-3 pt-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex justify-center">Change Role (For Demo)</Label>
              <div className="flex p-1 bg-slate-100 rounded-none">
                 {(['parent', 'teacher', 'branch_admin'] as Role[]).map((r) => (
                   <button
                    key={r}
                    onClick={() => router.push(`/auth/invite/${r}`)}
                    className={cn(
                      "flex-1 py-2 px-3 text-[10px] sm:text-xs font-bold rounded-none transition-all flex items-center justify-center space-x-2",
                      role === r 
                        ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" 
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    )}
                   >
                     {r === 'parent' && <UserIcon className="w-3 h-3" />}
                     {r === 'teacher' && <School className="w-3 h-3" />}
                     {r === 'branch_admin' && <Building2 className="w-3 h-3" />}
                     <span>{r.split('_')[0].charAt(0).toUpperCase() + r.split('_')[0].slice(1)}</span>
                   </button>
                 ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="px-8 pb-8 pt-4 flex flex-col space-y-4">
            <Button 
              className="w-full h-14 bg-slate-950 hover:bg-black text-white rounded-none font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all group"
              onClick={handleActivate}
              disabled={isActivating}
            >
              {isActivating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Lock className="w-5 h-5" />
                </motion.div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Activate Account & Login</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>

            <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium">
              Not {userData.name}? Contact the school admin.
            </button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
