export type LeadStatus = "New" | "Contacted" | "Qualified" | "Won" | "Lost";

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Won",
  "Lost",
];

export type Profile = {
  id: string;
  fullName: string;
  email: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string | null;
  ownerId: string | null;
  ownerName: string | null;
  status: LeadStatus;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadActivity = {
  id: string;
  leadId: string;
  changedBy: string | null;
  fieldChanged: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
  changedByName: string | null;
};

export type CreateLeadInput = {
  name: string;
  email: string;
  phone?: string | null;
  source?: string | null;
  ownerId?: string | null;
  status?: LeadStatus;
  notes?: string | null;
};

export type UpdateLeadInput = {
  name?: string;
  email?: string;
  phone?: string | null;
  source?: string | null;
  ownerId?: string | null;
  status?: LeadStatus;
  notes?: string | null;
};
