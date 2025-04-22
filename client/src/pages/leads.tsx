import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/ui/sidebar";
import Topbar from "@/components/layout/topbar";
import FilterSection from "@/components/leads/filter-section";
import LeadsTable from "@/components/leads/leads-table";
import ImportModal from "@/components/leads/import-modal";
import AddLeadModal from "@/components/leads/add-lead-modal";
import LeadDetailModal from "@/components/leads/lead-detail-modal";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Lead } from "@shared/schema";

export default function Leads() {
  const [selectedSource, setSelectedSource] = useState("Mubawab");
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    email: "",
    phone: "",
    source: "",
    date: "",
  });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { toast } = useToast();

  // Fetch leads
  const { data: leads = [], isLoading, refetch } = useQuery<Lead[]>({
    queryKey: ['/api/leads'],
  });

  // Import leads mutation
  const importMutation = useMutation({
    mutationFn: async (csvLeads: any[]) => {
      const response = await apiRequest('POST', '/api/leads/import', { leads: csvLeads });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Leads imported successfully",
      });
      refetch();
      setIsImportModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to import leads: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Add lead mutation
  const addLeadMutation = useMutation({
    mutationFn: async (newLead: any) => {
      const response = await apiRequest('POST', '/api/leads', newLead);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lead added successfully",
      });
      refetch();
      setIsAddLeadModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add lead: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Filter leads based on filter options
  const filteredLeads = leads
    // First filter the leads
    .filter((lead: Lead) => {
      return (
        (filterOptions.status === "" || filterOptions.status === "all" || lead.status.toLowerCase() === filterOptions.status.toLowerCase()) &&
        (filterOptions.email === "" || lead.email.toLowerCase().includes(filterOptions.email.toLowerCase())) &&
        (filterOptions.phone === "" || lead.phone.includes(filterOptions.phone)) &&
        (filterOptions.source === "" || filterOptions.source === "all" || lead.source.toLowerCase() === filterOptions.source.toLowerCase()) &&
        (filterOptions.date === "" || lead.date === filterOptions.date)
      );
    })
    // Then sort by ID descending (newest first) - this is a fallback in case server sorting fails
    .sort((a: Lead, b: Lead) => b.id - a.id);

  const handleImportCSV = (parsedLeads: any[]) => {
    importMutation.mutate(parsedLeads);
  };

  const handleAddLead = (lead: any) => {
    addLeadMutation.mutate(lead);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar selectedSource={selectedSource} onSourceChange={setSelectedSource} />
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-neutral-800">Leads</h2>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <Upload className="-ml-1 mr-2 h-5 w-5 text-neutral-500" />
                  Import CSV
                </Button>
                <Button 
                  onClick={() => setIsAddLeadModalOpen(true)}
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Add Lead
                </Button>
              </div>
            </div>

            <FilterSection 
              filterOptions={filterOptions} 
              onFilterChange={setFilterOptions} 
            />

            <LeadsTable 
              leads={filteredLeads} 
              isLoading={isLoading} 
              onViewLead={handleViewLead} 
            />
          </div>
        </div>
      </div>

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportCSV}
        isImporting={importMutation.isPending}
      />

      <AddLeadModal 
        isOpen={isAddLeadModalOpen} 
        onClose={() => setIsAddLeadModalOpen(false)}
        onAdd={handleAddLead}
        isAdding={addLeadMutation.isPending}
      />

      {selectedLead && (
        <LeadDetailModal 
          lead={selectedLead}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
