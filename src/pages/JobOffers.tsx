import { useState } from 'react';
import { Search, Briefcase, MapPin, DollarSign, Calendar, ExternalLink, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatDate, formatCurrency } from '@/lib/utils';

const demoJobs = [
  { id: '1', title: 'Senior Software Engineer', department: 'Engineering', description: 'We are looking for an experienced software engineer to join our team...', requirements: '5+ years of experience with React and Node.js', location: 'San Francisco, CA (Hybrid)', type: 'FULL_TIME', salary_min: 120000, salary_max: 160000, status: 'PUBLISHED', published_at: '2024-12-01' },
  { id: '2', title: 'HR Specialist', department: 'Human Resources', description: 'Join our HR team to help manage employee relations...', requirements: '3+ years of HR experience', location: 'San Francisco, CA (On-site)', type: 'FULL_TIME', salary_min: 60000, salary_max: 80000, status: 'PUBLISHED', published_at: '2024-12-05' },
  { id: '3', title: 'Marketing Manager', department: 'Marketing', description: 'Lead our marketing initiatives and drive growth...', requirements: '5+ years of marketing experience', location: 'Remote', type: 'FULL_TIME', salary_min: 90000, salary_max: 120000, status: 'CLOSED', published_at: '2024-11-01' },
];

export function JobOffers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<typeof demoJobs[0] | null>(null);

  const filteredJobs = demoJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || job.type === selectedType;
    return matchesSearch && matchesType && job.status === 'PUBLISHED';
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Job Opportunities</h1>
        <p className="text-muted-foreground mt-1">Explore open positions and join our team</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search job openings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48"><Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="Job Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                <SelectItem value="PART_TIME">Part Time</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-xl">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.department}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                    <Badge variant="secondary">{job.type.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-muted-foreground mt-3 line-clamp-2">{job.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    {job.salary_min && job.salary_max && <span className="flex items-center gap-1 text-sm font-medium"><DollarSign className="w-4 h-4" />{formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}</span>}
                    <span className="flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="w-4 h-4" />Posted {formatDate(job.published_at)}</span>
                  </div>
                </div>
                <Button onClick={() => setSelectedJob(job)} className="gap-2"><ExternalLink className="w-4 h-4" />View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Job Details Dialog */}
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
