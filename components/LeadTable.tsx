"use client";

import { Pencil, Trash2 } from "lucide-react";
import { OwnerAvatar } from "@/components/OwnerAvatar";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";
import type { Lead } from "@/types/lead";

type LeadTableProps = {
  leads: Lead[];
  onOpen: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
};

export function LeadTable({ leads, onOpen, onEdit, onDelete }: LeadTableProps) {
  return (
    <div className="border-y border-border bg-surface">
      <table className="min-w-[880px] w-full text-left text-sm">
        <thead className="sticky top-0 z-10 border-b border-border bg-[color-mix(in_srgb,var(--color-bg)_82%,var(--color-accent-soft)_18%)] text-xs font-medium uppercase tracking-wide text-ink-soft">
          <tr>
            <th className="px-4 py-3.5 font-medium">Name</th>
            <th className="px-4 py-3.5 font-medium">Email</th>
            <th className="px-4 py-3.5 font-medium">Owner</th>
            <th className="px-4 py-3.5 font-medium">Status</th>
            <th className="px-4 py-3.5 font-medium">Source</th>
            <th className="px-4 py-3.5 font-medium">Created</th>
            <th className="px-4 py-3.5 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              tabIndex={0}
              onClick={() => onOpen(lead)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onOpen(lead);
                }
              }}
              className="cursor-pointer border-b border-border last:border-b-0 transition-colors duration-150 hover:bg-accent-soft/50 focus-visible:outline-none focus-visible:bg-accent-soft/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
            >
              <td className="px-4 py-4 font-medium text-ink">{lead.name}</td>
              <td className="px-4 py-4 text-ink-soft">{lead.email}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <OwnerAvatar
                    fullName={lead.ownerName}
                    ownerId={lead.ownerId}
                  />
                  <span className="text-ink">
                    {lead.ownerName ?? "Unassigned"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-4 text-ink-soft">{lead.source ?? "—"}</td>
              <td className="px-4 py-4 text-ink-soft">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    aria-label={`Edit ${lead.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(lead);
                    }}
                    className="rounded-md p-2 text-ink-soft transition-colors duration-150 hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
