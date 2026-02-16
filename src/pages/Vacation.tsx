import { useState } from 'react';
import { Plus, Calendar, Search, Filter, MoreHorizontal, Eye, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials, formatDate } from '@/lib/utils';

const demoVacations = [
  { id: '1', employee_name: 'Emily Chen', type: 'ANNUAL', start_date: '2024-12-23', end_date: '2024-12-27', days: 5, reason: 'Christmas vacation', status: 'APPROVED' },
  { id: '2', employee_name: 'Michael Johnson', type: 'SICK', start_date: '2024-12-10', end_date: '2024-12-12', days: 3, reason: 'Medical appointment', status: 'PENDING' },
  { id: '3', employee_name: 'Lisa Williams', type: 'ANNUAL', start_date: '2025-01-15', end_date: '2025-01-20', days: 6, reason: 'Personal trip', status: 'PENDING' },
];

export function Vacation() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const filteredRequests = demoVacations.filter(req => {
    const matchesSearch = req.employee_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || req.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getLeaveTypeColor = (type: string) => {
    const colors: Record<string, string> = { ANNUAL: 'bg-blue-500', SICK: 'bg-red-500', MATERNITY: 'bg-pink-500', PATERNITY: 'bg-indigo-500', UNPAID: 'bg-gray-500', OTHER: 'bg-purple-500' };
    return colors[type] || 'bg-gray-500';
  };

  const vacationStats = { total: 15, used: 8, remaining: 7, pending: 2 };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Vacation Management</h1>
          <p className="text-muted-foreground mt-1">Manage leave requests and track vacation balances</p>
        </div>
        {user?.role === 'EMPLOYEE' && (
          <Button onClick={() => setIsRequestDialogOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Request Leave</Button>
        )}
      </div>

      {/* Employee Balance */}
      {user?.role === 'EMPLOYEE' && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div><p className="text-sm text-muted-foreground">Total</p><p className="text-3xl font-bold">{vacationStats.total}</p><p className="text-xs text-muted-foreground">days/year</p></div>
              <div><p className="text-sm text-muted-foreground">Used</p><p className="text-3xl font-bold text-amber-500">{vacationStats.used}</p><p className="text-xs text-muted-foreground">days</p></div>
              <div><p className="text-sm text-muted-foreground">Remaining</p><p className="text-3xl font-bold text-emerald-500">{vacationStats.remaining}</p><p className="text-xs text-muted-foreground">days</p></div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Usage</span><span className="font-medium">{Math.round((vacationStats.used / vacationStats.total) * 100)}%</span></div>
              <Progress value={(vacationStats.used / vacationStats.total) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats for HR/Admin */}
      {(user?.role === 'ADMIN' || user?.role === 'HR') && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-amber-500">{demoVacations.filter(r => r.status === 'PENDING').length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Approved</p><p className="text-2xl font-bold text-emerald-500">{demoVacations.filter(r => r.status === 'APPROVED').length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Rejected</p><p className="text-2xl font-bold text-red-500">{demoVacations.filter(r => r.status === 'REJECTED').length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">On Leave Today</p><p className="text-2xl font-bold text-blue-500">3</p></CardContent></Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search requests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Leave Requests ({filteredRequests.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary">{getInitials(request.employee_name.split(' ')[0], request.employee_name.split(' ')[1])}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{request.type} Leave</h3>
                        <Badge className={getLeaveTypeColor(request.type)}>{request.days} days</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(request.start_date)} - {formatDate(request.end_date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={request.status === 'APPROVED' ? 'default' : request.status === 'REJECTED' ? 'destructive' : 'secondary'}>{request.status}</Badge>
                      {(user?.role === 'ADMIN' || user?.role === 'HR' || user?.role === 'TEAM_MANAGER') && request.status === 'PENDING' && (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"><Check className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"><X className="w-4 h-4" /></Button>
                        </div>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end"><DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View Details</DropdownMenuItem></DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Request Leave</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Leave Type</Label><Select><SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger><SelectContent><SelectItem value="ANNUAL">Annual Leave</SelectItem><SelectItem value="SICK">Sick Leave</SelectItem><SelectItem value="OTHER">Other</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" /></div>
              <div className="space-y-2"><Label>End Date</Label><Input type="date" /></div>
            </div>
            <div className="space-y-2"><Label>Reason</Label><Textarea placeholder="Enter reason for leave" rows={3} /></div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsRequestDialogOpen(false)}>Submit Request</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
