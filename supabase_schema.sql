-- HR Intelligent BPMS - Supabase Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{
        "workHoursStart": "09:00",
        "workHoursEnd": "18:00",
        "workDays": [1,2,3,4,5],
        "timezone": "UTC",
        "currency": "USD"
    }'::jsonb
);

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'HR', 'TEAM_MANAGER', 'EMPLOYEE')),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    department_id UUID,
    position VARCHAR(255),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DEPARTMENTS TABLE
-- ============================================
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

-- Add foreign key to profiles.department_id
ALTER TABLE profiles ADD CONSTRAINT fk_profile_department 
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- ============================================
-- EMPLOYEES TABLE (additional employee data)
-- ============================================
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    employee_code VARCHAR(100) NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    hire_date DATE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    position VARCHAR(255) NOT NULL,
    contract_type VARCHAR(50) NOT NULL CHECK (contract_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP')),
    base_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
    cnss VARCHAR(100),
    rib TEXT,
    bank_name VARCHAR(255),
    manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, employee_code)
);

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE')),
    notes TEXT,
    work_hours DECIMAL(4,2) DEFAULT 0,
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- ============================================
-- TASKS TABLE
-- ============================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    assigned_to UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED')),
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- VACATION REQUESTS TABLE
-- ============================================
CREATE TABLE vacation_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'UNPAID', 'OTHER')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    approved_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- ============================================
-- DOCUMENT REQUESTS TABLE
-- ============================================
CREATE TABLE document_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ATTESTATION', 'CERTIFICATE', 'CONTRACT', 'PAYSLIP', 'OTHER')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'READY', 'DELIVERED', 'REJECTED')),
    file_url TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES employees(id) ON DELETE SET NULL
);

-- ============================================
-- PAYROLL TABLE
-- ============================================
CREATE TABLE payrolls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL,
    base_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
    overtime_pay DECIMAL(12,2) DEFAULT 0,
    bonuses DECIMAL(12,2) DEFAULT 0,
    deductions DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    net_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING', 'APPROVED', 'PAID')),
    paid_at TIMESTAMP WITH TIME ZONE,
    payslip_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, month, year)
);

-- ============================================
-- JOB OFFERS TABLE
-- ============================================
CREATE TABLE job_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location VARCHAR(255),
    type VARCHAR(50) NOT NULL CHECK (type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP')),
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED', 'FILLED')),
    published_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CANDIDATES TABLE
-- ============================================
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_offer_id UUID NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    cv_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED')),
    interview_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO', 'SUCCESS', 'WARNING', 'ERROR')),
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_profiles_organization ON profiles(organization_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_employees_organization ON employees(organization_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_vacation_employee ON vacation_requests(employee_id);
CREATE INDEX idx_vacation_status ON vacation_requests(status);
CREATE INDEX idx_payroll_employee ON payrolls(employee_id);
CREATE INDEX idx_payroll_month_year ON payrolls(month, year);
CREATE INDEX idx_candidates_job_offer ON candidates(job_offer_id);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_audit_logs_organization ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Organizations Policies
-- Drop existing to avoid conflicts
DROP POLICY IF EXISTS "org_admin_policy" ON organizations;
DROP POLICY IF EXISTS "org_insert_policy" ON organizations;
DROP POLICY IF EXISTS "org_select_policy" ON organizations;

-- Allow anyone to create an organization (needed for registration)
CREATE POLICY "Enable insert for registration" ON organizations
    FOR INSERT 
    WITH CHECK (true);

-- Allow anyone to read organization info (needed for returning ID and public listing)
CREATE POLICY "Enable read for all" ON organizations
    FOR SELECT 
    USING (true);

-- Allow admins to manage their organization
CREATE POLICY "Enable manage for admins" ON organizations
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.organization_id = organizations.id 
            AND profiles.role = 'ADMIN'
        )
    );

-- 2. Profiles Policies
-- Drop existing to avoid conflicts
DROP POLICY IF EXISTS "profile_select_policy" ON profiles;
DROP POLICY IF EXISTS "profile_update_policy" ON profiles;
DROP POLICY IF EXISTS "View profiles in same org" ON profiles;
DROP POLICY IF EXISTS "Update own profile" ON profiles;

-- Users can always view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT 
    USING (id = auth.uid());

-- Non-recursive helper to get organization_id from user metadata
-- This avoids querying the profiles table itself, preventing RLS recursion
CREATE OR REPLACE FUNCTION get_my_org_id()
RETURNS uuid AS $$
BEGIN
    RETURN (auth.jwt() -> 'user_metadata' ->> 'organization_id')::uuid;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Users can view profiles in their organization
CREATE POLICY "View profiles in same org" ON profiles
    FOR SELECT 
    USING (
        organization_id = get_my_org_id()
    );

-- Users can update their own profile
CREATE POLICY "Update own profile" ON profiles
    FOR UPDATE 
    USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Update own profile" ON profiles
    FOR UPDATE 
    USING (id = auth.uid());

-- Employees: Organization members can view employees
CREATE POLICY employee_select_policy ON employees
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Employees: HR and Admin can manage employees
CREATE POLICY employee_manage_policy ON employees
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.organization_id = employees.organization_id 
            AND profiles.role IN ('ADMIN', 'HR')
        )
    );

