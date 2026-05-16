'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';
import { OrganizationVerification } from '@/components/organization/verification-flow';
import { OwnerDashboard } from '@/components/organization/owner-dashboard';
import { BranchDashboard } from '@/components/branch/branch-dashboard';
import { TeacherDashboard } from '@/components/teacher/teacher-dashboard';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const role = params.role as string;
  const { user, logout } = useAuth();
 
  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleVerificationComplete = () => {
    if (user) {
      const updatedUser = { ...user, isNew: false };
      localStorage.setItem('auth_session', JSON.stringify(updatedUser));
      window.location.reload(); 
    }
  };

  const isOrganization = role === 'organization';
  const needsVerification = isOrganization && (user as any)?.isNew;

  // Organization Owner gets a specialized dashboard layout
  if (isOrganization && !needsVerification) {
    return <OwnerDashboard />;
  }

  // Branch Admin gets a specialized dashboard layout
  if (role === 'branch_admin') {
    return <BranchDashboard />;
  }

  // Teacher gets a specialized dashboard layout
  if (role === 'teacher') {
    return <TeacherDashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <nav className="h-16 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-1.5 rounded-none">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg font-display tracking-tight text-slate-900">Kelem.co</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-900">{user?.name}</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{role.replace('_', ' ')}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-none">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </nav>
      
      <main className="p-4 sm:p-8">
        {needsVerification ? (
          <OrganizationVerification onComplete={handleVerificationComplete} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            <div className="bg-white p-8 rounded-none border border-slate-950 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 font-display tracking-tight">Main Dashboard</h1>
                <p className="text-slate-500 font-medium">Welcome back, {user?.name}. Here&apos;s your overview.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-12 px-6 font-bold">
                  Quick Action
                </Button>
              </div>
            </div>
            
            <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 no-scrollbar snap-x">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-4 md:p-6 rounded-none border border-slate-950 shadow-sm space-y-3 md:space-y-4 min-w-[160px] md:min-w-0 flex-shrink-0 snap-start">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-none bg-slate-50 flex items-center justify-center text-indigo-500">
                    <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Metric Title</p>
                    <h4 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">2,482</h4>
                  </div>
                  <div className="h-1 bg-slate-50 rounded-none overflow-hidden">
                    <div className="h-full bg-indigo-500 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-12 rounded-none border border-slate-950 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
               <div className="bg-indigo-50 p-6 rounded-none shadow-inner">
                  <LayoutDashboard className="w-12 h-12 text-indigo-600 opacity-20" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Your Workspace is Being Prepared</h3>
                  <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                    We&apos;re currently mapping your institutional modules. You&apos;ll be notified as soon as your custom features are ready.
                  </p>
               </div>
               <Button variant="outline" className="rounded-none font-bold h-12 px-8 border-slate-200">
                  View Roadmap
               </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}


