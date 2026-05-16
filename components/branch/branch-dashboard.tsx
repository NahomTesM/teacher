'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  GitBranch, 
  Menu,
  School,
  Users, 
  BarChart3, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  ChevronDown, 
  ChevronRight,
  Check, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  LayoutDashboard, 
  FileText, 
  MoreVertical, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertCircle,
  Info,
  GraduationCap,
  Heart,
  Calendar,
  MessageSquare,
  UserCircle,
  LogOut,
  Sparkles,
  CreditCard,
  User as UserIcon,
  ShieldCheck,
  Briefcase,
  Users2,
  BookOpen,
  ClipboardCheck,
  Megaphone,
  CalendarDays,
  FileDown,
  XCircle,
  ChevronUp,
  UserPlus,
  Trash2,
  Globe,
  Monitor,
  Smartphone,
  CheckCircle,
  Link2,
  Unlink,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

// Mock Data matching the screenshot precisely
const BRANCH_DATA = {
  id: 'b1',
  name: 'Addis Ababa Main',
  code: 'CAMPUS-AA-01',
  stats: [
    { label: 'TOTAL STUDENTS', value: '1,280', trend: '+12%', sub: 'vs last term', icon: <Users2 className="w-5 h-5" />, color: 'blue' },
    { label: 'TEACHING STAFF', value: '84', trend: '+20%', sub: 'vs last term', icon: <UserIcon className="w-5 h-5" />, color: 'indigo' },
    { label: 'CAMPUS CAPACITY', value: '85%', trend: '-2%', sub: 'vs last term', icon: <Building2 className="w-5 h-5" />, color: 'purple' },
  ],
  pendingApprovals: [
    { id: 'REQ-01', type: 'Curriculum Change', submittedBy: 'Dr. Sarah Wilson', status: 'PENDING' },
    { id: 'REQ-02', type: 'Field Trip: History Museum', submittedBy: 'James Miller', status: 'APPROVED' },
    { id: 'REQ-03', type: 'Resource: Lab Equipment', submittedBy: 'Maria Garcia', status: 'REJECTED' },
  ],
  urgentAlerts: [
    { id: 1, title: 'Weather Protocol Update', priority: 'HIGH PRIORITY', time: '2h ago' },
    { id: 2, title: 'Mid-term Assessment Draft Due', priority: 'MEDIUM PRIORITY', time: '5h ago' },
  ]
};

const SidebarItem = ({ active, onClick, icon, label, collapsed }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, collapsed?: boolean }) => (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center space-x-4 px-4 py-3.5 transition-all rounded-none font-bold uppercase tracking-[0.1em] text-[11px] relative",
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100/50" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/80",
        collapsed && "justify-center p-4 space-x-0"
      )}
    >
      <div className={cn("shrink-0 transition-transform duration-300", active && "scale-110")}>
        {icon}
      </div>
      {!collapsed && <span>{label}</span>}
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute left-0 w-1 h-8 bg-white rounded-r-full" 
        />
      )}
    </button>
  );

