import { useState } from 'react';
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  MapPin,
  Edit2,
  Camera,
  Award,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { cn, getInitials, formatDate } from '@/lib/utils';
import { mockTasks, mockVacationRequests, mockPayrolls } from '@/lib/mockData';

export function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const userTasks = mockTasks.filter(t => t.assigned_to === user?.id);
  const userVacations = mockVacationRequests.filter(v => v.employee_id === user?.id);
  const userPayrolls = mockPayrolls.filter(p => p.employee_id === user?.id);

  const completedTasks = userTasks.filter(t => t.status === 'COMPLETED').length;
  const taskCompletionRate = userTasks.length > 0 ? (completedTasks / userTasks.length) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />
        <CardContent className="relative pt-0">
          <div className="flex flex-col md:flex-row md:items-end -mt-12 mb-6 gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={user?.avatar_url || undefined} />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {user ? getInitials(user.first_name, user.last_name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-white shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-muted-foreground">{user?.position}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Badge variant="secondary">{user?.role.replace('_', ' ')}</Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  {user?.department_id}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Info */}
        <div className="space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user?.phone || '+1 555-0000'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">San Francisco, CA</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{formatDate(user?.created_at || '')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Info */}
          <Card>
            <CardHeader>
              <CardTitle>Work Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{user?.department_id || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{user?.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium">EMP{user?.id?.padStart(3, '0')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="vacation">Vacation</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Performance Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold">{userTasks.length}</p>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-green-500">{completedTasks}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-blue-500">{userVacations.filter(v => v.status === 'APPROVED').length}</p>
                    <p className="text-sm text-muted-foreground">Vacations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-purple-500">92%</p>
                    <p className="text-sm text-muted-foreground">Performance</p>
                  </CardContent>
                </Card>
              </div>

              {/* Task Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Task Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(taskCompletionRate)}%</span>
                    </div>
                    <Progress value={taskCompletionRate} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                    <div>
                      <p className="text-xl font-bold">{userTasks.filter(t => t.status === 'TODO').length}</p>
                      <p className="text-xs text-muted-foreground">To Do</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{userTasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{completedTasks}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>My Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          task.status === 'COMPLETED' ? 'bg-green-500' : 
                          task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-gray-400'
                        )} />
                        <div className="flex-1">
                          <p className={cn(
                            "font-medium",
                            task.status === 'COMPLETED' && "line-through text-muted-foreground"
                          )}>{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.status.replace('_', ' ')}</p>
                        </div>
                        {task.due_date && (
                          <span className="text-sm text-muted-foreground">
                            Due {formatDate(task.due_date)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vacation">
              <Card>
                <CardHeader>
                  <CardTitle>Vacation History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userVacations.map((vacation) => (
                      <div key={vacation.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="font-medium">{vacation.type} Leave</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(vacation.start_date)} - {formatDate(vacation.end_date)}
                          </p>
                        </div>
                        <Badge variant={vacation.status === 'APPROVED' ? 'default' : 'secondary'}>
                          {vacation.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payroll">
              <Card>
                <CardHeader>
                  <CardTitle>Payroll History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userPayrolls.map((payroll) => (
                      <div key={payroll.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="font-medium">
                            {new Date(payroll.year, payroll.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Base: {payroll.base_salary.toLocaleString()} | Net: {payroll.net_salary.toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={payroll.status === 'PAID' ? 'default' : 'secondary'}>
                          {payroll.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
