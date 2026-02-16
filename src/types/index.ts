export type UserRole = 'ADMIN' | 'HR' | 'TEAM_MANAGER' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: UserRole;
  organization_id: string | null;
  department_id: string | null;
  position: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  settings: {
    workHoursStart: string;
    workHoursEnd: string;
    workDays: number[];
    timezone: string;
    currency: string;
  };
}

export interface Department {
  id: string;
  name: string;
  code: string;
  organization_id: string;
  manager_id: string | null;
  parent_id: string | null;
  created_at: string;
}

export interface Employee {
  id: string;
  profile_id: string;
  employee_code: string;
  organization_id: string;
  hire_date: string;
  department_id: string | null;
  position: string;
  contract_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  base_salary: number;
  cnss: string | null;
  rib: string | null;
  bank_name: string | null;
  manager_id: string | null;
  created_at: string;
  profile?: User;
  department?: Department;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';
  notes: string | null;
  work_hours: number;
  overtime_hours: number;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  assigned_to: string;
  assigned_by: string;
  status: 'TODO' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  due_date: string | null;
  completed_at: string | null;
  performance_score: number | null;
  feedback: string | null;
  created_at: string;
  assignee?: Employee;
  assigner?: Employee;
}

export interface VacationRequest {
  id: string;
  employee_id: string;
  type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'UNPAID' | 'OTHER';
  start_date: string;
  end_date: string;
  days: number;
  reason: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approved_by: string | null;
  approved_at: string | null;
  comments: string | null;
  created_at: string;
  employee?: Employee;
}

export interface DocumentRequest {
  id: string;
  employee_id: string;
  type: 'ATTESTATION' | 'CERTIFICATE' | 'CONTRACT' | 'PAYSLIP' | 'OTHER';
  title: string;
  description: string | null;
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'DELIVERED' | 'REJECTED';
  file_url: string | null;
  requested_at: string;
  completed_at: string | null;
  processed_by: string | null;
}

export interface Payroll {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  base_salary: number;
  overtime_pay: number;
  bonuses: number;
  deductions: number;
  tax_amount: number;
  net_salary: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'PAID';
  paid_at: string | null;
  payslip_url: string | null;
  created_at: string;
}

export interface JobOffer {
  id: string;
  title: string;
  organization_id: string;
  department_id: string | null;
  description: string;
  requirements: string | null;
  location: string | null;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  salary_min: number | null;
  salary_max: number | null;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'FILLED';
  published_at: string | null;
  closed_at: string | null;
  created_by: string | null;
  created_at: string;
  department?: Department;
}

export interface Candidate {
  id: string;
  job_offer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  cv_url: string | null;
  status: 'NEW' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';
  interview_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  lateToday: number;
  onLeave: number;
  pendingRequests: number;
  openPositions: number;
  newCandidates: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  position: string;
  organization_name: string;
  organization_email: string;
  organization_phone: string;
  organization_address: string;
  role: UserRole;
}

export interface EmployeeCreateCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  department_id?: string;
  position: string;
  base_salary: number;
}
