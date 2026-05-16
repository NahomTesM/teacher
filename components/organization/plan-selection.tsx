'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Shield, Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlanSelectionProps {
  onPlanSelected: (plan: string) => void;
}

const PLANS = [
  {
    id: 'basic',
    name: 'Foundation',
    price: '$49',
    description: 'Perfect for small single-branch schools starting their digital journey.',
    features: ['Up to 500 Students', 'Parent Mobile App', 'Basic Attendance', 'Email Support'],
    icon: Zap,
    color: 'slate',
  },
  {
    id: 'pro',
    name: 'Excellence',
    price: '$129',
    description: 'Ideal for growing institutions with multiple branches and advanced needs.',
    features: ['Unlimited Students', 'Advanced Analytics', 'SMS Notifications', 'Multi-branch Support', 'Priority Support'],
    icon: Crown,
    color: 'indigo',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Institutional',
    price: 'Custom',
    description: 'Custom solutions for large educational groups and government bodies.',
    features: ['White-label Branding', 'API Access', 'Dedicated Manager', 'Custom Integration', 'On-site Training'],
    icon: Shield,
    color: 'slate',
  },
];

export function PlanSelection({ onPlanSelected }: PlanSelectionProps) {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-none border border-emerald-100"
        >
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Identity Verified</span>
        </motion.div>
        <h2 className="text-4xl font-bold text-slate-900 font-display tracking-tight">Select Your Institution Plan</h2>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          Choose the right scale for your organization. All plans include our core engagement engine and 24/7 technical assistance.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center pt-4">
          <div className="bg-slate-100 p-1 rounded-none flex items-center space-x-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                "px-6 py-2 rounded-none text-sm font-bold transition-all",
                billingCycle === 'monthly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={cn(
                "px-6 py-2 rounded-none text-sm font-bold transition-all flex items-center space-x-2",
                billingCycle === 'yearly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <span>Yearly</span>
              <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-none">-20%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan, idx) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={cn(
                "relative h-full flex flex-col border transition-all duration-500 group overflow-hidden shadow-xl",
                plan.popular ? "border-indigo-600 border-2 scale-105 z-10" : "border-slate-950 hover:border-black"
              )}>
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-none shadow-lg">
                      Recommended
                    </div>
                  </div>
                )}
                
                <CardHeader className="space-y-6 p-8">
                  <div className={cn(
                    "w-12 h-12 rounded-none flex items-center justify-center transition-transform group-hover:rotate-12",
                    plan.color === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-600"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 text-left">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{plan.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow p-8 pt-0 space-y-8 text-left">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-black text-slate-900 font-display">{plan.price}</span>
                    {plan.price !== 'Custom' && (
                      <span className="text-slate-400 font-bold">/per branch</span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">What&apos;s Included</p>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center space-x-3 text-sm font-medium text-slate-600">
                          <div className={cn(
                            "w-5 h-5 rounded-none flex items-center justify-center shrink-0",
                            plan.color === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-400"
                          )}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="p-8 pt-0">
                  <Button
                    className={cn(
                      "w-full h-12 rounded-none font-bold flex items-center justify-center space-x-2 transition-all",
                      plan.popular 
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                    )}
                    onClick={() => onPlanSelected(plan.id)}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      <div className="text-center">
        <p className="text-sm text-slate-400 font-medium">
          Need a multi-year contract or have more than 10 branches? <button className="text-indigo-600 hover:underline">Contact Sales</button>
        </p>
      </div>
    </div>
  );
}
