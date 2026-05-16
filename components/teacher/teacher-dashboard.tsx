'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  GraduationCap, 
  BarChart3, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Menu,
  School,
  ChevronDown,
  Check,
  X,
  Plus,
  Search,
  BookOpen,
  ClipboardCheck,
  FileText,
  Clock,
  User,
  MoreVertical,
  Filter,
  Sparkles,
  CreditCard,
  User as UserIcon,
  Phone,
  Info,
  ExternalLink,
  Mail,
  ChevronLeft,
  Paperclip,
  Trash2,
  Edit,
  ClipboardList,
  Download,
  Upload,
  Trophy,
  TrendingDown,
  Target,
  ArrowUpDown,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Heart,
  Activity,
  Smile,
  ShieldCheck,
  UserCheck,
  Eye,
  CheckCircle2,
  Send,
  Megaphone,
  UserPlus,
  MapPin,
  CalendarDays,
  Languages,
  Lock,
  Globe
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Mock Data for Grades/Sections
const MOCK_TEACHER_CONTEXT = [
  {
    grade: 'Grade 7',
    sections: ['Section A', 'Section B', 'Section C']
  },
  {
    grade: 'Grade 8',
    sections: ['Section A', 'Section D']
  },
  {
    grade: 'Grade 9',
    sections: ['Section B', 'Section E']
  }
];

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

function SidebarItem({ icon, label, active, onClick, collapsed }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center space-x-3 px-4 py-3 transition-all duration-300 group relative",
        active 
          ? "bg-[#1e1b4b] text-white" 
          : "text-slate-500 hover:bg-slate-50 hover:text-[#1e1b4b]",
        collapsed && "justify-center px-0"
      )}
    >
      <div className={cn(
        "shrink-0 transition-transform duration-300 group-hover:scale-110",
        active ? "text-white" : "text-slate-400 group-hover:text-[#1e1b4b]"
      )}>
        {icon}
      </div>
      {!collapsed && (
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest",
          active ? "text-white" : "text-slate-500"
        )}>
          {label}
        </span>
      )}
      {active && !collapsed && (
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-indigo-500" />
      )}
    </button>
  );
}

function AccountMenuItem({ icon, label, onClick, className }: { icon: React.ReactNode, label: string, onClick?: () => void, className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-50 transition-colors text-left group",
        className
      )}
    >
      <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

// Mock Data for Dashboard Content
const MOCK_ACTIVE_CLASSES = [
  { id: 1, grade: 'Grade 7', section: 'Section A', subject: 'Mathematics', students: 42, color: 'bg-indigo-600' },
  { id: 2, grade: 'Grade 8', section: 'Section B', subject: 'Physics', students: 38, color: 'bg-emerald-600' },
  { id: 3, grade: 'Grade 9', section: 'Section A', subject: 'Mathematics', students: 45, color: 'bg-orange-600' },
];

const MOCK_DAILY_SCHEDULE = [
  { id: 1, time: '08:30 AM', duration: '45 min', subject: 'Mathematics', grade: '7', section: 'A', room: 'Room 102', active: true },
  { id: 2, time: '09:15 AM', duration: '45 min', subject: 'Physics', grade: '8', section: 'B', room: 'Lab 2', active: false },
  { id: 3, time: '11:00 AM', duration: '45 min', subject: 'Mathematics', grade: '9', section: 'A', room: 'Room 204', active: false },
  { id: 4, time: '01:30 PM', duration: '60 min', subject: 'Tutoring', grade: '7', section: 'A', room: 'Library', active: false },
];

const MOCK_PENDING_GRADING = [
  { id: 1, title: 'Algebra Midterm', type: 'Exam', count: 38, total: 42, deadline: '2 days ago', priority: 'high' },
  { id: 2, title: 'Newtonian Laws Quiz', type: 'Quiz', count: 12, total: 38, deadline: 'Today', priority: 'medium' },
  { id: 3, title: 'Geometry Project', type: 'Assignment', count: 42, total: 42, deadline: '5 days ago', priority: 'low' },
];

const MOCK_UPCOMING_ASSIGNMENTS = [
  { id: 1, title: 'Calculus Basics', grade: '9', section: 'A', dueDate: 'May 14', status: 'Draft' },
  { id: 2, title: 'Thermal Energy Lab', grade: '8', section: 'B', dueDate: 'May 16', status: 'Scheduled' },
];

const MOCK_PARENT_MESSAGES = [
  { id: 1, parent: 'Alemayehu T.', student: 'Samuel A.', message: 'Samuel will be absent tomorrow due to a dental appointment...', time: '20 min ago', unread: true },
  { id: 2, parent: 'Marta G.', student: 'Hanna G.', message: 'Could you please clarify the grading for the last project?', time: '2 hours ago', unread: true },
];

const MOCK_AT_RISK_STUDENTS = [
  { id: 1, name: 'Dagim Solomon', grade: '7', section: 'A', reason: 'Attendance (62%)', score: '54%', trend: 'down' },
  { id: 2, name: 'Lily Yohannes', grade: '8', section: 'B', reason: 'Academic Performance', score: '48%', trend: 'down' },
];

const MOCK_STUDENTS_LIST = [
  { 
    id: 'st-1', 
    name: 'Samuel Alemu', 
    idNumber: 'EGA-042',
    parent: 'Alemayehu T.',
    parentContact: { phone: '+251 911 234 567', email: 'alem@email.com' },
    attendance: '98%',
    performance: '88.5',
    riskLevel: 'low',
    status: 'Stable'
  },
  { 
    id: 'st-2', 
    name: 'Hanna Girmay', 
    idNumber: 'EGA-085',
    parent: 'Marta G.',
    parentContact: { phone: '+251 922 888 999', email: 'marta.g@email.com' },
    attendance: '94%',
    performance: '92.1',
    riskLevel: 'none',
    status: 'Excellent'
  },
  { 
    id: 'st-3', 
    name: 'Dagim Solomon', 
    idNumber: 'EGA-103',
    parent: 'Solomon K.',
    parentContact: { phone: '+251 933 444 555', email: 'solomon.k@email.com' },
    attendance: '62%',
    performance: '54.0',
    riskLevel: 'high',
    status: 'Critically At Risk'
  },
  { 
    id: 'st-4', 
    name: 'Lily Yohannes', 
    idNumber: 'EGA-112',
    parent: 'Yohannes B.',
    parentContact: { phone: '+251 944 111 222', email: 'yohannes.b@email.com' },
    attendance: '82%',
    performance: '48.0',
    riskLevel: 'medium',
    status: 'Struggling'
  },
  { 
    id: 'st-5', 
    name: 'Amare Kebede', 
    idNumber: 'EGA-215',
    parent: 'Kebede Z.',
    parentContact: { phone: '+251 955 666 777', email: 'kebede.z@email.com' },
    attendance: '91%',
    performance: '76.4',
    riskLevel: 'low',
    status: 'Improving'
  },
  { 
    id: 'st-6', 
    name: 'Bethelhem T.', 
    idNumber: 'EGA-301',
    parent: 'Tewodros J.',
    parentContact: { phone: '+251 966 333 444', email: 'tewodros.j@email.com' },
    attendance: '95%',
    performance: '81.2',
    riskLevel: 'none',
    status: 'Stable'
  }
];

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  actionLabel?: string;
  className?: string;
}

