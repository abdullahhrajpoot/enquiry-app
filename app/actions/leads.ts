"use server";

import { revalidatePath } from "next/cache";
import {
  createLead,
  deleteLead,
  getLeadActivity,
  getLeads,
  LEADS_PAGE_SIZE,
  updateLead,
} from "@/lib/leads";
import { createClient } from "@/lib/supabase/server";
import type { CreateLeadInput, UpdateLeadInput } from "@/types/lead";

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user.id;
}

export async function createLeadAction(data: CreateLeadInput) {
  const userId = await requireUserId();
  const lead = await createLead(data, userId);
  revalidatePath("/");
  return lead;
}

export async function updateLeadAction(id: string, data: UpdateLeadInput) {
  const userId = await requireUserId();
  const lead = await updateLead(id, data, userId);
  revalidatePath("/");
  return lead;
}

export async function deleteLeadAction(id: string) {
  await requireUserId();
  await deleteLead(id);
  revalidatePath("/");
}

export async function loadMoreLeadsAction(offset: number) {
  await requireUserId();
  return getLeads({ limit: LEADS_PAGE_SIZE, offset });
}

export async function fetchLeadActivityAction(leadId: string) {
  await requireUserId();
  return getLeadActivity(leadId);
}
