"use client";

import { useId, useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { LEAD_STATUSES, type Lead, type LeadStatus, type Profile } from "@/types/lead";

export type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  source: string;
  ownerId: string | null;
  status: LeadStatus;
  notes: string;
};

type LeadFormProps = {
  initialData?: Lead | null;
  profiles: Profile[];
  submitLabel?: string;
  onSubmit: (values: LeadFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toFormValues(lead?: Lead | null): LeadFormValues {
  return {
    name: lead?.name ?? "",
    email: lead?.email ?? "",
    phone: lead?.phone ?? "",
    source: lead?.source ?? "",
    ownerId: lead?.ownerId ?? null,
    status: lead?.status ?? "New",
    notes: lead?.notes ?? "",
  };
}

export function LeadForm({
  initialData,
  profiles,
  submitLabel,
  onSubmit,
  onCancel,
}: LeadFormProps) {
  const formId = useId();
  const isEdit = Boolean(initialData);
  const [values, setValues] = useState<LeadFormValues>(() =>
    toFormValues(initialData),
  );
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormValues, string>>>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(next: LeadFormValues) {
    const nextErrors: Partial<Record<keyof LeadFormValues, string>> = {};
    if (!next.name.trim()) nextErrors.name = "Name is required.";
    if (!next.email.trim()) nextErrors.email = "Email is required.";
    else if (!EMAIL_RE.test(next.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setFormError(null);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        source: values.source.trim(),
        notes: values.notes.trim(),
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass = "field w-full";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-name`} className="text-sm font-medium text-ink">
          Name
        </label>
        <input
          id={`${formId}-name`}
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className={fieldClass}
          aria-invalid={Boolean(errors.name)}
          disabled={submitting}
        />
        {errors.name ? (
          <p className="text-xs text-status-lost">{errors.name}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-email`} className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          className={fieldClass}
          aria-invalid={Boolean(errors.email)}
          disabled={submitting}
        />
        {errors.email ? (
          <p className="text-xs text-status-lost">{errors.email}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-phone`} className="text-sm font-medium text-ink">
            Phone
          </label>
          <input
            id={`${formId}-phone`}
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            className={fieldClass}
            disabled={submitting}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-source`} className="text-sm font-medium text-ink">
            Source
          </label>
          <input
            id={`${formId}-source`}
            value={values.source}
            onChange={(e) => setValues((v) => ({ ...v, source: e.target.value }))}
            className={fieldClass}
            disabled={submitting}
          />
        </div>
      </div>

      <div className={`grid gap-4 ${isEdit ? "sm:grid-cols-2" : ""}`}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-owner`} className="text-sm font-medium text-ink">
            Owner
          </label>
          <div className="relative">
            <select
              id={`${formId}-owner`}
              value={values.ownerId ?? ""}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  ownerId: e.target.value ? e.target.value : null,
                }))
              }
              className={fieldClass}
              disabled={submitting}
            >
              <option value="">Unassigned</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.fullName}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
          </div>
        </div>

        {isEdit ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-status`} className="text-sm font-medium text-ink">
              Status
            </label>
            <div className="relative">
              <select
                id={`${formId}-status`}
                value={values.status}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    status: e.target.value as LeadStatus,
                  }))
                }
                className={fieldClass}
                disabled={submitting}
              >
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
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-notes`} className="text-sm font-medium text-ink">
          Notes
        </label>
        <textarea
          id={`${formId}-notes`}
          rows={3}
          value={values.notes}
          onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
          className={`${fieldClass} resize-y`}
          disabled={submitting}
        />
      </div>

      {formError ? (
        <p
          role="alert"
          className="rounded-md bg-status-lost-soft px-3 py-2 text-sm text-status-lost"
        >
          {formError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="btn-ghost"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="btn-primary"
        >
          {submitting ? "Saving..." : (submitLabel ?? (isEdit ? "Save changes" : "Create enquiry"))}
        </button>
      </div>
    </form>
  );
}
