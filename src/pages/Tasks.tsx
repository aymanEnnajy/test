import { useState } from 'react';
import { Plus, Search, Filter, Calendar, Flag, CheckCircle2, Circle, Clock, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials, formatDate } from '@/lib/utils';

const demoTasks = [
  { id: '1', title: 'Complete Q4 Performance Review', description: 'Review and submit performance evaluations', assigned_to: 'Sarah Mitchell', status: 'IN_PROGRESS', priority: 'HIGH', due_date: '2024-12-31' },
  { id: '2', title: 'Update Employee Handbook', description: 'Review and update policies', assigned_to: 'James Rodriguez', status: 'TODO', priority: 'MEDIUM', due_date: '2024-12-20' },
  { id: '3', title: 'Prepare Training Materials', description: 'Create onboarding materials', assigned_to: 'Emily Chen', status: 'COMPLETED', priority: 'MEDIUM', due_date: '2024-12-10' },
  { id: '4', title: 'Fix Payroll Module Bug', description: 'Investigate overtime calculation', assigned_to: 'Michael Johnson', status: 'UNDER_REVIEW', priority: 'URGENT', due_date: '2024-12-15' },
];

export function Tasks() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredTasks = demoTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = { LOW: 'bg-emerald-500', MEDIUM: 'bg-amber-500', HIGH: 'bg-orange-500', URGENT: 'bg-red-500' };
    return colors[priority] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage tasks and track team performance</p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'HR' || user?.role === 'TEAM_MANAGER') && (
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Assign Task</Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{demoTasks.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">To Do</p><p className="text-2xl font-bold text-gray-500">{demoTasks.filter(t => t.status === 'TODO').length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">In Progress</p><p className="text-2xl font-bold text-blue-500">{demoTasks.filter(t => t.status === 'IN_PROGRESS').length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Review</p><p className="text-2xl font-bold text-amber-500">{demoTasks.filter(t => t.status === 'UNDER_REVIEW').length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold text-emerald-500">{demoTasks.filter(t => t.status === 'COMPLETED').length}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="board">Board View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-muted/50 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getStatusIcon(task.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View</DropdownMenuItem>
                              <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <Badge variant="outline" className="gap-1"><Flag className="w-3 h-3" /> {task.priority}</Badge>
                          <Badge variant={task.status === 'COMPLETED' ? 'default' : 'secondary'}>{task.status.replace('_', ' ')}</Badge>
                          {task.due_date && <span className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="w-4 h-4" /> Due {formatDate(task.due_date)}</span>}
                          <div className="flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarFallback className="text-xs bg-primary/10 text-primary">{getInitials(task.assigned_to.split(' ')[0], task.assigned_to.split(' ')[1])}</AvatarFallback></Avatar><span className="text-sm text-muted-foreground">{task.assigned_to}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['TODO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'].map((status) => (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between"><h3 className="font-medium">{status.replace('_', ' ')}</h3><Badge variant="secondary">{filteredTasks.filter(t => t.status === status).length}</Badge></div>
                <div className="space-y-3">
                  {filteredTasks.filter(t => t.status === status).map((task) => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2"><Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge></div>
                        <h4 className="font-medium text-sm mb-2">{task.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{getInitials(task.assigned_to.split(' ')[0], task.assigned_to.split(' ')[1])}</AvatarFallback></Avatar>
                          {task.due_date && <span className="text-xs text-muted-foreground">{formatDate(task.due_date)}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Task Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Assign New Task</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Task Title</Label><Input placeholder="Enter task title" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Enter task description" rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Assign To</Label><Select><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger><SelectContent><SelectItem value="1">Sarah Mitchell</SelectItem><SelectItem value="2">James Rodriguez</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Priority</Label><Select><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger><SelectContent><SelectItem value="LOW">Low</SelectItem><SelectItem value="MEDIUM">Medium</SelectItem><SelectItem value="HIGH">High</SelectItem><SelectItem value="URGENT">Urgent</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Due Date</Label><Input type="date" /></div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>Assign Task</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
