import {
  LayoutDashboard,
  Users,
  Clock,
  CheckSquare,
  Calendar,
  FolderOpen,
  DollarSign,
  UserPlus,
  Building2,
  Briefcase,
  FileText,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/types';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export const navigationItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'HR', 'TEAM_MANAGER', 'EMPLOYEE'] },
  { label: 'Employees', path: '/employees', icon: Users, roles: ['ADMIN', 'HR', 'TEAM_MANAGER'] },
  { label: 'Attendance', path: '/attendance', icon: Clock, roles: ['ADMIN', 'HR', 'TEAM_MANAGER', 'EMPLOYEE'] },
  { label: 'Tasks', path: '/tasks', icon: CheckSquare, roles: ['ADMIN', 'HR', 'TEAM_MANAGER', 'EMPLOYEE'] },
  { label: 'Vacation', path: '/vacation', icon: Calendar, roles: ['ADMIN', 'HR', 'TEAM_MANAGER', 'EMPLOYEE'] },
  { label: 'Documents', path: '/documents', icon: FolderOpen, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
  { label: 'Payroll', path: '/payroll', icon: DollarSign, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
  { label: 'Recruitment', path: '/recruitment', icon: UserPlus, roles: ['ADMIN', 'HR'] },
  { label: 'Departments', path: '/departments', icon: Building2, roles: ['ADMIN', 'HR'] },
  { label: 'Job Offers', path: '/jobs', icon: Briefcase, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
  { label: 'Reports', path: '/reports', icon: FileText, roles: ['ADMIN', 'HR', 'TEAM_MANAGER'] },
  { label: 'Settings', path: '/settings', icon: Settings, roles: ['ADMIN', 'HR', 'TEAM_MANAGER', 'EMPLOYEE'] },
];
