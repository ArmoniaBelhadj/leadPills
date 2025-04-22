import { users, type User, type InsertUser, leads, type Lead, type InsertLead } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lead operations
  getAllLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;
  importLeads(leadsToImport: InsertLead[]): Promise<Lead[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private userCurrentId: number;
  private leadCurrentId: number;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.userCurrentId = 1;
    this.leadCurrentId = 1;
    
    // Add some sample leads
    this.createLead({
      name: "Karim El Mansouri",
      email: "karim.elmansouri@example.com",
      phone: "+212 612345678",
      source: "Mubawab",
      status: "New",
      date: "2025-04-20",
    });
    
    this.createLead({
      name: "Fatima Zahra",
      email: "fatima.zahra@example.com",
      phone: "+212 698765432",
      source: "Facebook",
      status: "Contacted",
      date: "2025-04-19",
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Lead methods
  async getAllLeads(): Promise<Lead[]> {
    // Sort leads by ID in descending order (newest first)
    return Array.from(this.leads.values()).sort((a, b) => b.id - a.id);
  }

  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.leadCurrentId++;
    const lead: Lead = { ...insertLead, id, notes: "" };
    this.leads.set(id, lead);
    return lead;
  }

  async updateLead(id: number, leadUpdate: Partial<InsertLead>): Promise<Lead | undefined> {
    const existingLead = this.leads.get(id);
    
    if (!existingLead) {
      return undefined;
    }
    
    const updatedLead = { ...existingLead, ...leadUpdate };
    this.leads.set(id, updatedLead);
    
    return updatedLead;
  }

  async deleteLead(id: number): Promise<boolean> {
    if (!this.leads.has(id)) {
      return false;
    }
    
    return this.leads.delete(id);
  }

  async importLeads(leadsToImport: InsertLead[]): Promise<Lead[]> {
    const importedLeads: Lead[] = [];
    
    for (const leadData of leadsToImport) {
      const lead = await this.createLead(leadData);
      importedLeads.push(lead);
    }
    
    return importedLeads;
  }
}

export const storage = new MemStorage();