export function BranchDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedAY, setSelectedAY] = useState('AY 2024-25');
  const [isAYOpen, setIsAYOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);

  const ayRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ayRef.current && !ayRef.current.contains(event.target as Node)) {
        setIsAYOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen bg-white md:bg-[#f8fafc] overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[45]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-slate-950 flex flex-col fixed inset-y-0 left-0 z-[60] transition-all duration-300 md:sticky md:top-0 md:h-screen shadow-2xl lg:shadow-none no-scrollbar",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isSidebarCollapsed ? "lg:w-20" : "w-72"
      )}>
        {/* Floating Toggle Arrow */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={cn(
            "hidden lg:flex absolute -right-3 top-12 w-6 h-6 bg-white border border-slate-950 rounded-full items-center justify-center z-[70] hover:bg-slate-50 transition-all shadow-md group",
            isSidebarCollapsed && "translate-x-0"
          )}
        >
          <ChevronRight className={cn("w-3.5 h-3.5 text-slate-900 transition-transform duration-300", !isSidebarCollapsed && "rotate-180")} />
        </button>

        {/* Assigned School Context */}
        <div className={cn(
            "px-4 md:px-6 pt-6 pb-2 border-b border-slate-50 bg-slate-50/50",
            isSidebarCollapsed && "px-3 py-4"
        )}>
            <div className={cn(
                "flex items-center space-x-3 group",
                isSidebarCollapsed && "justify-center space-x-0"
            )}>
                <div className={cn(
                   "w-10 h-10 bg-[#1e1b4b] border border-slate-950 text-white flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(79,70,229,1)] transition-transform duration-500 group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px]",
                   isSidebarCollapsed && "w-10 h-10"
                )}>
                    <School className="w-5 h-5" />
                </div>
                {!isSidebarCollapsed && (
                    <div className="overflow-hidden flex flex-col">
                        <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-0.5">Assigned To</span>
                        <h2 className="text-[11px] font-black text-[#1e1b4b] truncate leading-none uppercase tracking-tight">Ethio-Global Academy</h2>
                        <div className="flex items-center gap-1.5 mt-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Main Network Campus</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Academic Year Switcher */}
        <div className={cn("p-4 md:p-6 relative", isSidebarCollapsed && "px-3 pt-4")}>
            <button 
              onClick={() => isSidebarCollapsed ? setIsSidebarCollapsed(false) : setIsAYOpen(!isAYOpen)}
              className={cn(
                "w-full flex items-center justify-between p-3 border border-slate-950 bg-white hover:bg-slate-50 transition-all rounded-none group",
                isSidebarCollapsed && "justify-center p-2"
              )}
            >
              <div className="flex items-center space-x-3 text-left">
                <div className="w-10 h-10 flex items-center justify-center bg-[#1e1b4b] text-white rounded-none shadow-sm shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="text-left overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{selectedAY}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch Admin</p>
                  </div>
                )}
              </div>
              {!isSidebarCollapsed && <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isAYOpen && "rotate-180")} />}
            </button>

            <AnimatePresence>
              {isAYOpen && !isSidebarCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-6 right-6 top-[calc(100%-8px)] bg-white border border-slate-950 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-2 space-y-1">
                    {['AY 2024-25', 'AY 2023-24', 'AY 2022-23'].map((ay) => (
                      <button
                        key={ay}
                        onClick={() => {
                          setSelectedAY(ay);
                          setIsAYOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-all rounded-none text-left",
                          selectedAY === ay && "bg-slate-50"
                        )}
                      >
                        <span className="text-xs font-bold text-slate-700 truncate">{ay}</span>
                        {selectedAY === ay && <Check className="w-4 h-4 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 px-4 space-y-1 mt-4 overflow-y-auto overflow-x-hidden no-scrollbar", isSidebarCollapsed && "px-2")}>
            {!isSidebarCollapsed && <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Management</p>}
            
            <SidebarItem active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" collapsed={isSidebarCollapsed} />
            <SidebarItem active={activeTab === 'students'} onClick={() => { setActiveTab('students'); setIsMobileMenuOpen(false); }} icon={<Users className="w-5 h-5" />} label="Students" collapsed={isSidebarCollapsed} />
            <SidebarItem active={activeTab === 'parents'} onClick={() => { setActiveTab('parents'); setIsMobileMenuOpen(false); }} icon={<Users2 className="w-5 h-5" />} label="Parents" collapsed={isSidebarCollapsed} />
            <SidebarItem active={activeTab === 'teachers'} onClick={() => { setActiveTab('teachers'); setIsMobileMenuOpen(false); }} icon={<GraduationCap className="w-5 h-5" />} label="Teachers" collapsed={isSidebarCollapsed} />
            <SidebarItem active={activeTab === 'academia'} onClick={() => { setActiveTab('academia'); setIsMobileMenuOpen(false); }} icon={<BookOpen className="w-5 h-5" />} label="Academia" collapsed={isSidebarCollapsed} />
            <SidebarItem active={activeTab === 'attendance'} onClick={() => { setActiveTab('attendance'); setIsMobileMenuOpen(false); }} icon={<ClipboardCheck className="w-5 h-5" />} label="Attendance" collapsed={isSidebarCollapsed} />
            <SidebarItem active={activeTab === 'announcements'} onClick={() => { setActiveTab('announcements'); setIsMobileMenuOpen(false); }} icon={<Megaphone className="w-5 h-5" />} label="Announcements" collapsed={isSidebarCollapsed} />
            <SidebarItem active={activeTab === 'calendar'} onClick={() => { setActiveTab('calendar'); setIsMobileMenuOpen(false); }} icon={<CalendarDays className="w-5 h-5" />} label="Academic Calendar" collapsed={isSidebarCollapsed} />
            <SidebarItem active={activeTab === 'batch'} onClick={() => { setActiveTab('batch'); setIsMobileMenuOpen(false); }} icon={<FileDown className="w-5 h-5" />} label="Batch Import" collapsed={isSidebarCollapsed} />
            <SidebarItem active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} icon={<Settings className="w-5 h-5" />} label="Settings" collapsed={isSidebarCollapsed} />
        </nav>

        {/* User Account Account switch at bottom */}
        <div 
          ref={accountMenuRef}
          className={cn("p-4 border-t border-slate-100 bg-slate-50/50 relative", isSidebarCollapsed && "px-2")}
        >
          <button 
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className={cn(
              "w-full flex items-center justify-between p-2 hover:bg-slate-100 transition-all rounded-none group",
              isSidebarCollapsed && "justify-center"
            )}
          >
            <div className="flex items-center space-x-3 text-left">
              <Avatar className="w-10 h-10 border border-slate-100 shrink-0 transition-transform group-hover:scale-105">
              <AvatarImage src="https://picsum.photos/seed/admin/200" />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold uppercase">AD</AvatarFallback>
            </Avatar>
              {!isSidebarCollapsed && (
                <div className="flex flex-col items-start overflow-hidden text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight truncate w-full">Admin User</span>
                  <span className="text-[10px] font-medium text-slate-500 truncate w-full">{user?.email}</span>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />}
          </button>

          <AnimatePresence>
            {isAccountMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={cn(
                  "absolute bottom-[calc(100%-8px)] left-4 right-4 bg-white border border-slate-950 shadow-2xl z-50 overflow-hidden",
                  isSidebarCollapsed && "left-full ml-2 w-48 bottom-4 right-auto"
                )}
              >
                <div className="p-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3 text-left">
                  <Avatar className="w-8 h-8 border border-slate-100">
                    <AvatarImage src="https://picsum.photos/seed/admin/200" />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">AD</AvatarFallback>
                  </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-bold text-slate-900 truncate">Admin User</span>
                      <span className="text-[9px] text-slate-500 truncate">{user?.email}</span>
                    </div>
                  </div>
                </div>
                <div className="p-1 space-y-0.5">
                  <button onClick={() => { setIsAccountMenuOpen(false); setIsProfileSettingsOpen(true); }} className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-slate-50 text-[10px] font-bold text-slate-600 uppercase tracking-widest transition-all">
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Profile & Settings</span>
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-red-50 text-[10px] font-bold text-red-500 uppercase tracking-widest transition-all">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#f8fafc] no-scrollbar">
        {/* Header from Screenshot */}
        <header className="h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-slate-100">
            <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-none"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                    <span className="text-slate-400 font-medium tracking-tight">Branch Admin</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <span className="text-[#1e1b4b] font-bold tracking-tight capitalize">{activeTab.replace('-', ' ')}</span>
                </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-6">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <Input 
                        placeholder="Search records..." 
                        className="w-48 lg:w-96 h-10 pl-10 bg-slate-50 border-slate-200 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 rounded-xl text-xs font-medium" 
                    />
                </div>
                
                <div className="flex items-center space-x-1 md:space-x-4">
                    <button className="md:hidden p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>

        {/* Dashboard Panels */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="p-4 md:p-10 space-y-6 md:space-y-10">
            {activeTab === 'dashboard' && <BranchDashboardTab />}
            {activeTab === 'students' && <StudentsTab selectedAY={selectedAY} />}
            {activeTab === 'parents' && <ParentsTab selectedAY={selectedAY} />}
            {activeTab === 'teachers' && <TeachersTab selectedAY={selectedAY} />}
            {activeTab === 'academia' && <AcademiaTab selectedAY={selectedAY} />}
            {activeTab === 'attendance' && <AttendanceTab selectedAY={selectedAY} />}
            {activeTab === 'announcements' && <AnnouncementsTab selectedAY={selectedAY} />}
            {activeTab === 'calendar' && <CalendarTab selectedAY={selectedAY} />}
            {activeTab === 'batch' && <BatchImportTab />}
            {activeTab === 'settings' && <BranchSettingsTab />}
          </div>
        </div>
      </main>

      <ProfileSettingsModal 
        isOpen={isProfileSettingsOpen} 
        onClose={() => setIsProfileSettingsOpen(false)} 
        user={user}
      />
    </div>
  );
}

function BranchDashboardTab() {
  return (
    <div className="space-y-6 md:space-y-10">
        {/* Stats Grid - Adaptive Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
            {BRANCH_DATA.stats.map((stat, i) => (
                <Card key={i} className={cn(
                  "border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-none bg-white group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300",
                  i === 2 && "col-span-2 md:col-span-1"
                )}>
                    <CardContent className="p-3 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
                        <div className="space-y-1 md:space-y-4">
                            <p className="text-[8px] md:text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{stat.label}</p>
                            <div className="space-y-0.5 md:space-y-1">
                                <h3 className="text-lg md:text-5xl font-black text-[#1e1b4b] tracking-tighter">{stat.value}</h3>
                                <div className="flex items-center space-x-1.5 md:space-x-2">
                                    <span className={cn(
                                        "text-[8px] md:text-xs font-bold flex items-center",
                                        stat.trend.startsWith('+') ? "text-emerald-500" : "text-red-500"
                                    )}>
                                        {stat.trend} {stat.trend.startsWith('+') ? <ChevronUp className="w-2.5 h-2.5 md:w-4 md:h-4" /> : <ChevronDown className="w-2.5 h-2.5 md:w-4 md:h-4" />}
                                    </span>
                                    <span className="text-[8px] md:text-xs text-slate-400 font-medium truncate max-w-[60px] md:max-w-none">{stat.sub}</span>
                                </div>
                            </div>
                        </div>
                        <div className={cn(
                            "h-7 w-7 md:h-16 md:w-16 flex items-center justify-center rounded-none shrink-0",
                            "bg-slate-50 text-slate-400 group-hover:bg-[#1e1b4b] group-hover:text-white transition-all duration-500",
                            "[&_svg]:w-3.5 [&_svg]:h-3.5 md:[&_svg]:w-6 md:[&_svg]:h-6"
                        )}>
                            {stat.icon}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* Bottom Grid - 2/3 ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 items-start">
            
            {/* Pending Approvals - Adaptive UI */}
            <Card className="lg:col-span-2 border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-none bg-white overflow-hidden text-left">
                <CardHeader className="p-5 md:p-8 pb-4 flex flex-row items-center justify-between border-b md:border-none border-slate-50">
                    <CardTitle className="text-base md:text-lg font-bold text-[#1e1b4b] tracking-tight">Pending Approvals</CardTitle>
                    <Button variant="link" className="text-indigo-600 font-bold text-[10px] md:text-xs p-0 h-auto font-sans">View All</Button>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Desktop View Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#fcfdff]">
                                <tr className="border-y border-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                                    <th className="px-8 py-5">ID</th>
                                    <th className="px-8 py-5">TYPE</th>
                                    <th className="px-8 py-5">SUBMITTED BY</th>
                                    <th className="px-8 py-5">STATUS</th>
                                    <th className="px-8 py-5 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {BRANCH_DATA.pendingApprovals.map((req, i) => (
                                    <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-8 py-7 text-xs text-slate-400 font-bold group-hover:text-[#4f46e5] transition-colors">{req.id}</td>
                                        <td className="px-8 py-7 text-sm font-bold text-[#1e1b4b] group-hover:translate-x-1 transition-transform inline-block">{req.type}</td>
                                        <td className="px-8 py-7 text-sm text-slate-500 font-medium">{req.submittedBy}</td>
                                        <td className="px-8 py-7">
                                            <div className={cn(
                                                "inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black border",
                                                req.status === 'PENDING' ? "bg-orange-50 text-orange-600 border-orange-100 ring-4 ring-orange-50/50" :
                                                req.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100 ring-4 ring-emerald-50/50" : "bg-red-50 text-red-600 border-red-100 ring-4 ring-red-50/50"
                                            )}>
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    req.status === 'PENDING' ? "bg-orange-600" :
                                                    req.status === 'APPROVED' ? "bg-emerald-600" : "bg-red-600"
                                                )} />
                                                <span>{req.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View List */}
                    <div className="md:hidden divide-y divide-slate-50">
                      {BRANCH_DATA.pendingApprovals.map((req, i) => (
                        <div key={i} className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{req.id}</span>
                            <div className={cn(
                                "flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[8px] font-black border",
                                req.status === 'PENDING' ? "bg-orange-50 text-orange-600 border-orange-100" :
                                req.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                            )}>
                              <span>{req.status}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold text-[#1e1b4b]">{req.type}</p>
                              <p className="text-[10px] font-medium text-slate-500">By {req.submittedBy}</p>
                            </div>
                            <button className="p-2 -mr-2 text-slate-300">
                               <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                </CardContent>
            </Card>

                    {/* Urgent Alerts from Screenshot */}
            <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-none bg-white h-full relative overflow-hidden">
                <CardHeader className="p-4 md:p-8 pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-base md:text-lg font-bold text-[#1e1b4b] tracking-tight">Urgent Alerts</CardTitle>
                    <div className="bg-[#fee2e2] text-[#dc2626] text-[8px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-full uppercase tracking-widest ring-4 ring-red-50">3 New</div>
                </CardHeader>
                <CardContent className="p-4 md:p-8 pt-4 md:pt-6 space-y-3 md:space-y-6">
                    {BRANCH_DATA.urgentAlerts.map((alert, i) => (
                        <div key={i} className="p-3 md:p-6 bg-red-50/30 border border-red-100/50 rounded-none group hover:bg-red-50 transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#dc2626]" />
                            <div className="flex items-start space-x-3 md:space-x-4">
                                <div className="mt-1 h-7 w-7 md:h-10 md:w-10 shrink-0 bg-white border border-red-100/50 flex items-center justify-center rounded-none text-[#dc2626] shadow-sm">
                                    <AlertCircle className="w-3.5 h-3.5 md:w-5 md:h-5 font-black" />
                                </div>
                                <div className="space-y-0.5 md:space-y-1 text-left flex-1 min-w-0">
                                    <h4 className="font-bold text-[#1e1b4b] text-[11px] md:text-sm group-hover:text-[#991b1b] leading-tight transition-colors truncate">{alert.title}</h4>
                                    <div className="flex items-center space-x-2 md:space-x-3">
                                        <span className="text-[7px] md:text-[10px] font-black text-[#ef4444] uppercase tracking-widest shrink-0">{alert.priority}</span>
                                        <span className="text-slate-200 shrink-0">•</span>
                                        <span className="text-[7px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{alert.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button variant="outline" className="w-full mt-4 md:mt-10 border-slate-100 text-slate-400 text-[10px] md:text-xs font-bold py-4 md:py-7 hover:bg-slate-50 hover:text-[#1e1b4b] hover:border-slate-200 rounded-none transition-all shadow-sm">
                        See All Notifications
                    </Button>
                </CardContent>
            </Card>

        </div>
    </div>
  );
}

function TeachersTab({ selectedAY }: { selectedAY: string }) {
  const [filter, setFilter] = useState('All');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviteTeacherModalOpen, setIsInviteTeacherModalOpen] = useState(false);
  
  const teachers = [
    { name: 'Abebe Kebede', id: 'T-2024-001', email: 'abebe.k@school.edu', status: 'ACTIVE', dept: 'Mathematics', sections: ['9B', '10A'], image: null },
    { name: 'Dawit Mekonnen', id: 'T-2024-005', email: 'dawit.m@school.edu', status: 'NEW', dept: 'Arts', sections: ['7B', '8A'], image: 'https://picsum.photos/seed/dawit/200' },
    { name: 'Samuel Desta', id: 'T-2024-003', email: 'samuel.d@school.edu', status: 'ACTIVE', dept: 'History', sections: ['11B', '12A'], image: 'https://picsum.photos/seed/samuel/200' },
    { name: 'Sara Tesfaye', id: 'T-2024-002', email: 'sara.t@school.edu', status: 'PENDING', dept: 'Science', sections: ['8C', '7A'], image: 'https://picsum.photos/seed/sara/200' },
    { name: 'Tigist Belay', id: 'T-2024-004', email: 'tigist.b@school.edu', status: 'NEW', dept: 'English', sections: ['9A', '10C'], image: 'https://picsum.photos/seed/tigist/200' },
  ];

  const filteredTeachers = filter === 'All' 
    ? teachers 
    : teachers.filter(t => t.status === filter.toUpperCase());

  const newTeachersCount = teachers.filter(t => t.status === 'NEW').length;

  return (
    <div className="space-y-8 text-left">
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="bg-[#1e1b4b] px-4 md:px-6 py-2.5 md:py-3 rounded-none flex items-center shadow-lg shadow-indigo-100 self-start">
           <span className="text-white text-[11px] md:text-sm font-bold tracking-tight">Academic year {selectedAY}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
           <Button 
            onClick={() => setIsImportModalOpen(true)}
            variant="outline" 
            className="flex-1 sm:flex-none bg-white border-slate-100 text-[#4f46e5] font-bold text-[10px] md:text-xs px-4 md:px-6 h-10 md:h-12 rounded-none shadow-sm hover:bg-slate-50 border-none flex items-center gap-2"
           >
              <FileDown className="w-3.5 h-3.5 md:w-4 h-4" />
              Bulk Import
           </Button>
           <Button 
            onClick={() => setIsInviteModalOpen(true)}
            className="flex-1 sm:flex-none bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-[10px] md:text-xs px-4 md:px-6 h-10 md:h-12 rounded-none shadow-lg shadow-orange-100 flex items-center gap-2"
           >
              <Mail className="w-3.5 h-3.5 md:w-4 h-4" />
              Invite ({newTeachersCount})
           </Button>
           <Button 
            onClick={() => setIsInviteTeacherModalOpen(true)}
            className="w-full sm:w-auto bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-[10px] md:text-xs px-4 md:px-6 h-10 md:h-12 rounded-none shadow-lg shadow-slate-200 flex items-center gap-2"
           >
              <Plus className="w-3.5 h-3.5 md:w-4 h-4" />
              Invite Teacher
           </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-2 rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-3 md:gap-4 overflow-hidden">
         <div className="flex w-full md:w-auto bg-slate-50 p-1 rounded-full overflow-x-auto no-scrollbar shrink-0">
            {['All', 'New', 'Active', 'Pending'].map((p) => (
              <button 
                key={p}
                onClick={() => setFilter(p)}
                className={cn(
                  "px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap",
                  filter === p ? "bg-[#1e1b4b] text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {p}
              </button>
            ))}
         </div>

         <div className="flex-1 relative w-full">
            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 h-4 text-slate-300" />
            <Input 
              placeholder="Search teachers, IDs..." 
              className="w-full h-10 md:h-14 pl-10 md:pl-14 bg-slate-50/50 border-none rounded-full text-[10px] md:text-xs font-semibold placeholder:text-slate-300 focus-visible:ring-indigo-600/10"
            />
         </div>

         <button className="hidden md:flex px-6 h-14 items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors uppercase font-black text-[10px] tracking-widest shrink-0 border-l border-slate-50">
            <Filter className="w-4 h-4" />
            Name
         </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
         <SummaryMiniCard label="TOTAL" value={teachers.length.toString()} color="indigo" icon={<Users2 className="w-4 h-4" />} />
         <SummaryMiniCard label="ACTIVE" value={teachers.filter(t => t.status === 'ACTIVE').length.toString()} color="emerald" icon={<CheckCircle2 className="w-4 h-4" />} />
         <SummaryMiniCard label="PENDING" value={teachers.filter(t => t.status === 'PENDING').length.toString()} color="orange" icon={<Mail className="w-4 h-4" />} />
         <SummaryMiniCard label="NEW" value={teachers.filter(t => t.status === 'NEW').length.toString()} color="blue" icon={<Info className="w-4 h-4" />} />
      </div>

      {/* Teacher List */}
      <div className="bg-white rounded-none shadow-[0_4px_30px_rgba(0,0,0,0.03)] overflow-hidden min-h-[300px] md:min-h-[400px]">
         <div className="px-6 md:px-10 py-4 md:py-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {filter === 'All' ? 'Active Staff' : `${filter} Staff`} ({filteredTeachers.length} members)
            </h3>
            <div className="hidden lg:flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest gap-24 mr-24">
               <span className="w-24 text-center">Status</span>
               <span className="w-32 text-center">Department</span>
               <span className="w-24 text-center">Sections</span>
            </div>
         </div>

         <div className="divide-y divide-slate-100">
            {filteredTeachers.map((teacher, i) => (
               <div key={i} className="px-6 md:px-10 py-5 md:py-8 flex flex-col lg:flex-row lg:items-center group hover:bg-slate-50/50 transition-colors gap-5 lg:gap-0">
                  <div className="flex flex-1 items-center space-x-4 md:space-x-6">
                     <div className="relative">
                        <Avatar className="h-10 w-10 md:h-14 md:w-14 border border-slate-100">
                           {teacher.image ? <AvatarImage src={teacher.image} /> : <AvatarFallback className="bg-slate-100 text-slate-400 font-bold uppercase text-[10px] md:text-sm">{teacher.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>}
                        </Avatar>
                        <div className={cn(
                           "absolute bottom-0 right-0 w-3 md:w-3.5 h-3 md:h-3.5 rounded-full border-2 border-white",
                           teacher.status === 'ACTIVE' ? "bg-emerald-500" :
                           teacher.status === 'PENDING' ? "bg-orange-500" : "bg-indigo-600"
                        )} />
                     </div>
                     <div className="space-y-0.5 md:space-y-1 flex-1 overflow-hidden">
                        <h4 className="font-bold text-sm md:text-base text-slate-900 group-hover:text-[#4f46e5] transition-colors truncate">{teacher.name}</h4>
                        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                           <span className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">{teacher.id}</span>
                           <span className="text-slate-200 hidden sm:inline">•</span>
                           <span className="text-[9px] md:text-[10px] font-bold text-slate-400 lowercase truncate">{teacher.email}</span>
                        </div>
                     </div>
                     <button className="lg:hidden p-2 text-slate-200 hover:text-slate-950 transition-colors shrink-0">
                        <MoreVertical className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="flex flex-row items-center flex-wrap lg:justify-end gap-x-6 gap-y-2 lg:gap-24 lg:mr-8 border-t lg:border-none pt-4 lg:pt-0 border-slate-50 mt-1 lg:mt-0">
                     <div className="lg:w-24">
                        <StatusPill status={teacher.status} />
                     </div>
                     <div className="lg:w-32 text-left lg:text-center">
                        <p className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-tight">{teacher.dept}</p>
                        <p className="hidden sm:block text-[8px] font-black text-slate-300 uppercase tracking-widest">Department</p>
                     </div>
                     <div className="lg:w-24 flex lg:justify-center gap-1.5 md:gap-2">
                        {teacher.sections.map(s => (
                           <span key={s} className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md">{s}</span>
                        ))}
                     </div>
                  </div>
                  
                  <button className="hidden lg:block p-2 text-slate-200 hover:text-slate-950 transition-colors">
                     <MoreVertical className="w-4 h-4" />
                  </button>
               </div>
            ))}
            
            {filteredTeachers.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <Users2 className="w-12 h-12 text-slate-100 mx-auto" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No {filter.toLowerCase()} members found</p>
              </div>
            )}
         </div>
      </div>

      <BulkImportDialog isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
      <BulkInviteDialog isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} count={newTeachersCount} />
      <InviteTeacherDialog isOpen={isInviteTeacherModalOpen} onClose={() => setIsInviteTeacherModalOpen(false)} />
    </div>
  );
}

function BulkImportDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 'uploading') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('success'), 400);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1e1b4b]/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-none shadow-2xl w-full max-w-md relative overflow-hidden p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1e1b4b]">Bulk Import Teachers</h2>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {step === 'idle' && (
          <div className="space-y-6">
            <div 
              onClick={() => setStep('uploading')}
              className="border-2 border-dashed border-slate-100 rounded-none p-6 flex flex-col items-center justify-center space-y-3 hover:border-indigo-200 hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#eef2ff] flex items-center justify-center text-[#4f46e5] group-hover:scale-110 transition-transform">
                <FileDown className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-bold text-[#1e1b4b] text-sm tracking-tight">Drop CSV file here</p>
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Maximum file size: 5MB</p>
              </div>
            </div>

            <div className="bg-[#fcfdff] border border-slate-50 p-3 rounded-none flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[#4f46e5] shadow-sm text-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[8px] font-black text-[#1e1b4b] uppercase tracking-widest">DOWNLOAD TEMPLATE</p>
                  <p className="text-[9px] text-slate-400 font-medium">Standard CSV Format</p>
                </div>
              </div>
              <Button variant="link" className="text-[#4f46e5] font-black text-[9px] uppercase tracking-widest h-auto p-0">Get CSV</Button>
            </div>

            <Button disabled className="w-full h-11 bg-slate-50 text-slate-300 rounded-none font-bold uppercase tracking-widest text-[10px] shadow-sm mt-2">
               Start Import
            </Button>
          </div>
        )}

        {step === 'uploading' && (
          <div className="space-y-8 py-4">
            <div className="border border-dashed border-[#4f46e5] bg-slate-50/50 rounded-none p-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#4f46e5] flex items-center justify-center text-white shadow-lg shadow-indigo-200 animate-pulse">
                <FileDown className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-bold text-[#1e1b4b] text-sm">teachers_onboarding.csv</p>
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">0.2 KB</p>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center text-[9px] font-black text-[#4f46e5] uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    ANALYZING RECORDS...
                  </div>
                  <span>{progress}%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-[#1e1b4b]" 
                  />
               </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-6 space-y-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#1e1b4b]">Analysis Complete</h3>
              <p className="text-xs text-slate-500 font-medium max-w-[240px] mx-auto leading-relaxed">
                12 records validated. Invitations are ready to be dispatched from the dashboard.
              </p>
            </div>
            <Button 
               onClick={onClose}
               className="w-32 h-11 bg-[#1e1b4b] text-white rounded-none font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              Finish
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function BulkInviteDialog({ isOpen, onClose, count }: { isOpen: boolean, onClose: () => void, count: number }) {
  const [step, setStep] = useState<'confirm' | 'sending' | 'success'>('confirm');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 'sending') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('success'), 400);
            return 100;
          }
          return prev + 4;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1e1b4b]/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-none shadow-2xl w-full max-w-sm relative overflow-hidden p-6 text-center"
      >
        <AnimatePresence mode="wait">
          {step === 'confirm' && (
            <motion.div 
              key="confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#1e1b4b]">Send Bulk Invitations</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  You are about to send portal invitations to <span className="text-[#1e1b4b] font-bold">{count} pending teachers</span>.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1 h-10 border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-widest rounded-none"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setStep('sending')}
                  className="flex-1 h-10 bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest rounded-none shadow-lg shadow-indigo-100"
                >
                  Send Now
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'sending' && (
            <motion.div 
              key="sending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[9px] font-black text-[#4f46e5] uppercase tracking-widest">
                  <span>DISPATCHING...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-[#1e1b4b]" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#1e1b4b]">Invites Dispatched</h3>
                <p className="text-[11px] text-slate-500 font-medium">Teachers can now access their portals.</p>
              </div>
              <Button 
                onClick={onClose}
                className="w-full h-10 bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest rounded-none shadow-xl shadow-slate-200"
              >
                Continue
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function InviteTeacherDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Mathematics',
    assignments: [] as { grade: string, sections: string[] }[]
  });
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);

  const subjects = ['Mathematics', 'Science', 'History', 'English', 'Arts'];
  const grades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const availableSections = ['A', 'B', 'C', 'D', 'E'];

  const addAssignment = () => {
    setFormData(prev => ({
      ...prev,
      assignments: [...prev.assignments, { grade: 'Grade 10', sections: ['A'] }]
    }));
  };

  const removeAssignment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.filter((_, i) => i !== index)
    }));
  };

  const toggleSection = (assignmentIndex: number, section: string) => {
    setFormData(prev => ({
      ...prev,
      assignments: prev.assignments.map((as, i) => {
        if (i !== assignmentIndex) return as;
        const sections = as.sections.includes(section)
          ? as.sections.filter(s => s !== section)
          : [...as.sections, section];
        return { ...as, sections };
      })
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1e1b4b]/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-none shadow-2xl w-full max-w-xl relative overflow-hidden p-10 space-y-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f0f2ff] flex items-center justify-center text-[#4f46e5]">
              <UserPlus className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold text-[#1e1b4b]">Invite New Teacher</h2>
              <p className="text-[10px] font-bold text-slate-400">Add a professional to your academic team</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 text-left">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FULL NAME</label>
             <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter teacher name" 
                className="h-12 bg-slate-50/50 border-slate-100 rounded-none text-xs font-semibold placeholder:text-slate-200" 
             />
          </div>
          <div className="space-y-2 text-left">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OFFICIAL EMAIL</label>
             <Input 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="email@school.edu" 
                className="h-12 bg-slate-50/50 border-slate-100 rounded-none text-xs font-semibold placeholder:text-slate-200" 
             />
          </div>
        </div>

        <div className="space-y-2 text-left relative">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PRIMARY SUBJECT</label>
           <button 
             onClick={() => setIsSubjectOpen(!isSubjectOpen)}
             className="w-full h-12 px-4 flex items-center justify-between border border-slate-100 bg-slate-50/50 rounded-none text-xs font-semibold text-slate-700"
           >
             <span>{formData.subject}</span>
             <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform", isSubjectOpen && "rotate-180")} />
           </button>
           
           <AnimatePresence>
             {isSubjectOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: -5 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -5 }}
                 className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-none z-50 overflow-hidden"
               >
                 {subjects.map(s => (
                   <button
                     key={s}
                     onClick={() => { setFormData({...formData, subject: s}); setIsSubjectOpen(false); }}
                     className={cn(
                       "w-full px-5 py-4 text-left text-xs font-bold transition-colors",
                       formData.subject === s ? "bg-[#1e1b4b] text-white" : "text-slate-600 hover:bg-slate-50"
                     )}
                   >
                     {s}
                   </button>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CLASS ASSIGNMENTS</label>
              <button 
                onClick={addAssignment}
                className="text-xs font-bold text-[#4f46e5] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add Class
              </button>
           </div>

           <div className="min-h-[140px] border-2 border-dashed border-slate-100 rounded-none p-6 flex flex-col gap-4">
              {formData.assignments.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-2 opacity-40">
                  <Plus className="w-8 h-8 text-slate-300" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NO CLASSES ASSIGNED YET</p>
                </div>
              ) : (
                formData.assignments.map((as, i) => (
                  <div key={i} className="bg-slate-50/50 border border-slate-100/50 p-6 rounded-none relative group">
                    <button 
                      onClick={() => removeAssignment(i)}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-red-100 text-red-500 rounded-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2 text-left">
                          <label className="text-[8px] font-black text-slate-300 uppercase tracking-widest">GRADE</label>
                          <div className="relative">
                             <select 
                               value={as.grade}
                               onChange={(e) => {
                                 const updated = [...formData.assignments];
                                 updated[i].grade = e.target.value;
                                 setFormData({...formData, assignments: updated});
                               }}
                               className="w-full h-10 px-4 bg-white border border-slate-100 rounded-none text-xs font-bold appearance-none outline-none focus:ring-2 focus:ring-indigo-500/10"
                             >
                               {grades.map(g => <option key={g} value={g}>{g}</option>)}
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                          </div>
                       </div>

                       <div className="space-y-2 text-left">
                          <div className="flex items-center justify-between">
                             <label className="text-[8px] font-black text-slate-300 uppercase tracking-widest">SECTIONS</label>
                             <Plus className="w-3 h-3 text-slate-300" />
                          </div>
                          <div className="flex gap-2">
                             {availableSections.map(s => (
                               <button
                                 key={s}
                                 onClick={() => toggleSection(i, s)}
                                 className={cn(
                                   "w-8 h-8 rounded-none text-[10px] font-black transition-all",
                                   as.sections.includes(s) 
                                     ? "bg-[#1e1b4b] text-white shadow-md shadow-indigo-100 scale-110" 
                                     : "bg-white border border-slate-100 text-slate-300 hover:border-slate-300"
                                 )}
                               >
                                 {s}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <Button 
             variant="outline"
             onClick={onClose}
             className="h-14 bg-slate-50 border-none text-[#1e1b4b] font-bold text-xs rounded-none"
           >
             Cancel
           </Button>
           <Button 
             disabled={!formData.name || !formData.email}
             className={cn(
               "h-14 rounded-none font-bold text-xs shadow-lg transition-all",
               (!formData.name || !formData.email) 
                 ? "bg-slate-100 text-slate-300 shadow-none" 
                 : "bg-[#1e1b4b] hover:bg-slate-800 text-white shadow-indigo-100"
             )}
           >
             Send Invitation
           </Button>
        </div>
      </motion.div>
    </div>
  );
}

function BatchImportTab() {
  const [targetModule, setTargetModule] = useState('Teacher Record');
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [progress, setProgress] = useState(0);

  // New states for mobile popups
  const [activeHelpTab, setActiveHelpTab] = useState<'templates' | 'guidelines' | null>(null);

  const modules = ['Teacher Record', 'Parent Record', 'Student Record', 'Academic Calendar'];

  const handleStartImport = () => {
    if (!file) return;
    setIsProcessing(true);
    setShowNotification(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setFile(null);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#1e1b4b] tracking-tight">Batch Data Import</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Upload CSV or Excel files to bulk create records</p>
        </div>
        
        <div className="flex items-center space-x-3 text-[#4f46e5] bg-indigo-50/50 px-3 py-1.5 rounded-none border border-indigo-100 font-bold text-[9px] uppercase tracking-widest">
           <Info className="w-3.5 h-3.5" />
           <span>v2.1.2 Opt</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Mobile Help Toggles */}
          <div className="lg:hidden flex items-center gap-2">
            <button 
              onClick={() => setActiveHelpTab(activeHelpTab === 'templates' ? null : 'templates')}
              className={cn(
                "flex-1 py-3 px-4 border flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                activeHelpTab === 'templates' ? "bg-[#1e1b4b] text-white border-[#1e1b4b]" : "bg-white text-slate-400 border-slate-100"
              )}
            >
              <FileText className="w-4 h-4" />
              Templates
            </button>
            <button 
              onClick={() => setActiveHelpTab(activeHelpTab === 'guidelines' ? null : 'guidelines')}
              className={cn(
                "flex-1 py-3 px-4 border flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                activeHelpTab === 'guidelines' ? "bg-[#1e1b4b] text-white border-[#1e1b4b]" : "bg-white text-slate-400 border-slate-100"
              )}
            >
              <Info className="w-4 h-4" />
              Guidelines
            </button>
          </div>

          <Card className="border-none shadow-sm rounded-none bg-white p-6 overflow-visible">
            <div className="space-y-6">
               {/* Upload Zone */}
               <div className="relative group">
                  <div className={cn(
                    "border-2 border-dashed rounded-none p-8 flex flex-col items-center justify-center space-y-3 transition-all duration-300",
                    file ? "border-indigo-400 bg-indigo-50/20" : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                  )}>
                    <div className={cn(
                      "w-12 h-12 rounded-none flex items-center justify-center transition-all duration-300",
                      file ? "bg-[#1e1b4b] text-white scale-110 shadow-lg" : "bg-slate-50 text-indigo-400 group-hover:scale-110"
                    )}>
                      {file ? <FileText className="w-6 h-6" /> : <FileDown className="w-6 h-6" />}
                    </div>
                    
                    <div className="text-center space-y-1">
                       {file ? (
                          <div className="space-y-2">
                             <div className="flex flex-col items-center">
                                <p className="font-bold text-[#1e1b4b] text-sm">teacher_template.csv</p>
                                <p className="text-slate-300 font-bold uppercase tracking-widest text-[8px]">0.1 KB</p>
                             </div>
                             <button onClick={() => setFile(null)} className="text-red-500 font-bold text-[8px] uppercase tracking-widest hover:underline flex items-center gap-1.5 mx-auto">
                                <XCircle className="w-3 h-3" />
                                Remove File
                             </button>
                          </div>
                       ) : (
                          <>
                             <p className="font-bold text-[#1e1b4b] text-sm leading-tight">Choose a file or drag it here</p>
                             <p className="text-slate-300 font-bold text-[8px] uppercase tracking-widest">CSV, XLSX (Max 10MB)</p>
                          </>
                       )}
                    </div>

                    {!file && (
                      <Button className="bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-[9px] px-6 h-10 rounded-none transition-all uppercase tracking-widest">
                        Browse Files
                      </Button>
                    )}
                  </div>
                  {!file && <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && setFile(e.target.files[0])} />}
               </div>

               {/* Import Settings Card */}
               <Card className="border border-slate-50 shadow-none rounded-none p-5 space-y-4 overflow-visible">
                  <h3 className="text-[10px] font-black text-[#1e1b4b] uppercase tracking-widest">Import Settings</h3>
                  <div className="space-y-2 relative">
                     <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">TARGET MODULE</p>
                     <button 
                        onClick={() => setIsModuleOpen(!isModuleOpen)}
                        className="w-full h-11 px-4 flex items-center justify-between bg-white border border-slate-100 rounded-none text-xs font-bold text-slate-800 hover:border-indigo-200 transition-all"
                     >
                        <span>{targetModule}</span>
                        <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform duration-300", isModuleOpen && "rotate-180")} />
                     </button>
                     
                     <AnimatePresence>
                        {isModuleOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-950 shadow-2xl rounded-none overflow-hidden z-50 p-1.5"
                          >
                             {modules.map(m => (
                               <button 
                                 key={m} 
                                 onClick={() => { setTargetModule(m); setIsModuleOpen(false); }}
                                 className={cn(
                                   "w-full px-4 py-2.5 text-[10px] font-black text-left rounded-none transition-all uppercase tracking-wider",
                                   targetModule === m ? "bg-[#1e1b4b] text-white" : "text-slate-600 hover:bg-slate-50"
                                 )}
                               >
                                 {m}
                               </button>
                             ))}
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </Card>

               <Button 
                 disabled={!file || isProcessing}
                 onClick={handleStartImport}
                 className={cn(
                    "w-full h-14 rounded-none font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2",
                    file && !isProcessing 
                      ? "bg-[#1e1b4b] text-white shadow-xl hover:scale-[1.01] active:scale-[0.99]" 
                      : "bg-[#e2e8f0] text-slate-400 shadow-inner"
                 )}
               >
                  {isProcessing ? "Processing..." : "Begin Import Process"}
                  {!isProcessing && <ChevronRight className="w-4 h-4" />}
               </Button>
            </div>
          </Card>
        </div>

        <div className="hidden lg:flex flex-col space-y-6">
          <Card className="border-none shadow-sm rounded-none bg-white p-6 space-y-6">
             <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-[10px] font-black text-[#1e1b4b] uppercase tracking-widest">Protocol Templates</h3>
             </div>

             <div className="space-y-3">
                {[
                   { name: 'Teacher Records', type: 'XLSX', size: '14KB' },
                   { name: 'Parent Records', type: 'CSV', size: '2KB' },
                   { name: 'Student Records', type: 'XLSX', size: '12KB' },
                ].map((t, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 border border-slate-50 bg-slate-50/30 rounded-none group hover:border-indigo-100 hover:bg-indigo-50/20 transition-all">
                     <div className="text-left">
                        <p className="text-[10px] font-bold text-slate-700">{t.name}</p>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{t.type} • {t.size}</p>
                     </div>
                     <div className="h-8 w-8 bg-white border border-slate-100 rounded-none flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                        <FileDown className="w-3.5 h-3.5" />
                     </div>
                  </button>
                ))}
             </div>
          </Card>

          <Card className="border-none shadow-sm rounded-none bg-white p-6 space-y-5">
             <h3 className="text-[10px] font-black text-[#1e1b4b] uppercase tracking-widest">Guidelines</h3>
             <ul className="space-y-4">
                {[
                   "Ensure ISO-8601 format (YYYY-MM-DD).",
                   "Unique Staff ID fields must not contain duplicates.",
                   "Max record count per file is 5,000."
                ].map((text, i) => (
                   <li key={i} className="flex items-start gap-2.5">
                      <div className="w-1 h-1 rounded-none bg-indigo-400 mt-1.5 shrink-0" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">{text}</p>
                   </li>
                ))}
             </ul>
          </Card>
        </div>

        {/* Mobile Help Modals */}
        <AnimatePresence>
          {activeHelpTab && (
            <div className="fixed inset-0 z-[100] lg:hidden">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveHelpTab(null)}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bottom-0 inset-x-0 bg-white p-8 space-y-6 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-black text-[#1e1b4b] uppercase tracking-widest">
                     {activeHelpTab === 'templates' ? 'Protocol Templates' : 'Import Guidelines'}
                   </h3>
                   <button onClick={() => setActiveHelpTab(null)}>
                      <XCircle className="w-5 h-5 text-slate-300" />
                   </button>
                </div>

                {activeHelpTab === 'templates' ? (
                  <div className="space-y-3">
                    {[
                       { name: 'Teacher Records', type: 'XLSX', size: '14KB' },
                       { name: 'Parent Records', type: 'CSV', size: '2KB' },
                       { name: 'Student Records', type: 'XLSX', size: '12KB' },
                    ].map((t, i) => (
                      <button key={i} className="w-full flex items-center justify-between p-4 border border-slate-100 bg-slate-50/30 rounded-none group">
                         <div className="text-left">
                            <p className="text-[11px] font-bold text-slate-700">{t.name}</p>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{t.type} • {t.size}</p>
                         </div>
                         <FileDown className="w-4 h-4 text-[#4f46e5]" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {[
                       "Ensure ISO-8601 format (YYYY-MM-DD).",
                       "Unique Staff ID fields must not contain duplicates.",
                       "Max record count per file is 5,000."
                    ].map((text, i) => (
                       <li key={i} className="flex items-start gap-3">
                          <div className="w-1 h-1 rounded-none bg-indigo-400 mt-2 shrink-0" />
                          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">{text}</p>
                       </li>
                    ))}
                  </ul>
                )}
                
                <Button 
                  onClick={() => setActiveHelpTab(null)}
                  className="w-full h-12 bg-[#1e1b4b] text-white font-bold text-[10px] uppercase tracking-widest rounded-none shadow-xl"
                >
                  Understood
                </Button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 50 }}
            className="fixed bottom-10 right-10 z-[100] w-72 bg-white rounded-none shadow-2xl p-5 space-y-4 border border-slate-950 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-[9px] font-black text-[#1e1b4b] uppercase tracking-widest">Importing batch...</h4>
              <button onClick={() => setShowNotification(false)} className="p-1 hover:bg-slate-50 rounded"><XCircle className="w-3 h-3 text-slate-300" /></button>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-none overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-[#1e1b4b]" 
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Parents Module Implementation ---

const PARENTS_MOCK_DATA = [
  {
    id: 'P-1',
    name: 'Teshome G. Michael',
    phone: '+251 911 223344',
    email: 'teshome.gm@example.com',
    status: 'ACTIVE',
    linkedStudents: [
      { id: 'S1', name: 'Nahom Teshome', grade: 'Grade 10' }
    ]
  },
  {
    id: 'P-2',
    name: 'Kebede Ayele',
    phone: '+251 911 556677',
    email: 'kebede.a@example.com',
    status: 'INVITED',
    linkedStudents: [
      { id: 'S2', name: 'Hanna Kebede', grade: 'Grade 8' }
    ]
  },
  {
    id: 'P-3',
    name: 'Almaz Tadesse',
    phone: '+251 922 889900',
    email: 'almaz.t@example.com',
    status: 'PENDING LINKAGE',
    linkedStudents: []
  }
];

function ParentsTab({ selectedAY }: { selectedAY: string }) {
  const [filter, setFilter] = useState('All Parents');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParent, setSelectedParent] = useState<any>(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isBulkInviteOpen, setIsBulkInviteOpen] = useState(false);
  const [isInviteParentOpen, setIsInviteParentOpen] = useState(false);
  const [isGradeFilterOpen, setIsGradeFilterOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('All Grades');

  const filteredParents = PARENTS_MOCK_DATA.filter(parent => {
    const matchesSearch = parent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         parent.phone.includes(searchQuery) ||
                         parent.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = filter === 'All Parents' || (filter === 'Unlinked Students' && parent.linkedStudents.length === 0);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 md:space-y-8 text-left">
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="bg-[#1e1b4b] px-6 py-3 rounded-none flex items-center shadow-lg shadow-indigo-100/20 self-start">
           <span className="text-white text-xs md:text-sm font-bold tracking-tight">Academic year {selectedAY}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <Button 
            onClick={() => setIsBulkImportOpen(true)}
            variant="outline" 
            className="flex-1 sm:flex-none border-slate-200 text-[#1e1b4b] font-bold text-xs px-6 h-12 rounded-none bg-white hover:bg-slate-50 transition-all flex items-center gap-2"
           >
              <FileDown className="w-4 h-4" />
              Bulk Import
           </Button>
           <Button 
            onClick={() => setIsBulkInviteOpen(true)}
            className="flex-1 sm:flex-none bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs px-6 h-12 rounded-none shadow-lg shadow-orange-100 flex items-center gap-2"
           >
              <Mail className="w-4 h-4" />
              Bulk Invite (1)
           </Button>
           <Button 
            onClick={() => setIsInviteParentOpen(true)}
            className="w-full sm:w-auto bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-xs px-6 h-12 rounded-none shadow-lg shadow-slate-200 flex items-center gap-2"
           >
              <Plus className="w-4 h-4" />
              Invite Parent
           </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <Input 
              placeholder="Search parents by name, phone or student ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 bg-white border-slate-100 rounded-none text-sm font-semibold placeholder:text-slate-300 focus-visible:ring-indigo-600/10 focus-visible:border-slate-300 shadow-sm transition-all"
            />
          </div>
          <div className="relative shrink-0 w-full md:w-auto">
            <button 
              onClick={() => setIsGradeFilterOpen(!isGradeFilterOpen)}
              className="w-full md:w-auto h-14 px-8 flex items-center justify-between gap-4 bg-white border border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>{selectedGrade}</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isGradeFilterOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {isGradeFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-full md:w-56 bg-white border border-slate-950 shadow-2xl z-50 p-1.5"
                >
                  {['All Grades', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11'].map((grade) => (
                    <button
                      key={grade}
                      onClick={() => { setSelectedGrade(grade); setIsGradeFilterOpen(false); }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-all",
                        selectedGrade === grade ? "bg-[#1e1b4b] text-white" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {grade}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['All Parents', 'Unlinked Students'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-6 py-2.5 text-[11px] font-black uppercase tracking-widest border transition-all flex items-center gap-2",
                filter === tab 
                  ? "bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-lg shadow-indigo-100" 
                  : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
              )}
            >
              {tab}
              {tab === 'Unlinked Students' && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-sm text-[8px]",
                  filter === tab ? "bg-white/10" : "bg-orange-50 text-orange-600"
                )}>4</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Parents Record List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
             Directory ({filteredParents.length} Parents)
           </h3>
        </div>

        <div className="space-y-3">
          {filteredParents.map((parent) => (
            <motion.div 
              key={parent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedParent(parent)}
              className="bg-white border border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-5">
                <Avatar className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">
                  {parent.name.split(' ').map(n=>n[0]).join('')}
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#1e1b4b] group-hover:text-indigo-600 transition-colors">{parent.name}</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">{parent.phone}</span>
                    </div>
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest",
                      parent.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" :
                      parent.status === 'INVITED' ? "bg-indigo-50 text-indigo-600" : "bg-orange-50 text-orange-600"
                    )}>
                      {parent.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-3 border-t md:border-none pt-4 md:pt-0">
                <div className="flex items-center gap-2 text-slate-300">
                  <Link2 className="w-3.5 h-3.5 uppercase" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Linked Student(s)</span>
                </div>
                {parent.linkedStudents.length > 0 ? (
                  <div className="flex flex-wrap md:justify-end gap-2 text-[10px] font-bold text-[#1e1b4b]">
                    {parent.linkedStudents.map(student => (
                      <div key={student.id} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <UserIcon className="w-3 h-3 text-indigo-400" />
                        <span>{student.name}</span>
                        <span className="text-slate-300">({student.grade})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] font-bold text-slate-400 italic">No students linked yet</p>
                )}
              </div>
            </motion.div>
          ))}
          
          {filteredParents.length === 0 && (
            <div className="py-20 text-center space-y-4 border-2 border-dashed border-slate-100">
               <Users2 className="w-16 h-16 text-slate-100 mx-auto" />
               <div className="space-y-1">
                 <h3 className="text-sm font-bold text-[#1e1b4b] uppercase tracking-widest">No matching results</h3>
                 <p className="text-xs text-slate-400 font-medium">Try adjusting your search query or filters.</p>
               </div>
            </div>
          )}
        </div>
      </div>

      <ParentDetailsSlideOver parent={selectedParent} onClose={() => setSelectedParent(null)} />
      <BulkImportParentsDialog isOpen={isBulkImportOpen} onClose={() => setIsBulkImportOpen(false)} />
      <InviteParentDialog isOpen={isInviteParentOpen} onClose={() => setIsInviteParentOpen(false)} />
    </div>
  );
}

function ParentDetailsSlideOver({ parent, onClose }: { parent: any, onClose: () => void }) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLinkStudentOpen, setIsLinkStudentOpen] = useState(false);

  if (!parent) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1e1b4b]/40 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white w-full max-w-xl h-full relative shadow-2xl flex flex-col"
      >
        <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between">
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-[#1e1b4b] transition-colors">
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>
          <div className="flex gap-3">
             <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">AY 2024-25</div>
             <Button 
              variant="outline" 
              onClick={() => setIsEditProfileOpen(true)}
              className="h-10 px-6 border-slate-200 text-slate-600 font-bold text-xs rounded-none hover:bg-slate-50"
             >
                Edit Profile
             </Button>
             <Button 
              onClick={() => setIsLinkStudentOpen(true)}
              className="h-10 px-6 bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-xs rounded-none shadow-lg shadow-indigo-100"
             >
                Link New Student
             </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
          {/* Hero Profile Info */}
          <div className="flex items-center gap-8">
            <Avatar className="w-24 h-24 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-2xl">
               {parent.name.split(' ').map((n: string)=>n[0]).join('')}
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#1e1b4b] tracking-tight">{parent.name}</h2>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-bold">{parent.phone}</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-bold">{parent.email}</span>
                 </div>
              </div>
              <div className={cn(
                "inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-sm text-[10px] font-black uppercase tracking-widest mt-2",
                parent.status !== 'ACTIVE' && "bg-orange-50 text-orange-600"
              )}>
                {parent.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
             {/* Contact Details */}
             <div className="space-y-6">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Contact Info</h3>
                <div className="space-y-3">
                   <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-none flex items-center justify-between group h-14">
                      <div className="flex items-center gap-4 text-slate-900 font-bold text-sm">
                         <Phone className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                         <span>{parent.phone}</span>
                      </div>
                   </div>
                   <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-none flex items-center justify-between group h-14">
                      <div className="flex items-center gap-4 text-slate-900 font-bold text-sm">
                         <Mail className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                         <span>{parent.email}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Students List */}
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Linked Children</h3>
                   <span className="text-[10px] font-black text-[#1e1b4b] uppercase tracking-widest">{parent.linkedStudents.length} Total</span>
                </div>
                <div className="space-y-3">
                   {parent.linkedStudents.map((child: any) => (
                     <div key={child.id} className="p-5 border border-slate-100 rounded-none flex items-center justify-between group hover:border-indigo-200 transition-all">
                        <div className="flex items-center gap-5">
                           <Avatar className="w-12 h-12 bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                              <UserIcon className="w-6 h-6" />
                           </Avatar>
                           <div className="text-left">
                              <h4 className="text-sm font-bold text-[#1e1b4b]">{child.name}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                {child.grade} • ID: {child.id}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 text-red-300 hover:text-red-500 transition-colors" title="Unlink Student">
                              <Unlink className="w-4 h-4" />
                           </button>
                           <button className="p-2 text-indigo-300 hover:text-indigo-600 transition-colors">
                              <ChevronRight className="w-5 h-5" />
                           </button>
                        </div>
                     </div>
                   ))}
                   {parent.linkedStudents.length === 0 && (
                     <div className="border border-dashed border-slate-200 p-10 flex flex-col items-center justify-center space-y-3 opacity-30">
                        <Link2 className="w-8 h-8" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Children Linked</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>

        <div className="p-8 md:p-10 border-t border-slate-100 grid grid-cols-2 gap-4">
           <Button 
            variant="outline" 
            className="h-14 border-slate-200 text-slate-600 font-bold text-xs rounded-none hover:bg-slate-50 flex items-center justify-center gap-3"
           >
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Manage Security
           </Button>
           <Button 
            onClick={onClose}
            className="h-14 bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-xs rounded-none shadow-xl shadow-indigo-100"
           >
              Save Preferences
           </Button>
        </div>

        {/* Inner Modals */}
        <EditParentProfileDialog 
           isOpen={isEditProfileOpen} 
           onClose={() => setIsEditProfileOpen(false)} 
           parent={parent} 
        />
        <LinkStudentDialog 
           isOpen={isLinkStudentOpen} 
           onClose={() => setIsLinkStudentOpen(false)} 
           parentName={parent.name} 
        />
      </motion.div>
    </div>
  );
}

function BulkImportParentsDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState<'upload' | 'validating' | 'review' | 'processing' | 'success'>('upload');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 'validating') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('review'), 500);
            return 100;
          }
          return p + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
    if (step === 'processing') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('success'), 500);
            return 100;
          }
          return p + 10;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1e1b4b]/60 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-3xl w-full max-w-lg relative overflow-hidden p-10 text-left"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 transition-colors">
           <XCircle className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                    <FileDown className="w-6 h-6" />
                 </div>
                 <div className="text-left">
                    <h3 className="text-lg font-bold text-[#1e1b4b]">Bulk Import Parents</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Map parents to students via CSV</p>
                 </div>
              </div>

              <div 
                onClick={() => setStep('validating')}
                className="border-2 border-dashed border-slate-100 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-indigo-200 hover:bg-slate-50 transition-all cursor-pointer group"
              >
                 <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
                    <FileDown className="w-6 h-6" />
                 </div>
                 <div className="text-center">
                    <p className="font-bold text-[#1e1b4b] text-sm">Drop your file here</p>
                    <p className="text-slate-400 text-[10px] font-medium mt-1">Support for CSV, XLS, XLSX formats</p>
                 </div>
                 <Button className="h-10 px-8 bg-white border border-slate-200 text-[#1e1b4b] font-bold text-xs rounded-lg mt-4 shadow-sm group-hover:border-indigo-200">
                    Select File
                 </Button>
              </div>

              <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-xl space-y-4">
                 <div className="flex items-start gap-4">
                    <Info className="w-4 h-4 text-orange-500 mt-0.5" />
                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                      Ensure your CSV includes columns for <span className="text-[#1e1b4b]">Parent Name</span>, <span className="text-[#1e1b4b]">Phone</span>, and <span className="text-[#1e1b4b]">Student ID</span>.
                    </p>
                 </div>
                 <Button variant="link" className="text-indigo-600 font-bold text-[10px] h-auto p-0 uppercase ml-8 tracking-widest">Download CSV Template</Button>
              </div>
            </motion.div>
          )}

          {(step === 'validating' || step === 'processing') && (
            <motion.div key="progress" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 space-y-8 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                    <motion.circle 
                      cx="50" cy="50" r="45" fill="none" stroke={step === 'validating' ? '#4f46e5' : '#10b981'} strokeWidth="8" strokeLinecap="round"
                      initial={{ strokeDasharray: "0 283" }} animate={{ strokeDasharray: `${(progress / 100) * 283} 283` }}
                    />
                 </svg>
                 <span className="absolute text-xl font-black text-[#1e1b4b]">{progress}%</span>
              </div>
              <div className="space-y-2">
                 <h3 className="text-xl font-bold text-[#1e1b4b]">{step === 'validating' ? 'Validating Data' : 'Processing Emails'}</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[280px]">
                    {step === 'validating' ? 'Checking for duplicates and invalid student IDs...' : 'Sending portal invitations and moving parents to invited status...'}
                 </p>
              </div>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center border border-orange-100 shadow-md">
                 <Mail className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-[#1e1b4b] tracking-tight">Send Bulk Invitations</h3>
                 <p className="text-sm font-medium text-slate-500 max-w-[320px] mx-auto">
                    You are about to send portal invitations to <span className="text-[#1e1b4b] font-bold">1 new parents</span>. Each will receive instructions to link their children.
                 </p>
              </div>
              <div className="flex w-full gap-4 pt-4">
                 <Button onClick={() => setStep('upload')} variant="outline" className="flex-1 h-14 bg-slate-50 border-none text-slate-600 font-bold text-sm rounded-xl">Review</Button>
                 <Button onClick={() => { setProgress(0); setStep('processing'); }} className="flex-1 h-14 bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-100">Send Now</Button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center flex flex-col items-center">
               <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center ring-8 ring-emerald-50/50">
                  <CheckCircle className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#1e1b4b] tracking-tight">All Invites Sent!</h3>
                  <p className="text-sm font-medium text-slate-500 max-w-[280px]">All parents have been notified and moved to <span className="text-indigo-600 font-bold">Invited</span> status.</p>
               </div>
               <Button onClick={onClose} className="w-full h-14 bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-100">Back to Directory</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function InviteParentDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    isPrimary: true,
    relationship: 'Father'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1e1b4b]/60 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-3xl w-full max-w-xl relative overflow-hidden"
      >
        <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-500">
                 <UserPlus className="w-6 h-6" />
              </div>
              <div className="text-left">
                 <h3 className="text-lg font-bold text-[#1e1b4b]">Invite & Link Parent</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {step} of 2 • {step === 1 ? 'Personal Info' : 'Student Mapping'}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600">
              <XCircle className="w-6 h-6" />
           </button>
        </div>

        <div className="p-10 space-y-8 min-h-[400px]">
           <AnimatePresence mode="wait">
             {step === 1 ? (
               <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-left">
                  <div className="space-y-2 text-left">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Parent Full Name</label>
                     <Input 
                        placeholder="Enter full legal name" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="h-14 bg-slate-50 border-slate-100 rounded-xl text-sm font-semibold focus-visible:ring-indigo-600/10 transition-all" 
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2 text-left">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                        <Input 
                           placeholder="parent@example.com" 
                           value={formData.email}
                           onChange={e => setFormData({...formData, email: e.target.value})}
                           className="h-14 bg-slate-50 border-slate-100 rounded-xl text-sm font-semibold" 
                        />
                     </div>
                     <div className="space-y-2 text-left">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                        <Input 
                           placeholder="+251 9XX XXX XXX" 
                           value={formData.phone}
                           onChange={e => setFormData({...formData, phone: e.target.value})}
                           className="h-14 bg-slate-50 border-slate-100 rounded-xl text-sm font-semibold" 
                        />
                     </div>
                  </div>
                  <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between">
                     <div className="text-left space-y-1">
                        <h4 className="text-[11px] font-black text-[#1e1b4b] uppercase tracking-wide">Primary Contact</h4>
                        <p className="text-[9px] font-medium text-slate-400 max-w-[240px]">Determines recipient of urgent SMS/App alerts</p>
                     </div>
                     <button 
                        onClick={() => setFormData({...formData, isPrimary: !formData.isPrimary})}
                        className={cn(
                          "w-12 h-6 rounded-full p-1 transition-all flex items-center",
                          formData.isPrimary ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"
                        )}
                     >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                     </button>
                  </div>
               </motion.div>
             ) : (
               <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-left">
                  <div className="space-y-2 text-left">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Search Student by name or ID</label>
                     <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <Input placeholder="Type student name or employee ID..." className="h-14 pl-12 bg-slate-50 border-slate-100 rounded-xl text-sm font-semibold" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Linked Students</label>
                     <div className="border border-dashed border-slate-200 p-8 rounded-2xl flex flex-col items-center justify-center opacity-40">
                        <Link2 className="w-8 h-8 text-slate-300" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">No Students Linked Yet</p>
                     </div>
                  </div>

                  <div className="space-y-2 text-left">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Relationship</label>
                     <div className="relative border border-slate-100 bg-white rounded-xl h-14 flex items-center px-4">
                        <select 
                          value={formData.relationship}
                          onChange={e => setFormData({...formData, relationship: e.target.value})}
                          className="w-full bg-transparent text-sm font-bold appearance-none outline-none text-[#1e1b4b]"
                        >
                           {['Father', 'Mother', 'Guardian'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
                     </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="p-10 border-t border-slate-50 grid grid-cols-2 gap-4">
           {step === 1 ? (
             <>
               <div />
               <Button 
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.phone}
                className="h-14 bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
               >
                  Continue to Student Mapping
                  <ArrowRight className="w-4 h-4" />
               </Button>
             </>
           ) : (
             <>
               <Button variant="outline" onClick={() => setStep(1)} className="h-14 border-slate-200 text-[#1e1b4b] font-bold text-xs rounded-xl hover:bg-slate-50">Back</Button>
               <Button onClick={onClose} className="h-14 bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
                  Complete Invitation & Link
                  <CheckCircle className="w-4 h-4" />
               </Button>
             </>
           )}
        </div>
      </motion.div>
    </div>
  );
}

function LinkStudentDialog({ isOpen, onClose, parentName }: { isOpen: boolean, onClose: () => void, parentName: string }) {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1e1b4b]/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-3xl w-full max-w-lg relative overflow-hidden p-10 space-y-8">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
               <Link2 className="w-6 h-6" />
            </div>
            <div className="text-left">
               <h3 className="text-lg font-bold text-[#1e1b4b]">Link New Student</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select a student to link to {parentName}</p>
            </div>
            <button onClick={onClose} className="ml-auto text-slate-300 hover:text-slate-600"><XCircle className="w-6 h-6" /></button>
         </div>

         <div className="space-y-6">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
               <Input 
                 placeholder="Search student by name or ID..." 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="h-14 pl-12 bg-slate-50 border-slate-100 rounded-xl text-sm font-semibold" 
               />
            </div>

            {search.length > 0 && (
              <div 
                onClick={() => setSelectedStudent({ id: 'S3', name: 'Sara Lemma', grade: 'Grade 10' })}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-6 flex items-center justify-between cursor-pointer transition-all",
                  selectedStudent ? "border-emerald-500 bg-emerald-50/20 shadow-lg shadow-emerald-100" : "border-slate-100 hover:border-indigo-100"
                )}
              >
                 <div className="flex items-center gap-5">
                    <Avatar className="w-12 h-12 bg-white border border-slate-100 text-slate-300"><UserIcon className="w-6 h-6" /></Avatar>
                    <div className="text-left">
                       <h4 className="font-bold text-[#1e1b4b]">Sara Lemma</h4>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">S3 • Grade 10</p>
                    </div>
                 </div>
                 {selectedStudent ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <Plus className="w-5 h-5 text-indigo-400" />}
              </div>
            )}
            
            <div className="space-y-2 text-left">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Relationship</label>
               <div className="relative border border-slate-100 bg-white rounded-xl h-14 flex items-center px-4">
                  <select className="w-full bg-transparent text-sm font-bold appearance-none outline-none text-[#1e1b4b]">
                     {['Father', 'Mother', 'Guardian'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
               </div>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={onClose} className="h-14 border-none bg-slate-50 text-slate-600 font-bold text-sm rounded-xl">Cancel</Button>
            <Button disabled={!selectedStudent} onClick={onClose} className="h-14 bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-100">Confirm Link</Button>
         </div>
      </motion.div>
    </div>
  );
}

function EditParentProfileDialog({ isOpen, onClose, parent }: { isOpen: boolean, onClose: () => void, parent: any }) {
  const [data, setData] = useState({ ...parent });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#1e1b4b]/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-3xl w-full max-w-lg relative overflow-hidden p-10 space-y-8 text-left">
         <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#1e1b4b] tracking-tight">Edit Parent Profile</h3>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><XCircle className="w-6 h-6" /></button>
         </div>

         <div className="space-y-5 text-left">
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
               <Input value={data.name} onChange={e => setData({...data, name: e.target.value})} className="h-14 bg-slate-50 border-slate-100 rounded-xl text-sm font-semibold" />
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
               <Input value={data.phone} onChange={e => setData({...data, phone: e.target.value})} className="h-14 bg-slate-50 border-slate-100 rounded-xl text-sm font-semibold" />
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
               <Input value={data.email} onChange={e => setData({...data, email: e.target.value})} className="h-14 bg-slate-50 border-slate-100 rounded-xl text-sm font-semibold" />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={onClose} className="h-14 border-none bg-slate-50 text-slate-600 font-bold text-sm rounded-xl">Discard</Button>
            <Button onClick={onClose} className="h-14 bg-[#1e1b4b] hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-100">Save Changes</Button>
         </div>
      </motion.div>
    </div>
  );
}

// --- Academia Module ---
function AcademiaTab({ selectedAY }: { selectedAY: string }) {
  const [activeView, setActiveView] = useState<'subjects' | 'curriculum'>('subjects');
  
  const subjects = [
    { name: 'Mathematics', code: 'MATH-101', lead: 'Abebe Kebede', grades: ['7', '8', '9', '10'], status: 'ACTIVE' },
    { name: 'Physics', code: 'PHYS-101', lead: 'Sara Tesfaye', grades: ['9', '10', '11', '12'], status: 'ACTIVE' },
    { name: 'Amharic', code: 'AMH-101', lead: 'Tigist Belay', grades: ['All'], status: 'ACTIVE' },
    { name: 'Biology', code: 'BIO-101', lead: 'Dawit Mekonnen', grades: ['9', '10', '11', '12'], status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Academic Blueprint</h1>
          <p className="text-slate-500 font-medium">Curriculum management and subject allocation for {selectedAY}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-12 px-6 bg-[#1e1b4b] text-white rounded-none font-bold text-xs uppercase tracking-widest">
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-100 pb-0 shadow-sm md:shadow-none bg-white md:bg-transparent -mx-4 md:mx-0 px-4 md:px-0">
        {[
          { id: 'subjects', label: 'Subject Registry', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'curriculum', label: 'Curriculum Map', icon: <GitBranch className="w-4 h-4" /> }
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative",
              activeView === v.id ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {v.icon}
            {v.label}
          </button>
        ))}
      </div>

      {activeView === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {subjects.map((s, i) => (
            <Card key={i} className="rounded-none border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] bg-white group hover:shadow-xl transition-all overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{s.code}</p>
                    <h3 className="text-xl font-bold text-[#1e1b4b]">{s.name}</h3>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                    {s.status}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 rounded-none border border-slate-100">
                      <AvatarFallback className="bg-slate-50 text-slate-400 text-[10px] font-bold">{s.lead[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Department Lead</p>
                      <p className="text-xs font-bold text-slate-700">{s.lead}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Active Grades</p>
                    <div className="flex flex-wrap gap-2">
                      {s.grades.map(g => (
                        <span key={g} className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500">Grade {g}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full h-10 border-slate-100 text-[#1e1b4b] font-bold text-[10px] uppercase tracking-widest rounded-none hover:bg-slate-50">
                  Manage Curriculum
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeView === 'curriculum' && (
        <div className="bg-white p-12 text-center space-y-4 border border-slate-50 shadow-sm lg:min-h-[400px] flex flex-col items-center justify-center">
          <GitBranch className="w-16 h-16 text-slate-100" />
          <h3 className="text-xl font-bold uppercase tracking-widest text-[#1e1b4b]">Curriculum Matrix Engine</h3>
          <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
            Configure complex academic pathways, credit systems, and inter-departmental dependencies.
          </p>
          <Button className="bg-[#1e1b4b] text-white font-bold h-12 px-8 rounded-none uppercase tracking-widest text-xs mt-4">
            Initialize Mapper
          </Button>
        </div>
      )}
    </div>
  );
}

// --- Attendance Module ---
function AttendanceTab({ selectedAY }: { selectedAY: string }) {
  const stats = [
    { label: 'Avg Daily Presence', value: '94.2%', trend: '+2%', color: 'emerald' },
    { label: 'Teacher Attendance', value: '98.1%', trend: 'Stable', color: 'indigo' },
    { label: 'Unexcused Absences', value: '14', trend: '-12%', color: 'rose' },
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Attendance Analytics</h1>
          <p className="text-slate-500 font-medium tracking-tight">Real-time presence tracking and behavioral analysis for {selectedAY}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 border-slate-200 text-slate-600 rounded-none font-bold text-xs uppercase tracking-widest">
            <FileDown className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <Card key={i} className="rounded-none border-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] bg-white p-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <div className="flex items-baseline gap-4">
                <h3 className="text-4xl font-black text-[#1e1b4b] tracking-tighter">{s.value}</h3>
                <span className={cn(
                  "text-xs font-bold",
                  s.color === 'rose' ? "text-rose-500" : "text-emerald-500"
                )}>{s.trend}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-none border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#1e1b4b]">Academic Attendance Velocity</CardTitle>
          </CardHeader>
          <CardContent className="p-12 text-center flex flex-col items-center justify-center min-h-[300px] space-y-6">
             <div className="flex items-end gap-3 h-48 w-full max-w-lg">
                {[70, 95, 85, 90, 80, 92, 88].map((h, i) => (
                  <div key={i} className="flex-1 space-y-3">
                    <div className="w-full bg-slate-50 rounded-none overflow-hidden h-full flex flex-col justify-end">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-indigo-600/10 border-t-2 border-indigo-600" 
                      />
                    </div>
                    <p className="text-[8px] font-black text-slate-300 uppercase truncate">Day {i+1}</p>
                  </div>
                ))}
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Regional Campus Trend (Past 7 Operating Days)</p>
          </CardContent>
        </Card>

        <Card className="rounded-none border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-rose-500">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-slate-50">
                {[
                  { text: 'Consecutive absence alert: Grade 10A', count: 4, type: 'ROSE' },
                  { text: 'Below mandatory threshold: Arts Dept', count: 2, type: 'ORANGE' },
                  { text: 'Late arrivals peak: Morning Shift', count: 12, type: 'AMBER' }
                ].map((a, i) => (
                  <div key={i} className="p-8 flex items-start justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-900 leading-tight">{a.text}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{a.count} incidents flagged</p>
                    </div>
                    <AlertCircle className={cn(
                      "w-4 h-4",
                      a.type === 'ROSE' ? "text-rose-500" : "text-amber-500"
                    )} />
                  </div>
                ))}
             </div>
          </CardContent>
          <CardFooter className="p-8 pt-0">
            <Button variant="link" className="w-full text-indigo-600 font-bold text-[10px] uppercase tracking-widest">
              Review Conflict Map
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// --- Announcements Module ---
function AnnouncementsTab({ selectedAY }: { selectedAY: string }) {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFTS'>('ALL');
  
  const news = [
    { title: 'Global Academic Term Rescheduling', date: 'Oct 12, 2024', status: 'PUBLISHED', audience: 'ALL STAFF', views: '1.2k' },
    { title: 'Revised Security Protocol: Main Gate', date: 'Oct 10, 2024', status: 'PUBLISHED', audience: 'PARENTS', views: '3.4k' },
    { title: 'New Lab Equipment Procurement', date: 'Draft', status: 'DRAFT', audience: 'TEACHERS', views: '-' },
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Campus Broadcasts</h1>
          <p className="text-slate-500 font-medium">Strategic internal communications and announcements for {selectedAY}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsComposeOpen(true)}
            className="h-12 px-6 bg-[#1e1b4b] text-white rounded-none font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Compose Dispatch
          </Button>
        </div>
      </div>

      <div className="flex bg-white p-1 border border-slate-50 shadow-sm self-start inline-flex rounded-none overflow-hidden">
        {['ALL', 'PUBLISHED', 'DRAFTS'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-8 py-3 text-[10px] font-black tracking-widest uppercase transition-all rounded-none",
              filter === f ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#fcfdff] border-b border-slate-50">
              <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                <th className="px-10 py-6">Publication Details</th>
                <th className="px-10 py-6 text-center">Status</th>
                <th className="px-10 py-6 text-center">Audience</th>
                <th className="px-10 py-6 text-center">Engagement</th>
                <th className="px-10 py-6 text-right w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {news.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="space-y-1">
                      <p className="text-sm md:text-base font-bold text-[#1e1b4b] group-hover:text-indigo-600 transition-colors">{item.title}</p>
                      <p className="text-[10px] font-medium text-slate-400">{item.date}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className={cn(
                      "inline-flex px-3 py-1 text-[9px] font-black uppercase tracking-widest border",
                      item.status === 'PUBLISHED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                      {item.status}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.audience}</span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-900">{item.views}</span>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Reads</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Calendar Module ---
function CalendarTab({ selectedAY }: { selectedAY: string }) {
  const months = ['SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER', 'JANUARY', 'FEBRUARY'];
  
  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Technical Calendar</h1>
          <p className="text-slate-500 font-medium tracking-tight">Academic timelines, statutory holidays, and critical milestones for {selectedAY}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 border-slate-200 text-slate-600 rounded-none font-bold text-xs uppercase tracking-widest">
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {months.map((m, i) => (
            <Card key={i} className="rounded-none border-none shadow-[0_4px_20px_rgba(0,0,0,0.01)] bg-white overflow-hidden text-left">
              <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-center justify-between">
                <CardTitle className="text-[11px] font-black text-[#1e1b4b] uppercase tracking-[0.2em]">{m} 2024</CardTitle>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              </CardHeader>
              <CardContent className="p-6 space-y-4 min-h-[160px]">
                <div className="space-y-4">
                  <EventItem day="12" event="Semester Launch" type="ACADEMIC" />
                  <EventItem day="24" event="Teacher Training" type="ADMIN" />
                  {i % 2 === 0 && <EventItem day="28" event="Public Holiday" type="OFF" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="rounded-none border-slate-950 border-2 bg-white p-8 space-y-8 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Sparkles className="w-32 h-32" />
             </div>
             <div className="space-y-2 relative z-10">
                <h3 className="text-lg font-black text-[#1e1b4b] uppercase tracking-tighter">Timeline Summary</h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Institutional Overview {selectedAY}</p>
             </div>
             
             <div className="space-y-8 relative z-10">
                {[
                   { label: 'Academic Days Remaining', value: '184', total: '220' },
                   { label: 'Statutory Holidays', value: '12', total: '12' },
                   { label: 'Staff Development Ops', value: '4', total: '8' },
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                       <span className="text-xs font-black text-[#1e1b4b]">{item.value} / {item.total}</span>
                    </div>
                    <div className="h-1 bg-slate-50 rounded-none overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(parseInt(item.value)/parseInt(item.total))*100}%` }}
                        className="h-full bg-indigo-600" 
                       />
                    </div>
                  </div>
                ))}
             </div>
             
             <Button className="w-full h-14 bg-[#1e1b4b] text-white font-black text-[11px] uppercase tracking-widest rounded-none shadow-xl hover:bg-slate-800 transition-all">
                Publish Final Calendar
             </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EventItem({ day, event, type }: { day: string, event: string, type: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center w-8 shrink-0">
        <span className="text-base font-black text-[#1e1b4b]">{day}</span>
        <div className="w-px h-6 bg-slate-100" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-700 leading-tight">{event}</p>
        <span className={cn(
          "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 border",
          type === 'ACADEMIC' ? "text-indigo-500 border-indigo-100 bg-indigo-50" :
          type === 'ADMIN' ? "text-orange-500 border-orange-100 bg-orange-50" : "text-rose-500 border-rose-100 bg-rose-50"
        )}>
          {type}
        </span>
      </div>
    </div>
  );
}

// --- Settings Module ---
function BranchSettingsTab() {
  return (
    <div className="space-y-10 text-left max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Branch Configuration</h1>
        <p className="text-slate-500 font-medium tracking-tight">Technical parameters and regional overrides for this campus.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-none border-slate-950 border-2 overflow-hidden">
          <CardHeader className="bg-slate-950 p-6 text-white">
            <CardTitle className="text-xs font-black uppercase tracking-widest">Regional Identity</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campus Moniker</label>
              <Input defaultValue="Addis Ababa Main Hub" className="h-12 border-slate-100 bg-slate-50 rounded-none font-bold italic" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Functional Status</label>
              <div className="p-4 bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Operational / Active</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-[#1e1b4b]">Local Governance</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
             {[
               { label: 'Automated Attendance Dispatch', checked: true },
               { label: 'Academic Year Auto-Switching', checked: false },
               { label: 'Public Enrollment Protocol', checked: true },
             ].map((opt, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">{opt.label}</span>
                  <div className={cn(
                    "w-10 h-5 rounded-full p-1 transition-all flex items-center",
                    opt.checked ? "bg-indigo-600 justify-end" : "bg-slate-200 justify-start"
                  )}>
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>

      <div className="bg-rose-50/20 border-2 border-dashed border-rose-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-sm font-black text-rose-900 uppercase">Archive Campus Assets</h4>
          <p className="text-[10px] font-medium text-rose-700 opacity-60 uppercase tracking-tight leading-relaxed max-w-sm">Suspends all academic activities and locks staff portals for this specific region.</p>
        </div>
        <Button variant="outline" className="h-12 px-8 border-rose-200 text-rose-600 font-black text-[10px] uppercase tracking-widest rounded-none hover:bg-rose-50">Suspend Infrastructure</Button>
      </div>
    </div>
  );
}

function SummaryMiniCard({ label, value, color, icon }: { label: string, value: string, color: string, icon: React.ReactNode }) {
   return (
      <Card className="rounded-none border-none shadow-[0_4px_20px_rgba(0,0,0,0.01)] py-3 md:py-6 px-4 md:px-8 flex items-center justify-between group hover:shadow-xl transition-all">
         <div className="flex items-center gap-3 md:gap-4 text-left overflow-hidden">
            <div className={cn(
               "w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-2xl flex items-center justify-center border shrink-0",
               color === 'indigo' ? "bg-indigo-50 border-indigo-100 text-[#4f46e5]" :
               color === 'emerald' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
               color === 'orange' ? "bg-orange-50 border-orange-100 text-orange-600" : "bg-blue-50 border-blue-100 text-blue-600"
            )}>
               {icon}
            </div>
            <div className="overflow-hidden">
               <p className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-[0.1em] md:tracking-[0.2em]">{label}</p>
               <h4 className="text-base md:text-xl font-black text-slate-800 leading-none mt-0.5 md:mt-1">{value}</h4>
            </div>
         </div>
      </Card>
   );
}

// --- Students Module ---
function StudentsTab({ selectedAY }: { selectedAY: string }) {
  const [filter, setFilter] = useState('All');
  const students = [
    { name: 'Nahom Teshome', id: 'S-2024-001', grade: 'Grade 10', section: 'A', status: 'ACTIVE', parent: 'Teshome G.' },
    { name: 'Hanna Kebede', id: 'S-2024-002', grade: 'Grade 8', section: 'B', status: 'ACTIVE', parent: 'Kebede Ayele' },
    { name: 'Sara Lemma', id: 'S-2024-003', grade: 'Grade 10', section: 'C', status: 'NEW', parent: 'Lemma D.' },
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Student Registry</h1>
          <p className="text-slate-500 font-medium">Lighthouse management of learner profiles and academic grouping for {selectedAY}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-12 px-6 bg-[#1e1b4b] text-white rounded-none font-bold text-xs uppercase tracking-widest">
            <Plus className="w-4 h-4 mr-2" />
            Enroll Student
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((s, i) => (
          <Card key={i} className="rounded-none border-none shadow-sm bg-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4">
              <span className={cn(
                "px-2 py-1 text-[8px] font-black uppercase tracking-widest border",
                s.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
              )}>{s.status}</span>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 rounded-none border border-slate-100">
                  <AvatarFallback className="bg-slate-50 text-slate-300 font-black text-xl">{s.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#1e1b4b] group-hover:text-indigo-600 transition-colors uppercase italic">{s.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.id}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-y border-slate-50 py-4">
                <div>
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Academic Year</p>
                  <p className="text-xs font-bold text-slate-700">{selectedAY}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Grade / Section</p>
                  <p className="text-xs font-bold text-slate-700">{s.grade} - {s.section}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[10px] font-bold text-slate-500">Parent: {s.parent}</span>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-200 hover:text-[#1e1b4b]">
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// --- Profile & Settings Modal ---
function ProfileSettingsModal({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: any }) {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'notifications' | 'language' | 'accessibility'>('info');
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('English');

  const updateFontSize = (size: string) => {
    setFontSize(size);
    const root = document.documentElement;
    switch (size) {
      case 'small': root.style.fontSize = '14px'; break;
      case 'medium': root.style.fontSize = '16px'; break;
      case 'large': root.style.fontSize = '18px'; break;
    }
  };

  const tabs = [
    { id: 'info', label: 'Info', icon: <UserIcon className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'notifications', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'language', label: 'Lang', icon: <Globe className="w-4 h-4" /> },
    { id: 'accessibility', label: 'Access', icon: <Sparkles className="w-4 h-4" /> },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full h-full md:h-auto md:max-w-4xl md:min-h-[600px] relative overflow-hidden flex flex-col md:flex-row shadow-2xl md:rounded-3xl"
      >
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#1e1b4b] p-6 md:p-10 flex flex-row md:flex-col justify-between shrink-0">
          <div className="flex flex-row md:flex-col gap-1 md:space-y-2 flex-1 overflow-x-auto no-scrollbar">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap",
                  activeTab === t.id ? "bg-white/10 text-white shadow-inner" : "text-slate-400 hover:text-white"
                )}
              >
                {t.icon}
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{t.label}</span>
              </button>
            ))}
          </div>
          <button onClick={onClose} className="hidden md:flex items-center gap-3 text-slate-400 hover:text-white transition-colors mt-auto pt-10">
            <LogOut className="w-4 h-4 rotate-180" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Hub</span>
          </button>
          <button onClick={onClose} className="md:hidden p-2 text-white">
            <XCircle className="w-6 h-6" />
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto no-scrollbar text-left">
          {activeTab === 'info' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-slate-50 ring-2 ring-indigo-500/20">
                  <AvatarImage src="https://picsum.photos/seed/admin/400" />
                  <AvatarFallback className="text-4xl font-black">AD</AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-2xl font-black text-slate-900 italic uppercase">Administrator Profile</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity ID: {user?.id || 'GLOBAL-AA-01'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <Input defaultValue={user?.name || 'Admin User'} className="h-12 bg-slate-50/50 border-slate-100 rounded-xl font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Email</label>
                  <Input defaultValue={user?.email || 'admin@school.edu'} className="h-12 bg-slate-50/50 border-slate-100 rounded-xl font-bold" />
                </div>
              </div>

              <Button className="h-12 bg-[#1e1b4b] text-white px-8 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100/30">
                Update Security Token & Profile
              </Button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
               <div className="space-y-1">
                 <h3 className="text-2xl font-black text-slate-900 italic uppercase">Security Protocols</h3>
                 <p className="text-sm font-medium text-slate-500">Rotate access keys and managed linked sessions.</p>
               </div>
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New System Password</label>
                    <Input type="password" placeholder="••••••••••••" className="h-14 bg-slate-50/50 border-slate-100 rounded-xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm Passcode</label>
                    <Input type="password" placeholder="••••••••••••" className="h-14 bg-slate-50/50 border-slate-100 rounded-xl font-bold" />
                  </div>
               </div>
               <Button className="h-14 bg-rose-600 hover:bg-rose-700 text-white px-8 rounded-xl font-bold uppercase text-[10px] tracking-widest">
                  Rotate Passcode & Log out others
               </Button>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-8">
               <div className="space-y-1">
                 <h3 className="text-2xl font-black text-slate-900 italic uppercase">Accessibility</h3>
                 <p className="text-sm font-medium text-slate-500">Visual comfort and interaction scaling.</p>
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Font Scaling</p>
                  <div className="grid grid-cols-3 gap-4">
                     {['small', 'medium', 'large'].map((s) => (
                       <button
                         key={s}
                         onClick={() => updateFontSize(s)}
                         className={cn(
                           "h-14 flex flex-col items-center justify-center border-2 transition-all rounded-2xl relative overflow-hidden group",
                           fontSize === s ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 hover:border-indigo-200"
                         )}
                       >
                         <span className={cn(
                           "font-black uppercase tracking-widest",
                           s === 'small' ? 'text-[8px]' : s === 'medium' ? 'text-xs' : 'text-base',
                           fontSize === s ? "text-indigo-600" : "text-slate-400"
                         )}>
                           {s}
                         </span>
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-8">
               <div className="space-y-1">
                 <h3 className="text-2xl font-black text-slate-900 italic uppercase">Regional Dialects</h3>
                 <p className="text-sm font-medium text-slate-500">System language and localized data formatting.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['English', 'Amharic', 'Oromo', 'Tigrinya', 'Somali'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={cn(
                        "p-5 border-2 rounded-2xl flex items-center justify-between transition-all group",
                        language === lang ? "border-[#1e1b4b] bg-slate-50" : "border-slate-100 hover:border-slate-300"
                      )}
                    >
                      <span className="font-bold text-slate-800">{lang}</span>
                      {language === lang && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                    </button>
                  ))}
               </div>
            </div>
          )}
        </main>
      </motion.div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
   return (
      <div className={cn(
         "px-2.5 md:px-4 py-1 rounded-full text-[8px] md:text-[9px] font-black tracking-widest border whitespace-nowrap",
         status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
         status === 'NEW' ? "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm shadow-indigo-100" : "bg-orange-50 text-orange-600 border-orange-100"
      )}>
         {status}
      </div>
   );
}
