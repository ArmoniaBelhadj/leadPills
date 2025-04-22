import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterSectionProps {
  filterOptions: {
    status: string;
    email: string;
    phone: string;
    source: string;
    date: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterSection({ filterOptions, onFilterChange }: FilterSectionProps) {
  const handleChange = (field: string, value: string) => {
    onFilterChange({ ...filterOptions, [field]: value });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1">
            <Label htmlFor="status-filter">Status</Label>
            <Select 
              value={filterOptions.status} 
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="unqualified">Unqualified</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="email-filter">Email</Label>
            <Input
              id="email-filter"
              placeholder="Search by email"
              value={filterOptions.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="phone-filter">Phone</Label>
            <Input
              id="phone-filter"
              placeholder="Search by phone"
              value={filterOptions.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="source-filter">Source</Label>
            <Select 
              value={filterOptions.source} 
              onValueChange={(value) => handleChange('source', value)}
            >
              <SelectTrigger id="source-filter">
                <SelectValue placeholder="All sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="mubawab">Mubawab</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="website">Website</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="date-filter">Date</Label>
            <Input
              id="date-filter"
              type="date"
              value={filterOptions.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
