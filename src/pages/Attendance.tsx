import { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, QrCode, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials, formatDate, getStatusColor } from '@/lib/utils';

const demoAttendance = [
  { id: '1', employee_id: '1', first_name: 'Sarah', last_name: 'Mitchell', date: new Date().toISOString().split('T')[0], check_in: '08:55:00', check_out: null, status: 'PRESENT' },
  { id: '2', employee_id: '2', first_name: 'James', last_name: 'Rodriguez', date: new Date().toISOString().split('T')[0], check_in: '09:15:00', check_out: null, status: 'LATE' },
  { id: '3', employee_id: '3', first_name: 'Emily', last_name: 'Chen', date: new Date().toISOString().split('T')[0], check_in: '08:45:00', check_out: null, status: 'PRESENT' },
  { id: '4', employee_id: '4', first_name: 'Michael', last_name: 'Johnson', date: new Date().toISOString().split('T')[0], check_in: null, check_out: null, status: 'ON_LEAVE' },
  { id: '5', employee_id: '5', first_name: 'Lisa', last_name: 'Williams', date: new Date().toISOString().split('T')[0], check_in: '08:30:00', check_out: null, status: 'PRESENT' },
];

export function Attendance() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = {
    present: demoAttendance.filter(a => a.status === 'PRESENT').length,
    late: demoAttendance.filter(a => a.status === 'LATE').length,
    absent: demoAttendance.filter(a => a.status === 'ABSENT').length,
    onLeave: demoAttendance.filter(a => a.status === 'ON_LEAVE').length,
    total: demoAttendance.length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Attendance</h1>
          <p className="text-muted-foreground mt-1">Track employee attendance and working hours</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Export</Button>
          {user?.role === 'EMPLOYEE' && (
            <Button onClick={() => setShowQRDialog(true)} className="gap-2"><QrCode className="w-4 h-4" /> Scan QR</Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Present</p><p className="text-2xl font-bold text-emerald-500">{stats.present}</p></div><div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Clock className="w-5 h-5 text-emerald-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Late</p><p className="text-2xl font-bold text-amber-500">{stats.late}</p></div><div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Absent</p><p className="text-2xl font-bold text-red-500">{stats.absent}</p></div><div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><Clock className="w-5 h-5 text-red-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">On Leave</p><p className="text-2xl font-bold text-blue-500">{stats.onLeave}</p></div><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-600" /></div></div></CardContent></Card>
      </div>

      {/* Employee Check-in */}
      {user?.role === 'EMPLOYEE' && (
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Time</p>
                  <p className="text-3xl font-bold font-mono">{currentTime.toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={isCheckedIn ? 'default' : 'secondary'}>{isCheckedIn ? 'Checked In' : 'Not Checked In'}</Badge>
                <Button size="lg" onClick={() => setIsCheckedIn(!isCheckedIn)} variant={isCheckedIn ? 'destructive' : 'default'}>{isCheckedIn ? 'Check Out' : 'Check In'}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Today's Attendance</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon"><ChevronLeft className="w-4 h-4" /></Button>
            <span className="text-sm font-medium">{formatDate(new Date().toISOString())}</span>
            <Button variant="outline" size="icon"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoAttendance.map((record) => (
              <div key={record.id} className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary text-sm">{getInitials(record.first_name, record.last_name)}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <p className="font-medium">{record.first_name} {record.last_name}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {record.check_in && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> In: {record.check_in}</span>}
                  </div>
                </div>
                <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* QR Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-center">Scan QR Code</DialogTitle></DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-64 h-64 bg-white rounded-xl flex items-center justify-center border-2 border-dashed border-primary/50">
              <div className="text-center">
                <QrCode className="w-32 h-32 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground mt-4">Scan to check in/out</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground"><MapPin className="w-4 h-4" /><span>Location: Main Office</span></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
