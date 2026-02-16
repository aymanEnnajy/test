import { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Users, Calendar, Download, Filter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

const departmentStats = [
  { name: 'Engineering', count: 25 },
  { name: 'Sales', count: 15 },
  { name: 'Marketing', count: 10 },
  { name: 'Human Resources', count: 5 },
  { name: 'Finance', count: 8 },
];

const contractTypeStats = [
  { type: 'Full Time', count: 58 },
  { type: 'Part Time', count: 3 },
  { type: 'Contract', count: 2 },
  { type: 'Internship', count: 2 },
];

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const totalEmployees = 65;
  const avgSalary = 72000;
  const attendanceRate = 92;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive HR analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export</Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Employees</p><p className="text-2xl font-bold">{totalEmployees}</p></div><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Departments</p><p className="text-2xl font-bold">5</p></div><div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-purple-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Avg Salary</p><p className="text-2xl font-bold">{formatCurrency(avgSalary)}</p></div><div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-emerald-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Attendance</p><p className="text-2xl font-bold">{attendanceRate}%</p></div><div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-amber-600" /></div></div></CardContent></Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="headcount" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="headcount">Headcount</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="headcount" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Department Distribution</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept) => (
                    <div key={dept.name}>
                      <div className="flex justify-between text-sm mb-1"><span>{dept.name}</span><span className="font-medium">{dept.count} ({Math.round((dept.count / totalEmployees) * 100)}%)</span></div>
                      <Progress value={(dept.count / totalEmployees) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Contract Types</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contractTypeStats.map((contract) => (
                    <div key={contract.type} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="font-medium">{contract.type}</span>
                      <div className="flex items-center gap-3">
                        <Progress value={(contract.count / totalEmployees) * 100} className="w-24 h-2" />
                        <span className="text-sm font-medium w-8">{contract.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader><CardTitle className="text-lg">Attendance Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-emerald-100"><p className="text-2xl font-bold text-emerald-600">58</p><p className="text-sm text-emerald-700">Present</p></div>
                <div className="text-center p-4 rounded-lg bg-amber-100"><p className="text-2xl font-bold text-amber-600">5</p><p className="text-sm text-amber-700">Late</p></div>
                <div className="text-center p-4 rounded-lg bg-red-100"><p className="text-2xl font-bold text-red-600">2</p><p className="text-sm text-red-700">Absent</p></div>
                <div className="text-center p-4 rounded-lg bg-blue-100"><p className="text-2xl font-bold text-blue-600">8</p><p className="text-sm text-blue-700">On Leave</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader><CardTitle className="text-lg">Payroll Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-lg border border-border"><p className="text-sm text-muted-foreground mb-2">Total Payroll</p><p className="text-3xl font-bold">{formatCurrency(4680000)}</p></div>
                <div className="text-center p-6 rounded-lg border border-border"><p className="text-sm text-muted-foreground mb-2">Total Taxes</p><p className="text-3xl font-bold text-red-500">{formatCurrency(975000)}</p></div>
                <div className="text-center p-6 rounded-lg border border-border"><p className="text-sm text-muted-foreground mb-2">Total Bonuses</p><p className="text-3xl font-bold text-emerald-500">{formatCurrency(156000)}</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Available Reports */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Available Reports</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Employee List', description: 'Complete employee directory', icon: Users },
              { name: 'Attendance Report', description: 'Monthly attendance summary', icon: Calendar },
              { name: 'Payroll Report', description: 'Detailed payroll breakdown', icon: BarChart3 },
              { name: 'Leave Report', description: 'Vacation and leave summary', icon: FileText },
              { name: 'Performance Report', description: 'Employee performance metrics', icon: TrendingUp },
              { name: 'Recruitment Report', description: 'Hiring pipeline analysis', icon: PieChart },
            ].map((report) => (
              <div key={report.name} className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><report.icon className="w-5 h-5 text-primary" /></div>
                <div className="flex-1">
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
                <Download className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
