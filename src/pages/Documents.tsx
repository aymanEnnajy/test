import { useState } from 'react';
import { Plus, Search, Filter, FileText, Download, Eye, Clock, CheckCircle2, Upload, MoreHorizontal, FileSpreadsheet, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';

const demoDocuments = [
  { id: '1', type: 'ATTESTATION', title: 'Employment Certificate', description: 'Need for visa application', status: 'READY', requested_at: '2024-12-01', completed_at: '2024-12-03' },
  { id: '2', type: 'PAYSLIP', title: 'November 2024 Payslip', description: 'For loan application', status: 'DELIVERED', requested_at: '2024-12-05', completed_at: '2024-12-06' },
  { id: '3', type: 'CERTIFICATE', title: 'Salary Certificate', description: 'For apartment rental', status: 'PENDING', requested_at: '2024-12-10', completed_at: null },
];

export function Documents() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const filteredDocuments = demoDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'PAYSLIP': return <FileSpreadsheet className="w-5 h-5" />;
      case 'CERTIFICATE': return <FileImage className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = { ATTESTATION: 'bg-blue-500', CERTIFICATE: 'bg-emerald-500', CONTRACT: 'bg-purple-500', PAYSLIP: 'bg-orange-500', OTHER: 'bg-gray-500' };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Documents</h1>
          <p className="text-muted-foreground mt-1">Request and manage employee documents</p>
        </div>
        {user?.role === 'EMPLOYEE' && (
          <Button onClick={() => setIsRequestDialogOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Request Document</Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Requests</p><p className="text-2xl font-bold">{demoDocuments.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-amber-500">{demoDocuments.filter(d => d.status === 'PENDING').length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Ready</p><p className="text-2xl font-bold text-blue-500">{demoDocuments.filter(d => d.status === 'READY').length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Delivered</p><p className="text-2xl font-bold text-emerald-500">{demoDocuments.filter(d => d.status === 'DELIVERED').length}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search documents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Document Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ATTESTATION">Attestation</SelectItem>
                <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="PAYSLIP">Payslip</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Document Requests ({filteredDocuments.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${getDocumentTypeColor(doc.type)}`}>{getDocumentIcon(doc.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />Requested {formatDate(doc.requested_at)}</span>
                        {doc.completed_at && <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />Completed {formatDate(doc.completed_at)}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={doc.status === 'DELIVERED' ? 'default' : doc.status === 'REJECTED' ? 'destructive' : 'secondary'}>{doc.status}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View Details</DropdownMenuItem>
                          <DropdownMenuItem><Download className="w-4 h-4 mr-2" /> Download</DropdownMenuItem>
                          {(user?.role === 'ADMIN' || user?.role === 'HR') && doc.status === 'PENDING' && <DropdownMenuItem><Upload className="w-4 h-4 mr-2" /> Upload</DropdownMenuItem>}
                        </DropdownMenuContent>
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
          <DialogHeader><DialogTitle>Request Document</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Document Type</Label><Select><SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger><SelectContent><SelectItem value="ATTESTATION">Employment Attestation</SelectItem><SelectItem value="CERTIFICATE">Salary Certificate</SelectItem><SelectItem value="PAYSLIP">Payslip</SelectItem><SelectItem value="OTHER">Other</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Title</Label><Input placeholder="Enter document title" /></div>
            <div className="space-y-2"><Label>Description / Purpose</Label><Textarea placeholder="Explain why you need this document" rows={3} /></div>
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