function DashboardSection({ title, children, icon, actionLabel, className }: DashboardCardProps) {
  return (
    <Card className={cn("rounded-none border-0 md:border border-slate-200 shadow-none flex flex-col h-full bg-white", className)}>
      <div className="py-2.5 md:py-3 px-3.5 md:px-5 border-b border-slate-100 flex items-center justify-between bg-white md:bg-slate-50/20">
        <div className="flex items-center gap-2">
          {icon && <div className="text-slate-400 w-3.5 h-3.5 md:w-4 md:h-4">{icon}</div>}
          <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-[#1e1b4b]">{title}</h3>
        </div>
        {actionLabel && (
          <button className="text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
            {actionLabel}
          </button>
        )}
      </div>
      <CardContent className="p-0 flex-1">
        {children}
      </CardContent>
    </Card>
  );
}

function StudentsView({ grade, section }: { grade: string, section: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [analyticsStudent, setAnalyticsStudent] = useState<typeof MOCK_STUDENTS_LIST[0] | null>(null);
  
  const filteredStudents = MOCK_STUDENTS_LIST.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.idNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6 relative">
      {/* Search & Actions Bar */}
      <div className="flex items-center justify-between gap-2 md:gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 text-[10px] md:text-xs font-bold uppercase tracking-widest focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 rounded-sm"
          />
        </div>
        <div className="flex items-center gap-2">
           <Button className="rounded-none bg-slate-50 border border-slate-200 text-[#1e1b4b] text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 h-9 md:h-10 px-3 md:px-6">
             <Filter className="w-3.5 h-3.5 md:mr-2" />
             <span className="hidden md:inline">Filter</span>
           </Button>
           <Button className="rounded-none bg-white border border-slate-950 text-[#1e1b4b] text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 h-9 md:h-10 px-3 md:px-6 transition-all">
             <ExternalLink className="w-3.5 h-3.5 md:mr-2" />
             <span className="hidden md:inline">Export</span>
           </Button>
        </div>
      </div>

      {/* Student Analytics Quick-View Overlay */}
      <AnimatePresence>
        {analyticsStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end md:p-6 pointer-events-none">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setAnalyticsStudent(null)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] pointer-events-auto"
            />
            <motion.div 
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="relative w-full max-w-sm h-full md:h-auto bg-white border-l md:border border-slate-950 shadow-2xl z-[101] pointer-events-auto flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-indigo-600">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${analyticsStudent.name}`} />
                    <AvatarFallback className="font-black text-xs text-indigo-600 bg-white">{analyticsStudent.name.slice(0,2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-[14px] font-black text-[#1e1b4b] uppercase tracking-tight leading-none mb-1">{analyticsStudent.name}</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{analyticsStudent.idNumber}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAnalyticsStudent(null)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Academic Performance</p>
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-black text-[#1e1b4b] leading-none">{analyticsStudent.performance}%</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase mb-1 px-2 py-0.5 rounded-sm",
                      parseFloat(analyticsStudent.performance) > 80 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {analyticsStudent.status}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" style={{ width: `${analyticsStudent.performance}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                    <p className="text-xl font-black text-[#1e1b4b]">{analyticsStudent.attendance}</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Factor</p>
                    <p className={cn(
                      "text-sm font-black uppercase tracking-tight",
                      analyticsStudent.riskLevel === 'high' ? "text-red-500" : "text-emerald-500"
                    )}>{analyticsStudent.riskLevel}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</p>
                  {[
                    { log: 'Submitted Algebra Quiz', score: '92/100', date: '2h ago' },
                    { log: 'Marked Present', score: 'OK', date: '6h ago' },
                    { log: 'Homework Pending', score: '!', date: '1d ago' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{log.log}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">{log.date}</span>
                      </div>
                      <span className="text-[10px] font-black text-indigo-600">{log.score}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-5 mt-auto border-t border-slate-100 flex gap-2">
                <Button className="flex-1 bg-[#1e1b4b] text-white rounded-none uppercase text-[10px] font-black h-11 tracking-widest">Full Report</Button>
                <Button variant="outline" className="flex-1 rounded-none uppercase text-[10px] font-black h-11 tracking-widest border-slate-950">Message Parent</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Students Table - Optimized for Mobile */}
      <Card className="rounded-none border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-hidden">
          <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-slate-50 border-b border-slate-100">
                 <th className="px-3 md:px-6 py-3 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                 <th className="hidden sm:table-cell px-6 py-3 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent</th>
                 <th className="px-3 md:px-6 py-3 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                 <th className="hidden lg:table-cell px-6 py-3 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Performance</th>
                 <th className="px-3 md:px-6 py-3 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {filteredStudents.map((student) => (
                 <tr key={student.id} className="hover:bg-indigo-50/20 transition-colors group">
                   <td className="px-3 md:px-6 py-3 md:py-5">
                      <div className="flex items-center gap-2 md:gap-4">
                         <Avatar className="hidden sm:flex w-10 h-10 border border-slate-100 shrink-0">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                            <AvatarFallback className="font-black text-[10px] text-indigo-600 bg-indigo-50">{student.name.slice(0,2)}</AvatarFallback>
                         </Avatar>
                         <div className="flex flex-col min-w-0">
                            <span className="text-[11px] md:text-[14px] font-black text-[#1e1b4b] uppercase tracking-tight truncate max-w-[120px] md:max-w-none">{student.name}</span>
                            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.idNumber}</span>
                         </div>
                      </div>
                   </td>
                   <td className="hidden sm:table-cell px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                         <span className="text-[10px] md:text-[11px] font-black text-[#1e1b4b] uppercase">{student.parent}</span>
                         <div className="flex items-center gap-1.5">
                            <button className="p-1 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all rounded-sm" title="Message">
                               <MessageSquare className="w-3 h-3" />
                            </button>
                            <button className="p-1 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all rounded-sm" title="Call">
                               <Phone className="w-3 h-3" />
                            </button>
                         </div>
                      </div>
                   </td>
                   <td className="px-3 md:px-6 py-3 md:py-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                         <div className={cn(
                           "px-2 md:px-3 py-0.5 md:py-1 text-[7px] md:text-[9px] font-black uppercase tracking-widest border rounded-full whitespace-nowrap",
                           student.riskLevel === 'high' ? "bg-red-50 text-red-600 border-red-100" :
                           student.riskLevel === 'medium' ? "bg-amber-50 text-amber-600 border-amber-100" :
                           student.riskLevel === 'low' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                           "bg-emerald-50 text-emerald-600 border-emerald-100"
                         )}>
                           {student.status.split(' ')[0]}
                         </div>
                         {student.riskLevel !== 'none' && (
                           <div className="hidden md:flex items-center gap-0.5 text-red-500">
                             <BarChart3 className="w-2.5 h-2.5" />
                             <span className="text-[7px] font-black uppercase">Risk</span>
                           </div>
                         )}
                      </div>
                   </td>
                   <td className="hidden lg:table-cell px-6 py-5">
                      <div className="flex flex-col items-center gap-2">
                         <span className="text-[16px] font-black text-[#1e1b4b] leading-none">{student.performance}%</span>
                         <div className="w-full max-w-[60px] h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600" style={{ width: `${student.performance}%` }} />
                         </div>
                      </div>
                   </td>
                   <td className="px-3 md:px-6 py-3 md:py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 md:gap-2">
                         <button 
                           onClick={() => setAnalyticsStudent(student)}
                           className="p-1.5 md:p-2.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-[#1e1b4b] hover:bg-white transition-all rounded-sm shadow-sm"
                         >
                            <Info className="w-3.5 h-3.5 md:w-4 md:h-4" />
                         </button>
                         <button className="hidden md:flex p-2.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-white transition-all rounded-sm shadow-sm">
                            <ExternalLink className="w-4 h-4" />
                         </button>
                      </div>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function AttendanceView({ grade, section }: { grade: string, section: string }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date()); // For calendar navigation
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | null>>({});
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const totalDays = daysInMonth(currentYear, currentMonth);
  const firstDay = firstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= totalDays; i++) calendarDays.push(i);

  // Close calendar on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsHistoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize attendance for the day or fetch mock data
  useEffect(() => {
    const initialAttendance: Record<string, 'present' | 'absent' | null> = {};
    MOCK_STUDENTS_LIST.forEach(s => {
      initialAttendance[s.id] = Math.random() > 0.1 ? 'present' : 'absent';
    });
    setAttendance(initialAttendance);
  }, [selectedDate, grade, section]);

  const toggleAttendance = (studentId: string, status: 'present' | 'absent') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status
    }));
  };

  const stats = {
    total: MOCK_STUDENTS_LIST.length,
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    unmarked: MOCK_STUDENTS_LIST.length - Object.values(attendance).filter(s => s !== null).length
  };

  const handleAlertParents = () => {
    const absentCount = stats.absent;
    if (absentCount === 0) {
      alert("No absent students to alert.");
      return;
    }
    alert(`Sending push notifications to parents of ${absentCount} absent students...`);
  };

  return (
    <div className="space-y-6">
      {/* Date Header & Stats */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center border border-slate-950 shadow-[2px_2px_0px_0px_rgba(30,27,75,1)]">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[12px] font-black text-[#1e1b4b] uppercase tracking-widest leading-none mb-1">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mark Daily Attendance</span>
              </div>
            </div>
            
            <div className="relative" ref={calendarRef}>
              <button 
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className="px-4 py-2 border border-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <Clock className="w-3.5 h-3.5" />
                History
              </button>

              <AnimatePresence>
                {isHistoryOpen && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-3 w-72 bg-white border border-slate-950 p-4 shadow-[8px_8px_0px_0px_rgba(30,27,75,0.15)] z-[60]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-[#1e1b4b]">
                        {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h5>
                      <div className="flex items-center gap-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-slate-100 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                        <button onClick={nextMonth} className="p-1 hover:bg-slate-100 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <span key={`${d}-${i}`} className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{d}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, i) => {
                        const isSelected = day && 
                          selectedDate.getDate() === day && 
                          selectedDate.getMonth() === currentMonth && 
                          selectedDate.getFullYear() === currentYear;
                        
                        const isToday = day && 
                          new Date().getDate() === day && 
                          new Date().getMonth() === currentMonth && 
                          new Date().getFullYear() === currentYear;

                        return (
                          <button
                            key={i}
                            disabled={!day}
                            onClick={() => {
                              if(day) {
                                setSelectedDate(new Date(currentYear, currentMonth, day));
                                setIsHistoryOpen(false);
                              }
                            }}
                            className={cn(
                              "aspect-square flex items-center justify-center text-[11px] font-bold transition-all rounded-none",
                              !day && "opacity-0 pointer-events-none",
                              day && !isSelected && "hover:bg-slate-100 text-[#1e1b4b]",
                              isSelected && "bg-[#1e1b4b] text-white shadow-[2px_2px_0px_0px_rgba(79,70,229,1)]",
                              isToday && !isSelected && "text-indigo-600 border border-indigo-200"
                            )}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-full md:w-64 grid grid-cols-2 gap-2">
          <div className="bg-indigo-600 text-white p-3 border border-slate-950 flex flex-col justify-between">
            <span className="text-[8px] font-bold uppercase tracking-widest opacity-80">Present</span>
            <span className="text-2xl font-black">{stats.present}</span>
          </div>
          <div className="bg-white border border-slate-950 p-3 flex flex-col justify-between text-red-600">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Absent</span>
            <span className="text-2xl font-black">{stats.absent}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#1e1b4b]">Student Registry</h4>
        <div className="flex items-center gap-3">
           <button 
             onClick={handleAlertParents}
             className="px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
           >
             <Bell className="w-3.5 h-3.5" />
             Alert Absence
           </button>
           <button className="px-4 py-2 bg-[#1e1b4b] text-white text-[10px] font-black uppercase tracking-widest hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(79,70,229,1)] transition-all flex items-center gap-2">
             <ClipboardCheck className="w-3.5 h-3.5" />
             Save Record
           </button>
        </div>
      </div>

      {/* Attendance List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {MOCK_STUDENTS_LIST.map((student) => (
          <Card key={student.id} className={cn(
            "rounded-none border-0 md:border border-slate-200 shadow-none transition-all duration-300",
            attendance[student.id] === 'absent' ? "bg-red-50/30" : "bg-white",
            attendance[student.id] === 'present' ? "bg-emerald-50/10" : ""
          )}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="w-9 h-9 border border-slate-100 shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                  <AvatarFallback className="text-[10px] font-black bg-slate-50 text-slate-400">{student.name.slice(0,2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-black text-[#1e1b4b] uppercase truncate">{student.name}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{student.idNumber}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleAttendance(student.id, 'present')}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center border transition-all",
                    attendance[student.id] === 'present' 
                      ? "bg-emerald-600 border-emerald-700 text-white" 
                      : "bg-white border-slate-200 text-slate-300 hover:border-emerald-600 hover:text-emerald-600"
                  )}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleAttendance(student.id, 'absent')}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center border transition-all",
                    attendance[student.id] === 'absent' 
                      ? "bg-red-600 border-red-700 text-white" 
                      : "bg-white border-slate-200 text-slate-300 hover:border-red-600 hover:text-red-600"
                  )}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TasksView({ grade, section }: { grade: string, section: string }) {
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Algebra Midterm', type: 'Exam', dueDate: '2024-05-15', instructions: 'Covers Chapters 1-4. Show all work.', submissions: 38, total: 42, attachment: 'midterm_study_guide.pdf' },
    { id: 't2', title: 'Newtonian Laws Quiz', type: 'Quiz', dueDate: '2024-05-12', instructions: 'Multiple choice. 15 minutes.', submissions: 42, total: 42, attachment: null },
    { id: 't3', title: 'Geometry Project', type: 'Assignment', dueDate: '2024-05-20', instructions: 'Build a 3D model of a polyhedral shape.', submissions: 12, total: 42, attachment: 'project_rubric.pdf' }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [trackingTask, setTrackingTask] = useState<any | null>(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'Assignment',
    instructions: '',
    dueDate: '',
    attachment: null as File | null
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `t-${Date.now()}`;
    setTasks([{ ...newTask, id, submissions: 0, total: 42, attachment: newTask.attachment?.name || null } as any, ...tasks]);
    setIsCreating(false);
    setNewTask({ title: '', type: 'Assignment', instructions: '', dueDate: '', attachment: null });
  };

  const MOCK_SUBMISSIONS = [
    { id: 'sub-1', studentName: 'Samuel Alemu', submittedAt: '2024-05-10 14:30', status: 'Submitted', attachment: 'alex_geometry.pdf' },
    { id: 'sub-2', studentName: 'Hanna Girmay', submittedAt: '2024-05-11 10:15', status: 'Submitted', attachment: 'hanna_final.docx' },
    { id: 'sub-3', studentName: 'Dagim Solomon', submittedAt: '', status: 'Pending', attachment: null },
    { id: 'sub-4', studentName: 'Lily Yohannes', submittedAt: '', status: 'Overdue', attachment: null },
  ];

  if (trackingTask) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setTrackingTask(null)}
              className="w-10 h-10 border border-slate-950 flex items-center justify-center hover:bg-slate-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-[14px] font-black text-[#1e1b4b] uppercase tracking-tight leading-none mb-1">
                Submissions: {trackingTask.title}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Tracking for {grade} {section}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-white border border-slate-200 text-[#1e1b4b] text-[9px] font-black uppercase rounded-full">
              {trackingTask.submissions} / {trackingTask.total} SUBMITTED
            </div>
          </div>
        </div>

        <Card className="rounded-none border border-slate-200 shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Submission Date</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">File</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_SUBMISSIONS.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-black text-[#1e1b4b] uppercase">{sub.studentName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-slate-600 uppercase">{sub.submittedAt || '--'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border rounded-full",
                        sub.status === 'Submitted' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        sub.status === 'Overdue' ? "bg-red-50 text-red-600 border-red-100" :
                        "bg-slate-50 text-slate-400 border-slate-100"
                      )}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {sub.attachment ? (
                        <div className="flex items-center gap-2 text-indigo-600 hover:underline cursor-pointer">
                          <Paperclip className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase">{sub.attachment}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
                        Grade →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-indigo-600 text-white flex items-center justify-center border border-slate-950 shadow-[3px_3px_0px_0px_rgba(30,27,75,1)]">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-[14px] font-black text-[#1e1b4b] uppercase tracking-tight leading-none mb-1">Academic Tasks</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{tasks.length} active assessments for this class</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsCreating(true)}
          className="h-11 px-6 bg-[#1e1b4b] text-white text-[10px] font-black uppercase tracking-[0.15em] shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(79,70,229,1)] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-slate-50 border border-slate-950 shadow-[4px_4px_0px_0px_rgba(30,27,75,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-[#1e1b4b]" />
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#1e1b4b]">New Assessment</h4>
                <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Task Title</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Calculus Midterm Exam"
                    value={newTask.title}
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                    className="w-full h-11 px-4 bg-white border border-slate-200 text-[11px] font-bold uppercase tracking-widest focus:border-indigo-600 outline-none transition-all placeholder:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Task Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Exam', 'Quiz', 'Assignment'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewTask({...newTask, type})}
                        className={cn(
                          "h-10 text-[9px] font-black uppercase tracking-widest border transition-all",
                          newTask.type === type ? "bg-[#1e1b4b] text-white border-slate-950" : "bg-white border-slate-200 text-slate-400 hover:border-slate-400"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="date"
                      value={newTask.dueDate}
                      onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                      className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 text-[11px] font-bold focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Instructions</label>
                  <textarea 
                    required
                    placeholder="Provide clear guidelines for students..."
                    value={newTask.instructions}
                    onChange={e => setNewTask({...newTask, instructions: e.target.value})}
                    className="w-full h-[106px] p-4 bg-white border border-slate-200 text-[11px] font-bold focus:border-indigo-600 outline-none transition-all resize-none placeholder:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Attachment</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden"
                      onChange={e => setNewTask({...newTask, attachment: e.target.files ? e.target.files[0] : null})}
                    />
                    <label 
                      htmlFor="file-upload"
                      className="w-full h-11 flex items-center justify-between px-4 bg-white border border-slate-200 cursor-pointer hover:border-indigo-600 transition-all border-dashed"
                    >
                      <span className="text-[9px] font-black text-slate-400 uppercase truncate max-w-[200px]">
                        {newTask.attachment ? newTask.attachment.name : 'Select Study Material/Rubric'}
                      </span>
                      <Paperclip className="w-4 h-4 text-slate-400" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-2">
                <button type="submit" className="w-full h-12 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.25em] hover:bg-indigo-700 transition-all shadow-[2px_2px_0px_0px_rgba(30,27,75,1)]">
                  Launch Assessment
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="rounded-none border border-slate-200 shadow-none hover:shadow-[4px_4px_0px_0px_rgba(30,27,75,0.05)] transition-all group overflow-hidden bg-white flex flex-col">
            <div className="p-5 border-b border-slate-50 flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className={cn(
                  "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border self-start",
                  task.type === 'Exam' ? "bg-red-50 text-red-600 border-red-100" :
                  task.type === 'Quiz' ? "bg-amber-50 text-amber-600 border-amber-100" :
                  "bg-indigo-50 text-indigo-600 border-indigo-100"
                )}>
                  {task.type}
                </span>
                <h4 className="text-[14px] font-black text-[#1e1b4b] uppercase mt-2 tracking-tight line-clamp-1">{task.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Due {task.dueDate}
                  </span>
                  {task.attachment && (
                    <span className="text-[8px] font-bold text-indigo-500 uppercase flex items-center gap-1">
                      <Paperclip className="w-3 h-3" />
                      DOC
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-slate-50 transition-all">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-5 flex-1 bg-slate-50/50">
               <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic mb-4">
                 "{task.instructions}"
               </p>
               <div className="flex items-end justify-between">
                 <div className="flex flex-col">
                   <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Submissions</span>
                   <div className="flex items-center gap-2">
                     <span className="text-xl font-black text-[#1e1b4b]">{task.submissions}</span>
                     <span className="text-[9px] font-bold text-slate-400 uppercase">/ {task.total}</span>
                   </div>
                 </div>
                 {task.type === 'Assignment' && (
                   <button 
                     onClick={() => setTrackingTask(task)}
                     className="px-4 py-2 bg-white border border-slate-950 text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                   >
                     Track Progress
                   </button>
                 )}
               </div>
            </div>

            <div className="w-full h-1.5 bg-slate-100 overflow-hidden">
               <div 
                 className={cn(
                   "h-full transition-all duration-500",
                   task.type === 'Exam' ? "bg-red-500" : task.type === 'Quiz' ? "bg-amber-500" : "bg-indigo-600"
                 )} 
                 style={{ width: `${(task.submissions / task.total) * 100}%` }} 
               />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const MOCK_PERFORMANCE_TREND = [
  { month: 'Sep', score: 72 },
  { month: 'Oct', score: 75 },
  { month: 'Nov', score: 81 },
  { month: 'Dec', score: 78 },
  { month: 'Jan', score: 84 },
  { month: 'Feb', score: 82 },
  { month: 'Mar', score: 88 },
];

const MOCK_ATTENDANCE_TREND = [
  { month: 'Sep', rate: 96 },
  { month: 'Oct', rate: 94 },
  { month: 'Nov', rate: 95 },
  { month: 'Dec', rate: 89 },
  { month: 'Jan', rate: 97 },
  { month: 'Feb', rate: 94 },
  { month: 'Mar', rate: 98 },
];

const MOCK_ENGAGEMENT_DATA = [
  { name: 'Engaged', value: 32, color: '#4f46e5' },
  { name: 'Moderate', value: 8, color: '#f59e0b' },
  { name: 'At Risk', value: 2, color: '#ef4444' },
];

function StudentAnalyticsView({ grade, section }: { grade: string, section: string }) {
  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Analytics Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall GPA', value: '3.42', trend: '+0.2', icon: <Trophy className="w-5 h-5 text-amber-500" />, sub: 'Class Average' },
          { label: 'Attendance', value: '94.8%', trend: '+1.2%', icon: <UserCheck className="w-5 h-5 text-indigo-500" />, sub: 'Monthly Rate' },
          { label: 'Behavior', value: '92/100', trend: '-2', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, sub: 'Positive Logs' },
          { label: 'Engagement', value: '78%', trend: '+5%', icon: <Heart className="w-5 h-5 text-red-500" />, sub: 'Parent Portal' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-slate-200 shadow-none bg-white p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-slate-50 border border-slate-100">{stat.icon}</div>
              <span className={cn(
                "text-[9px] font-black px-1.5 py-0.5 rounded-sm",
                stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-[#1e1b4b] leading-tight">{stat.value}</h4>
              <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Academic Performance Trend */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="rounded-none border-slate-200 shadow-none bg-white flex flex-col h-[350px]">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1e1b4b]">Academic Performance Trend</h3>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-indigo-600" />
                   <span className="text-[8px] font-black uppercase text-slate-400">Class Avg</span>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 pb-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_PERFORMANCE_TREND}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                    domain={[60, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e1b4b', 
                      border: 'none', 
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }} 
                    cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Behavioral Monitoring */}
            <Card className="rounded-none border-slate-200 shadow-none bg-white p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1e1b4b]">Behavioral Monitoring</h3>
                <Smile className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Positive Reinforcements', value: 142, total: 160, color: 'bg-emerald-500' },
                  { label: 'Minor Infractions', value: 12, total: 160, color: 'bg-amber-500' },
                  { label: 'Critical Incidents', value: 3, total: 160, color: 'bg-red-500' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-[#1e1b4b]">{item.value} Logs</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 overflow-hidden">
                       <div className={cn("h-full", item.color)} style={{ width: `${(item.value / item.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50">
                 <p className="text-[8px] font-bold text-slate-400 uppercase leading-relaxed italic">
                   Note: 15% improvement in behavior logs compared to previous month.
                 </p>
              </div>
            </Card>

            {/* Attendance Trends */}
            <Card className="rounded-none border-slate-200 shadow-none bg-white p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1e1b4b]">Attendance Consistency</h3>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_ATTENDANCE_TREND}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      hide
                    />
                    <YAxis hide domain={[80, 100]} />
                    <Tooltip 
                      labelClassName="hidden"
                      contentStyle={{ 
                        backgroundColor: '#1e1b4b', 
                        border: 'none', 
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }} 
                    />
                    <Bar dataKey="rate" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-[10px] font-black text-[#1e1b4b]">94.8% AVG</span>
                </div>
                <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">+2.1% FROM FEB</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Side Analytics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           {/* Parent Engagement */}
           <Card className="rounded-none border-slate-200 shadow-none bg-white p-5 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1e1b4b]">Parent Engagement</h3>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              
              <div className="h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_ENGAGEMENT_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {MOCK_ENGAGEMENT_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                   <span className="text-xl font-black text-[#1e1b4b]">42</span>
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stud.</span>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                 {MOCK_ENGAGEMENT_DATA.map((item, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-[#1e1b4b]">{item.value} Parents</span>
                   </div>
                 ))}
              </div>
           </Card>

           {/* Risk Detection */}
           <Card className="rounded-none border-slate-200 shadow-none bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1e1b4b]">Risk Detection (AI)</h3>
                <div className="px-2 py-0.5 bg-red-600 text-white text-[7px] font-black uppercase tracking-widest rounded-sm">Alert</div>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Dagim Solomon', reason: 'Critical attendance drop (62%)', type: 'Attendance' },
                  { name: 'Lily Yohannes', reason: '3 consecutive failed quizzes', type: 'Academic' },
                ].map((risk, i) => (
                  <div key={i} className="p-3 bg-red-50 border border-red-100 group cursor-pointer hover:bg-red-100 transition-colors">
                     <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-red-700 uppercase">{risk.name}</span>
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                     </div>
                     <p className="text-[9px] font-bold text-red-600 leading-tight mb-2">{risk.reason}</p>
                     <div className="flex items-center justify-between">
                        <span className="text-[7px] font-black text-red-800 bg-red-200 px-1 py-0.5 uppercase">{risk.type}</span>
                        <button className="text-[8px] font-black text-indigo-700 uppercase hover:underline">Full Profile</button>
                     </div>
                  </div>
                ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

function MessagesView({ grade, section }: { grade: string, section: string }) {
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState<'section' | 'selected-parents' | 'selected-sections'>('section');
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [broadcastSearchQuery, setBroadcastSearchQuery] = useState('');
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const MOCK_CONVERSATIONS = [
    { id: 'c1', name: 'Abebe Kebede', student: 'Samuel Alemu', lastMsg: 'I will check the homework tonight.', time: '10:45 AM', unread: 2, online: true },
    { id: 'c2', name: 'Hiwot Tadesse', student: 'Hanna Girmay', lastMsg: 'Thanks for the update!', time: 'Yesterday', unread: 0, online: false },
    { id: 'c3', name: 'Mulugeta Bekele', student: 'Dagim Solomon', lastMsg: 'Can we meet on Friday?', time: '2 days ago', unread: 0, online: true },
    { id: 'c4', name: 'Zewditu Haile', student: 'Lily Yohannes', lastMsg: 'She was sick today.', time: '3 days ago', unread: 0, online: false },
  ];

  const MOCK_HISTORY = [
    { id: 'm1', sender: 'parent', text: 'Hello Teacher, how is Samuel performing this week?', time: '09:30 AM' },
    { id: 'm2', sender: 'teacher', text: 'Hello! He is doing great in Math, but needs some work on his English vocabulary.', time: '09:45 AM' },
    { id: 'm3', sender: 'parent', text: 'I noticed that too. We will practice at home.', time: '10:15 AM' },
    { id: 'm4', sender: 'teacher', text: 'Great! I will send some resources today.', time: '10:30 AM' },
    { id: 'm5', sender: 'parent', text: 'I will check the homework tonight.', time: '10:45 AM' },
  ];

  // For Section Selection in Broadcast
  const ALL_SECTIONS = MOCK_TEACHER_CONTEXT.flatMap(g => g.sections.map(s => `${g.grade} - ${s}`));

  useEffect(() => {
    if (activeChat) {
      setMessages(MOCK_HISTORY);
    }
  }, [activeChat]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg = {
      id: `m-${Date.now()}`,
      sender: 'teacher',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, msg]);
    setNewMessage('');
    
    // Simulate real-time response
    setTimeout(() => {
      const response = {
        id: `r-${Date.now()}`,
        sender: 'parent',
        text: 'Noted, thank you!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    let targetDesc = '';
    if (broadcastTarget === 'section') targetDesc = `Current Section (${grade} ${section})`;
    else if (broadcastTarget === 'selected-parents') targetDesc = `${selectedParents.length} Selected Parents`;
    else targetDesc = `${selectedSections.length} Selected Sections`;

    alert(`Broadcasting message to: ${targetDesc}`);
    setIsBroadcasting(false);
    setSelectedParents([]);
    setSelectedSections([]);
  };

  const toggleParentSelection = (id: string) => {
    setSelectedParents(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleSectionSelection = (sec: string) => {
    setSelectedSections(prev => 
      prev.includes(sec) ? prev.filter(s => s !== sec) : [...prev, sec]
    );
  };

  return (
    <div className="flex bg-white border border-slate-950 shadow-[8px_8px_0px_0px_rgba(30,27,75,1)] h-[calc(100vh-220px)] overflow-hidden">
      {/* Sidebar - Conversations */}
      <div className={cn(
        "w-full md:w-80 border-r border-slate-100 flex flex-col h-full",
        activeChat && "hidden md:flex"
      )}>
        <div className="p-4 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-black text-[#1e1b4b] uppercase tracking-tight">Messages</h3>
            <button 
              onClick={() => {
                setIsBroadcasting(true);
                setBroadcastTarget('section');
              }}
              className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all rounded-none border border-indigo-200"
              title="Broadcast Message"
            >
              <Megaphone className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search parents..."
              className="w-full h-10 pl-10 pr-4 bg-slate-50 border-none text-[11px] font-bold outline-none focus:ring-1 ring-indigo-500"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {MOCK_CONVERSATIONS.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.student.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={cn(
                "w-full p-4 flex items-center gap-3 border-b border-slate-50 transition-all text-left group",
                activeChat?.id === chat.id 
                  ? "bg-[#1e1b4b] text-white shadow-[inset_4px_0px_0px_0px_#f59e0b]" 
                  : "hover:bg-slate-50"
              )}
            >
              <div className="relative shrink-0">
                <Avatar className={cn(
                  "w-11 h-11 border-2 transition-all",
                  activeChat?.id === chat.id ? "border-amber-400" : "border-slate-200"
                )}>
                   <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} />
                   <AvatarFallback>{chat.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={cn(
                    "text-[11px] font-black uppercase truncate",
                    activeChat?.id === chat.id ? "text-white" : "text-[#1e1b4b]"
                  )}>
                    {chat.name}
                  </span>
                  <span className={cn(
                    "text-[8px] font-bold opacity-60",
                    activeChat?.id === chat.id ? "text-white" : "text-slate-400"
                  )}>
                    {chat.time}
                  </span>
                </div>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-widest mb-1",
                  activeChat?.id === chat.id ? "text-amber-300" : "text-indigo-600"
                )}>
                  Parent of {chat.student}
                </p>
                <p className={cn(
                  "text-[10px] truncate font-medium",
                  activeChat?.id === chat.id ? "text-slate-300" : "text-slate-500"
                )}>
                  {chat.lastMsg}
                </p>
              </div>
              {chat.unread > 0 && activeChat?.id !== chat.id && (
                <div className="w-5 h-5 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full leading-none shrink-0">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className={cn(
        "flex-1 flex flex-col bg-[#fdfdfd] h-full",
        !activeChat && "hidden md:flex items-center justify-center bg-slate-50/30"
      )}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-2 text-slate-400"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="relative">
                  <Avatar className="w-10 h-10 border border-slate-100">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.name}`} />
                    <AvatarFallback>{activeChat.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  {activeChat.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />}
                </div>
                <div>
                   <h4 className="text-[12px] font-black text-[#1e1b4b] uppercase truncate leading-none mb-1">{activeChat.name}</h4>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Online • parent of {activeChat.student}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2 text-slate-400 hover:text-indigo-600"><Phone className="w-4 h-4" /></button>
                 <button className="p-2 text-slate-400 hover:text-indigo-600"><Info className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar scrolling-touch"
            >
              <div className="flex justify-center mb-8">
                 <span className="px-3 py-1 bg-slate-100 text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] rounded-full">Conversation Started</span>
              </div>
              
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex flex-col max-w-[80%] md:max-w-[70%]",
                  msg.sender === 'teacher' ? "ml-auto items-end" : "mr-auto items-start"
                )}>
                  <div className={cn(
                    "p-4 text-[12px] font-medium leading-relaxed shadow-sm",
                    msg.sender === 'teacher' 
                      ? "bg-[#1e1b4b] text-white rounded-l-2xl rounded-tr-2xl" 
                      : "bg-white border border-slate-100 text-slate-700 rounded-r-2xl rounded-tl-2xl"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] font-bold text-slate-300 uppercase mt-2 tracking-widest">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-slate-100">
               <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-slate-50 p-1.5 border border-slate-100">
                  <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input 
                    type="text" 
                    placeholder="Type your message here..."
                    className="flex-1 bg-transparent border-none text-[12px] font-medium outline-none py-2 px-1 text-slate-700 placeholder:text-slate-300"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center transition-all",
                      newMessage.trim() ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </button>
               </form>
            </div>
          </>
        ) : (
          <div className="text-center p-8 space-y-4">
             <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-indigo-400" />
             </div>
             <h3 className="text-[16px] font-black text-[#1e1b4b] uppercase tracking-tight">Your Direct Inboxes</h3>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest max-w-[300px] mx-auto leading-relaxed">
               Select a parent to start a real-time conversation or use the broadcast feature to reach multiple parents instantly.
             </p>
             <div className="pt-6">
                <button 
                  onClick={() => setIsBroadcasting(true)}
                  className="px-6 py-3 bg-[#1e1b4b] text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto"
                >
                  <Megaphone className="w-4 h-4" />
                  New Broadcast
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Broadcasting Modal */}
      <AnimatePresence>
        {isBroadcasting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="w-full max-w-2xl bg-white border border-slate-950 p-6 md:p-8 shadow-[12px_12px_0px_0px_rgba(245,158,11,1)] overflow-y-auto max-h-[90vh] no-scrollbar"
             >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3 text-indigo-600">
                    <Megaphone className="w-6 h-6" />
                    <h3 className="text-[16px] font-black uppercase tracking-tight">Parent Broadcast</h3>
                  </div>
                  <button onClick={() => setIsBroadcasting(false)} className="p-2 hover:bg-slate-50 transition-all"><X className="w-6 h-6 text-slate-400" /></button>
                </div>
                
                <form onSubmit={handleBroadcast} className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Target Audience</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { id: 'section', label: 'Current Section', sub: `${grade} ${section}` },
                        { id: 'selected-sections', label: 'Select Sections', sub: 'Across your grades' },
                        { id: 'selected-parents', label: 'Certain Parents', sub: 'From current section' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setBroadcastTarget(opt.id as any)}
                          className={cn(
                            "p-4 border-2 text-left transition-all",
                            broadcastTarget === opt.id ? "border-indigo-600 bg-indigo-50" : "border-slate-100 hover:border-slate-200"
                          )}
                        >
                          <div className="text-[11px] font-black text-[#1e1b4b] uppercase leading-none mb-1">{opt.label}</div>
                          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{opt.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Selection Areas */}
                  {broadcastTarget === 'selected-sections' && (
                    <div className="p-4 bg-slate-50 border border-slate-200 space-y-3">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Choose Sections</label>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {ALL_SECTIONS.map(sec => (
                            <label key={sec} className="flex items-center gap-3 p-2 bg-white border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all">
                               <input 
                                 type="checkbox" 
                                 className="w-4 h-4 accent-indigo-600"
                                 checked={selectedSections.includes(sec)}
                                 onChange={() => toggleSectionSelection(sec)}
                               />
                               <span className="text-[9px] font-black uppercase text-[#1e1b4b]">{sec}</span>
                            </label>
                          ))}
                       </div>
                    </div>
                  )}

                  {broadcastTarget === 'selected-parents' && (
                    <div className="p-4 bg-slate-50 border border-slate-200 space-y-3">
                       <div className="flex items-center justify-between mb-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Choose Parents ({section})</label>
                          <div className="flex items-center gap-4">
                             <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                <input 
                                  type="text"
                                  placeholder="Search filtered..."
                                  value={broadcastSearchQuery}
                                  onChange={e => setBroadcastSearchQuery(e.target.value)}
                                  className="h-7 pl-7 pr-3 bg-white border border-slate-200 text-[9px] font-bold outline-none focus:ring-1 ring-indigo-500 w-32"
                                />
                             </div>
                             <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  className="w-3 h-3 accent-amber-500"
                                  checked={
                                    (() => {
                                      const filtered = MOCK_CONVERSATIONS.filter(p => 
                                        p.name.toLowerCase().includes(broadcastSearchQuery.toLowerCase()) || 
                                        p.student.toLowerCase().includes(broadcastSearchQuery.toLowerCase())
                                      );
                                      return filtered.length > 0 && filtered.every(p => selectedParents.includes(p.id));
                                    })()
                                  }
                                  onChange={(e) => {
                                    const filtered = MOCK_CONVERSATIONS.filter(p => 
                                      p.name.toLowerCase().includes(broadcastSearchQuery.toLowerCase()) || 
                                      p.student.toLowerCase().includes(broadcastSearchQuery.toLowerCase())
                                    );
                                    if (e.target.checked) {
                                      setSelectedParents(prev => Array.from(new Set([...prev, ...filtered.map(p => p.id)])));
                                    } else {
                                      setSelectedParents(prev => prev.filter(id => !filtered.find(p => p.id === id)));
                                    }
                                  }}
                                />
                                <span className="text-[8px] font-black uppercase text-indigo-600 group-hover:underline">Select All Filtered</span>
                             </label>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto no-scrollbar pr-2">
                          {MOCK_CONVERSATIONS.filter(p => 
                            p.name.toLowerCase().includes(broadcastSearchQuery.toLowerCase()) || 
                            p.student.toLowerCase().includes(broadcastSearchQuery.toLowerCase())
                          ).map(pc => (
                            <label key={pc.id} className="flex items-center gap-3 p-2 bg-white border border-slate-100 cursor-pointer hover:border-indigo-200 transition-all">
                               <input 
                                 type="checkbox" 
                                 className="w-4 h-4 accent-indigo-600"
                                 checked={selectedParents.includes(pc.id)}
                                 onChange={() => toggleParentSelection(pc.id)}
                               />
                               <div className="flex flex-col">
                                 <span className="text-[9px] font-black uppercase text-[#1e1b4b]">{pc.name}</span>
                                 <span className="text-[7px] font-bold text-slate-400 uppercase">P/o {pc.student}</span>
                               </div>
                            </label>
                          ))}
                       </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Announcement Title</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. End of Term Meeting Details"
                        className="w-full h-12 px-4 bg-slate-50 border-none text-[11px] font-black outline-none focus:ring-2 ring-indigo-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Broadcast Message</label>
                      <textarea 
                        required
                        placeholder="Type the message to be sent to all selected parents..."
                        className="w-full min-h-[140px] p-4 bg-slate-50 border-none text-[11px] font-bold outline-none focus:ring-2 ring-indigo-600 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                     <button 
                       type="button"
                       onClick={() => setIsBroadcasting(false)}
                       className="flex-1 h-12 border border-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                     >
                       Cancel
                     </button>
                     <button 
                       type="submit"
                       className="flex-[2] h-12 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] transition-all"
                     >
                       Blast Message
                     </button>
                  </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScheduleView({ grade, section }: { grade: string, section: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [events, setEvents] = useState([
    { id: 'e1', title: 'Calculus Advanced Derivatives', type: 'teaching', date: new Date(2024, 4, 15), time: '08:30 AM', location: 'Hall 4' },
    { id: 'e2', title: 'Parent-Teacher Meeting', type: 'meeting', date: new Date(2024, 4, 20), time: '02:00 PM', location: 'Office 2' },
    { id: 'e3', title: 'Final Semester Projects', type: 'assignment', date: new Date(2024, 4, 25), time: '11:59 PM', location: 'Online' },
    { id: 'e4', title: 'School Foundation Day', type: 'school-event', date: new Date(2024, 4, 12), time: '09:00 AM', location: 'Main Grounds' },
    { id: 'e5', title: 'Mid-term Mathematics Exam', type: 'exam', date: new Date(2024, 4, 28), time: '10:00 AM', location: 'Exam Room A' },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'teaching',
    time: '',
    location: '',
    description: ''
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const onDateClick = (day: Date) => setSelectedDate(day);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const event = {
      ...newEvent,
      id: `e-${Date.now()}`,
      date: selectedDate
    };
    setEvents([...events, event as any]);
    setIsAddingEvent(false);
    setNewEvent({ title: '', type: 'teaching', time: '', location: '', description: '' });
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayEvents = (day: Date) => events.filter(e => isSameDay(e.date, day));

  const eventTypeColors = {
    'teaching': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'assignment': 'bg-amber-50 text-amber-700 border-amber-200',
    'meeting': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'school-event': 'bg-purple-50 text-purple-700 border-purple-200',
    'exam': 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-white border border-slate-950 shadow-[8px_8px_0px_0px_rgba(30,27,75,1)] min-h-[600px] overflow-hidden">
      {/* Calendar Section */}
      <div className="flex-1 p-6 lg:border-r border-slate-100">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(30,27,75,1)]">
                <CalendarDays className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-[14px] font-black text-[#1e1b4b] uppercase tracking-tight leading-none mb-1">
                 {format(currentDate, 'MMMM yyyy')}
               </h3>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Academic Schedule</p>
             </div>
           </div>
           <div className="flex items-center gap-2">
             <button onClick={prevMonth} className="w-9 h-9 border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all font-black text-slate-400">
               <ChevronLeft className="w-4 h-4" />
             </button>
             <button onClick={nextMonth} className="w-9 h-9 border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all font-black text-slate-400">
               <ChevronRight className="w-4 h-4" />
             </button>
           </div>
        </div>

        <div className="grid grid-cols-7 border-t border-l border-slate-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="p-3 bg-slate-50 border-r border-b border-slate-100 text-[9px] font-black uppercase text-slate-400 text-center tracking-[0.2em]">
              {d}
            </div>
          ))}
          {calendarDays.map((day, i) => {
            const dayEvents = getDayEvents(day);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const currentMonth = isSameMonth(day, monthStart);
            
            return (
              <div 
                key={i} 
                onClick={() => onDateClick(day)}
                className={cn(
                  "relative h-20 md:h-28 p-2 border-r border-b border-slate-100 transition-all cursor-pointer hover:bg-slate-50",
                  !currentMonth && "bg-slate-50/30 opacity-40 grayscale",
                  isToday && !isSelected && "bg-slate-100/60",
                  isSelected && "bg-indigo-50/50 ring-2 ring-inset ring-indigo-600 z-10"
                )}
              >
                <span className={cn(
                  "text-[11px] font-black",
                  isSelected ? "text-indigo-600" : isToday ? "text-[#1e1b4b]" : "text-slate-400"
                )}>
                  {format(day, 'd')}
                  {isToday && <span className="ml-1 text-[7px] font-black uppercase text-indigo-600">Now</span>}
                </span>
                
                <div className="mt-1 space-y-1 overflow-hidden">
                   {dayEvents.slice(0, 2).map(e => (
                     <div key={e.id} className={cn("px-1.5 py-0.5 text-[7px] font-black uppercase truncate rounded-[2px] border", (eventTypeColors as any)[e.type])}>
                        {e.title}
                     </div>
                   ))}
                   {dayEvents.length > 2 && (
                     <div className="text-[7px] font-black text-slate-300 uppercase tracking-widest pl-1">
                       + {dayEvents.length - 2} More
                     </div>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events Sidebar */}
      <div className="w-full lg:w-96 bg-slate-50/50 flex flex-col h-full overflow-y-auto no-scrollbar">
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[11px] font-black text-[#1e1b4b] uppercase tracking-widest">
              {format(selectedDate, 'EEEE, MMM do')}
            </h4>
            <button 
              onClick={() => setIsAddingEvent(true)}
              className="w-8 h-8 bg-[#1e1b4b] text-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(245,158,11,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
             {getDayEvents(selectedDate).length === 0 ? (
               <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-white border border-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-slate-200" />
                  </div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                    No active events<br/>for this date
                  </p>
               </div>
             ) : (
               getDayEvents(selectedDate).map(e => (
                 <div key={e.id} className="p-4 bg-white border border-slate-200 shadow-sm transition-all hover:border-indigo-600 group">
                    <div className="flex items-center justify-between mb-2">
                       <span className={cn("px-2 py-0.5 text-[7px] font-black uppercase tracking-widest border rounded-[2px]", (eventTypeColors as any)[e.type])}>
                         {e.type.replace('-', ' ')}
                       </span>
                       <span className="text-[10px] font-black text-[#1e1b4b]">{e.time}</span>
                    </div>
                    <h5 className="text-[12px] font-black text-[#1e1b4b] uppercase mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{e.title}</h5>
                    <div className="flex items-center gap-2 text-slate-400">
                       <MapPin className="w-3 h-3" />
                       <span className="text-[9px] font-bold uppercase">{e.location}</span>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>

        {/* Form Modal (Simple Inline) */}
        <AnimatePresence>
          {isAddingEvent && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden shadow-inner"
            >
              <div className="p-6 bg-[#1e1b4b] text-white space-y-4">
                 <div className="flex items-center justify-between">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Add New Entry</h4>
                    <button onClick={() => setIsAddingEvent(false)}><X className="w-4 h-4 text-slate-400" /></button>
                 </div>
                 
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Entry Subject</label>
                      <input 
                        required
                        type="text"
                        value={newEvent.title}
                        onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                        className="w-full h-10 px-3 bg-white/10 border border-white/10 text-[11px] font-bold outline-none focus:border-indigo-400 transition-all text-white"
                        placeholder="e.g. Science Chapter 2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Entry Type</label>
                        <select 
                          value={newEvent.type}
                          onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                          className="w-full h-10 px-2 bg-white/10 border border-white/10 text-[11px] font-bold outline-none focus:border-indigo-400 transition-all text-white appearance-none"
                        >
                          <option value="teaching" className="text-slate-900">Teaching</option>
                          <option value="assignment" className="text-slate-900">Assignment</option>
                          <option value="meeting" className="text-slate-900">Meeting</option>
                          <option value="school-event" className="text-slate-900">School Event</option>
                          <option value="exam" className="text-slate-900">Exam</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Time</label>
                        <input 
                          required
                          type="time"
                          value={newEvent.time}
                          onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                          className="w-full h-10 px-3 bg-white/10 border border-white/10 text-[11px] font-bold outline-none focus:border-indigo-400 transition-all text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Location / Room</label>
                      <input 
                        required
                        type="text"
                        value={newEvent.location}
                        onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                        className="w-full h-10 px-3 bg-white/10 border border-white/10 text-[11px] font-bold outline-none focus:border-indigo-400 transition-all text-white"
                        placeholder="e.g. Room 204"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full h-11 bg-white text-[#1e1b4b] text-[10px] font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_#818cf8] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                    >
                      Create Entry
                    </button>
                 </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProfileSettingsModal({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: any }) {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'notifications' | 'language' | 'accessibility'>('info');
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Abeba Haile',
    email: user?.email || 'abeba.haile@school.edu',
    phone: '+251 911 223 344',
    bio: 'Primary Mathematics Teacher with 8 years of experience. Dedicated to student growth and interactive learning.',
    role: 'Senior Educator'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    browserNotifications: true,
    assignmentUpdates: true,
    parentMessages: true,
    schoolEvents: false
  });

  const [language, setLanguage] = useState('English');
  const [fontSize, setFontSize] = useState('medium');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'small') root.style.fontSize = '14px';
    else if (fontSize === 'large') root.style.fontSize = '18px';
    else root.style.fontSize = '16px';
    
    return () => { root.style.fontSize = '16px'; };
  }, [fontSize]);

  const languages = [
    { name: 'English', local: 'English' },
    { name: 'Amharic', local: 'አማርኛ' },
    { name: 'Oromo', local: 'Afaan Oromoo' },
    { name: 'Tigrinya', local: 'ትግርኛ' },
    { name: 'Somali', local: 'Soomaaliga' }
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl bg-white border border-slate-950 shadow-[16px_16px_0px_0px_rgba(30,27,75,1)] flex flex-col md:flex-row h-[90vh] md:h-[700px] overflow-hidden"
      >
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 md:p-6 flex flex-col">
          <div className="mb-4 md:mb-8 hidden md:block">
             <h3 className="text-sm font-black text-[#1e1b4b] uppercase tracking-tight mb-1">Account & Settings</h3>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control your experience</p>
          </div>

          <nav className="flex flex-row md:flex-col gap-1 md:space-y-2 flex-1 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {[
              { id: 'info', label: 'Info', fullLabel: 'Teacher Info', icon: <UserIcon className="w-4 h-4 md:w-4 md:h-4" /> },
              { id: 'security', label: 'Security', fullLabel: 'Security', icon: <Lock className="w-4 h-4 md:w-4 md:h-4" /> },
              { id: 'notifications', label: 'Notifs', fullLabel: 'Notifications', icon: <Bell className="w-4 h-4 md:w-4 md:h-4" /> },
              { id: 'language', label: 'Lang', fullLabel: 'Language', icon: <Languages className="w-4 h-4 md:w-4 md:h-4" /> },
              { id: 'accessibility', label: 'Access', fullLabel: 'Accessibility', icon: <Info className="w-4 h-4 md:w-4 md:h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-shrink-0 md:w-full flex flex-col md:flex-row items-center gap-2 md:gap-3 px-3 md:px-4 py-3 md:py-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all border md:border-none",
                  activeTab === tab.id 
                    ? "bg-[#1e1b4b] text-white shadow-[2px_2px_0px_0px_#f59e0b] md:shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] border-transparent" 
                    : "text-slate-500 hover:bg-slate-100 border-slate-100"
                )}
              >
                {tab.icon}
                <span className="md:hidden">{tab.label}</span>
                <span className="hidden md:block">{tab.fullLabel}</span>
              </button>
            ))}
          </nav>

          <button 
            onClick={onClose}
            className="mt-2 md:mt-6 hidden md:flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#1e1b4b] transition-colors"
          >
            <X className="w-4 h-4" />
            Close Settings
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-white">
          <div className="p-4 md:p-8 flex-1">
             <AnimatePresence mode="wait">
               {activeTab === 'info' && (
                 <motion.div 
                   key="info"
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   className="space-y-6 md:space-y-8"
                 >
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pb-6 md:pb-8 border-b border-slate-50">
                       <div className="relative group">
                          <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-slate-100">
                             <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profileData.name}`} />
                             <AvatarFallback className="bg-indigo-600 text-white text-xl md:text-2xl font-black">{profileData.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <button className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-7 h-7 md:w-8 md:h-8 bg-amber-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                             <Edit className="w-3 h-3 text-[#1e1b4b]" />
                          </button>
                       </div>
                       <div className="text-center sm:text-left">
                          <h4 className="text-lg md:text-xl font-bold text-[#1e1b4b]">{profileData.name}</h4>
                          <p className="text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-2">{profileData.role}</p>
                          <span className="px-3 py-1 bg-slate-50 border border-slate-100 text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tight rounded-full">ID: EDU-2024-8832</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                       <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                          <input 
                            type="text" 
                            value={profileData.name}
                            onChange={e => setProfileData({...profileData, name: e.target.value})}
                            className="w-full h-10 md:h-12 px-3 md:px-4 bg-slate-50 border-none text-[11px] md:text-[12px] font-black outline-none focus:ring-2 ring-indigo-600" 
                          />
                       </div>
                       <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                          <input 
                            type="email" 
                            value={profileData.email}
                            onChange={e => setProfileData({...profileData, email: e.target.value})}
                            className="w-full h-10 md:h-12 px-3 md:px-4 bg-slate-50 border-none text-[11px] md:text-[12px] font-black outline-none focus:ring-2 ring-indigo-600" 
                          />
                       </div>
                       <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                          <input 
                            type="text" 
                            value={profileData.phone}
                            onChange={e => setProfileData({...profileData, phone: e.target.value})}
                            className="w-full h-10 md:h-12 px-3 md:px-4 bg-slate-50 border-none text-[11px] md:text-[12px] font-black outline-none focus:ring-2 ring-indigo-600" 
                          />
                       </div>
                       <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Specialization</label>
                          <input 
                            type="text" 
                            disabled
                            value="Mathematics"
                            className="w-full h-10 md:h-12 px-3 md:px-4 bg-slate-100 border-none text-[11px] md:text-[12px] font-black text-slate-400 cursor-not-allowed" 
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Professional Bio</label>
                       <textarea 
                         rows={3}
                         value={profileData.bio}
                         onChange={e => setProfileData({...profileData, bio: e.target.value})}
                         className="w-full p-3 md:p-4 bg-slate-50 border-none text-[11px] md:text-[12px] font-medium outline-none focus:ring-2 ring-indigo-600 resize-none leading-relaxed" 
                       />
                    </div>
                 </motion.div>
               )}

               {activeTab === 'security' && (
                 <motion.div 
                   key="security"
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   className="space-y-8"
                 >
                    <div className="p-6 bg-slate-50 border border-slate-100 flex items-center gap-4">
                       <div className="w-12 h-12 bg-white text-[#1e1b4b] flex items-center justify-center shadow-sm">
                          <ShieldCheck className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="text-[12px] font-black text-[#1e1b4b] uppercase tracking-tight">Security & Privacy</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Protect your account access</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Current Password</label>
                          <input 
                            type="password" 
                            className="w-full h-12 px-4 bg-slate-50 border-none text-[12px] font-black outline-none focus:ring-2 ring-indigo-600" 
                            placeholder="••••••••"
                          />
                       </div>
                       <Separator />
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">New Password</label>
                            <input 
                              type="password" 
                              className="w-full h-12 px-4 bg-slate-50 border-none text-[12px] font-black outline-none focus:ring-2 ring-indigo-600" 
                              placeholder="Min 8 characters"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Confirm New Password</label>
                            <input 
                              type="password" 
                              className="w-full h-12 px-4 bg-slate-50 border-none text-[12px] font-black outline-none focus:ring-2 ring-indigo-600" 
                            />
                         </div>
                       </div>
                    </div>

                    <div className="p-6 border border-emerald-100 bg-emerald-50/30">
                       <div className="flex items-center gap-3 mb-4">
                          <Activity className="w-4 h-4 text-emerald-600" />
                          <h5 className="text-[10px] font-black text-emerald-900 uppercase">Login History</h5>
                       </div>
                       <div className="space-y-3">
                          {[
                            { device: 'MacBook Pro - Chrome', location: 'Addis Ababa, ET', time: 'Active Now' },
                            { device: 'iPhone 15 Pro', location: 'Addis Ababa, ET', time: '2 hours ago' }
                          ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between">
                               <p className="text-[10px] font-bold text-slate-700">{log.device} <span className="mx-2 text-slate-300">|</span> <span className="text-slate-400">{log.location}</span></p>
                               <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-100 px-1.5 py-0.5">{log.time}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'notifications' && (
                 <motion.div 
                   key="notifications"
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   className="space-y-6 md:space-y-8"
                 >
                    <div className="space-y-3 md:space-y-4">
                       <h4 className="text-[9px] md:text-[10px] font-black text-[#1e1b4b] uppercase tracking-widest mb-4">Channel Preferences</h4>
                       {[
                         { id: 'emailAlerts', label: 'Email Notifications', desc: 'Direct alerts to your email' },
                         { id: 'browserNotifications', label: 'Push Notifications', desc: 'Alerts on this browser' },
                         { id: 'assignmentUpdates', label: 'Assignment Updates', desc: 'Alert when students submit' },
                         { id: 'parentMessages', label: 'Parent Messages', desc: 'Real-time alert for chats' }
                       ].map((item) => (
                         <div key={item.id} className="flex items-center justify-between p-4 md:p-5 bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                            <div className="max-w-[70%] md:max-w-[80%]">
                               <h5 className="text-[10px] md:text-[11px] font-black text-[#1e1b4b] uppercase mb-0.5 md:mb-1">{item.label}</h5>
                               <p className="text-[8px] md:text-[9px] font-medium text-slate-400">{item.desc}</p>
                            </div>
                            <button 
                              onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                              className={cn(
                                "w-10 md:w-12 h-5 md:h-6 rounded-none p-1 transition-all flex items-center",
                                notifications[item.id as keyof typeof notifications] ? "bg-indigo-600 justify-end" : "bg-slate-200 justify-start"
                              )}
                            >
                               <div className="w-3 md:w-4 h-3 md:h-4 bg-white shadow-sm" />
                            </button>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}

               {activeTab === 'language' && (
                 <motion.div 
                   key="language"
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   className="space-y-6 md:space-y-8"
                 >
                    <div className="p-6 md:p-10 text-center border-b border-slate-50">
                       <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4 md:mb-6 text-indigo-600">
                          <Globe className="w-6 h-6 md:w-8 md:h-8" />
                       </div>
                       <h4 className="text-base md:text-lg font-bold text-[#1e1b4b] mb-1 md:mb-2">Display Language</h4>
                       <p className="text-[12px] md:text-sm text-slate-400 max-w-sm mx-auto">Choose your preferred language for the interface.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                       {languages.map((lang) => (
                         <button 
                           key={lang.name}
                           onClick={() => setLanguage(lang.name)}
                           className={cn(
                             "p-3 md:p-5 flex items-center justify-between border-2 transition-all",
                             language === lang.name ? "border-[#1e1b4b] bg-[#1e1b4b]/5 shadow-sm" : "border-slate-100 hover:border-slate-200"
                           )}
                         >
                            <div className="flex items-center gap-3 md:gap-4">
                               <div className={cn("w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xs md:text-sm font-black border", language === lang.name ? "bg-[#1e1b4b] text-white border-transparent" : "bg-slate-50 text-slate-400 border-slate-100")}>
                                  {lang.name.slice(0, 2).toUpperCase()}
                               </div>
                               <div className="text-left">
                                  <h6 className="text-[10px] md:text-[12px] font-black text-[#1e1b4b] uppercase leading-none mb-0.5 md:mb-1">{lang.name}</h6>
                                  <p className="text-[9px] md:text-[11px] font-medium text-slate-400">{lang.local}</p>
                               </div>
                            </div>
                            {language === lang.name && (
                              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#1e1b4b]" />
                            )}
                         </button>
                       ))}
                    </div>
                 </motion.div>
               )}

               {activeTab === 'accessibility' && (
                 <motion.div 
                   key="accessibility"
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   className="space-y-8"
                 >
                    <div className="p-8 text-center border-b border-slate-50">
                       <div className="w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6 text-indigo-600">
                          <Eye className="w-8 h-8" />
                       </div>
                       <h4 className="text-lg font-bold text-[#1e1b4b] mb-2">Accessibility Settings</h4>
                       <p className="text-sm text-slate-400 max-w-sm mx-auto">Adjust the interface to better fit your visual and usage needs.</p>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-[#1e1b4b] uppercase tracking-widest">System Font Size</label>
                          <div className="grid grid-cols-3 gap-3">
                             {[
                               { id: 'small', label: 'Small', size: '14px' },
                               { id: 'medium', label: 'Normal', size: '16px' },
                               { id: 'large', label: 'Large', size: '18px' }
                             ].map((opt) => (
                               <button
                                 key={opt.id}
                                 onClick={() => setFontSize(opt.id)}
                                 className={cn(
                                   "p-4 border-2 transition-all flex flex-col items-center justify-center gap-2",
                                   fontSize === opt.id ? "border-[#1e1b4b] bg-[#1e1b4b]/5 shadow-sm" : "border-slate-100 hover:border-slate-200"
                                 )}
                               >
                                 <span className="text-xs font-black uppercase tracking-tight">{opt.label}</span>
                                 <span style={{ fontSize: opt.size }} className="font-bold text-slate-400">Aa</span>
                               </button>
                             ))}
                          </div>
                          <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">Changes will apply to the entire platform interface for a better reading experience.</p>
                       </div>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0">
             <button 
               onClick={onClose}
               className="px-4 md:px-6 h-10 md:h-11 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#1e1b4b] hover:bg-slate-100 transition-all"
             >
               Discard
             </button>
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className="px-6 md:px-10 h-10 md:h-11 bg-[#1e1b4b] text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#f59e0b] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all disabled:opacity-50 flex items-center justify-center gap-2 md:gap-3"
             >
               {isSaving ? (
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 <>
                   <Check className="w-4 h-4" />
                   Save Changes
                 </>
               )}
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function NotificationsView({ grade, section, onNavigate }: { grade: string, section: string, onNavigate: (tab: string) => void }) {
  const [notifications, setNotifications] = useState([
    { 
      id: 'n1', 
      type: 'parent-message', 
      title: 'New Message from Mrs. Sarah', 
      desc: 'Regarding the upcoming project submission for John Doe.', 
      time: '10 mins ago', 
      read: false, 
      action: 'Reply',
      targetTab: 'messages'
    },
    { 
      id: 'n2', 
      type: 'assignment-deadline', 
      title: 'Deadline Approaching: Math Quiz', 
      desc: 'Assignment "Quadratic Equations" is due in 4 hours.', 
      time: '2 hours ago', 
      read: false, 
      action: 'Manage',
      targetTab: 'homeworks'
    },
    { 
      id: 'n3', 
      type: 'meeting-reminder', 
      title: 'Department Meeting in 30m', 
      desc: 'Curriculum review meeting in Conference Room B.', 
      time: '30 mins ago', 
      read: true, 
      action: 'View Details',
      targetTab: 'schedule'
    },
    { 
      id: 'n4', 
      type: 'attendance-alert', 
      title: 'High Absence Alert', 
      desc: '5 students marked absent in Section A today.', 
      time: '1 hour ago', 
      read: false, 
      action: 'Review',
      targetTab: 'attendance'
    },
    { 
      id: 'n5', 
      type: 'school-announcement', 
      title: 'School Closure (Maintenance)', 
      desc: 'The school will be closed this Friday for scheduled technical maintenance.', 
      time: '5 hours ago', 
      read: true, 
      action: 'Read More',
      targetTab: 'dashboard'
    },
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'parent-message': return <MessageSquare className="w-4 h-4" />;
      case 'assignment-deadline': return <Clock className="w-4 h-4" />;
      case 'meeting-reminder': return <Calendar className="w-4 h-4" />;
      case 'attendance-alert': return <Users className="w-4 h-4" />;
      case 'school-announcement': return <Megaphone className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case 'parent-message': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'assignment-deadline': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'meeting-reminder': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'attendance-alert': return 'bg-red-50 text-red-600 border-red-100';
      case 'school-announcement': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 md:p-6 border border-slate-950 shadow-[4px_4px_0px_0px_rgba(30,27,75,1)] md:shadow-[6px_6px_0px_0px_rgba(30,27,75,1)] gap-4 sm:gap-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1e1b4b] text-white flex items-center justify-center shadow-[3px_3px_0px_0px_#f59e0b] md:shadow-[4px_4px_0px_0px_#f59e0b]">
            <Bell className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-[#1e1b4b] uppercase tracking-tight">Notification Center</h2>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] md:tracking-[0.2em]">Manage your alerts & reminders</p>
          </div>
        </div>
        <button 
          onClick={markAllRead}
          className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all"
        >
          Mark all read
        </button>
      </div>

      <div className="space-y-2 md:space-y-3">
        {notifications.map((n) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={n.id} 
            className={cn(
              "p-4 md:p-5 flex items-start gap-4 md:gap-5 border transition-all relative overflow-hidden group",
              n.read ? "bg-white border-slate-100" : "bg-indigo-50/30 border-indigo-200 shadow-sm"
            )}
          >
            {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />}
            
            <div className={cn("w-9 h-9 md:w-10 md:h-10 shrink-0 flex items-center justify-center border", getColor(n.type))}>
              {getIcon(n.type)}
            </div>

            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between mb-1">
                 <h4 className={cn("text-[11px] md:text-[13px] font-black uppercase tracking-tight truncate pr-2", n.read ? "text-[#1e1b4b]" : "text-indigo-900")}>
                   {n.title}
                 </h4>
                 <span className="text-[8px] md:text-[10px] font-bold text-slate-400 shrink-0">{n.time}</span>
               </div>
               <p className="text-[12px] md:text-sm text-slate-500 font-medium leading-relaxed mb-3 md:mb-4">{n.desc}</p>
               <div className="flex items-center gap-3">
                 <button 
                   onClick={() => onNavigate(n.targetTab)}
                   className="h-7 md:h-8 px-3 md:px-4 bg-[#1e1b4b] text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(245,158,11,1)] transition-all flex items-center justify-center gap-2"
                 >
                   <span>{n.action}</span>
                   <ChevronRight className="w-2.5 h-2.5 md:w-3 md:h-3" />
                 </button>
                 {!n.read && (
                   <button className="text-[8px] md:text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Dismiss</button>
                 )}
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function HomeworkView({ grade, section }: { grade: string, section: string }) {
  const [homeworks, setHomeworks] = useState([
    { id: 'h1', title: 'Quadratic Equations Practice', subject: 'Mathematics', createdAt: '2024-05-10', dueDate: '2024-05-12', description: 'Solve problems 1-20 in Chapter 4. Show steps for each.', confirmations: 32, total: 42 },
    { id: 'h2', title: 'Solar System Components', subject: 'Science', createdAt: '2024-05-11', dueDate: '2024-05-13', description: 'Create a list of all planets and their primary characteristics.', confirmations: 28, total: 42 },
    { id: 'h3', title: 'Amharic Grammar Revision', subject: 'Amharic', createdAt: '2024-05-12', dueDate: '2024-05-14', description: 'Identify active and passive voices in the provided passage.', confirmations: 15, total: 42 },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [viewingConfirmations, setViewingConfirmations] = useState<any | null>(null);
  const [newHomework, setNewHomework] = useState({
    title: '',
    subject: 'Mathematics',
    dueDate: '',
    description: ''
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `h-${Date.now()}`;
    setHomeworks([{ 
      ...newHomework, 
      id, 
      createdAt: new Date().toISOString().split('T')[0], 
      confirmations: 0, 
      total: 42 
    }, ...homeworks]);
    setIsCreating(false);
    setNewHomework({ title: '', subject: 'Mathematics', dueDate: '', description: '' });
  };

  const MOCK_PARENT_CONFIRMATIONS = [
    { id: 'p1', parentName: 'Abebe Kebede', studentName: 'Samuel Alemu', confirmedAt: '2024-05-10 18:45', status: 'Confirmed' },
    { id: 'p2', parentName: 'Hiwot Tadesse', studentName: 'Hanna Girmay', confirmedAt: '2024-05-11 07:20', status: 'Confirmed' },
    { id: 'p3', parentName: 'Mulugeta Bekele', studentName: 'Dagim Solomon', confirmedAt: '', status: 'Pending' },
    { id: 'p4', parentName: 'Zewditu Haile', studentName: 'Lily Yohannes', confirmedAt: '', status: 'Seen' },
  ];

  if (viewingConfirmations) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setViewingConfirmations(null)}
              className="w-10 h-10 border border-slate-950 flex items-center justify-center hover:bg-slate-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-[14px] font-black text-[#1e1b4b] uppercase tracking-tight leading-none mb-1">
                Parent Acknowledgments
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {viewingConfirmations.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase rounded-full">
              {viewingConfirmations.confirmations} / {viewingConfirmations.total} CONFIRMED
            </div>
          </div>
        </div>

        <Card className="rounded-none border-slate-200 shadow-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Parent Name</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Acknowledgment Date</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_PARENT_CONFIRMATIONS.map((pc) => (
                  <tr key={pc.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-black text-[#1e1b4b] uppercase">{pc.parentName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{pc.studentName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{pc.confirmedAt || '--'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border rounded-full",
                        pc.status === 'Confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        pc.status === 'Seen' ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-slate-50 text-slate-300 border-slate-100"
                      )}>
                        {pc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-500 text-white flex items-center justify-center border border-slate-950 shadow-[3px_3px_0px_0px_rgba(30,27,75,1)]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-[14px] font-black text-[#1e1b4b] uppercase tracking-tight leading-none mb-1">Homework Tracker</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Daily assignments & parent engagement</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsCreating(true)}
          className="h-11 px-6 bg-[#1e1b4b] text-white text-[10px] font-black uppercase tracking-[0.15em] shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(245,158,11,1)] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Assign Homework
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="p-6 bg-slate-50 border border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1e1b4b]">New Homework Assignment</h4>
                 <button onClick={() => setIsCreating(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Homework Title</label>
                    <input 
                      required
                      type="text"
                      value={newHomework.title}
                      onChange={e => setNewHomework({...newHomework, title: e.target.value})}
                      placeholder="e.g. Chapter 4 Practice"
                      className="w-full h-11 px-4 bg-white border border-slate-200 text-[11px] font-bold outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
                      <select 
                        value={newHomework.subject}
                        onChange={e => setNewHomework({...newHomework, subject: e.target.value})}
                        className="w-full h-11 px-4 bg-white border border-slate-200 text-[11px] font-bold outline-none focus:border-amber-500 appearance-none"
                      >
                        <option>Mathematics</option>
                        <option>Science</option>
                        <option>Amharic</option>
                        <option>English</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Due Date</label>
                      <input 
                        required
                        type="date"
                        value={newHomework.dueDate}
                        onChange={e => setNewHomework({...newHomework, dueDate: e.target.value})}
                        className="w-full h-11 px-4 bg-white border border-slate-200 text-[11px] font-bold outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="space-y-1.5 h-full flex flex-col">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Instructions</label>
                    <textarea 
                      required
                      value={newHomework.description}
                      onChange={e => setNewHomework({...newHomework, description: e.target.value})}
                      placeholder="Provide details on the homework..."
                      className="w-full flex-1 min-h-[114px] p-4 bg-white border border-slate-200 text-[11px] font-bold outline-none focus:border-amber-500 resize-none"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                   <button type="submit" className="w-full h-12 bg-[#1e1b4b] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-[3px_3px_0px_0px_rgba(245,158,11,1)]">
                     Send to Parents & Students
                   </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeworks.map((hw) => (
          <Card key={hw.id} className="rounded-none border-slate-200 shadow-none hover:shadow-[4px_4px_0px_0px_rgba(30,27,75,0.05)] transition-all bg-white flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-50 flex items-start justify-between">
              <div>
                <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 uppercase tracking-widest border border-amber-100">
                  {hw.subject}
                </span>
                <h4 className="text-[13px] font-black text-[#1e1b4b] uppercase mt-2 tracking-tight">{hw.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                   <span className="text-[8px] font-bold text-slate-400 uppercase">Issued: {hw.createdAt}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-[#1e1b4b]">{hw.dueDate}</span>
                <span className="text-[7px] font-bold text-slate-400 uppercase">Deadline</span>
              </div>
            </div>
            
            <div className="p-5 flex-1 bg-slate-50/50">
               <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic mb-5 line-clamp-3">
                 "{hw.description}"
               </p>
               
               <div className="flex items-end justify-between">
                  <div className="w-1/2">
                    <span className="text-[7px] font-black text-slate-400 uppercase block mb-1">Parent Engagement</span>
                    <div className="flex items-center gap-2">
                       <span className="text-xl font-black text-[#1e1b4b]">{hw.confirmations}</span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase">/ {hw.total}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewingConfirmations(hw)}
                    className="flex-1 max-w-[120px] h-9 bg-white border border-slate-950 text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1e1b4b] hover:text-white transition-all"
                  >
                    <Eye className="w-3 h-3" />
                    Tracking
                  </button>
               </div>
               
               <div className="mt-4 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${(hw.confirmations/hw.total)*100}%` }} />
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GradeView({ grade, section }: { grade: string, section: string }) {
  const [viewMode, setViewMode] = useState<'tasks' | 'gradebook'>('tasks');
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const MOCK_TASKS = [
    { id: 't1', title: 'Algebra Midterm', type: 'Exam', graded: 35, total: 42, status: 'Grading' },
    { id: 't2', title: 'Newtonian Laws Quiz', type: 'Quiz', graded: 42, total: 42, status: 'Completed' },
    { id: 't3', title: 'Geometry Project', type: 'Assignment', graded: 10, total: 42, status: 'Active' },
    { id: 't4', title: 'Unit 1 Test', type: 'Exam', graded: 42, total: 42, status: 'Completed' },
  ];

  const MOCK_GRADES = MOCK_STUDENTS_LIST.map(s => ({
    ...s,
    grades: {
      't1': Math.floor(Math.random() * 40) + 60,
      't2': Math.floor(Math.random() * 40) + 60,
      't3': Math.floor(Math.random() * 40) + 60,
      't4': Math.floor(Math.random() * 40) + 60,
    }
  }));

  const studentAverages = MOCK_GRADES.map(s => {
    const grades = Object.values(s.grades);
    const avg = Math.round(grades.reduce((a, b) => a + b, 0) / grades.length);
    return { ...s, avg };
  });

  const classAvg = studentAverages.length > 0 
    ? Math.round(studentAverages.reduce((a, b) => a + b.avg, 0) / studentAverages.length) 
    : 0;

  const sortedAverages = [...studentAverages].sort((a, b) => b.avg - a.avg);
  const topStudent = sortedAverages[0];
  const atRiskStudents = studentAverages.filter(s => s.avg < 70).sort((a, b) => a.avg - b.avg);

  const handleExport = () => {
    alert("Exporting Gradebook as CSV...");
  };

  const handleImport = () => {
    alert("System ready to parse grades from file. Verification successful.");
    setIsImporting(false);
  };

  if (selectedTask) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedTask(null)}
              className="w-10 h-10 border border-slate-950 flex items-center justify-center hover:bg-slate-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-[14px] font-black text-[#1e1b4b] uppercase tracking-tight leading-none mb-1">Grading: {selectedTask.title}</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{selectedTask.graded} of {selectedTask.total} graded</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsImporting(true)}
              className="px-4 py-2 bg-white border border-slate-950 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              Import Scores
            </button>
            <button className="px-4 py-2 bg-[#1e1b4b] text-white text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
              Save All
            </button>
          </div>
        </div>

        {isImporting && (
          <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
             <Upload className="w-8 h-8 text-slate-400 mb-3" />
             <p className="text-[10px] font-black uppercase text-slate-900 mb-2">Drop grade file here or click to upload</p>
             <p className="text-[8px] font-bold text-slate-400 uppercase mb-4">Supported formats: .CSV, .XLSX (System will auto-map ID numbers)</p>
             <div className="flex gap-2">
                <Button onClick={handleImport} className="h-8 rounded-none bg-[#1e1b4b] text-white text-[9px] font-black uppercase px-4">Process File</Button>
                <Button variant="ghost" onClick={() => setIsImporting(false)} className="h-8 rounded-none text-[9px] font-black uppercase px-4">Cancel</Button>
             </div>
          </div>
        )}

        <div className="space-y-3">
          {MOCK_STUDENTS_LIST.slice(0, 8).map((student) => (
            <Card key={student.id} className="rounded-none border border-slate-200 shadow-none hover:border-slate-400 transition-all">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-slate-100">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                    <AvatarFallback className="font-black text-[10px]">{student.name.slice(0,2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-[11px] font-black text-[#1e1b4b] uppercase leading-none mb-1">{student.name}</h4>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{student.idNumber}</span>
                  </div>
                </div>

                <div className="flex flex-1 items-center gap-4 max-w-lg">
                   <div className="flex flex-col flex-1">
                     <span className="text-[7px] font-black text-slate-400 uppercase mb-1">Feedback</span>
                     <textarea 
                       placeholder="Enter feedback..."
                       className="w-full bg-slate-50 border border-slate-100 p-2 text-[10px] font-medium outline-none focus:border-indigo-600 resize-none h-10"
                     />
                   </div>
                   <div className="w-24">
                     <span className="text-[7px] font-black text-slate-400 uppercase mb-1">Score / 100</span>
                     <input 
                       type="text" 
                       placeholder="--"
                       className="w-full bg-white border border-slate-200 h-10 px-3 text-[12px] font-black text-center focus:border-indigo-600 outline-none"
                     />
                   </div>
                   <button className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                     <Check className="w-4 h-4" />
                   </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header & View Switch */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#1e1b4b] text-white flex items-center justify-center border border-slate-950 shadow-[3px_3px_0px_0px_rgba(79,70,229,1)]">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-[14px] font-black text-[#1e1b4b] uppercase tracking-tight leading-none mb-1">
              {viewMode === 'tasks' ? 'Grading Hub' : 'Full Gradebook'}
            </h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Grade 12A • Physics & Mathematics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex border border-slate-950 p-1 bg-white">
            <button 
              onClick={() => setViewMode('tasks')}
              className={cn(
                "px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all",
                viewMode === 'tasks' ? "bg-[#1e1b4b] text-white" : "hover:bg-slate-50"
              )}
            >
              Assessments
            </button>
            <button 
              onClick={() => setViewMode('gradebook')}
              className={cn(
                "px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all",
                viewMode === 'gradebook' ? "bg-[#1e1b4b] text-white" : "hover:bg-slate-50"
              )}
            >
              Gradebook
            </button>
          </div>
          
          <button 
            onClick={() => setShowAnalytics(true)}
            className="w-11 h-11 border border-slate-950 flex items-center justify-center hover:bg-slate-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
          >
            <Info className="w-5 h-5 text-[#1e1b4b]" />
          </button>
        </div>
      </div>

      {/* Class Analytics Overlay */}
      <AnimatePresence>
        {showAnalytics && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-slate-950 shadow-[10px_10px_0px_0px_rgba(30,27,75,1)] w-full max-w-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <div className="w-full md:w-1/3 bg-[#1e1b4b] p-8 text-white flex flex-col justify-between">
                <div>
                   <Trophy className="w-10 h-10 mb-4 text-amber-400" />
                   <h4 className="text-[12px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Avg. Score</h4>
                   <p className="text-5xl font-black">{classAvg}%</p>
                </div>
                <div className="mt-8 space-y-4">
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-widest block mb-1 opacity-50">Top Student</span>
                    <span className="text-[10px] font-black uppercase">
                      {topStudent ? `${topStudent.name} (${topStudent.avg}%)` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-widest block mb-1 opacity-50">Students at Risk</span>
                    <span className="text-[12px] font-black text-red-400">{atRiskStudents.length} Students</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAnalytics(false)}
                  className="mt-12 py-3 border border-indigo-400 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all font-bold"
                >
                  Close Analysis
                </button>
              </div>

              <div className="flex-1 p-8 space-y-8 bg-white overflow-y-auto max-h-[70vh] no-scrollbar">
                <div>
                  <h5 className="text-[11px] font-black uppercase tracking-widest text-[#1e1b4b] mb-4 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    Struggling (At Risk)
                  </h5>
                  <div className="space-y-3">
                    {atRiskStudents.length > 0 ? atRiskStudents.map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-red-50 border border-red-100">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-white border border-red-200 flex items-center justify-center text-[10px] font-black text-red-500">
                             {s.name.slice(0,2)}
                           </div>
                           <span className="text-[10px] font-black uppercase text-red-700">{s.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-red-600">{s.avg}%</span>
                      </div>
                    )) : (
                      <p className="text-[10px] font-bold text-slate-400 uppercase italic">No students currently at high risk.</p>
                    )}
                  </div>
                </div>

                <div>
                   <h5 className="text-[11px] font-black uppercase tracking-widest text-[#1e1b4b] mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-600" />
                    Performance Target
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-1">
                      <span>Current Progress</span>
                      <span>Goal: 90%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-none relative">
                       <div className="h-full bg-indigo-600" style={{ width: `${classAvg}%` }} />
                       <div className="absolute top-0 right-[10%] h-full w-0.5 bg-red-500" />
                    </div>
                    <p className="text-[8px] font-bold text-slate-400 italic">
                      {90 - classAvg > 0 
                        ? `${(90 - classAvg).toFixed(1)}% increase required to meet semester goal.`
                        : "Goal met! Maintain current performance."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {viewMode === 'tasks' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TASKS.map((task) => (
            <Card key={task.id} className="rounded-none border border-slate-200 shadow-none hover:shadow-[4px_4px_0px_0px_rgba(30,27,75,0.05)] transition-all flex flex-col group overflow-hidden">
               <div className="p-5 border-b border-slate-50 flex items-start justify-between">
                 <div className="flex flex-col gap-1">
                    <span className={cn(
                      "px-2 py-0.5 text-[7px] font-black uppercase tracking-widest border self-start",
                      task.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                    )}>
                      {task.status}
                    </span>
                    <h4 className="text-[13px] font-black text-[#1e1b4b] uppercase mt-1.5 tracking-tight">{task.title}</h4>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{task.type}</span>
                 </div>
                 <div className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#1e1b4b] group-hover:text-white transition-all">
                    <Edit className="w-4 h-4" />
                 </div>
               </div>
               
               <div className="p-5 flex-1 bg-white">
                 <div className="flex items-end justify-between mb-4">
                    <div className="flex flex-col">
                       <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Graded</span>
                       <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-[#1e1b4b]">{task.graded}</span>
                          <span className="text-[10px] font-bold text-slate-400">/{task.total}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Completion</span>
                       <span className="text-[12px] font-black text-indigo-600">{Math.round((task.graded / task.total) * 100)}%</span>
                    </div>
                 </div>
                 
                 <div className="w-full h-1 bg-slate-100 overflow-hidden mb-5">
                    <div className="h-full bg-indigo-600" style={{ width: `${(task.graded / task.total) * 100}%` }} />
                 </div>

                 <button 
                   onClick={() => setSelectedTask(task)}
                   className="w-full py-2.5 bg-white border border-slate-950 text-[9px] font-black uppercase tracking-widest hover:bg-[#1e1b4b] hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                 >
                   Open Grade Hub
                 </button>
               </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="SEARCH GRADEBOOK..."
                  className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest focus:border-indigo-600 outline-none transition-all shadow-sm"
                />
             </div>
             <button 
               onClick={handleExport}
               className="h-10 px-6 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
             >
               <Download className="w-4 h-4" />
               Export CSV
             </button>
          </div>

          <Card className="rounded-none border border-slate-200 shadow-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1e1b4b] text-white">
                    <th className="px-5 py-4 text-[9px] font-black uppercase tracking-widest sticky left-0 bg-[#1e1b4b] z-20 border-r border-indigo-900/50 min-w-[160px]">Student Registry</th>
                    {MOCK_TASKS.map(task => (
                      <th key={task.id} className="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-center whitespace-nowrap min-w-[100px] border-r border-indigo-900/30">
                        <div className="flex flex-col items-center">
                          <span className="opacity-60 text-[7px] mb-0.5">{task.type}</span>
                          <span>{task.title}</span>
                        </div>
                      </th>
                    ))}
                    <th className="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-right sticky right-0 bg-indigo-900 z-10 border-l border-indigo-700 min-w-[80px]">TOTAL %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_GRADES.map((student) => {
                    const studentTasks = Object.values(student.grades);
                    const average = Math.round(studentTasks.reduce((a, b) => a + b, 0) / studentTasks.length);
                    
                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-all group">
                         <td className="px-5 py-4 sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-100 z-10 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black shrink-0">
                                 {student.name.slice(0,2)}
                               </div>
                               <div className="flex flex-col min-w-0">
                                 <span className="text-[10px] font-black text-[#1e1b4b] uppercase truncate">{student.name}</span>
                                 <span className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter">{student.idNumber}</span>
                               </div>
                            </div>
                         </td>
                         {MOCK_TASKS.map(task => (
                           <td key={task.id} className="px-5 py-4 text-center border-r border-slate-50 last:border-r-0">
                              <span className={cn(
                                "text-[11px] font-black font-mono",
                                student.grades[task.id as keyof typeof student.grades] < 65 ? "text-red-500" : "text-slate-600"
                              )}>
                                {student.grades[task.id as keyof typeof student.grades]}
                              </span>
                           </td>
                         ))}
                         <td className="px-5 py-4 text-right bg-slate-50/80 sticky right-0 z-10 border-l border-slate-100 backdrop-blur-sm group-hover:bg-slate-100/90 transition-colors">
                            <span className={cn(
                              "text-[12px] font-black",
                              average >= 90 ? "text-emerald-600" : average < 65 ? "text-red-600" : "text-[#1e1b4b]"
                            )}>
                              {average}%
                            </span>
                         </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export function TeacherDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Grade/Section selection state
  const [selectedGrade, setSelectedGrade] = useState(MOCK_TEACHER_CONTEXT[0].grade);
  const [selectedSection, setSelectedSection] = useState(MOCK_TEACHER_CONTEXT[0].sections[0]);
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);
  
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const gradeRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gradeRef.current && !gradeRef.current.contains(event.target as Node)) {
        setIsGradeDropdownOpen(false);
      }
      if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
        setIsSectionDropdownOpen(false);
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'attendance', label: 'Attendance', icon: <ClipboardCheck className="w-5 h-5" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <FileText className="w-5 h-5" /> },
    { id: 'grade', label: 'Gradebook', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'student-analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'homeworks', label: 'Homeworks', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="w-5 h-5" /> },
    { id: 'notification', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  ];

  const currentGradeObj = MOCK_TEACHER_CONTEXT.find(g => g.grade === selectedGrade);

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-950">
      {/* App Logo & Assigned School */}
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
              <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-0.5">Teacher Mode</span>
              <h2 className="text-[11px] font-black text-[#1e1b4b] truncate leading-none uppercase tracking-tight">Ethio-Global Academy</h2>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Active Session</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grade & Section Selection - Command Center */}
      <div className={cn("p-4 md:p-6", isSidebarCollapsed && "px-2")}>
        {!isSidebarCollapsed && (
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-3">Teaching Context</p>
        )}
        
        <div className={cn(
          "bg-indigo-50/20 border border-indigo-100/30 p-1 flex flex-row gap-1 shadow-sm rounded-lg mx-1",
          isSidebarCollapsed && "bg-transparent border-0 p-0 shadow-none mx-0"
        )}>
          {/* Grade Selector */}
          <div className="relative group flex-1" ref={gradeRef}>
            <button
              onClick={() => isSidebarCollapsed ? setIsSidebarCollapsed(false) : setIsGradeDropdownOpen(!isGradeDropdownOpen)}
              className={cn(
                "w-full flex items-center justify-between p-1.5 bg-white border border-slate-200 hover:border-indigo-300 transition-all rounded-md shadow-sm",
                isSidebarCollapsed && "justify-center p-2.5 mb-1.5"
              )}
            >
              <div className="flex items-center space-x-1 min-w-0">
                <Filter className="w-3 h-3 text-indigo-500 shrink-0" />
                {!isSidebarCollapsed && <span className="text-[10px] font-bold text-[#1e1b4b] uppercase tracking-tight truncate">{selectedGrade.split(' ')[1]}</span>}
              </div>
              {!isSidebarCollapsed && <ChevronDown className={cn("w-2 h-2 text-slate-400 transition-transform hidden sm:block", isGradeDropdownOpen && "rotate-180")} />}
            </button>
            
            <AnimatePresence>
              {isGradeDropdownOpen && !isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 mt-2 bg-white border border-slate-950 shadow-2xl z-50 p-1 min-w-[120px] rounded-md"
                >
                  {MOCK_TEACHER_CONTEXT.map(g => (
                    <button
                      key={g.grade}
                      onClick={() => {
                        setSelectedGrade(g.grade);
                        setSelectedSection(g.sections[0]);
                        setIsGradeDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-2 hover:bg-indigo-50 transition-all text-left rounded-sm group",
                        selectedGrade === g.grade && "bg-indigo-50"
                      )}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{g.grade}</span>
                      {selectedGrade === g.grade && <Check className="w-3 h-3 text-indigo-600" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section Selector */}
          <div className="relative group flex-1" ref={sectionRef}>
            <button
              onClick={() => isSidebarCollapsed ? setIsSidebarCollapsed(false) : setIsSectionDropdownOpen(!isSectionDropdownOpen)}
              className={cn(
                "w-full flex items-center justify-between p-1.5 bg-white border border-slate-200 hover:border-indigo-300 transition-all rounded-md shadow-sm",
                isSidebarCollapsed && "justify-center p-2.5"
              )}
            >
              <div className="flex items-center space-x-1 min-w-0">
                <Users className="w-3 h-3 text-indigo-500 shrink-0" />
                {!isSidebarCollapsed && <span className="text-[10px] font-bold text-[#1e1b4b] uppercase tracking-tight truncate">{selectedSection.split(' ')[1]}</span>}
              </div>
              {!isSidebarCollapsed && <ChevronDown className={cn("w-2 h-2 text-slate-400 transition-transform hidden sm:block", isSectionDropdownOpen && "rotate-180")} />}
            </button>
            
            <AnimatePresence>
              {isSectionDropdownOpen && !isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 mt-2 bg-white border border-slate-950 shadow-2xl z-50 p-1 min-w-[120px] rounded-md"
                >
                  {currentGradeObj?.sections.map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSection(s);
                        setIsSectionDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-2 hover:bg-indigo-50 transition-all text-left rounded-sm",
                        selectedSection === s && "bg-indigo-50"
                      )}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{s}</span>
                      {selectedSection === s && <Check className="w-3 h-3 text-indigo-600" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-100" />

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto pt-4 no-scrollbar">
        {!isSidebarCollapsed && (
          <p className="px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Academic Tools</p>
        )}
        <div className="space-y-0.5 px-2 md:px-0">
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              collapsed={isSidebarCollapsed}
            />
          ))}
        </div>
      </nav>

      {/* User Profile popover like the branch admin */}
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
            <Avatar className={cn(
              "w-10 h-10 shrink-0 border border-slate-100 transition-transform group-hover:scale-105",
              isSidebarCollapsed ? "mx-auto" : ""
            )}>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Teacher'}`} />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold uppercase">
                {user?.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            {!isSidebarCollapsed && (
              <div className="flex flex-col items-start overflow-hidden text-left">
                <span className="text-[11px] font-black text-slate-900 leading-tight truncate w-full uppercase tracking-tight">{user?.name}</span>
                <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest truncate w-full">Primary Teacher</span>
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
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Teacher'}`} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">
                      {user?.name?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tight">{user?.name}</span>
                    <span className="text-[8px] font-bold text-slate-500 truncate uppercase tracking-widest">Profile & Settings</span>
                  </div>
                </div>
              </div>
              <div className="p-1.5 space-y-0.5">
                <AccountMenuItem icon={<UserIcon className="w-3.5 h-3.5" />} label="MY ACCOUNT" onClick={() => { setIsAccountMenuOpen(false); setIsProfileModalOpen(true); }} />
                <AccountMenuItem icon={<Settings className="w-3.5 h-3.5" />} label="PREFERENCES" onClick={() => { setIsAccountMenuOpen(false); setIsProfileModalOpen(true); }} />
                <AccountMenuItem icon={<Bell className="w-3.5 h-3.5" />} label="PRIVACY" onClick={() => setIsAccountMenuOpen(false)} />
                <Separator className="my-1" />
                <AccountMenuItem icon={<LogOut className="w-3.5 h-3.5" />} label="LOG OUT" onClick={handleLogout} className="text-red-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const DashboardContent = (
    <div className="space-y-6 md:space-y-8">
      {/* Top Stats Row - Condensed and Horizontal on Mobile */}
      <div className="flex overflow-x-auto pb-2 md:pb-0 md:grid md:grid-cols-3 gap-3 md:gap-7 no-scrollbar snap-x">
        {[
          { label: 'Students', value: '42', icon: Users, change: '+2 Active' },
          { label: 'Performance', value: '82.4', icon: GraduationCap, change: '+4.5%' },
          { label: 'Tasks', value: '03', icon: FileText, change: 'Pending' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-0 sm:border border-slate-200 shadow-none group hover:bg-indigo-50/10 transition-all duration-300 bg-white min-w-[140px] flex-shrink-0 md:min-w-0 snap-start">
            <CardContent className="p-3 md:p-6 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 truncate">{stat.label}</p>
                <h4 className="text-xl md:text-3xl font-black text-[#1e1b4b] leading-none mb-0.5 md:mb-2">{stat.value}</h4>
                <div className="flex items-center gap-1">
                  <span className={cn(
                    "text-[7px] md:text-[10px] font-bold uppercase tracking-widest",
                    stat.change.startsWith('+') ? "text-emerald-600" : "text-amber-600"
                  )}>{stat.change}</span>
                </div>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 border border-slate-100 group-hover:bg-[#1e1b4b] group-hover:text-white group-hover:border-slate-950 transition-all text-slate-400 shrink-0 shadow-sm ml-2">
                <stat.icon className="w-3.5 h-3.5 md:w-6 md:h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          {/* Active Classes - More Condensed on Mobile */}
          <section className="space-y-3 md:space-y-4">
             <div className="flex items-center justify-between px-2 md:px-0">
               <h3 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em] text-[#1e1b4b] flex items-center gap-2">
                 <div className="w-0.5 py-1 bg-indigo-600" />
                 Active Classes
               </h3>
               <button className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Schedule</button>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-3">
               {MOCK_ACTIVE_CLASSES.map((cls) => (
                 <button key={cls.id} className="group text-left border border-slate-200 md:border-slate-100 p-3 md:p-4 hover:border-[#1e1b4b] hover:shadow-lg transition-all bg-white relative overflow-hidden">
                    <div className={cn("absolute top-0 right-0 w-8 h-8 opacity-[0.05] translate-x-2 -translate-y-2 group-hover:opacity-10 transition-opacity", cls.color)} />
                    <div className="flex flex-col">
                      <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{cls.grade}</span>
                      <h4 className="text-[12px] md:text-[14px] font-black text-[#1e1b4b] uppercase leading-tight mb-2 truncate">{cls.section}</h4>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-tight">{cls.subject}</span>
                       <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Users className="w-2.5 h-2.5" />
                          <span className="text-[9px] font-black">{cls.students}</span>
                       </div>
                    </div>
                 </button>
               ))}
             </div>
          </section>

          {/* Daily Schedule - Refined for mobile list layout */}
          <DashboardSection title="Schedule" icon={<Calendar className="w-4 h-4 text-indigo-600" />} actionLabel="View More">
             <div className="h-[160px] md:h-[180px] overflow-y-auto divide-y divide-slate-100 scrollbar-hide">
               {MOCK_DAILY_SCHEDULE.map((item) => (
                 <div key={item.id} className={cn(
                   "p-2.5 md:p-3 flex items-center justify-between group hover:bg-slate-50/50 transition-all cursor-pointer",
                   item.active && "bg-indigo-50/20 border-l-2 border-indigo-600"
                 )}>
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <div className="flex flex-col items-center min-w-[45px] md:min-w-[55px]">
                        <span className="text-[11px] md:text-[12px] font-black text-[#1e1b4b] leading-none mb-0.5">{item.time.split(' ')[0]}</span>
                        <span className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.time.split(' ')[1]}</span>
                      </div>
                      <Separator orientation="vertical" className="h-7 md:h-8 bg-slate-200" />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h4 className={cn(
                            "text-[10px] md:text-[11px] font-black uppercase tracking-tight truncate max-w-[90px] md:max-w-none",
                            item.active ? "text-indigo-600" : "text-[#1e1b4b]"
                          )}>{item.subject}</h4>
                          {item.active && (
                            <div className="px-1 py-0.5 bg-indigo-600 text-white text-[6px] md:text-[7px] font-black uppercase flex items-center gap-0.5 rounded-sm">
                              Live
                            </div>
                          )}
                        </div>
                        <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">Gr {item.grade} • {item.section}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="hidden sm:inline-block text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">{item.duration}</span>
                       <div className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-white border border-slate-200 group-hover:border-slate-950 transition-all shadow-sm">
                         <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-300 group-hover:text-indigo-600" />
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </DashboardSection>

          {/* Pending Grading & Upcoming Assignments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
             <DashboardSection title="Grading" icon={<GraduationCap className="w-4 h-4 text-amber-500" />} className="h-[260px] flex flex-col">
                <div className="p-3 md:p-4 space-y-4 overflow-y-auto no-scrollbar flex-1">
                  {MOCK_PENDING_GRADING.map((task) => (
                    <div key={task.id} className="relative pl-3.5 group/task">
                       <div className={cn(
                         "absolute left-0 top-0.5 bottom-0.5 w-0.5 rounded-full opacity-60 group-hover/task:opacity-100 transition-opacity",
                         task.priority === 'high' ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.3)]' : task.priority === 'medium' ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.3)]' : 'bg-slate-300'
                       )} />
                       <div className="flex justify-between items-start mb-1.5">
                          <h5 className="text-[11px] md:text-[12px] font-black text-[#1e1b4b] uppercase truncate max-w-[130px]">{task.title}</h5>
                          <span className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-tight">{task.deadline}</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                             <span className="bg-slate-50 text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 px-1 py-0.5">{task.type}</span>
                             <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">{task.count}/{task.total}</span>
                          </div>
                          <button className="text-[8px] md:text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform">Process →</button>
                       </div>
                    </div>
                  ))}
                </div>
             </DashboardSection>

             <DashboardSection title="Tasks" icon={<FileText className="w-4 h-4 text-indigo-500" />} className="h-[260px] flex flex-col">
                <div className="p-3 md:p-4 space-y-4 overflow-y-auto no-scrollbar flex-1">
                  {MOCK_UPCOMING_ASSIGNMENTS.map((task) => (
                    <div key={task.id} className="group border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                       <div className="flex justify-between items-center mb-1.5">
                          <h5 className="text-[11px] md:text-[12px] font-black text-[#1e1b4b] uppercase truncate">{task.title}</h5>
                          <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[7px] md:text-[8px] font-black uppercase border border-indigo-100 rounded-sm">{task.status}</span>
                       </div>
                       <div className="flex items-center justify-between text-[8px] md:text-[9px] font-bold uppercase tracking-[0.1em]">
                          <span className="text-slate-400 flex items-center gap-1">
                             <Clock className="w-2.5 h-2.5" />
                             Due {task.dueDate}
                          </span>
                          <span className="text-indigo-600 font-extrabold">{task.grade}{task.section}</span>
                       </div>
                    </div>
                  ))}
                  <button className="w-full py-3 border border-dashed border-slate-200 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/20 transition-all rounded-sm">
                    + Create Task
                  </button>
                </div>
             </DashboardSection>
          </div>
        </div>

        {/* Side Column */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
           {/* Unread Parent Messages - Balanced Height */}
           <DashboardSection title="Parent Messages" icon={<MessageSquare className="w-4 h-4 text-indigo-600" />} actionLabel="Manage">
              <div className="max-h-[220px] md:max-h-[240px] overflow-y-auto no-scrollbar p-0">
                {MOCK_PARENT_MESSAGES.map((msg) => (
                  <div key={msg.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-all group relative cursor-pointer last:border-0">
                     <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                           <div className="w-1 rounded-full aspect-square bg-indigo-600 shadow-[0_0_6px_rgba(79,70,229,0.5)] animate-pulse" />
                           <span className="text-[11px] font-black text-[#1e1b4b] uppercase tracking-tight truncate">{msg.parent}</span>
                        </div>
                        <span className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">{msg.time}</span>
                     </div>
                     <p className="text-[9px] md:text-[10px] font-medium text-slate-500 leading-relaxed mb-2 line-clamp-2 italic">"{msg.message}"</p>
                     <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold text-indigo-500 bg-indigo-50 px-1 py-0.5 uppercase tracking-widest">{msg.student}</span>
                        <div className="flex items-center gap-0.5 text-[7px] md:text-[8px] font-black text-[#1e1b4b] uppercase group-hover:text-indigo-600 transition-colors">
                           Reply <ChevronRight className="w-2.5 h-2.5" />
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </DashboardSection>

           {/* Alerts & Context - Refined */}
           <DashboardSection title="Warnings" icon={<BarChart3 className="w-4 h-4 text-red-500" />} actionLabel="View All">
              <div className="p-3 md:p-4 space-y-4">
                 {MOCK_AT_RISK_STUDENTS.map((student) => (
                   <div key={student.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2.5">
                         <div className="relative">
                           <Avatar className="w-8 h-8 border-2 border-slate-50 shadow-sm shrink-0">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                              <AvatarFallback className="text-[9px] bg-red-100 text-red-600 font-bold">{student.name.slice(0, 2)}</AvatarFallback>
                           </Avatar>
                           <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                              <Info className="w-1.5 h-1.5 text-white" />
                           </div>
                         </div>
                         <div className="flex flex-col min-w-0">
                            <span className="text-[11px] md:text-[12px] font-black text-[#1e1b4b] uppercase tracking-tight truncate max-w-[80px] md:max-w-[100px]">{student.name}</span>
                            <span className="text-[8px] md:text-[9px] font-bold text-red-500 uppercase truncate leading-none mt-0.5">{student.reason}</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[12px] font-black text-slate-900 leading-none mb-0.5 font-mono">{student.score}</div>
                         <div className={cn(
                           "text-[7px] font-black uppercase tracking-widest px-1 py-0.5 rounded-sm inline-block",
                           student.trend === 'down' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                         )}>
                            {student.trend}
                         </div>
                      </div>
                   </div>
                 ))}
                  <div className="pt-2 mt-1">
                    <Separator className="bg-slate-50 mb-2" />
                    <div className="p-2 bg-indigo-50/40 rounded-sm border border-indigo-100/50">
                       <p className="text-[8px] md:text-[9px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed text-center">
                         AI: Monitoring last 30 logs.
                       </p>
                    </div>
                 </div>
              </div>
           </DashboardSection>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-950 sticky top-0 bg-white z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#1e1b4b] text-white flex items-center justify-center border border-slate-950">
            <School className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#1e1b4b]">Kelem Dashboard</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 flex items-center justify-center border border-slate-950 hover:bg-slate-50 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className={cn(
        "hidden md:flex flex-col sticky top-0 h-screen transition-all duration-500 ease-in-out z-30 group/sidebar",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}>
        {SidebarContent}
        
        {/* Collapse Toggle Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-950 flex items-center justify-center hover:bg-[#1e1b4b] hover:text-white transition-all z-50 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
        >
          <ChevronRight className={cn("w-3 h-3 text-current transition-transform duration-500", !isSidebarCollapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[50] md:hidden shadow-2xl border-r border-slate-950 overflow-hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-50/10 overflow-auto no-scrollbar">
        <div className="p-3 md:p-6 lg:p-8">
          {/* Header Section - More Compact / No Large Title */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5 md:mb-6 border-b border-slate-100 pb-3 md:pb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className="px-1.5 py-0.5 bg-[#1e1b4b] text-white text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] shadow-[1px_1px_0px_0px_rgba(79,70,229,1)]">
                  {selectedGrade}
                </div>
                <div className="px-1.5 py-0.5 bg-white border border-slate-900 text-[#1e1b4b] text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em]">
                  {selectedSection}
                </div>
                <Separator orientation="vertical" className="h-3 mx-1.5 bg-slate-200 hidden sm:block" />
                <span className="hidden sm:block text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-slate-500 max-w-lg font-bold text-[8px] md:text-[9px] uppercase tracking-[0.2em] leading-relaxed">
                Academic Hub <span className="text-indigo-600 font-extrabold px-1">/</span> <span className="text-slate-900">{activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}</span>
              </p>
            </div>
            
            <div className="flex items-center justify-start lg:justify-end gap-2 w-full lg:w-auto mt-2 lg:mt-0">
               <div className="relative mr-2">
                 <button 
                   onClick={() => setActiveTab('notification')}
                   className="h-8 w-8 md:h-9 md:w-9 bg-white border border-slate-950 text-[#1e1b4b] flex items-center justify-center hover:bg-slate-50 transition-all relative group"
                 >
                   <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-none shadow-[1px_1px_0px_0px_white]">3</span>
                 </button>
               </div>
               <button className="h-8 md:h-9 px-3 md:px-5 bg-white border border-slate-950 text-[#1e1b4b] font-black text-[8px] md:text-[9px] uppercase tracking-widest hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(30,27,75,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>AI Insights</span>
               </button>
               {activeTab !== 'students' && (
                 <button className="h-8 w-8 md:h-9 md:w-auto md:px-5 bg-black text-white font-black text-[8px] md:text-[9px] uppercase tracking-widest hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(79,70,229,1)] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none flex items-center justify-center gap-1.5 shrink-0">
                    <ExternalLink className="w-3 h-3" />
                    <span className="hidden md:inline">Export</span>
                 </button>
               )}
            </div>
          </div>

          {/* Tab Specific Content */}
          {activeTab === 'dashboard' ? (
            DashboardContent
          ) : activeTab === 'attendance' ? (
            <AttendanceView grade={selectedGrade} section={selectedSection} />
          ) : activeTab === 'students' ? (
            <StudentsView grade={selectedGrade} section={selectedSection} />
          ) : activeTab === 'tasks' ? (
            <TasksView grade={selectedGrade} section={selectedSection} />
          ) : activeTab === 'grade' ? (
            <GradeView grade={selectedGrade} section={selectedSection} />
          ) : activeTab === 'student-analytics' ? (
            <StudentAnalyticsView grade={selectedGrade} section={selectedSection} />
          ) : activeTab === 'homeworks' ? (
            <HomeworkView grade={selectedGrade} section={selectedSection} />
          ) : activeTab === 'messages' ? (
            <MessagesView grade={selectedGrade} section={selectedSection} />
          ) : activeTab === 'schedule' ? (
            <ScheduleView grade={selectedGrade} section={selectedSection} />
          ) : activeTab === 'notification' ? (
            <NotificationsView 
              grade={selectedGrade} 
              section={selectedSection} 
              onNavigate={(tab) => setActiveTab(tab)} 
            />
          ) : (
            <div className="bg-white border border-slate-200 p-4 md:p-12 text-center flex flex-col items-center justify-center min-h-[250px] md:min-h-[400px]">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-50 flex items-center justify-center border border-slate-100 mb-3 md:mb-6">
                   <LayoutDashboard className="w-6 h-6 md:w-10 md:h-10 text-slate-300" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[#1e1b4b] uppercase tracking-tighter mb-2 md:mb-4">Module Preparation</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-bold text-[10px] md:text-xs uppercase tracking-widest leading-relaxed">
                   The <span className="text-indigo-600 truncate inline-block max-w-[100px] align-bottom">{activeTab}</span> component for <span className="text-indigo-600 font-black">{selectedGrade} {selectedSection}</span> is being finalized.
                </p>
                <button className="mt-6 md:mt-8 h-10 md:h-12 px-8 md:px-10 bg-[#1e1b4b] text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                  Refresh View
                </button>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isProfileModalOpen && (
          <ProfileSettingsModal 
            isOpen={isProfileModalOpen} 
            onClose={() => setIsProfileModalOpen(false)} 
            user={user} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

