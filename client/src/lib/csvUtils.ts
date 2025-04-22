import Papa from 'papaparse';
import { Lead, InsertLead } from '@shared/schema';

interface CSVRow {
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  date?: string;
  [key: string]: any;
}

export const parseCSV = (file: File): Promise<InsertLead[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const leads = transformCSVToLeads(results.data as CSVRow[]);
          resolve(leads);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

const transformCSVToLeads = (rows: CSVRow[]): InsertLead[] => {
  return rows.map(row => {
    // Normalize the field names and handle variations
    const normalizedRow = normalizeRowFields(row);
    
    // Convert to InsertLead format
    return {
      name: normalizedRow.name || '',
      email: normalizedRow.email || '',
      phone: normalizedRow.phone || '',
      source: normalizedRow.source || 'Other',
      status: normalizedRow.status || 'New',
      date: normalizedRow.date || new Date().toISOString().split('T')[0],
    };
  });
};

const normalizeRowFields = (row: CSVRow): CSVRow => {
  const normalized: CSVRow = {};
  
  // Map different potential field names to our standard field names
  const fieldMappings: Record<string, string[]> = {
    name: ['name', 'full name', 'contact name', 'contact', 'client', 'client name'],
    email: ['email', 'email address', 'mail', 'e-mail'],
    phone: ['phone', 'phone number', 'tel', 'telephone', 'mobile', 'cell'],
    source: ['source', 'lead source', 'channel', 'origin'],
    status: ['status', 'lead status', 'state'],
    date: ['date', 'lead date', 'created date', 'created at', 'date created'],
  };
  
  // Normalize field names
  Object.entries(fieldMappings).forEach(([standardField, variations]) => {
    for (const key of Object.keys(row)) {
      if (variations.includes(key.toLowerCase())) {
        normalized[standardField] = row[key];
        break;
      }
    }
  });
  
  return normalized;
};
