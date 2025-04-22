import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lead } from "@shared/schema";
import { cn } from "@/lib/utils";

interface LeadDetailModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadDetailModal({ lead, isOpen, onClose }: LeadDetailModalProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lead Details</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{lead.name}</h3>
            <div className="flex gap-2">
              <Badge className={cn("font-medium", getSourceBadgeColor(lead.source))}>
                {lead.source}
              </Badge>
              <Badge className={cn("font-medium", getStatusBadgeColor(lead.status))}>
                {lead.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-neutral-500">ID</p>
              <p>{lead.id}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-neutral-500">Date</p>
              <p>{lead.date}</p>
            </div>

            <Separator />
            
            <div>
              <p className="text-sm font-medium text-neutral-500">Email</p>
              <p>{lead.email}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-neutral-500">Phone</p>
              <p>{lead.phone}</p>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm font-medium text-neutral-500">Notes</p>
              <p className="text-neutral-600">{lead.notes || "No notes available"}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
