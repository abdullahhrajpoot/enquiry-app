import { createClient } from "@/lib/supabase/server";
import type {
  CreateLeadInput,
  Lead,
  LeadActivity,
  LeadStatus,
  Profile,
  UpdateLeadInput,
} from "@/types/lead";

export const LEADS_PAGE_SIZE = 20;

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string | null;
  owner_id: string | null;
  status: LeadStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  owner?: { full_name: string } | { full_name: string }[] | null;
};

type ActivityRow = {
  id: string;
  lead_id: string;
  changed_by: string | null;
  field_changed: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  changer?: { full_name: string } | { full_name: string }[] | null;
};

const LEAD_SELECT = `
  id,
  name,
  email,
  phone,
  source,
  owner_id,
  status,
  notes,
  created_by,
  created_at,
  updated_at,
  owner:profiles!leads_owner_id_fkey ( full_name )
`;

function ownerNameFromJoin(owner: LeadRow["owner"]): string | null {
  if (!owner) return null;
  if (Array.isArray(owner)) return owner[0]?.full_name ?? null;
  return owner.full_name ?? null;
}

function mapLead(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    source: row.source,
    ownerId: row.owner_id,
    ownerName: ownerNameFromJoin(row.owner),
    status: row.status,
    notes: row.notes,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapActivity(row: ActivityRow): LeadActivity {
  const changer = row.changer;
  const changedByName = !changer
    ? null
    : Array.isArray(changer)
      ? (changer[0]?.full_name ?? null)
      : (changer.full_name ?? null);

  return {
    id: row.id,
    leadId: row.lead_id,
    changedBy: row.changed_by,
    fieldChanged: row.field_changed,
    oldValue: row.old_value,
    newValue: row.new_value,
    createdAt: row.created_at,
    changedByName,
  };
}

export async function getLeads(options?: {
  limit?: number;
  offset?: number;
}): Promise<{ leads: Lead[]; total: number }> {
  const limit = options?.limit ?? LEADS_PAGE_SIZE;
  const offset = options?.offset ?? 0;
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("leads")
    .select(LEAD_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);
  return {
    leads: (data as LeadRow[]).map(mapLead),
    total: count ?? 0,
  };
}

export async function getProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .order("full_name", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    fullName: row.full_name as string,
    email: row.email as string,
  }));
}

export async function getLeadActivity(leadId: string): Promise<LeadActivity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lead_activity")
    .select(
      `
      id,
      lead_id,
      changed_by,
      field_changed,
      old_value,
      new_value,
      created_at,
      changer:profiles!lead_activity_changed_by_fkey ( full_name )
    `,
    )
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as ActivityRow[]).map(mapActivity);
}

export async function createLead(
  data: CreateLeadInput,
  currentUserId: string,
): Promise<Lead> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("leads")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      source: data.source ?? null,
      owner_id: data.ownerId ?? null,
      status: data.status ?? "New",
      notes: data.notes ?? null,
      created_by: currentUserId,
    })
    .select(LEAD_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapLead(row as LeadRow);
}

export async function updateLead(
  id: string,
  data: UpdateLeadInput,
  currentUserId: string,
): Promise<Lead> {
  const supabase = await createClient();

  const { data: current, error: currentError } = await supabase
    .from("leads")
    .select("status, owner_id")
    .eq("id", id)
    .single();

  if (currentError) throw new Error(currentError.message);

  const patch: Record<string, unknown> = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.email !== undefined) patch.email = data.email;
  if (data.phone !== undefined) patch.phone = data.phone;
  if (data.source !== undefined) patch.source = data.source;
  if (data.ownerId !== undefined) patch.owner_id = data.ownerId;
  if (data.status !== undefined) patch.status = data.status;
  if (data.notes !== undefined) patch.notes = data.notes;

  const { data: row, error } = await supabase
    .from("leads")
    .update(patch)
    .eq("id", id)
    .select(LEAD_SELECT)
    .single();

  if (error) throw new Error(error.message);

  const activityRows: {
    lead_id: string;
    changed_by: string;
    field_changed: string;
    old_value: string | null;
    new_value: string | null;
  }[] = [];

  if (data.status !== undefined && data.status !== current.status) {
    activityRows.push({
      lead_id: id,
      changed_by: currentUserId,
      field_changed: "status",
      old_value: current.status,
      new_value: data.status,
    });
  }

  if (data.ownerId !== undefined && data.ownerId !== current.owner_id) {
    activityRows.push({
      lead_id: id,
      changed_by: currentUserId,
      field_changed: "owner_id",
      old_value: current.owner_id,
      new_value: data.ownerId,
    });
  }

  if (activityRows.length > 0) {
    const { error: activityError } = await supabase
      .from("lead_activity")
      .insert(activityRows);

    if (activityError) throw new Error(activityError.message);
  }

  return mapLead(row as LeadRow);
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
