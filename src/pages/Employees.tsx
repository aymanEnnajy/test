import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Building2,
  Briefcase,
  Calendar,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getInitials, formatDate, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, EyeOff } from 'lucide-react';

// Demo data
const demoEmployees = [
  { id: '1', employee_code: 'EMP001', first_name: 'Sarah', last_name: 'Mitchell', email: 'sarah@company.com', department: 'Human Resources', position: 'HR Manager', contract_type: 'FULL_TIME', hire_date: '2022-01-15', base_salary: 75000 },
  { id: '2', employee_code: 'EMP002', first_name: 'James', last_name: 'Rodriguez', email: 'james@company.com', department: 'Engineering', position: 'Engineering Manager', contract_type: 'FULL_TIME', hire_date: '2021-06-01', base_salary: 95000 },
  { id: '3', employee_code: 'EMP003', first_name: 'Emily', last_name: 'Chen', email: 'emily@company.com', department: 'Engineering', position: 'Software Developer', contract_type: 'FULL_TIME', hire_date: '2023-03-10', base_salary: 65000 },
  { id: '4', employee_code: 'EMP004', first_name: 'Michael', last_name: 'Johnson', email: 'michael@company.com', department: 'Sales', position: 'Sales Representative', contract_type: 'FULL_TIME', hire_date: '2022-09-20', base_salary: 55000 },
  { id: '5', employee_code: 'EMP005', first_name: 'Lisa', last_name: 'Williams', email: 'lisa@company.com', department: 'Marketing', position: 'Marketing Specialist', contract_type: 'FULL_TIME', hire_date: '2023-01-05', base_salary: 58000 },
];

const demoDepartments = [
  { id: '1', name: 'Human Resources' },
  { id: '2', name: 'Engineering' },
  { id: '3', name: 'Sales' },
  { id: '4', name: 'Marketing' },
  { id: '5', name: 'Finance' },
];

export function Employees() {
  const { addEmployee } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    department_id: '',
    position: '',
    base_salary: '0',
    role: 'EMPLOYEE' as any,
  });

  const handleAddEmployee = async () => {
    if (!newEmployee.email || !newEmployee.password || !newEmployee.first_name || !newEmployee.last_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    const { error } = await addEmployee({
      ...newEmployee,
      base_salary: parseFloat(newEmployee.base_salary),
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Employee account created successfully');
      setIsAddDialogOpen(false);
      setNewEmployee({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        department_id: '',
        position: '',
        base_salary: '0',
        role: 'EMPLOYEE',
      });
    }
    setIsLoading(false);
  };

  const filteredEmployees = demoEmployees.filter(emp => {
    const matchesSearch =
      emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || emp.department === demoDepartments.find(d => d.id === selectedDepartment)?.name;
    return matchesSearch && matchesDepartment;
  });

  const getContractBadge = (type: string) => {
    const variants: Record<string, string> = {
      FULL_TIME: 'default',
      PART_TIME: 'secondary',
      CONTRACT: 'outline',
      INTERNSHIP: 'destructive',
    };
    return variants[type] || 'default';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-muted-foreground mt-1">Manage your workforce and employee information</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {demoDepartments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Employee List ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {getInitials(employee.first_name, employee.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.first_name} {employee.last_name}</p>
                          <p className="text-xs text-muted-foreground">{employee.employee_code}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {employee.department}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        {employee.position}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getContractBadge(employee.contract_type) as any}>
                        {employee.contract_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(employee.hire_date)}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(employee.base_salary)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={newEmployee.first_name}
                onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={newEmployee.last_name}
                onChange={(e) => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
                placeholder="Enter last name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  placeholder="Set initial password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={newEmployee.department_id}
                onValueChange={(val) => setNewEmployee({ ...newEmployee, department_id: val })}
              >
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>{demoDepartments.map(dept => <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Input
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                placeholder="Enter position"
              />
            </div>
            <div className="space-y-2">
              <Label>Base Salary</Label>
              <Input
                type="number"
                value={newEmployee.base_salary}
                onChange={(e) => setNewEmployee({ ...newEmployee, base_salary: e.target.value })}
                placeholder="50000"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={newEmployee.role}
                onValueChange={(val) => setNewEmployee({ ...newEmployee, role: val as any })}
              >
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem value="TEAM_MANAGER">Team Manager</SelectItem>
                  <SelectItem value="HR">HR Manager</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEmployee} disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Employee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
