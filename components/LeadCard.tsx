"use client";

import { Pencil, Trash2 } from "lucide-react";
import { OwnerAvatar } from "@/components/OwnerAvatar";
import { StatusBadge } from "@/components/StatusBadge";
import type { Lead } from "@/types/lead";

type LeadCardProps = {
  lead: Lead;
  onOpen: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
};

export function LeadCard({ lead, onOpen, onEdit, onDelete }: LeadCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(lead)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(lead);
        }
      }}
      className="cursor-pointer border-b border-border bg-surface px-4 py-5 transition-colors duration-150 hover:bg-accent-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-heading text-base font-semibold text-ink">
            {lead.name}
          </h3>
          <p className="mt-0.5 truncate text-sm text-ink-soft">{lead.email}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label={`Edit ${lead.name}`}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(lead);
            }}
            className="rounded-md p-2 text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Delete ${lead.name}`}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(lead);
            }}
            className="rounded-md border border-transparent p-2 text-status-lost transition-colors duration-150 hover:border-status-lost/30 hover:bg-status-lost-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-lost"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <StatusBadge status={lead.status} />
        <OwnerAvatar fullName={lead.ownerName} ownerId={lead.ownerId} />
      </div>
    </article>
  );
}
