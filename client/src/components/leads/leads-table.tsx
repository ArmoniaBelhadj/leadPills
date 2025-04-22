import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Lead } from "@shared/schema";
import { cn } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onViewLead: (lead: Lead) => void;
}

export default function LeadsTable({ leads, isLoading, onViewLead }: LeadsTableProps) {
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedLeads(leads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (isChecked: boolean, leadId: number) => {
    if (isChecked) {
      setSelectedLeads([...selectedLeads, leadId]);
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'mubawab': return 'bg-blue-100 text-blue-800';
      case 'facebook': return 'bg-indigo-100 text-indigo-800';
      case 'linkedin': return 'bg-purple-100 text-purple-800';
      case 'website': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-blue-100 text-blue-800';
      case 'unqualified': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <div className="p-4">
          <Skeleton className="h-8 w-full mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all leads"
                />
              </TableHead>
              <TableHead className="text-xs font-medium text-neutral-500 uppercase">ID du lead</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500 uppercase">Date du lead</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500 uppercase">Name</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500 uppercase">Email</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500 uppercase">Phone</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500 uppercase">Source</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500 uppercase">Status</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500 uppercase">Détails</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-neutral-500">
                  No leads found. Add some leads or adjust your filters.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow 
                  key={lead.id} 
                  className="hover:bg-primary-50/50 transition-colors"
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={(checked) => handleSelectLead(!!checked, lead.id)}
                      aria-label={`Select lead ${lead.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-neutral-900">{lead.id}</TableCell>
                  <TableCell className="text-neutral-500">{lead.date}</TableCell>
                  <TableCell className="text-neutral-500">{lead.name}</TableCell>
                  <TableCell className="text-neutral-500">{lead.email}</TableCell>
                  <TableCell className="text-neutral-500">{lead.phone}</TableCell>
                  <TableCell>
                    <Badge className={cn("font-medium", getSourceBadgeColor(lead.source))}>
                      {lead.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("font-medium", getStatusBadgeColor(lead.status))}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-primary-700 bg-primary-100 hover:bg-primary-200"
                      onClick={() => onViewLead(lead)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {leads.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-neutral-200">
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{leads.length}</span> of <span className="font-medium">{leads.length}</span> results
              </p>
            </div>
            {/* Pagination can be added here if needed */}
          </div>
        </div>
      )}
    </Card>
  );
}
