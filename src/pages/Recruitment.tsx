import { useState } from 'react';
import { Plus, Search, Filter, Briefcase, MapPin, DollarSign, Calendar, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, formatCurrency } from '@/lib/utils';

const demoJobs = [
  { id: '1', title: 'Senior Software Engineer', department: 'Engineering', description: 'We are looking for an experienced software engineer...', requirements: '5+ years of experience with React and Node.js', location: 'San Francisco, CA (Hybrid)', type: 'FULL_TIME', salary_min: 120000, salary_max: 160000, status: 'PUBLISHED', published_at: '2024-12-01' },
  { id: '2', title: 'HR Specialist', department: 'Human Resources', description: 'Join our HR team...', requirements: '3+ years of HR experience', location: 'San Francisco, CA (On-site)', type: 'FULL_TIME', salary_min: 60000, salary_max: 80000, status: 'PUBLISHED', published_at: '2024-12-05' },
  { id: '3', title: 'Marketing Manager', department: 'Marketing', description: 'Lead our marketing initiatives...', requirements: '5+ years of marketing experience', location: 'Remote', type: 'FULL_TIME', salary_min: 90000, salary_max: 120000, status: 'CLOSED', published_at: '2024-11-01' },
];

const demoCandidates = [
  { id: '1', job_title: 'Senior Software Engineer', first_name: 'John', last_name: 'Doe', email: 'john@email.com', status: 'INTERVIEW', interview_date: '2024-12-15T14:00:00' },
  { id: '2', job_title: 'Senior Software Engineer', first_name: 'Jane', last_name: 'Smith', email: 'jane@email.com', status: 'SCREENING' },
  { id: '3', job_title: 'HR Specialist', first_name: 'Michael', last_name: 'Johnson', email: 'michael@email.com', status: 'NEW' },
];

export function Recruitment() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof demoJobs[0] | null>(null);

  const filteredJobs = demoJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getCandidateStatusColor = (status: string) => {
    const colors: Record<string, string> = { NEW: 'bg-blue-500', SCREENING: 'bg-amber-500', INTERVIEW: 'bg-purple-500', OFFER: 'bg-orange-500', HIRED: 'bg-emerald-500', REJECTED: 'bg-red-500' };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Recruitment</h1>
          <p className="text-muted-foreground mt-1">Manage job openings and track candidates</p>
        </div>
        <Button onClick={() => setIsJobDialogOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> Post Job</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Open Positions</p><p className="text-2xl font-bold text-blue-500">{demoJobs.filter(j => j.status === 'PUBLISHED').length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Candidates</p><p className="text-2xl font-bold">{demoCandidates.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">In Interview</p><p className="text-2xl font-bold text-purple-500">{demoCandidates.filter(c => c.status === 'INTERVIEW').length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Hired</p><p className="text-2xl font-bold text-emerald-500">{demoCandidates.filter(c => c.status === 'HIRED').length}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search job openings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="jobs">Job Openings</TabsTrigger>
          <TabsTrigger value="candidates">All Candidates</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <Badge variant={job.status === 'PUBLISHED' ? 'default' : 'secondary'}>{job.status}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.department}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-sm"><DollarSign className="w-4 h-4" />{job.salary_min && job.salary_max ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}` : 'Not specified'}</span>
                          <span className="text-sm text-muted-foreground">Posted {formatDate(job.published_at)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}><Eye className="w-4 h-4 mr-1" /> View</Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Close</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candidates">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {demoCandidates.map((candidate) => (
                  <div key={candidate.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary">{candidate.first_name[0]}{candidate.last_name[0]}</AvatarFallback></Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{candidate.first_name} {candidate.last_name}</h4>
                            <p className="text-sm text-muted-foreground">{candidate.email}</p>
                          </div>
                          <Badge className={getCandidateStatusColor(candidate.status)}>{candidate.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{candidate.job_title}</span>
                          {candidate.interview_date && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Interview: {formatDate(candidate.interview_date)}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Post Job Dialog */}
      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Post New Job</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Job Title</Label><Input placeholder="Enter job title" /></div>
            <div className="space-y-2"><Label>Department</Label><Select><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent><SelectItem value="eng">Engineering</SelectItem><SelectItem value="hr">Human Resources</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Enter job description" rows={3} /></div>
            <div className="space-y-2"><Label>Requirements</Label><Textarea placeholder="Enter job requirements" rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Location</Label><Input placeholder="e.g. San Francisco, CA" /></div>
              <div className="space-y-2"><Label>Job Type</Label><Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="FULL_TIME">Full Time</SelectItem><SelectItem value="PART_TIME">Part Time</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Salary Min</Label><Input type="number" placeholder="50000" /></div>
              <div className="space-y-2"><Label>Salary Max</Label><Input type="number" placeholder="80000" /></div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsJobDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsJobDialogOpen(false)}>Post Job</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Job Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
            <DialogDescription>{selectedJob?.department}</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{selectedJob.type.replace('_', ' ')}</Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="w-4 h-4" />{selectedJob.location}</span>
                {selectedJob.salary_min && selectedJob.salary_max && <span className="flex items-center gap-1 text-sm text-muted-foreground"><DollarSign className="w-4 h-4" />{formatCurrency(selectedJob.salary_min)} - {formatCurrency(selectedJob.salary_max)}</span>}
              </div>
              <div><h4 className="font-medium mb-2">Description</h4><p className="text-sm text-muted-foreground">{selectedJob.description}</p></div>
              <div><h4 className="font-medium mb-2">Requirements</h4><p className="text-sm text-muted-foreground">{selectedJob.requirements}</p></div>
              <div className="flex gap-3 pt-4"><Button className="flex-1">Apply Now</Button><Button variant="outline">Save for Later</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
