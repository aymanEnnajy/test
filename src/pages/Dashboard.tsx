import { useEffect, useState } from 'react';
import {
  Users,
  Clock,
  Calendar,
  CheckSquare,
  TrendingUp,
  DollarSign,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import type { DashboardStats } from '@/types';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

function StatCard({ title, value, description, icon: Icon, trend, color }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {trend && (
                <span className={trend.isPositive ? 'text-emerald-500' : 'text-red-500'}>
                  {trend.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </span>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className={`p-2.5 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Demo stats
const demoStats: Record<string, DashboardStats> = {
  ADMIN: {
    totalEmployees: 75,
    presentToday: 62,
    lateToday: 5,
    onLeave: 8,
    pendingRequests: 12,
    openPositions: 4,
    newCandidates: 15,
  },
  HR: {
    totalEmployees: 75,
    presentToday: 62,
    lateToday: 5,
    onLeave: 8,
    pendingRequests: 12,
    openPositions: 4,
    newCandidates: 15,
  },
  TEAM_MANAGER: {
    totalEmployees: 8,
    presentToday: 7,
    lateToday: 1,
    onLeave: 0,
    pendingRequests: 3,
    openPositions: 1,
    newCandidates: 2,
  },
  EMPLOYEE: {
    totalEmployees: 1,
    presentToday: 1,
    lateToday: 0,
    onLeave: 0,
    pendingRequests: 0,
    openPositions: 0,
    newCandidates: 0,
  },
};

export function Dashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const stats = demoStats[user?.role || 'EMPLOYEE'];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getRoleSpecificStats = () => {
    const role = user?.role || 'EMPLOYEE';
    
    switch (role) {
      case 'ADMIN':
        return [
          { title: 'Total Employees', value: stats.totalEmployees, icon: Users, color: 'bg-blue-500', trend: { value: 12, isPositive: true } },
          { title: 'Present Today', value: stats.presentToday, icon: Clock, color: 'bg-emerald-500', description: `${stats.lateToday} late arrivals` },
          { title: 'Pending Requests', value: stats.pendingRequests, icon: CheckSquare, color: 'bg-amber-500' },
          { title: 'Open Positions', value: stats.openPositions, icon: Briefcase, color: 'bg-purple-500' },
        ];
      case 'HR':
        return [
          { title: 'Total Employees', value: stats.totalEmployees, icon: Users, color: 'bg-blue-500' },
          { title: 'On Leave', value: stats.onLeave, icon: Calendar, color: 'bg-orange-500' },
          { title: 'New Candidates', value: stats.newCandidates, icon: UserPlus, color: 'bg-emerald-500', trend: { value: 24, isPositive: true } },
          { title: 'Pending Requests', value: stats.pendingRequests, icon: CheckSquare, color: 'bg-amber-500' },
        ];
      case 'TEAM_MANAGER':
        return [
          { title: 'Team Members', value: stats.totalEmployees, icon: Users, color: 'bg-blue-500' },
          { title: 'Active Tasks', value: 5, icon: CheckSquare, color: 'bg-amber-500' },
          { title: 'Pending Reviews', value: 2, icon: Clock, color: 'bg-orange-500' },
          { title: 'Completed', value: 12, icon: TrendingUp, color: 'bg-emerald-500', trend: { value: 15, isPositive: true } },
        ];
      case 'EMPLOYEE':
      default:
        return [
          { title: 'My Tasks', value: 4, icon: CheckSquare, color: 'bg-blue-500' },
          { title: 'Pending', value: 2, icon: Clock, color: 'bg-amber-500' },
          { title: 'Vacation Days', value: '15', icon: Calendar, color: 'bg-emerald-500', description: 'Days remaining' },
          { title: 'Performance', value: '92%', icon: TrendingUp, color: 'bg-purple-500', trend: { value: 5, isPositive: true } },
        ];
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back, {user?.first_name}! 
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your organization today
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
          <p className="text-lg font-medium">{formatDate(currentTime.toISOString())}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {getRoleSpecificStats().map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {user?.role === 'EMPLOYEE' && (
                <>
                  <Button variant="outline" className="gap-2">
                    <Clock className="w-4 h-4" />
                    Check In
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Request Leave
                  </Button>
                </>
              )}
              {(user?.role === 'HR' || user?.role === 'ADMIN') && (
                <>
                  <Button variant="outline" className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add Employee
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <DollarSign className="w-4 h-4" />
                    Process Payroll
                  </Button>
                </>
              )}
              {user?.role === 'TEAM_MANAGER' && (
                <>
                  <Button variant="outline" className="gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Assign Task
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Approve Leave
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Present</span>
                <span className="font-medium">{stats.presentToday} / {stats.totalEmployees}</span>
              </div>
              <Progress value={(stats.presentToday / stats.totalEmployees) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">On Leave</span>
                <span className="font-medium">{stats.onLeave}</span>
              </div>
              <Progress value={(stats.onLeave / stats.totalEmployees) * 100} className="h-2 bg-orange-100" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Late</span>
                <span className="font-medium">{stats.lateToday}</span>
              </div>
              <Progress value={(stats.lateToday / stats.totalEmployees) * 100} className="h-2 bg-amber-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Task completed</p>
                  <p className="text-xs text-muted-foreground">Q4 Performance Review submitted</p>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Leave approved</p>
                  <p className="text-xs text-muted-foreground">Christmas vacation (5 days)</p>
                </div>
                <span className="text-xs text-muted-foreground">5h ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New candidate</p>
                  <p className="text-xs text-muted-foreground">Applied for Senior Developer</p>
                </div>
                <span className="text-xs text-muted-foreground">1d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary">
                  <span className="text-xs font-medium">DEC</span>
                  <span className="text-lg font-bold">25</span>
                </div>
                <div>
                  <p className="font-medium">Christmas Holiday</p>
                  <p className="text-sm text-muted-foreground">Company-wide</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="text-xs font-medium">DEC</span>
                  <span className="text-lg font-bold">31</span>
                </div>
                <div>
                  <p className="font-medium">Year-End Review</p>
                  <p className="text-sm text-muted-foreground">All departments</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
