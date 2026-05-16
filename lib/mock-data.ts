export type Role = 'us' | 'organization' | 'branch_admin' | 'teacher' | 'parent';

export interface User {
  id: string;
  name: string;
  firstName?: string;
  fatherName?: string;
  grandFatherName?: string;
  role: Role;
  email: string;
  phone?: string;
  organizationName?: string;
  branchName?: string;
  studentName?: string;
  studentGrade?: string;
}

export interface School {
  id: string;
  name: string;
  founded?: string;
  branchesCount: number;
  studentsCount: number;
  logoColor?: string;
}

export interface Branch {
  id: string;
  schoolId: string;
  name: string;
  managerEmail: string;
  status: 'Active' | 'Invited' | 'Inactive';
}

export const MOCK_SCHOOLS: School[] = [
  { id: 's1', name: 'Acme Academy', founded: '2018', branchesCount: 5, studentsCount: 1240, logoColor: 'indigo' },
  { id: 's2', name: 'Zemen International', founded: '2020', branchesCount: 3, studentsCount: 890, logoColor: 'emerald' },
  { id: 's3', name: 'Unity Preparatory', founded: '2015', branchesCount: 4, studentsCount: 2100, logoColor: 'orange' },
];

export const MOCK_BRANCHES: Branch[] = [
  { id: 'b1', schoolId: 's1', name: 'Addis Main Campus', managerEmail: 'yoseph.t@acme.edu.et', status: 'Active' },
  { id: 'b2', schoolId: 's1', name: 'Bole Secondary', managerEmail: 'selamawit.k@acme.edu.et', status: 'Active' },
  { id: 'b3', schoolId: 's1', name: 'Summit Primary', managerEmail: 'kebede.f@acme.edu.et', status: 'Invited' },
  { id: 'b4', schoolId: 's1', name: 'Lebu Tech Hub', managerEmail: 'tigist.m@acme.edu.et', status: 'Active' },
];

export const MOCK_INVITES: Record<Role, User> = {
  parent: {
    id: 'p1',
    name: 'Nahom Teshome',
    role: 'parent',
    email: 'nahom@example.com',
    phone: '+251 911 223 344',
    organizationName: 'St. Joseph Academy',
    studentName: 'Abenezer Nahom',
    studentGrade: 'Grade 9A',
  },
  teacher: {
    id: 't1',
    name: 'Sara Kassa',
    role: 'teacher',
    email: 'sara.k@example.com',
    organizationName: 'St. Joseph Academy',
    branchName: 'Main Branch',
  },
  branch_admin: {
    id: 'ba1',
    name: 'Abebe Bikila',
    role: 'branch_admin',
    email: 'abebe.b@example.com',
    organizationName: 'St. Joseph Academy',
    branchName: 'Addis Ababa Branch',
  },
  organization: {
    id: 'o1',
    name: 'Dawit Lema',
    role: 'organization',
    email: 'dawit@schoolgroup.com',
    organizationName: 'School Group International',
  },
  us: {
    id: 'u1',
    name: 'Platform Admin',
    role: 'us',
    email: 'admin@kelem.co',
  },
};
