import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Layout } from '@/components/layout/Layout';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Employees } from '@/pages/Employees';
import { Attendance } from '@/pages/Attendance';
import { Tasks } from '@/pages/Tasks';
import { Vacation } from '@/pages/Vacation';
import { Documents } from '@/pages/Documents';
import { Payroll } from '@/pages/Payroll';
import { Recruitment } from '@/pages/Recruitment';
import { Departments } from '@/pages/Departments';
import { JobOffers } from '@/pages/JobOffers';
import { Reports } from '@/pages/Reports';
import { Settings } from '@/pages/Settings';
import { Profile } from '@/pages/Profile';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/vacation" element={<Vacation />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/jobs" element={<JobOffers />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
