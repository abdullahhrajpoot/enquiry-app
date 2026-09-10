"use client";

import { ChevronDown, Search } from "lucide-react";
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
    <div className="flex shrink-0 flex-col gap-3 border-b border-border bg-surface px-4 py-4 md:flex-row md:items-center md:gap-4 md:px-6">
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
          className="field w-full pl-9"
        />
      </div>

      <div className="flex w-full items-center gap-3 md:w-auto md:shrink-0">
        <label htmlFor="enquiry-status-filter" className="sr-only">
          Filter by status
        </label>
        <div className="relative min-w-0 flex-1 md:w-44 md:flex-none">
          <select
            id="enquiry-status-filter"
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as LeadStatus | "all")
            }
            className="field w-full"
          >
            <option value="all">All statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
        </div>

        <button
          type="button"
          onClick={onNewEnquiry}
          className="btn-primary shrink-0"
        >
          New Enquiry
        </button>
      </div>
    </div>
  );
}
