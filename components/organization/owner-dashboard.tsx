'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Building2, 
  LayoutDashboard, 
  School as SchoolIcon, 
  GitBranch, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Bell, 
  ChevronDown, 
  ChevronRight,
  Check, 
  MapPin, 
  Mail, 
  Edit2, 
  MoreVertical,
  Upload,
  FileText,
  Building,
  CheckCircle2,
  ExternalLink,
  LayoutGrid,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Menu,
  X,
  Sparkles,
  CreditCard,
  Globe,
  Phone,
  Type,
  User as UserIcon,
  Map as MapIcon,
  ChevronsUpDown,
  Shield,
  Activity,
  FileCheck,
  UserPlus,
  ArrowRight,
  Filter,
  Users2,
  Lock,
  MailSearch
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { MOCK_SCHOOLS, MOCK_BRANCHES, School, Branch } from '@/lib/mock-data';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

function SidebarItem({ active, onClick, icon, label, collapsed }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, collapsed?: boolean }) {
  return (
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
      <div className={cn("transition-transform duration-300", active && "scale-110")}>
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
}

function SidebarContent({ 
  activeSchool, 
  isSidebarCollapsed, 
  setIsSidebarCollapsed,
  isSchoolSwitcherOpen,
  setIsSchoolSwitcherOpen,
  schoolSwitcherRef,
  activeTab,
  setActiveTab,
  sidebarVisibility,
  setSidebarVisibility,
  handleLogout,
  isAccountMenuOpen,
  setIsAccountMenuOpen,
  setIsProfileSettingsOpen,
  accountMenuRef,
  user
}: {
  activeSchool: any,
  isSidebarCollapsed: boolean,
  setIsSidebarCollapsed: (v: boolean) => void,
  isSchoolSwitcherOpen: boolean,
  setIsSchoolSwitcherOpen: (v: boolean) => void,
  schoolSwitcherRef: React.RefObject<HTMLDivElement | null>,
  activeTab: string,
  setActiveTab: (t: any) => void,
  sidebarVisibility: any,
  setSidebarVisibility: (v: any) => void,
  handleLogout: () => void,
  isAccountMenuOpen: boolean,
  setIsAccountMenuOpen: (v: boolean) => void,
  setIsProfileSettingsOpen: (v: boolean) => void,
  accountMenuRef: React.RefObject<HTMLDivElement | null>,
  user: any
}) {
  return (
    <>
      {/* School Switcher */}
      <div 
        ref={schoolSwitcherRef}
        className={cn("p-4 md:p-6 relative", isSidebarCollapsed && "px-3")}
      >
        <button 
          onClick={() => isSidebarCollapsed ? setIsSidebarCollapsed(false) : setIsSchoolSwitcherOpen(!isSchoolSwitcherOpen)}
          className={cn(
            "w-full flex items-center justify-between p-3 border border-slate-950 bg-white hover:bg-slate-50 transition-all rounded-none group",
            isSidebarCollapsed && "justify-center p-2"
          )}
        >
          <div className="flex items-center space-x-3 text-left">
            <div className={cn(
              "w-10 h-10 flex items-center justify-center text-white rounded-none shadow-sm shrink-0",
              activeSchool.logoColor === 'indigo' ? "bg-indigo-600" : 
              activeSchool.logoColor === 'emerald' ? "bg-emerald-600" : "bg-orange-500"
            )}>
              <SchoolIcon className="w-6 h-6" />
            </div>
            {!isSidebarCollapsed && (
              <div className="text-left overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{activeSchool.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Org. Owner</p>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && <ChevronsUpDown className="w-4 h-4 text-slate-300" />}
        </button>

        {isSchoolSwitcherOpen && !isSidebarCollapsed && (
          <div className="absolute left-6 right-6 top-full mt-2 bg-white border border-slate-950 shadow-xl z-50 py-2">
            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Switch School</span>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {MOCK_SCHOOLS.map(school => (
                <button
                  key={school.id}
                  onClick={() => {
                    // Logic handled in parent normally, but here we would need a callback
                    // For simplified conversion, we'll assume there's a setActiveSchoolId passed if needed
                    // But in original code it was using local state. 
                    // I'll add setActiveSchoolId to props if I want it fully functional.
                    setIsSchoolSwitcherOpen(false);
                    // activeSchoolId handled by local state in OwnerDashboard, so we need to pass a setter
                    (window as any).__setActiveSchool?.(school.id);
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 transition-colors",
                    activeSchool.id === school.id && "bg-indigo-50/50"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 flex items-center justify-center text-white rounded-none shrink-0",
                    school.logoColor === 'indigo' ? "bg-indigo-600" : 
                    school.logoColor === 'emerald' ? "bg-emerald-600" : "bg-orange-500"
                  )}>
                    <SchoolIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{school.name}</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase">{school.branchesCount} Branches</p>
                  </div>
                  {activeSchool.id === school.id && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto pt-6 px-4 md:px-6 space-y-8 no-scrollbar">
        <div>
          {!isSidebarCollapsed && (
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Menu</p>
          )}
          <nav className="space-y-1">
            <SidebarItem 
              active={activeTab === 'dashboard'} 
              icon={<LayoutDashboard className="w-5 h-5" />} 
              label="Overview" 
              onClick={() => setActiveTab('dashboard')}
              collapsed={isSidebarCollapsed}
            />
            <SidebarItem 
              active={activeTab === 'schools'} 
              icon={<SchoolIcon className="w-5 h-5" />} 
              label="Schools" 
              onClick={() => setActiveTab('schools')}
              collapsed={isSidebarCollapsed}
            />
            <SidebarItem 
              active={activeTab === 'branches'} 
              icon={<GitBranch className="w-5 h-5" />} 
              label="Branches" 
              onClick={() => setActiveTab('branches')}
              collapsed={isSidebarCollapsed}
            />
          </nav>
        </div>

        <div>
           {!isSidebarCollapsed && (
            <div className="flex items-center justify-between px-4 mb-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Management</p>
            </div>
          )}
          <nav className="space-y-1">
            <SidebarItem 
              active={activeTab === 'staff'} 
              icon={<Users className="w-5 h-5" />} 
              label="Global Staff" 
              onClick={() => setActiveTab('staff')}
              collapsed={isSidebarCollapsed}
            />
            <SidebarItem 
              active={activeTab === 'analytics'} 
              icon={<BarChart3 className="w-5 h-5" />} 
              label="Analytics" 
              onClick={() => setActiveTab('analytics')}
              collapsed={isSidebarCollapsed}
            />
          </nav>
        </div>

        <div>
           {!isSidebarCollapsed && (
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">System</p>
          )}
          <nav className="space-y-1">
            <SidebarItem 
              active={activeTab === 'settings'} 
              icon={<Settings className="w-5 h-5" />} 
              label="Organization" 
              onClick={() => setActiveTab('settings')}
              collapsed={isSidebarCollapsed}
            />
          </nav>
        </div>
      </div>

      <div 
        ref={accountMenuRef}
        className={cn("p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 relative", isSidebarCollapsed && "px-3")}
      >
        <button 
          onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
          className={cn(
            "w-full flex items-center justify-between p-2 hover:bg-slate-100 transition-all rounded-none group",
            isSidebarCollapsed && "justify-center"
          )}
        >
          <div className="flex items-center space-x-3 text-left">
            <Avatar className={cn(
              "w-10 h-10 shrink-0 border border-slate-100 transition-transform group-hover:scale-105 shadow-sm",
              isSidebarCollapsed ? "mx-auto" : ""
            )}>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email || 'Owner'}`} />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold uppercase">
                {user?.email?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            {!isSidebarCollapsed && (
              <div className="flex flex-col items-start overflow-hidden text-left">
                <span className="text-[11px] font-black text-slate-900 leading-tight truncate w-full uppercase tracking-tight">{user?.email?.split('@')[0]}</span>
                <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest truncate w-full">Organization Owner</span>
              </div>
            )}
          </div>
        </button>

        <AnimatePresence>
          {isAccountMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={cn(
                "absolute bottom-[calc(100%-8px)] left-4 right-4 bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden",
                isSidebarCollapsed && "left-full ml-2 w-48 bottom-4 right-auto"
              )}
            >
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8 border border-slate-100">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email || 'Owner'}`} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">
                      {user?.email?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tight">{user?.email}</span>
                    <span className="text-[8px] font-bold text-slate-500 truncate uppercase tracking-widest">Global Admin</span>
                  </div>
                </div>
              </div>
              <div className="p-1.5 space-y-0.5 text-left">
                <AccountMenuItem icon={<UserIcon className="w-3.5 h-3.5" />} label="MY PROFILE" onClick={() => { setIsAccountMenuOpen(false); setIsProfileSettingsOpen(true); }} />
                <AccountMenuItem icon={<Settings className="w-3.5 h-3.5" />} label="ORG SETTINGS" onClick={() => setActiveTab('settings')} />
                <AccountMenuItem icon={<Bell className="w-3.5 h-3.5" />} label="NOTIFICATIONS" onClick={() => { setIsAccountMenuOpen(false); setIsProfileSettingsOpen(true); }} />
                <Separator className="my-1" />
                <AccountMenuItem icon={<LogOut className="w-3.5 h-3.5" />} label="SIGN OUT" onClick={handleLogout} className="text-red-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export function OwnerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeSchoolId, setActiveSchoolId] = useState<string>(MOCK_SCHOOLS[0].id);
  const [isSchoolSwitcherOpen, setIsSchoolSwitcherOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'branches' | 'staff' | 'analytics' | 'settings' | 'schools'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isCreateSchoolModalOpen, setIsCreateSchoolModalOpen] = useState(false);
  const [isCreateBranchModalOpen, setIsCreateBranchModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [sidebarVisibility, setSidebarVisibility] = useState({
    branches: true,
    staff: true,
    analytics: true
  });

  // Click outside references
  const schoolSwitcherRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (schoolSwitcherRef.current && !schoolSwitcherRef.current.contains(event.target as Node)) {
        setIsSchoolSwitcherOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeSchool = MOCK_SCHOOLS.find(s => s.id === activeSchoolId) || MOCK_SCHOOLS[0];
  const activeBranches = MOCK_BRANCHES.filter(b => b.schoolId === activeSchoolId);

  useEffect(() => {
    (window as any).__setActiveSchool = setActiveSchoolId;
    return () => { delete (window as any).__setActiveSchool; };
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white md:bg-slate-50/30">
      {/* Mobile Header - Only visible on small screens */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-50 w-full shrink-0">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-1.5 rounded-none">
            <SchoolIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">Kelem.co</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-none transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Responsive */}
      <aside className={cn(
        "bg-white border-r border-slate-950 flex flex-col fixed inset-y-0 left-0 z-[60] transition-all duration-300 md:sticky md:top-0 md:h-screen w-80 no-scrollbar",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        isSidebarCollapsed ? "md:w-20" : "md:w-72"
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
        <SidebarContent 
          activeSchool={activeSchool}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isSchoolSwitcherOpen={isSchoolSwitcherOpen}
          setIsSchoolSwitcherOpen={setIsSchoolSwitcherOpen}
          schoolSwitcherRef={schoolSwitcherRef}
          activeTab={activeTab}
          setActiveTab={(t) => setActiveTab(t)}
          sidebarVisibility={sidebarVisibility}
          setSidebarVisibility={setSidebarVisibility}
          handleLogout={handleLogout}
          isAccountMenuOpen={isAccountMenuOpen}
          setIsAccountMenuOpen={setIsAccountMenuOpen}
          setIsProfileSettingsOpen={setIsProfileSettingsOpen}
          accountMenuRef={accountMenuRef}
          user={user}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-y-auto no-scrollbar">
        {/* Top Header - Desktop Only */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 hidden md:flex shrink-0">
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-slate-400 flex items-center space-x-2">
              <span>Organization</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-slate-900 font-bold uppercase tracking-widest text-xs truncate max-w-[200px]">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative group flex items-center hidden lg:flex">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <Input 
                placeholder="Quick search..." 
                className="w-64 xl:w-80 h-10 pl-10 bg-slate-100/50 border-transparent hover:bg-slate-100 focus-visible:bg-white focus-visible:border-slate-950 focus-visible:ring-0 rounded-none font-medium text-sm transition-all shadow-inner"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('settings')}
              className={cn(
                "h-10 w-10 p-2 border-slate-200 rounded-none transition-all shrink-0",
                activeTab === 'settings' ? "bg-indigo-600 text-white border-indigo-600" : "text-slate-400 hover:text-indigo-600 hover:bg-slate-50"
              )}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-[1600px] mx-auto">
            {activeTab === 'dashboard' && <DashboardTab activeSchool={activeSchool} />}
            {activeTab === 'schools' && <SchoolsTab onAddSchool={() => setIsCreateSchoolModalOpen(true)} />}
            {activeTab === 'branches' && <BranchesTab activeSchool={activeSchool} activeBranches={activeBranches} onAddBranch={() => setIsCreateBranchModalOpen(true)} />}
            {activeTab === 'staff' && <StaffTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'settings' && (
              <SettingsTab 
                activeSchool={activeSchool} 
                visibility={sidebarVisibility} 
                onVisibilityChange={setSidebarVisibility} 
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ProfileSettingsModal 
        isOpen={isProfileSettingsOpen} 
        onClose={() => setIsProfileSettingsOpen(false)} 
        user={user}
      />
      <CreateSchoolModal isOpen={isCreateSchoolModalOpen} onClose={() => setIsCreateSchoolModalOpen(false)} />
      <CreateBranchModal isOpen={isCreateBranchModalOpen} onClose={() => setIsCreateBranchModalOpen(false)} />
    </div>
  );
}

function DashboardTab({ activeSchool }: any) {
  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <StatCard label="Active Campuses" value={activeSchool.branchesCount.toString()} trend="Regional capacity" icon={<GitBranch className="w-6 h-6 text-indigo-600" />} />
        <StatCard label="Student Base" value={activeSchool.studentsCount.toLocaleString()} trend="+4.2% this year" icon={<Users className="w-6 h-6 text-emerald-600" />} />
        <StatCard label="Faculty Presence" value="342" trend="Staff coverage" icon={<CheckCircle2 className="w-6 h-6 text-orange-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        <Card className="border-slate-950 rounded-none shadow-sm">
           <CardHeader className="border-b border-slate-100 p-4 md:p-6 flex flex-row items-center justify-between">
              <h3 className="text-sm md:text-lg font-bold uppercase tracking-widest text-slate-900">Attendance Velocity</h3>
              <BarChart3 className="w-4 h-4 text-indigo-600" />
           </CardHeader>
           <CardContent className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[200px] md:min-h-[300px] text-center space-y-4 text-xs">
              <div className="flex items-end space-x-2 md:space-x-4 h-24 md:h-32">
                 {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                   <div key={i} className="w-8 bg-indigo-600/10 border-t-2 border-indigo-600" style={{ height: `${h}%` }} />
                 ))}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Wider Campus Trend (Past 7 Days)</p>
           </CardContent>
        </Card>

        <Card className="border-slate-950 rounded-none shadow-sm">
           <CardHeader className="border-b border-slate-100 p-6 flex flex-row items-center justify-between">
              <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900">Recent Notifications</h3>
              <Bell className="w-4 h-4 text-orange-500" />
           </CardHeader>
           <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-left">
                 <div className="p-6 hover:bg-slate-50 transition-colors cursor-pointer space-y-1">
                    <p className="text-sm font-bold text-slate-900">Branch Creation Pending Approval</p>
                    <p className="text-xs text-slate-500 italic">4 hours ago • Bole Sub-city Hub</p>
                 </div>
                 <div className="p-6 hover:bg-slate-50 transition-colors cursor-pointer space-y-1">
                    <p className="text-sm font-bold text-slate-900">End of Term Report Generated</p>
                    <p className="text-xs text-slate-500 italic">Yesterday • System Automated</p>
                 </div>
                 <div className="p-6 hover:bg-slate-50 transition-colors cursor-pointer space-y-1 text-center">
                    <Button variant="link" className="text-xs font-bold text-indigo-600 uppercase tracking-widest">VIEW HISTORY MATRIX</Button>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BranchesTab({ activeSchool, activeBranches, onAddBranch }: any) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  const handleInviteAdmin = (branch: any) => {
    setSelectedBranch(branch);
    setIsInviteModalOpen(true);
  };

  return (
    <div className="p-6 md:p-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight text-left uppercase italic shrink-0">Campus Ecosystem</h1>
          <p className="text-slate-500 font-medium text-left">Management of regional hubs and physical infrastructure for {activeSchool.name}.</p>
        </div>
        <Button onClick={onAddBranch} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-14 px-8 font-bold flex items-center space-x-3 shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs shrink-0">
          <Plus className="w-5 h-5" />
          <span>Provision New Campus</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeBranches.map((branch: any) => (
          <BranchCard 
            key={branch.id} 
            branch={branch} 
            onInvite={() => handleInviteAdmin(branch)} 
          />
        ))}
        <button 
          onClick={onAddBranch}
          className="border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center space-y-4 hover:border-indigo-400 hover:bg-slate-50/50 transition-all group min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-none bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-900 uppercase text-xs tracking-widest">Add Campus</p>
            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Expand Infrastructure</p>
          </div>
        </button>
      </div>

      <InviteAdminModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        branchName={selectedBranch?.name} 
      />
    </div>
  );
}

function BranchCard({ branch, onInvite }: { branch: any, onInvite: () => void }) {
  return (
    <Card className="rounded-none border-slate-950 border-2 shadow-sm flex flex-col group hover:shadow-xl transition-all h-full bg-white">
      <CardHeader className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-none">
            <GitBranch className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">{branch.name}</CardTitle>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">{branch.code || 'HUB-00'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Online</span>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6 flex-1 text-left">
        <div className="space-y-3">
          <div className="flex items-start space-x-3 text-slate-600">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-xs font-medium leading-relaxed">{branch.location}</p>
          </div>
          <div className="flex items-center space-x-3 text-slate-600">
            <Users className="w-4 h-4 shrink-0" />
            <p className="text-xs font-bold uppercase tracking-widest">{branch.studentsCount || 0} Students Active</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch Management</p>
          <div className="flex items-center gap-2">
             <div className="flex -space-x-2">
                {[1, 2].map((i) => (
                  <div key={i} className="w-8 h-8 border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                    {i === 1 ? 'AB' : 'MT'}
                  </div>
                ))}
             </div>
             <button 
              onClick={onInvite}
              className="w-8 h-8 rounded-none bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors border border-indigo-100"
              title="Invite Additional Admin"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-slate-950 border-t border-slate-950">
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/dashboard/branch_admin'}
          className="w-full text-[10px] font-bold text-white uppercase tracking-[0.2em] hover:bg-slate-900 h-10 border-none"
        >
          Control Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}

function InviteAdminModal({ isOpen, onClose, branchName }: { isOpen: boolean, onClose: () => void, branchName?: string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border-2 border-slate-950 p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
        
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-1 text-left">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Access Delegation</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">Campus: {branchName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 border border-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="manager@institution.com" className="h-12 pl-10 border-slate-200 rounded-none font-bold text-sm" />
            </div>
          </div>
          
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Tier</label>
            <div className="relative">
              <select className="w-full h-12 px-3 border border-slate-200 rounded-none font-bold text-xs uppercase bg-white focus:outline-none focus:ring-1 focus:ring-slate-950 appearance-none">
                <option>Full Branch Admin</option>
                <option>Finance Manager</option>
                <option>Academic Supervisor</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1 h-12 rounded-none font-bold text-slate-600 border-slate-200 uppercase tracking-widest text-[10px]">
              Cancel
            </Button>
            <Button onClick={onClose} className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none font-bold uppercase tracking-widest text-[10px]">
              Send Invitation
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="p-4 md:p-10 space-y-10 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
           <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Intelligence Matrix</h1>
           <p className="text-slate-500 font-medium">Cross-campus productivity, financial velocity, and academic performance.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-12 border-2 border-slate-950 px-6 font-black text-[10px] uppercase tracking-widest bg-white hover:bg-slate-50">
              Export BI Matrix
           </Button>
           <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white px-6 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100">
              Sync Real-time Data
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="p-8 bg-white border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] space-y-4">
            <Activity className="w-6 h-6 text-indigo-600" />
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Engagement</p>
               <h4 className="text-2xl font-black text-[#1e1b4b]">94.2%</h4>
            </div>
            <div className="h-1 w-full bg-slate-100">
               <div className="h-full bg-indigo-600 w-[94%]" />
            </div>
         </div>
         <div className="p-8 bg-white border-2 border-slate-100 space-y-4">
            <Users2 className="w-6 h-6 text-emerald-600" />
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Enrollment</p>
               <h4 className="text-2xl font-black text-[#1e1b4b]">12.4K</h4>
            </div>
            <p className="text-[10px] font-bold text-emerald-500 uppercase">+1.2K this month</p>
         </div>
         <div className="p-8 bg-white border-2 border-slate-100 space-y-4">
            <CreditCard className="w-6 h-6 text-orange-600" />
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Forecast</p>
               <h4 className="text-2xl font-black text-[#1e1b4b]">$2.4M</h4>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Q3 Projections</p>
         </div>
         <div className="p-8 bg-white border-2 border-slate-100 space-y-4">
            <Shield className="w-6 h-6 text-indigo-600" />
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Rating</p>
               <h4 className="text-2xl font-black text-[#1e1b4b]">98%</h4>
            </div>
            <p className="text-[10px] font-bold text-indigo-500 uppercase">ISO Certified</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <Card className="lg:col-span-2 border-2 border-slate-950 rounded-none shadow-sm overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
               <div className="text-left">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Academic Growth Trajectory</CardTitle>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Relative performance across secondary branches</p>
               </div>
               <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-indigo-600" />
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-slate-200" />
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">2023</span>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-10">
               <div className="h-[400px] w-full flex items-end gap-12 group">
                  {[60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-1 items-center h-full">
                       <div className="w-full bg-slate-50 relative group/bar">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            className="w-full bg-indigo-600/10 border-t-4 border-indigo-600 relative overflow-hidden"
                          >
                             <motion.div 
                               initial={{ y: '100%' }}
                               animate={{ y: 0 }}
                               className="absolute inset-x-0 bottom-0 bg-indigo-600 opacity-20"
                               style={{ height: '50%' }}
                             />
                          </motion.div>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white px-3 py-1.5 text-[10px] font-black rounded-none opacity-0 group-hover/bar:opacity-100 transition-opacity">
                             {h}%
                          </div>
                       </div>
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-4">Branch {String.fromCharCode(65 + i)}</span>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <div className="space-y-6">
            <Card className="border-2 border-slate-950 rounded-none shadow-sm overflow-hidden">
               <CardHeader className="p-6 border-b border-slate-100">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-[#1e1b4b]">Regional Hub Distribution</CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-8">
                  <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="20" strokeDasharray="251 251" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#4f46e5" strokeWidth="20" strokeDasharray="180 251" strokeLinecap="butt" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="60 251" strokeDashoffset="-180" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <h4 className="text-2xl font-black text-[#1e1b4b]">24</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active Hubs</p>
                     </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-50">
                     <LegendItem color="bg-indigo-600" label="Tier 1 Metropolitan" value="12" />
                     <LegendItem color="bg-emerald-500" label="Satellite Hubs" value="8" />
                     <LegendItem color="bg-slate-200" label="Digital Annexes" value="4" />
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-[#1e1b4b] border-none rounded-none p-8 space-y-4">
               <Sparkles className="w-8 h-8 text-indigo-400" />
               <div className="space-y-2 text-left">
                  <h4 className="text-xl font-bold text-white tracking-tight">AI Insights Engine</h4>
                  <p className="text-xs text-indigo-200/60 leading-relaxed font-medium">Branch C shows 14% higher potential for STEM specialized expansion in AY 2025.</p>
               </div>
               <Button variant="link" className="text-indigo-400 font-bold text-[10px] h-auto p-0 uppercase tracking-[0.2em]">Generate Full Forecast</Button>
            </Card>
         </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string, label: string, value: string }) {
   return (
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className={cn("w-2 h-2 rounded-none", color)} />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{label}</span>
         </div>
         <span className="text-[10px] font-black text-[#1e1b4b]">{value}</span>
      </div>
   );
}

function PlaceholderTab({ title, description }: { title: string, description: string }) {
  return (
    <div className="p-10">
      <div className="bg-white border border-slate-950 p-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-none bg-slate-50 flex items-center justify-center text-slate-200">
           <LayoutGrid className="w-10 h-10" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest">{title}</h3>
          <p className="text-slate-500 text-sm">{description}</p>
        </div>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Module Coming Soon</p>
      </div>
    </div>
  );
}



function CreateSchoolModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white border border-slate-950 shadow-2xl p-6 md:p-8 rounded-none overflow-hidden text-left"
          >
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-display uppercase tracking-tight">Register School</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global Institutional Registry</p>
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-100 rounded-none bg-slate-50/50 group cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                  <div className="w-16 h-16 rounded-none bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm mb-3 transition-all">
                      <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors text-center">Institutional Logo (512x512 PNG/SVG)</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">School Full Name</label>
                      <Input placeholder="e.g. Skyline Academy" className="h-12 border-slate-200 rounded-none font-medium" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Email</label>
                        <Input placeholder="admin@school.com" className="h-12 border-slate-200 rounded-none font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Phone</label>
                        <Input placeholder="+251..." className="h-12 border-slate-200 rounded-none font-medium" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location / Country</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select className="w-full h-12 pl-12 pr-4 border border-slate-200 rounded-none font-medium text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-950 appearance-none">
                          <option>Ethiopia</option>
                          <option>Kenya</option>
                          <option>Rwanda</option>
                          <option>Other</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button onClick={onClose} variant="outline" className="flex-1 h-12 rounded-none font-bold text-slate-600 border-slate-200 uppercase tracking-widest text-[10px]">
                    Dismiss
                  </Button>
                  <Button onClick={onClose} className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100">
                    Register Institution
                  </Button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CreateBranchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white border border-slate-950 shadow-2xl p-6 md:p-8 rounded-none overflow-hidden max-h-[90vh] overflow-y-auto text-left"
          >
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-display uppercase tracking-tight">Expand Infrastructure</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Campus Provisioning Protocol</p>
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 border border-slate-100">
                  <X className="w-6 h-6" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapIcon className="w-3 h-3" /> Campus Identifier
                      </label>
                      <Input placeholder="e.g. Merkato Junior High" className="h-11 border-slate-200 rounded-none font-medium" />
                  </div>
                  
                  <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Physical Location
                      </label>
                      <textarea placeholder="Plot No. 441, Addis Ketema..." className="w-full h-20 p-3 border border-slate-200 rounded-none focus:outline-none focus:ring-1 focus:ring-indigo-600 font-medium text-xs transition-all resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Region</label>
                      <Input placeholder="Addis Ababa" className="h-11 border-slate-200 rounded-none font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Service Contact
                      </label>
                      <Input placeholder="+251..." className="h-11 border-slate-200 rounded-none font-medium" />
                    </div>
                  </div>

                  <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Type className="w-3 h-3" /> Operational Model
                      </label>
                      <div className="relative">
                        <select className="w-full h-11 px-3 border border-slate-200 rounded-none font-medium text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-950 appearance-none">
                          <option>Full Regular Campus</option>
                          <option>Satellite Annex</option>
                          <option>Residential/Boarding Hub</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button onClick={onClose} variant="outline" className="flex-1 h-11 rounded-none font-bold text-slate-600 border-slate-200 uppercase text-[10px] tracking-widest">
                    Abort
                  </Button>
                  <Button onClick={onClose} className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100">
                    Deploy Asset
                  </Button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SettingsTab({ activeSchool, visibility, onVisibilityChange }: { activeSchool: any, visibility: any, onVisibilityChange: any }) {
  const toggleVisibility = (key: string) => {
    onVisibilityChange({
      ...visibility,
      [key]: !visibility[key as keyof typeof visibility]
    });
  };

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-4xl text-left">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 font-display tracking-tight text-left uppercase">Institutional Settings</h2>
        <p className="text-slate-500 font-medium text-left">Configure your organizational workspace and visibility protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-none border-slate-950 border-2">
          <CardHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900">Sidebar Configuration</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toggle Module Visibility</p>
              
              <div className="space-y-3">
                <VisibilityToggle 
                  label="Campuses & Branches" 
                  description="Main organizational structure access"
                  icon={<GitBranch className="w-4 h-4" />}
                  checked={visibility.branches} 
                  onChange={() => toggleVisibility('branches')}
                />
                <VisibilityToggle 
                  label="Staff Directory" 
                  description="Faculty and personnel management"
                  icon={<Users className="w-4 h-4" />}
                  checked={visibility.staff} 
                  onChange={() => toggleVisibility('staff')}
                />
                <VisibilityToggle 
                  label="Advanced Analytics" 
                  description="Deep insights and metrics engine"
                  icon={<BarChart3 className="w-4 h-4" />}
                  checked={visibility.analytics} 
                  onChange={() => toggleVisibility('analytics')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200 shadow-sm">
          <CardHeader className="p-6 border-b border-slate-100">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900">General Identity</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institutional Label</label>
                <Input defaultValue={activeSchool.name} className="h-11 rounded-none border-slate-200 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technical Domain</label>
                <Input placeholder="institute.kelem.co" className="h-11 rounded-none border-slate-200 font-bold" />
              </div>
              <Button className="w-full bg-slate-950 hover:bg-slate-800 text-white rounded-none h-11 font-bold uppercase text-[10px] tracking-widest">Update Identity</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-red-100 bg-red-50/20 p-8 border-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest text-red-900">Archive Institution</h4>
            <p className="text-xs text-red-700/70 font-medium">This will suspend all active branches and revoke access for all managers. This action is reversible by system admins only.</p>
          </div>
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-none h-11 px-8 font-bold uppercase text-[10px] tracking-widest shrink-0">Initiate Suspension</Button>
        </div>
      </Card>
    </div>
  );
}

function VisibilityToggle({ label, description, icon, checked, onChange }: { label: string, description: string, icon: React.ReactNode, checked: boolean, onChange: () => void }) {
  return (
    <button 
      onClick={onChange}
      className={cn(
        "w-full flex items-center justify-between p-4 border transition-all text-left group",
        checked ? "bg-white border-indigo-600 shadow-sm" : "bg-slate-50/50 border-slate-100 opacity-60 grayscale"
      )}
    >
      <div className="flex items-center space-x-4">
        <div className={cn(
          "w-10 h-10 flex items-center justify-center shrink-0",
          checked ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"
        )}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{label}</p>
          <p className="text-[10px] font-medium text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className={cn(
        "w-6 h-6 border flex items-center justify-center transition-all",
        checked ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-transparent"
      )}>
        <Check className="w-4 h-4" />
      </div>
    </button>
  );
}

// --- Schools Module ---
function SchoolsTab({ onAddSchool }: { onAddSchool: () => void }) {
  return (
    <div className="space-y-8 text-left p-4 md:p-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">School Infrastructure</h1>
          <p className="text-slate-500 font-medium tracking-tight">Global management of institutional entities and campus networks.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={onAddSchool}
            className="h-12 px-6 bg-[#1e1b4b] text-white rounded-none font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Provision New School
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {MOCK_SCHOOLS.map((school, i) => (
          <Card key={i} className="rounded-none border-none shadow-[0_4px_30px_rgba(0,0,0,0.03)] bg-white group hover:shadow-2xl transition-all overflow-hidden relative">
            <div className={cn(
              "h-2 w-full",
              school.logoColor === 'indigo' ? "bg-indigo-600" : 
              school.logoColor === 'emerald' ? "bg-emerald-600" : "bg-orange-500"
            )} />
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-16 h-16 flex items-center justify-center text-white rounded-none shrink-0 shadow-lg",
                  school.logoColor === 'indigo' ? "bg-indigo-600" : 
                  school.logoColor === 'emerald' ? "bg-emerald-600" : "bg-orange-500"
                )}>
                  <SchoolIcon className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                   <h3 className="text-xl font-bold text-[#1e1b4b] uppercase italic tracking-tight">{school.name}</h3>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Multi-Campus</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-slate-50 py-6">
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Branches</p>
                  <p className="text-lg font-black text-[#1e1b4b]">{school.branchesCount}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total Students</p>
                  <p className="text-lg font-black text-[#1e1b4b]">1.4k+</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Subscription</p>
                    <p className="text-xs font-bold text-indigo-600 uppercase">Enterprise Protocol</p>
                 </div>
                 <Button variant="ghost" className="text-slate-200 hover:text-[#1e1b4b] p-0" onClick={() => (window as any).__setActiveSchool?.(school.id)}>
                    <ArrowRight className="w-6 h-6" />
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
                  <AvatarImage src="https://picsum.photos/seed/owner/400" />
                  <AvatarFallback className="text-4xl font-black">OW</AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-2xl font-black text-slate-900 italic uppercase">Executive Profile</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ownership ID: {user?.id || 'ORG-EX-001'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <Input defaultValue={user?.name || 'Org Owner'} className="h-12 bg-slate-50/50 border-slate-100 rounded-xl font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Email</label>
                  <Input defaultValue={user?.email || 'ceo@kelem.co'} className="h-12 bg-slate-50/50 border-slate-100 rounded-xl font-bold" />
                </div>
              </div>

              <Button className="h-12 bg-[#1e1b4b] text-white px-8 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100/30">
                Update Identity Metadata
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
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Master Password</label>
                    <Input type="password" placeholder="••••••••••••" className="h-14 bg-slate-50/50 border-slate-100 rounded-xl font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm Passphrase</label>
                    <Input type="password" placeholder="••••••••••••" className="h-14 bg-slate-50/50 border-slate-100 rounded-xl font-bold" />
                  </div>
               </div>
               <Button className="h-14 bg-rose-600 hover:bg-rose-700 text-white px-8 rounded-xl font-bold uppercase text-[10px] tracking-widest">
                  Authorize Key Rotation
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

function StatCard({ label, value, trend, icon }: { label: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <Card className="border border-slate-100 bg-white/50 backdrop-blur-sm rounded-none shadow-sm hover:shadow-md hover:border-slate-300 transition-all group overflow-hidden text-left">
      <CardContent className="p-4 md:p-8">
        <div className="flex items-start justify-between">
           <div className="space-y-2 md:space-y-4 text-left">
              <div className="bg-slate-50 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                <div className="scale-75 md:scale-100">{icon}</div>
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <div className="flex items-baseline space-x-2 md:space-x-3">
                  <h4 className="text-xl md:text-3xl font-bold text-slate-900 font-display">{value}</h4>
                  <span className={cn(
                    "text-[8px] md:text-[10px] font-bold flex items-center whitespace-nowrap",
                    trend.includes('+') || trend.includes('growth') ? "text-emerald-500" : "text-slate-400"
                  )}>
                    {trend}
                  </span>
                </div>
              </div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Global Staff & Analytics Implementation ---

const STAFF_MOCK_DATA = [
  {
    id: 'S-7721',
    name: 'Dr. Elias Zewdu',
    role: 'Academic Director',
    email: 'elias.z@institution.edu',
    phone: '+251 911 445566',
    status: 'ACTIVE',
    accessLevel: 'Global Admin',
    schools: ['Ethio-Global Academy', 'Skylight High']
  },
  {
    id: 'S-8812',
    name: 'Marta Tadesse',
    role: 'Finance Manager',
    email: 'marta.t@institution.edu',
    phone: '+251 922 778899',
    status: 'ACTIVE',
    accessLevel: 'Regional Supervisor',
    schools: ['Ethio-Global Academy']
  },
  {
    id: 'S-9901',
    name: 'Samuel Kebede',
    role: 'IT Coordinator',
    email: 'samuel.k@institution.edu',
    phone: '+251 933 001122',
    status: 'INVITED',
    accessLevel: 'System Manager',
    schools: ['Global Network Hub']
  }
];

function StaffTab() {
  const [filter, setFilter] = useState('All Staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const filteredStaff = STAFF_MOCK_DATA.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-10 space-y-8 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
           <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Personnel Registry</h1>
           <p className="text-slate-500 font-medium">Organization-wide administrative hierarchy and access delegation.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-14 px-8 border-2 border-slate-950 font-black text-[10px] uppercase tracking-widest bg-white hover:bg-slate-50 flex items-center gap-3">
              <FileCheck className="w-5 h-5" />
              Audit Logs
           </Button>
           <Button 
            onClick={() => setIsInviteModalOpen(true)}
            className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-3"
           >
              <UserPlus className="w-5 h-5" />
              Invite Strategic Staff
           </Button>
        </div>
      </div>

      {/* Global Search */}
      <div className="relative group">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
         <Input 
           placeholder="Search staff by name, email, or role across all schools..." 
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           className="h-16 pl-16 border-2 border-slate-100 focus-visible:border-indigo-600 bg-white rounded-none text-base font-bold placeholder:text-slate-200 transition-all shadow-sm"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {filteredStaff.map((staff) => (
           <Card 
            key={staff.id} 
            onClick={() => setSelectedStaff(staff)}
            className="border-2 border-slate-100 rounded-none hover:border-indigo-600 hover:shadow-2xl transition-all cursor-pointer group bg-white overflow-hidden"
           >
              <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 bg-white border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(79,70,229,1)]">
                       <AvatarFallback className="text-xs font-black uppercase text-indigo-600">{staff.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                       <h3 className="text-sm font-black text-[#1e1b4b] uppercase tracking-tight">{staff.name}</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{staff.role}</p>
                    </div>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-500">
                       <Mail className="w-3.5 h-3.5" />
                       <span className="text-xs font-bold">{staff.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                       <Phone className="w-3.5 h-3.5" />
                       <span className="text-xs font-bold">{staff.phone}</span>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-50 space-y-3">
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Administrative Reach</p>
                    <div className="flex flex-wrap gap-2">
                       {staff.schools.map((school, i) => (
                         <div key={i} className="bg-slate-50 border border-slate-100 px-3 py-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-tight flex items-center gap-2">
                            <SchoolIcon className="w-3 h-3 text-indigo-400" />
                            {school}
                         </div>
                       ))}
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="p-0 border-t border-slate-100">
                 <button className="w-full h-12 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all">
                    Access Profile Matrix
                    <ArrowRight className="w-3.5 h-3.5" />
                 </button>
              </CardFooter>
           </Card>
         ))}
      </div>

      <StaffDetailsSlideOver staff={selectedStaff} onClose={() => setSelectedStaff(null)} />
      <InviteStaffModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
    </div>
  );
}

function StaffDetailsSlideOver({ staff, onClose }: { staff: any, onClose: () => void }) {
  if (!staff) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="bg-white w-full max-w-xl h-full relative shadow-3xl flex flex-col">
         <div className="p-8 border-b border-slate-950 flex items-center justify-between">
            <button onClick={onClose} className="p-3 text-slate-300 hover:text-slate-900 transition-colors border border-slate-100">
               <ArrowRight className="w-6 h-6 rotate-180" />
            </button>
            <div className="flex gap-3">
               <Button variant="outline" className="h-10 px-6 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-none">Reset Access</Button>
               <Button className="h-10 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest rounded-none shadow-lg shadow-red-100">Revoke Credentials</Button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
            <div className="flex items-center gap-8">
               <Avatar className="w-28 h-28 bg-white border-4 border-slate-950 shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] flex items-center justify-center text-indigo-600 font-black text-3xl">
                  {staff.name.split(' ').map((n: string)=>n[0]).join('')}
               </Avatar>
               <div className="space-y-1 text-left">
                  <h2 className="text-3xl font-black text-[#1e1b4b] uppercase italic tracking-tight">{staff.name}</h2>
                  <p className="text-lg font-bold text-indigo-600 uppercase tracking-widest">{staff.role}</p>
                  <div className="flex items-center gap-4 mt-3">
                     <span className="bg-emerald-50 text-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-emerald-100">Online</span>
                     <span className="bg-indigo-50 text-indigo-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-indigo-100">Global Admin</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-12 text-left">
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Communication Vectors</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 bg-slate-50 border-2 border-slate-100 space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Identity</p>
                        <p className="text-sm font-bold text-[#1e1b4b]">{staff.email}</p>
                     </div>
                     <div className="p-6 bg-slate-50 border-2 border-slate-100 space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile Link</p>
                        <p className="text-sm font-bold text-[#1e1b4b]">{staff.phone}</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Influence</h3>
                  <div className="space-y-3">
                     {staff.schools.map((school: string, i: number) => (
                       <div key={i} className="p-5 border-2 border-slate-100 flex items-center justify-between group hover:border-indigo-600 transition-all">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 bg-white border-2 border-slate-950 flex items-center justify-center text-indigo-600">
                                <SchoolIcon className="w-6 h-6" />
                             </div>
                             <div className="text-left">
                                <h4 className="text-sm font-black text-[#1e1b4b] uppercase tracking-tight">{school}</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Primary Campus Oversight</p>
                             </div>
                          </div>
                          <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                             <ArrowRight className="w-5 h-5" />
                          </button>
                       </div>
                     ))}
                  </div>
                  <Button variant="outline" className="w-full h-14 border-2 border-dashed border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-400 rounded-none">
                     Assign Additional Campus Access
                  </Button>
               </div>
            </div>
         </div>

         <div className="p-10 border-t border-slate-950 bg-slate-950 grid grid-cols-2 gap-4">
            <Button variant="ghost" className="h-14 text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
               <Shield className="w-5 h-5 text-indigo-400" />
               Modify Permissions
            </Button>
            <Button className="h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest shadow-[0px_8px_30px_rgba(79,70,229,0.3)]">
               Commit Security Policy
            </Button>
         </div>
      </motion.div>
    </div>
  );
}

function InviteStaffModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border-2 border-slate-950 p-10 max-w-lg w-full relative shadow-3xl text-left overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <MailSearch className="w-48 h-48" />
         </div>
         
         <div className="space-y-2 mb-10">
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Invite Strategic Staff</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {step} of 2 • Global Permission Mapping</p>
         </div>

         <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Legal Name</label>
                    <Input placeholder="e.g. Samuel Kebede" className="h-14 border-2 border-slate-100 rounded-none font-bold italic" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Institutional Email</label>
                    <Input placeholder="name@institution.edu" className="h-14 border-2 border-slate-100 rounded-none font-bold" />
                 </div>
                 <div className="p-6 bg-slate-50 border border-slate-100 flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                       <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Security Protocol</p>
                       <p className="text-[9px] font-medium text-slate-400 leading-relaxed uppercase">Temporary passcodes are auto-generated and dispatched via encrypted mail upon commitment.</p>
                    </div>
                 </div>
              </motion.div>
            ) : (
              <motion.div key="2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Access Tier</label>
                    <select className="w-full h-14 border-2 border-slate-100 bg-white font-black uppercase text-xs px-4 rounded-none outline-none focus:border-indigo-600 transition-all">
                       <option>Global Admin</option>
                       <option>Regional Supervisor</option>
                       <option>Financial Auditor</option>
                       <option>IT Systems Manager</option>
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Campus Reach</label>
                    <div className="grid grid-cols-2 gap-3">
                       <PermissionToggle label="Ethio-Global Academy" checked={true} />
                       <PermissionToggle label="Skylight High" checked={false} />
                       <PermissionToggle label="Global Network Hub" checked={false} />
                       <PermissionToggle label="Bole Campus" checked={true} />
                    </div>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>

         <div className="grid grid-cols-2 gap-4 mt-10">
            <Button variant="outline" onClick={onClose} className="h-14 border-2 border-slate-950 rounded-none font-black text-[10px] uppercase tracking-widest">Abort</Button>
            {step === 1 ? (
              <Button onClick={() => setStep(2)} className="h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100">Next Step</Button>
            ) : (
              <Button onClick={onClose} className="h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100">Commit Invite</Button>
            )}
         </div>
      </motion.div>
    </div>
  );
}

function AccountMenuItem({ icon, label, onClick, className }: { icon: React.ReactNode, label: string, onClick: () => void, className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 transition-all rounded-none text-[10px] font-bold text-slate-700 text-left uppercase tracking-widest",
        className
      )}
    >
      <span className="text-slate-400 shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function MapPinPulse({ x, y, pulseDelay = '0s' }: { x: string, y: string, pulseDelay?: string }) {
  return (
    <div 
      className="absolute flex items-center justify-center" 
      style={{ left: x, top: y }}
    >
      <div className="relative flex items-center justify-center">
        <MapPin className="w-6 h-6 text-indigo-500 relative z-10 drop-shadow-lg" />
        <motion.div 
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: parseFloat(pulseDelay) }}
          className="absolute inset-0 bg-indigo-500 rounded-full z-0"
        />
      </div>
    </div>
  );
}

function PermissionToggle({ label, checked }: { label: string, checked: boolean }) {
  const [val, setVal] = useState(checked);
  return (
    <button 
      onClick={() => setVal(!val)}
      className="w-full flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 hover:border-indigo-200 transition-all group shrink-0"
    >
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <div className={cn(
        "w-5 h-5 rounded-none flex items-center justify-center transition-all",
        val ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-transparent"
      )}>
        <Check className="w-3.5 h-3.5" />
      </div>
    </button>
  );
}

