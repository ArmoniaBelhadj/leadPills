import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  
  // Get all leads
  app.get('/api/leads', async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ message });
    }
  });

  // Get lead by ID
  app.get('/api/leads/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid lead ID" });
      }
      
      const lead = await storage.getLead(id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json(lead);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ message });
    }
  });

  // Create new lead
  app.post('/api/leads', async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const newLead = await storage.createLead(leadData);
      res.status(201).json(newLead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.format() });
      }
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ message });
    }
  });

  // Import multiple leads
  app.post('/api/leads/import', async (req, res) => {
    try {
      const schema = z.object({
        leads: z.array(insertLeadSchema),
      });
      
      const { leads } = schema.parse(req.body);
      const importedLeads = await storage.importLeads(leads);
      
      res.status(201).json({ 
        message: `Successfully imported ${importedLeads.length} leads`, 
        leads: importedLeads 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.format() });
      }
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ message });
    }
  });

  // Update lead
  app.patch('/api/leads/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid lead ID" });
      }
      
      const leadData = req.body;
      const updatedLead = await storage.updateLead(id, leadData);
      
      if (!updatedLead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json(updatedLead);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ message });
    }
  });

  // Delete lead
  app.delete('/api/leads/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid lead ID" });
      }
      
      const success = await storage.deleteLead(id);
      
      if (!success) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json({ message: "Lead deleted successfully" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
