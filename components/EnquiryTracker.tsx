"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createLeadAction,
  deleteLeadAction,
  loadMoreLeadsAction,
} from "@/app/actions/leads";
import { EmptyState } from "@/components/EmptyState";
import { LeadCard } from "@/components/LeadCard";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { LeadForm, type LeadFormValues } from "@/components/LeadForm";
import { LeadTable } from "@/components/LeadTable";
import { Modal } from "@/components/Modal";
import { Pagination } from "@/components/Pagination";
import { Toolbar } from "@/components/Toolbar";
import type { Lead, LeadStatus, Profile } from "@/types/lead";

type EnquiryTrackerProps = {
  initialLeads: Lead[];
  initialTotal: number;
  profiles: Profile[];
};

export function EnquiryTracker({
  initialLeads,
  initialTotal,
  profiles,
}: EnquiryTrackerProps) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  useEffect(() => {
    setLeads(initialLeads);
    setTotal(initialTotal);
  }, [initialLeads, initialTotal]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [leads, search, statusFilter]);

  const hasFilters = search.trim().length > 0 || statusFilter !== "all";

  function openLead(lead: Lead) {
    setSelectedLead(lead);
    setDetailOpen(true);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
  }

  async function handleCreate(values: LeadFormValues) {
    await createLeadAction({
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      source: values.source || null,
      ownerId: values.ownerId,
      notes: values.notes || null,
    });
    setCreateOpen(false);
    router.refresh();
  }

  async function handleLoadMore() {
    setLoadingMore(true);
    setLoadMoreError(null);
    try {
      const page = await loadMoreLeadsAction(leads.length);
      setLeads((prev) => {
        const existing = new Set(prev.map((l) => l.id));
        const appended = page.leads.filter((l) => !existing.has(l.id));
        return [...prev, ...appended];
      });
      setTotal(page.total);
    } catch (error) {
      setLoadMoreError(
        error instanceof Error
          ? error.message
          : "Failed to load more enquiries.",
      );
    } finally {
      setLoadingMore(false);
    }
  }

  async function confirmDeleteLead() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteLeadAction(pendingDelete.id);
      setLeads((prev) => prev.filter((l) => l.id !== pendingDelete.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setPendingDelete(null);
      router.refresh();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete enquiry.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Toolbar
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onNewEnquiry={() => setCreateOpen(true)}
      />

      {total === 0 && !hasFilters ? (
        <EmptyState onNewEnquiry={() => setCreateOpen(true)} />
      ) : filteredLeads.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-sm text-ink-soft">
            No enquiries match your filters
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 text-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="md:hidden">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onOpen={openLead}
                onEdit={openLead}
                onDelete={setPendingDelete}
              />
            ))}
          </div>

          <div className="hidden md:block">
            <LeadTable
              leads={filteredLeads}
              onOpen={openLead}
              onEdit={openLead}
              onDelete={setPendingDelete}
            />
          </div>

          <Pagination
            showing={leads.length}
            total={total}
            loading={loadingMore}
            error={loadMoreError}
            onLoadMore={handleLoadMore}
          />
        </>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New enquiry"
      >
        <LeadForm
          profiles={profiles}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      <LeadDetailModal
        open={detailOpen}
        lead={selectedLead}
        profiles={profiles}
        onClose={() => {
          setDetailOpen(false);
          setSelectedLead(null);
        }}
        onSaved={(updated) => {
          setLeads((prev) =>
            prev.map((lead) => (lead.id === updated.id ? updated : lead)),
          );
          router.refresh();
        }}
        onDeleted={(leadId) => {
          setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
          setTotal((prev) => Math.max(0, prev - 1));
          router.refresh();
        }}
      />

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => {
          if (deleting) return;
          setPendingDelete(null);
          setDeleteError(null);
        }}
        title="Delete enquiry?"
      >
        <p className="text-sm text-ink-soft">
          This will permanently delete{" "}
          <span className="font-medium text-ink">
            {pendingDelete?.name}
          </span>{" "}
          and its activity history. This cannot be undone.
        </p>
        {deleteError ? (
          <p
            role="alert"
            className="mt-3 rounded-md bg-status-lost-soft px-3 py-2 text-sm text-status-lost"
          >
            {deleteError}
          </p>
        ) : null}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={deleting}
            onClick={() => {
              setPendingDelete(null);
              setDeleteError(null);
            }}
            className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={confirmDeleteLead}
            className="rounded-md bg-status-lost px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-lost focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
