export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
          settings: Json;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
          settings?: Json;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
          settings?: Json;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url: string | null;
          role: 'ADMIN' | 'HR' | 'TEAM_MANAGER' | 'EMPLOYEE';
          organization_id: string | null;
          department_id: string | null;
          position: string | null;
          phone: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url?: string | null;
          role?: 'ADMIN' | 'HR' | 'TEAM_MANAGER' | 'EMPLOYEE';
          organization_id?: string | null;
          department_id?: string | null;
          position?: string | null;
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          avatar_url?: string | null;
          role?: 'ADMIN' | 'HR' | 'TEAM_MANAGER' | 'EMPLOYEE';
          organization_id?: string | null;
          department_id?: string | null;
          position?: string | null;
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          name: string;
          code: string;
          organization_id: string;
          manager_id: string | null;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          organization_id: string;
          manager_id?: string | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          organization_id?: string;
          manager_id?: string | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          employee_code: string;
          organization_id: string;
          hire_date: string;
          department_id?: string | null;
          position: string;
          contract_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
          base_salary?: number;
          cnss?: string | null;
          rib?: string | null;
          bank_name?: string | null;
          manager_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          employee_code?: string;
          organization_id?: string;
          hire_date?: string;
          department_id?: string | null;
          position?: string;
          contract_type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
          base_salary?: number;
          cnss?: string | null;
          rib?: string | null;
          bank_name?: string | null;
          manager_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          date: string;
          check_in?: string | null;
          check_out?: string | null;
          status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';
          notes?: string | null;
          work_hours?: number;
          overtime_hours?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          date?: string;
          check_in?: string | null;
          check_out?: string | null;
          status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';
          notes?: string | null;
          work_hours?: number;
          overtime_hours?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          assigned_to: string;
          assigned_by: string;
          status?: 'TODO' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'CANCELLED';
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
          due_date?: string | null;
          completed_at?: string | null;
          performance_score?: number | null;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          assigned_to?: string;
          assigned_by?: string;
          status?: 'TODO' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'CANCELLED';
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
          due_date?: string | null;
          completed_at?: string | null;
          performance_score?: number | null;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      vacation_requests: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'UNPAID' | 'OTHER';
          start_date: string;
          end_date: string;
          days: number;
          reason?: string | null;
          status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
          approved_by?: string | null;
          approved_at?: string | null;
          comments?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          type?: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'UNPAID' | 'OTHER';
          start_date?: string;
          end_date?: string;
          days?: number;
          reason?: string | null;
          status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
          approved_by?: string | null;
          approved_at?: string | null;
          comments?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      document_requests: {
        Row: {
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
        };
        Insert: {
          id?: string;
          employee_id: string;
          type: 'ATTESTATION' | 'CERTIFICATE' | 'CONTRACT' | 'PAYSLIP' | 'OTHER';
          title: string;
          description?: string | null;
          status?: 'PENDING' | 'PROCESSING' | 'READY' | 'DELIVERED' | 'REJECTED';
          file_url?: string | null;
          requested_at?: string;
          completed_at?: string | null;
          processed_by?: string | null;
        };
        Update: {
          id?: string;
          employee_id?: string;
          type?: 'ATTESTATION' | 'CERTIFICATE' | 'CONTRACT' | 'PAYSLIP' | 'OTHER';
          title?: string;
          description?: string | null;
          status?: 'PENDING' | 'PROCESSING' | 'READY' | 'DELIVERED' | 'REJECTED';
          file_url?: string | null;
          requested_at?: string;
          completed_at?: string | null;
          processed_by?: string | null;
        };
      };
      payrolls: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          month: number;
          year: number;
          base_salary?: number;
          overtime_pay?: number;
          bonuses?: number;
          deductions?: number;
          tax_amount?: number;
          net_salary?: number;
          status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'PAID';
          paid_at?: string | null;
          payslip_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          month?: number;
          year?: number;
          base_salary?: number;
          overtime_pay?: number;
          bonuses?: number;
          deductions?: number;
          tax_amount?: number;
          net_salary?: number;
          status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'PAID';
          paid_at?: string | null;
          payslip_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_offers: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          organization_id: string;
          department_id?: string | null;
          description: string;
          requirements?: string | null;
          location?: string | null;
          type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
          salary_min?: number | null;
          salary_max?: number | null;
          status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'FILLED';
          published_at?: string | null;
          closed_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          organization_id?: string;
          department_id?: string | null;
          description?: string;
          requirements?: string | null;
          location?: string | null;
          type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
          salary_min?: number | null;
          salary_max?: number | null;
          status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'FILLED';
          published_at?: string | null;
          closed_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      candidates: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_offer_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          cv_url?: string | null;
          status?: 'NEW' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';
          interview_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_offer_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          cv_url?: string | null;
          status?: 'NEW' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';
          interview_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
          is_read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
          is_read?: boolean;
          link?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
          is_read?: boolean;
          link?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      employee_details: {
        Row: {
          id: string;
          employee_code: string;
          hire_date: string;
          position: string;
          contract_type: string;
          base_salary: number;
          cnss: string | null;
          rib: string | null;
          bank_name: string | null;
          profile_id: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url: string | null;
          role: string;
          is_active: boolean;
          department_id: string | null;
          department_name: string | null;
          department_code: string | null;
          organization_id: string;
          organization_name: string;
        };
      };
      today_attendance: {
        Row: {
          id: string;
          employee_id: string;
          date: string;
          check_in: string | null;
          check_out: string | null;
          status: string;
          notes: string | null;
          work_hours: number;
          overtime_hours: number;
          employee_code: string;
          first_name: string;
          last_name: string;
          avatar_url: string | null;
          department_name: string | null;
        };
      };
      pending_vacations: {
        Row: {
          id: string;
          employee_id: string;
          type: string;
          start_date: string;
          end_date: string;
          days: number;
          reason: string | null;
          status: string;
          approved_by: string | null;
          approved_at: string | null;
          comments: string | null;
          employee_code: string;
          first_name: string;
          last_name: string;
          avatar_url: string | null;
          department_name: string | null;
        };
      };
    };
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      update_updated_at_column: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
