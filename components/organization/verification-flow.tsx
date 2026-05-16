'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Upload, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  CheckCircle2, 
  Clock, 
  FileText,
  Save,
  Send,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface VerificationFormProps {
  onComplete: () => void;
}

export function OrganizationVerification({ onComplete }: VerificationFormProps) {
  const [step, setStep] = React.useState<'details' | 'review' | 'plans' | 'active'>('details');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const steps = [
    { id: 'details', label: 'Details Submitted', icon: FileText },
    { id: 'review', label: 'Under Review', icon: Clock },
    { id: 'plans', label: 'Select Plan', icon: Zap },
    { id: 'active', label: 'Active', icon: CheckCircle2 },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep('review');
    toast.success('Verification details submitted successfully!');
    setIsSubmitting(false);
  };

  const handleSimulateApproval = () => {
    toast.success('Identity verified by admin!');
    setStep('plans');
  };

  const handlePlanSelection = (plan: string) => {
    toast.success(`Plan selected: ${plan}`);
    setStep('active');
    // In demo, we finalize after plan selection
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header / Step Progress */}
      <Card className="border border-slate-950 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between px-8">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isPast = steps.findIndex(st => st.id === step) > idx;

              return (
                <div key={s.id} className="flex flex-col items-center space-y-2 relative z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-none flex items-center justify-center transition-all duration-500",
                    isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110" : 
                    isPast ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "text-xs font-bold tracking-tight",
                    isActive ? "text-indigo-600" : "text-slate-400"
                  )}>{s.label}</span>
                </div>
              );
            })}
            
            {/* Progress Line */}
            <div className="absolute top-[48px] left-[15%] right-[15%] h-0.5 bg-slate-100 -z-0 overflow-hidden">
               <motion.div 
                 className="h-full bg-indigo-600"
                 initial={{ width: '0%' }}
                 animate={{ 
                    width: step === 'details' ? '0%' : 
                           step === 'review' ? '33.33%' : 
                           step === 'plans' ? '66.66%' : '100%' 
                 }}
                 transition={{ duration: 0.8, ease: 'easeInOut' }}
               />
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {step === 'details' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Main Form Content */}
            <Card className="border border-slate-950 shadow-sm">
               <CardContent className="p-6 md:p-8 space-y-8">
                  {/* Business Identity */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-none bg-slate-100 flex items-center justify-center text-slate-500">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">Identity</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Institutional Registry</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Trade Name</Label>
                        <Input placeholder="e.g. Skyline Academy PLC" className="h-11 border-slate-200 rounded-none focus-visible:ring-indigo-500 font-medium text-left" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Display Name</Label>
                        <Input placeholder="e.g. Skyline International School" className="h-11 border-slate-200 rounded-none focus-visible:ring-indigo-500 font-medium text-left" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">License Number</Label>
                      <Input placeholder="EDU-ETH-2023-XXXX" className="h-11 border-slate-200 rounded-none focus-visible:ring-indigo-500 font-medium text-left" />
                    </div>
                  </div>

                  <Separator className="bg-slate-100" />

                  {/* License Upload - Compact */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                       <div className="w-8 h-8 rounded-none bg-indigo-50 flex items-center justify-center text-indigo-600">
                         <Upload className="w-4 h-4" />
                       </div>
                       <div>
                         <h4 className="text-base font-bold text-slate-900 uppercase">Verification Documents</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Operational License Upload</p>
                       </div>
                    </div>
                    <div className="p-6 border-2 border-dashed border-slate-100 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 hover:bg-slate-50 transition-all cursor-pointer group">
                      <p className="text-xs text-slate-500 font-medium max-w-sm text-center sm:text-left">
                        Drop your PDF or scan here. Ensure all four corners are visible.
                      </p>
                      <Button className="bg-[#1a237e] hover:bg-[#0d144d] text-white rounded-none px-6 h-10 font-bold text-[10px] uppercase tracking-widest shrink-0">
                        Select File
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-slate-100" />

                  {/* Contact & Location Combined Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-none bg-slate-100 flex items-center justify-center text-slate-500">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Main Contacts</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-1 text-left">
                          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Owner Name</Label>
                          <Input defaultValue="Abebe Bikila" className="h-11 border-slate-200 rounded-none font-medium text-left" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Business Mobile</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 border-r pr-2 border-slate-100 text-[10px] font-bold">+251</span>
                              <Input defaultValue="911234567" className="h-11 pl-14 border-slate-200 rounded-none font-medium text-left" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Public Line</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 border-r pr-2 border-slate-100 text-[10px] font-bold">+251</span>
                              <Input defaultValue="116789000" className="h-11 pl-14 border-slate-200 rounded-none font-medium text-left" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Business Location - Integrated */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-none bg-slate-100 flex items-center justify-center text-slate-500">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Physical HQ</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="relative h-28 bg-slate-100 border border-slate-100 group overflow-hidden">
                          <Image 
                            src="https://picsum.photos/seed/map/800/400" 
                            alt="Map Placeholder" 
                            fill 
                            className="object-cover opacity-60 grayscale"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 border border-slate-200 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                Bole Subcity, Addis Ababa
                             </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Detailed Address</Label>
                          <textarea 
                            placeholder="Building name, Office..." 
                            className="w-full h-[64px] p-3 border border-slate-200 rounded-none focus:ring-1 focus:ring-indigo-500 focus:outline-none font-medium text-xs transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
               </CardContent>
            </Card>

            {/* Actions - Refined and Minimal */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
               <Button 
                className="w-full sm:w-auto min-w-[240px] h-12 bg-[#000066] hover:bg-indigo-950 text-white rounded-none font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100/20 transition-all flex items-center justify-center space-x-2 px-8"
                onClick={handleSubmit}
                disabled={isSubmitting}
               >
                 {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Clock className="w-4 h-4" />
                    </motion.div>
                 ) : (
                    <span>SUBMIT VERIFICATION</span>
                 )}
               </Button>
               <Button 
                variant="ghost" 
                className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
               >
                 SAVE APPLICATION PROGRESS
               </Button>
            </div>
          </motion.div>
        )}

        {step === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-20 px-6 space-y-6"
          >
            <div className="w-24 h-24 rounded-none bg-indigo-50 flex items-center justify-center relative">
               <Clock className="w-12 h-12 text-indigo-600" />
               <motion.div 
                 className="absolute -inset-2 border-2 border-indigo-200 border-dashed rounded-none"
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
               />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 font-display">Under Review</h2>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">
                Our verification team is checking your institutional registration. This typically takes 24-48 business hours.
              </p>
            </div>
            <div className="bg-indigo-50 px-6 py-4 rounded-none border border-indigo-100 flex items-center space-x-3">
               <CheckCircle2 className="w-5 h-5 text-indigo-600" />
               <span className="text-sm font-semibold text-indigo-900">Application Reference: EDU-VER-78291</span>
            </div>
            
            <div className="flex flex-col space-y-4 w-full max-w-xs">
              <Button onClick={handleSimulateApproval} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none font-bold h-12 uppercase tracking-widest text-xs">
                Simulate Admin Approval
              </Button>
              <Button variant="ghost" className="text-slate-400 font-bold uppercase tracking-widest text-[10px]" onClick={() => setStep('details')}>
                Edit Submission
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'plans' && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PlanSelection onPlanSelected={handlePlanSelection} />
          </motion.div>
        )}

        {step === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-20 px-6 space-y-6"
          >
            <div className="w-24 h-24 rounded-none bg-emerald-50 flex items-center justify-center relative">
               <CheckCircle2 className="w-12 h-12 text-emerald-600" />
               <motion.div 
                 className="absolute -inset-2 border-2 border-emerald-200 rounded-none"
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1.2, opacity: [0, 1, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
               />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 font-display uppercase tracking-tight">Institution Active</h2>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">
                Welcome to Kelem.co! Your organization is now fully verified. Redirecting you to your management console...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { AnimatePresence } from 'motion/react';
import { PlanSelection } from './plan-selection';

