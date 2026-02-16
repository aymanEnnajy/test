import { useState } from 'react';
import { DollarSign, Download, Calendar, Search, FileText, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials, formatCurrency } from '@/lib/utils';

const demoPayrolls = [
  { id: '1', employee_name: 'Sarah Mitchell', month: 11, year: 2024, base_salary: 75000, overtime_pay: 0, bonuses: 2000, deductions: 1500, tax_amount: 15000, net_salary: 60500, status: 'PAID' },
  { id: '2', employee_name: 'James Rodriguez', month: 11, year: 2024, base_salary: 95000, overtime_pay: 500, bonuses: 3000, deductions: 1000, tax_amount: 19500, net_salary: 78000, status: 'PAID' },
  { id: '3', employee_name: 'Emily Chen', month: 11, year: 2024, base_salary: 65000, overtime_pay: 800, bonuses: 1000, deductions: 500, tax_amount: 13000, net_salary: 53300, status: 'PAID' },
  { id: '4', employee_name: 'Sarah Mitchell', month: 12, year: 2024, base_salary: 75000, overtime_pay: 0, bonuses: 5000, deductions: 1500, tax_amount: 15000, net_salary: 63500, status: 'PENDING' },
];

export function Payroll() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('11');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [selectedPayroll, setSelectedPayroll] = useState<typeof demoPayrolls[0] | null>(null);

  const filteredPayrolls = demoPayrolls.filter(payroll => {
    const matchesSearch = payroll.employee_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = payroll.month.toString() === selectedMonth;
    const matchesYear = payroll.year.toString() === selectedYear;
    const matchesUser = user?.role === 'ADMIN' || user?.role === 'HR' || payroll.employee_name.includes(user?.first_name || '');
    return matchesSearch && matchesMonth && matchesYear && matchesUser;
  });

  const totalPayroll = filteredPayrolls.reduce((sum, p) => sum + p.net_salary, 0);
  const totalTaxes = filteredPayrolls.reduce((sum, p) => sum + p.tax_amount, 0);
  const totalBonuses = filteredPayrolls.reduce((sum, p) => sum + p.bonuses, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Payroll</h1>
          <p className="text-muted-foreground mt-1">Manage employee salaries and generate payslips</p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'HR') && (
          <Button className="gap-2"><DollarSign className="w-4 h-4" /> Process Payroll</Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Payroll</p><p className="text-2xl font-bold">{formatCurrency(totalPayroll)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Taxes</p><p className="text-2xl font-bold text-red-500">{formatCurrency(totalTaxes)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Bonuses</p><p className="text-2xl font-bold text-emerald-500">{formatCurrency(totalBonuses)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Processed</p><p className="text-2xl font-bold">{filteredPayrolls.filter(p => p.status === 'PAID').length} / {filteredPayrolls.length}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search payrolls..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-40"><Calendar className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>{Array.from({ length: 12 }, (_, i) => <SelectItem key={i + 1} value={(i + 1).toString()}>{new Date(2024, i).toLocaleString('default', { month: 'long' })}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-32"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="2024">2024</SelectItem><SelectItem value="2023">2023</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payroll List */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Payroll Records ({filteredPayrolls.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayrolls.map((payroll) => (
              <div key={payroll.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary">{getInitials(payroll.employee_name.split(' ')[0], payroll.employee_name.split(' ')[1])}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{payroll.employee_name}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(payroll.year, payroll.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={payroll.status === 'PAID' ? 'default' : 'secondary'}>{payroll.status}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedPayroll(payroll)}><Eye className="w-4 h-4 mr-2" /> View Details</DropdownMenuItem>
                          <DropdownMenuItem><FileText className="w-4 h-4 mr-2" /> View Payslip</DropdownMenuItem>
                          <DropdownMenuItem><Download className="w-4 h-4 mr-2" /> Download</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                    <div><p className="text-xs text-muted-foreground">Base Salary</p><p className="font-medium">{formatCurrency(payroll.base_salary)}</p></div>
                    <div><p className="text-xs text-muted-foreground">Overtime</p><p className="font-medium text-emerald-500">+{formatCurrency(payroll.overtime_pay)}</p></div>
                    <div><p className="text-xs text-muted-foreground">Deductions</p><p className="font-medium text-red-500">-{formatCurrency(payroll.deductions + payroll.tax_amount)}</p></div>
                    <div><p className="text-xs text-muted-foreground">Net Salary</p><p className="font-bold text-lg">{formatCurrency(payroll.net_salary)}</p></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={!!selectedPayroll} onOpenChange={() => setSelectedPayroll(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Payslip Details</DialogTitle></DialogHeader>
          {selectedPayroll && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary/10 text-primary">{getInitials(selectedPayroll.employee_name.split(' ')[0], selectedPayroll.employee_name.split(' ')[1])}</AvatarFallback></Avatar>
                <div>
                  <p className="font-medium">{selectedPayroll.employee_name}</p>
                  <p className="text-sm text-muted-foreground">{new Date(selectedPayroll.year, selectedPayroll.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="font-medium mb-3">Earnings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Base Salary</span><span>{formatCurrency(selectedPayroll.base_salary)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Overtime Pay</span><span className="text-emerald-500">+{formatCurrency(selectedPayroll.overtime_pay)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Bonuses</span><span className="text-emerald-500">+{formatCurrency(selectedPayroll.bonuses)}</span></div>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <h4 className="font-medium mb-3">Deductions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span className="text-red-500">-{formatCurrency(selectedPayroll.tax_amount)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Other Deductions</span><span className="text-red-500">-{formatCurrency(selectedPayroll.deductions)}</span></div>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center"><span className="font-medium text-lg">Net Salary</span><span className="font-bold text-2xl text-primary">{formatCurrency(selectedPayroll.net_salary)}</span></div>
              </div>
              <div className="flex gap-2 pt-4"><Button className="flex-1 gap-2"><Download className="w-4 h-4" /> Download Payslip</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
