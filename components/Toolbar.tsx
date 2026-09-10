"use client";

import { Search } from "lucide-react";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";

type ToolbarProps = {
  search: string;
  statusFilter: LeadStatus | "all";
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: LeadStatus | "all") => void;
  onNewEnquiry: () => void;
};

export function Toolbar({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onNewEnquiry,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-surface px-4 py-4 md:flex-row md:items-center md:gap-4 md:px-6">
      <div className="relative w-full min-w-0 md:flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
          aria-hidden="true"
        />
        <label htmlFor="enquiry-search" className="sr-only">
          Search enquiries
        </label>
        <input
          id="enquiry-search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name or email..."
          className="w-full rounded-md border border-border bg-bg py-2 pr-3 pl-9 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="flex w-full items-center gap-3 md:w-auto md:shrink-0">
        <label htmlFor="enquiry-status-filter" className="sr-only">
          Filter by status
        </label>
        <select
          id="enquiry-status-filter"
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as LeadStatus | "all")
          }
          className="min-w-0 flex-1 rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink outline-none transition-shadow focus:ring-2 focus:ring-accent md:w-44 md:flex-none"
        >
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onNewEnquiry}
          className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          New Enquiry
        </button>
      </div>
    </div>
  );
}
