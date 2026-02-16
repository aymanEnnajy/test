import { useState } from 'react';
import { Plus, Search, Building2, Users, MoreHorizontal, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';

const demoDepartments = [
  { id: '1', name: 'Human Resources', code: 'HR', employee_count: 5 },
  { id: '2', name: 'Engineering', code: 'ENG', employee_count: 25 },
  { id: '3', name: 'Sales', code: 'SAL', employee_count: 15 },
  { id: '4', name: 'Marketing', code: 'MKT', employee_count: 10 },
  { id: '5', name: 'Finance', code: 'FIN', employee_count: 8 },
];

const demoEmployees = [
  { id: '1', name: 'Sarah Mitchell', department_id: '1', position: 'HR Manager' },
  { id: '2', name: 'James Rodriguez', department_id: '2', position: 'Engineering Manager' },
  { id: '3', name: 'Emily Chen', department_id: '2', position: 'Software Developer' },
];

export function Departments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [expandedDepts, setExpandedDepts] = useState<string[]>([]);

  const filteredDepartments = demoDepartments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDepartmentEmployees = (deptId: string) => demoEmployees.filter(e => e.department_id === deptId);
  const toggleExpand = (deptId: string) => setExpandedDepts(prev => prev.includes(deptId) ? prev.filter(id => id !== deptId) : [...prev, deptId]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Departments</h1>
          <p className="text-muted-foreground mt-1">Manage organizational structure and departments</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Department</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search departments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepartments.map((dept) => {
          const employees = getDepartmentEmployees(dept.id);
          const isExpanded = expandedDepts.includes(dept.id);
          return (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 className="w-6 h-6 text-primary" /></div>
                    <div>
                      <h3 className="font-semibold">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground">{dept.code}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="w-4 h-4" />{employees.length} employees</div>
                </div>
                {employees.length > 0 && (
                  <div className="mt-4">
                    <button onClick={() => toggleExpand(dept.id)} className="flex items-center gap-1 text-sm text-primary hover:underline">{isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}{isExpanded ? 'Hide' : 'Show'} employees</button>
                    {isExpanded && (
                      <div className="mt-3 space-y-2">
                        {employees.map(emp => (
                          <div key={emp.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                            <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{getInitials(emp.name.split(' ')[0], emp.name.split(' ')[1])}</AvatarFallback></Avatar>
                            <span className="text-sm">{emp.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Department</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Department Name</Label><Input placeholder="Enter department name" /></div>
            <div className="space-y-2"><Label>Department Code</Label><Input placeholder="e.g. ENG, HR, MKT" /></div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>Add Department</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
