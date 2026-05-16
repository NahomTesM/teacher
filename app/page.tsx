'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Building2, ShieldCheck, Users, School, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full h-20 bg-white/80 backdrop-blur-md border-b z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-none">
            <School className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 font-display">Kelem.co</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push('/auth/login')} className="font-semibold">Log in</Button>
          <Button onClick={() => router.push('/auth/invite/parent')} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none font-bold px-6">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-none border border-indigo-100"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">SaaS Preview Live</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 font-display tracking-tight leading-[1.1]"
          >
            The Operating System <br />
            <span className="text-indigo-600">for Modern Schools.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            Engage parents, empower teachers, and manage school branches with a single unified platform built for excellence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              onClick={() => router.push('/auth/invite/parent')}
              className="w-full sm:w-auto h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none font-bold text-lg group"
            >
              Role Invitation Demo
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/auth/login')}
              className="w-full sm:w-auto h-14 px-10 rounded-none font-bold text-lg border-2"
            >
              Organization Login
            </Button>
          </motion.div>

          {/* Feature Grid */}
          <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
             <div className="p-8 rounded-none bg-white border border-slate-950 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-indigo-50 w-12 h-12 rounded-none flex items-center justify-center text-indigo-600">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Parent Engagement</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Dedicated portals for parents to track progress, attendance, and communicate with teachers.</p>
             </div>
             <div className="p-8 rounded-none bg-white border border-slate-950 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-indigo-50 w-12 h-12 rounded-none flex items-center justify-center text-indigo-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Branch Management</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Centralized control for educational organizations managing multiple school locations.</p>
             </div>
             <div className="p-8 rounded-none bg-white border border-slate-950 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-indigo-50 w-12 h-12 rounded-none flex items-center justify-center text-indigo-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Enterprise Security</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Bank-grade security and role-based access control for your institution&apos;s sensitive data.</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