-- Attendance: Users can view their own attendance, managers can view their team's
CREATE POLICY attendance_select_policy ON attendance
    FOR SELECT USING (
        employee_id IN (
            SELECT id FROM employees WHERE profile_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM employees e
            JOIN profiles p ON p.id = auth.uid()
            WHERE e.id = attendance.employee_id 
            AND (e.manager_id IN (SELECT id FROM employees WHERE profile_id = auth.uid())
                 OR p.role IN ('ADMIN', 'HR'))
        )
    );

-- Tasks: Users can view tasks assigned to them or by them
CREATE POLICY task_select_policy ON tasks
    FOR SELECT USING (
        assigned_to IN (
            SELECT id FROM employees WHERE profile_id = auth.uid()
        ) OR
        assigned_by IN (
            SELECT id FROM employees WHERE profile_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('ADMIN', 'HR', 'TEAM_MANAGER')
        )
    );

-- Vacation: Users can view their own requests, managers can approve
CREATE POLICY vacation_select_policy ON vacation_requests
    FOR SELECT USING (
        employee_id IN (
            SELECT id FROM employees WHERE profile_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('ADMIN', 'HR', 'TEAM_MANAGER')
        )
    );

-- Payroll: Users can view their own payroll
CREATE POLICY payroll_select_policy ON payrolls
    FOR SELECT USING (
        employee_id IN (
            SELECT id FROM employees WHERE profile_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('ADMIN', 'HR')
        )
    );

-- Notifications: Users can only view their own notifications
CREATE POLICY notification_policy ON notifications
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vacation_requests_updated_at BEFORE UPDATE ON vacation_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payrolls_updated_at BEFORE UPDATE ON payrolls
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_offers_updated_at BEFORE UPDATE ON job_offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DEMO DATA (Optional - for testing)
-- ============================================

-- Insert demo organization
INSERT INTO organizations (id, name, email, address) VALUES 
('00000000-0000-0000-0000-000000000001', 'Demo Company', 'admin@democompany.com', '123 Business Ave, Suite 100');

-- Note: Profiles should be created via Supabase Auth, then insert into profiles table
-- The trigger below will automatically create a profile when a user signs up

-- ============================================
-- TRIGGER TO AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, phone, position, role, organization_id, is_active)
    VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'position',
        COALESCE(NEW.raw_user_meta_data->>'role', 'EMPLOYEE'),
        (NEW.raw_user_meta_data->>'organization_id')::uuid,
        TRUE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile after user inserts
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VIEWS FOR CONVENIENCE
-- ============================================

-- View: Employee details with profile info
CREATE VIEW employee_details AS
SELECT 
    e.id,
    e.employee_code,
    e.hire_date,
    e.position,
    e.contract_type,
    e.base_salary,
    e.cnss,
    e.rib,
    e.bank_name,
    p.id as profile_id,
    p.email,
    p.first_name,
    p.last_name,
    p.avatar_url,
    p.role,
    p.is_active,
    d.id as department_id,
    d.name as department_name,
    d.code as department_code,
    o.id as organization_id,
    o.name as organization_name
FROM employees e
JOIN profiles p ON p.id = e.profile_id
LEFT JOIN departments d ON d.id = e.department_id
LEFT JOIN organizations o ON o.id = e.organization_id;

-- View: Today's attendance with employee info
CREATE VIEW today_attendance AS
SELECT 
    a.*,
    e.employee_code,
    p.first_name,
    p.last_name,
    p.avatar_url,
    d.name as department_name
FROM attendance a
JOIN employees e ON e.id = a.employee_id
JOIN profiles p ON p.id = e.profile_id
LEFT JOIN departments d ON d.id = e.department_id
WHERE a.date = CURRENT_DATE;

-- View: Pending vacation requests with employee info
CREATE VIEW pending_vacations AS
SELECT 
    v.*,
    e.employee_code,
    p.first_name,
    p.last_name,
    p.avatar_url,
    d.name as department_name
FROM vacation_requests v
JOIN employees e ON e.id = v.employee_id
JOIN profiles p ON p.id = e.profile_id
LEFT JOIN departments d ON d.id = e.department_id
WHERE v.status = 'PENDING';
