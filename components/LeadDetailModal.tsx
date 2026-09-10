"use client";

import { useEffect, useState } from "react";
import {
  deleteLeadAction,
  fetchLeadActivityAction,
  updateLeadAction,
} from "@/app/actions/leads";
import { ActivityLog } from "@/components/ActivityLog";
import { LeadForm, type LeadFormValues } from "@/components/LeadForm";
import { Modal } from "@/components/Modal";
import type { Lead, LeadActivity, Profile } from "@/types/lead";

type LeadDetailModalProps = {
  open: boolean;
  lead: Lead | null;
  profiles: Profile[];
  onClose: () => void;
  onSaved: (lead: Lead) => void;
  onDeleted: (leadId: string) => void;
};

export function LeadDetailModal({
  open,
  lead,
  profiles,
  onClose,
  onSaved,
  onDeleted,
}: LeadDetailModalProps) {
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !lead) {
      setActivities([]);
      setConfirmDelete(false);
      setDeleteError(null);
      setActivityError(null);
      return;
    }

    let cancelled = false;
    setLoadingActivity(true);
    setConfirmDelete(false);
    setDeleteError(null);
    setActivityError(null);

    fetchLeadActivityAction(lead.id)
      .then((rows) => {
        if (!cancelled) setActivities(rows);
      })
      .catch((error) => {
        if (!cancelled) {
          setActivities([]);
          setActivityError(
            error instanceof Error
              ? error.message
              : "Failed to load activity.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingActivity(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lead, open]);

  if (!lead) return null;

  const activeLead = lead;

  async function handleSubmit(values: LeadFormValues) {
    const updated = await updateLeadAction(activeLead.id, {
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      source: values.source || null,
      ownerId: values.ownerId,
      status: values.status,
      notes: values.notes || null,
    });
    onSaved(updated);
    onClose();
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteLeadAction(activeLead.id);
      onDeleted(activeLead.id);
      onClose();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete enquiry.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Modal
        open={open && !confirmDelete}
        onClose={onClose}
        title="Edit enquiry"
        size="lg"
      >
        <LeadForm
          key={lead.id}
          initialData={lead}
          profiles={profiles}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />

        <div className="mt-8 border-t border-border pt-6">
          <h3 className="font-heading text-sm font-semibold tracking-tight text-ink">
            Activity
          </h3>
          <div className="mt-4">
            {loadingActivity ? (
              <div className="flex items-center gap-2 text-sm text-ink-soft">
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent border-t-transparent"
                  aria-hidden="true"
                />
                Loading activity...
              </div>
            ) : activityError ? (
              <p role="alert" className="text-sm text-status-lost">
                {activityError}
              </p>
            ) : (
              <ActivityLog activities={activities} profiles={profiles} />
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="btn-danger"
          >
            Delete enquiry
          </button>
        </div>
      </Modal>

      <Modal
        open={open && confirmDelete}
        onClose={() => {
          if (deleting) return;
          setConfirmDelete(false);
        }}
        title="Delete enquiry?"
      >
        <p className="text-sm text-ink-soft">
          This will permanently delete{" "}
          <span className="font-medium text-ink">{lead.name}</span> and its
          activity history. This cannot be undone.
        </p>
        {deleteError ? (
          <p
            role="alert"
            className="mt-3 rounded-md bg-status-lost-soft px-3 py-2 text-sm text-status-lost"
          >
            {deleteError}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            disabled={deleting}
            onClick={() => setConfirmDelete(false)}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="btn-danger"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
}
