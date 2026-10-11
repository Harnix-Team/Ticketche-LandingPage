"use client";

import { Check, ChevronDown, CircleAlert, FileText, Mail, Phone, Upload, X } from "@/components/icons";
import { useEffect, useId, useRef, useState } from "react";
import { submitApplication } from "@/app/services/jobsApi";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";

const MAX_SIZE = 10 * 1024 * 1024;

const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])";

function trapFocus(event, panel) {
  const items = panel.querySelectorAll(FOCUSABLE);
  const first = items[0];
  const last = items[items.length - 1];
  const current = document.activeElement;

  if (event.shiftKey && (current === first || current === panel)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && current === last) {
    event.preventDefault();
    first.focus();
  }
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + " Mo";
  if (bytes >= 1024) return Math.round(bytes / 1024) + " Ko";
  return bytes + " o";
}

function IconInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
      <Input className="pl-10" {...props} />
    </div>
  );
}

function YesNoSelect(props) {
  return (
    <div className="relative">
      <Select {...props}>
        <option value="">Sélectionner</option>
        <option value="yes">Oui</option>
        <option value="no">Non</option>
      </Select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
    </div>
  );
}

function FileUpload({ file, accept, onChange, placeholder, ...field }) {
  const inputRef = useRef(null);
  const handleDrop = (event) => {
    event.preventDefault();
    const dropped = event.dataTransfer.files[0];
    if (dropped) onChange(dropped);
  };

  return (
    <div
      className="relative cursor-pointer rounded-xl border border-dashed border-line-strong bg-sunken/50 px-4 py-5 text-center transition-colors hover:border-brand has-[:focus-visible]:border-brand has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/20 has-[[aria-invalid=true]]:border-danger"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        // Le clic relayé par le libellé ne doit pas remonter à la zone, qui rouvrirait le sélecteur.
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => onChange(event.target.files[0])}
        {...field}
      />
      {file ? (
        <p className="tk-label flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[0.875rem] text-brand">
          <FileText className="size-[1.125rem] shrink-0" aria-hidden />
          <span className="min-w-0 break-all">{file.name}</span>
          <span className="text-[0.75rem] font-normal text-ink-3">({formatSize(file.size)})</span>
        </p>
      ) : (
        <p className="flex flex-col items-center gap-1.5 text-[0.8125rem] text-ink-2">
          <Upload className="size-5 text-ink-3" aria-hidden />
          {placeholder}
        </p>
      )}
    </div>
  );
}

const DEV_PREFILL =
  process.env.NODE_ENV === "development"
    ? {
        last_name: "Dupont",
        first_name: "Jean",
        email: "jean.dupont@dev.test",
        phone: "+2290112345678",
        message: "Ceci est une candidature de test (environnement de développement).",
        license_number: "BJ-123456",
        has_experience: "yes",
        own_vehicle: "no",
        want_vehicle: "yes",
      }
    : {
        last_name: "",
        first_name: "",
        email: "",
        phone: "",
        message: "",
        license_number: "",
        has_experience: "",
        own_vehicle: "",
        want_vehicle: "",
      };

export function ApplicationModal({ job, onClose }) {
  const [form, setForm] = useState(DEV_PREFILL);
  const [cv, setCv] = useState(null);
  const [motivationFile, setMotivationFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const titleId = useId();
  const panelRef = useRef(null);

  // Fenêtre maison plutôt que <dialog> : jsdom n'implémente pas showModal, les tests ne l'ouvriraient pas.
  useEffect(() => {
    const previous = document.activeElement;
    panelRef.current.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") trapFocus(event, panelRef.current);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const setField = (name) => (event) => setForm((previous) => ({ ...previous, [name]: event.target.value }));

  const handleFileChange = (field, file) => {
    if (!file) return;
    if (file.size > MAX_SIZE) {
      setErrors((p) => ({ ...p, [field]: "Fichier trop lourd (max 10 Mo)" }));
      return;
    }
    setErrors((p) => {
      const n = { ...p };
      delete n[field];
      return n;
    });
    if (field === "cv") setCv(file);
    else setMotivationFile(file);
  };

  const validate = () => {
    const e = {};
    if (!form.last_name.trim()) e.last_name = "Requis";
    if (!form.first_name.trim()) e.first_name = "Requis";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email invalide";
    const phonePattern = /^\+229\s?01\d{8}$/;
    if (!form.phone.trim() || !phonePattern.test(form.phone.replace(/\s/g, "")))
      e.phone = "Format requis : +229 01XXXXXXXX";
    if (!cv) e.cv = "CV obligatoire";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("job_id", job.id ?? "spontaneous");
      fd.append("job_title", job.job_title ?? "Candidature spontanée");
      if (cv) fd.append("cv", cv);
      if (motivationFile) fd.append("motivation_letter", motivationFile);
      await submitApplication(job.id, fd);
      setSuccess(true);
    } catch {
      setErrors({ submit: "Une erreur est survenue. Réessayez." });
    } finally {
      setSubmitting(false);
    }
  };

  const isDelivery = job?.job_title?.toLowerCase().includes("livreur") || job?.id === "delivery_man";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-scrim backdrop-blur-[2px] sm:items-center sm:p-5"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[92dvh] w-full max-w-[38rem] flex-col rounded-t-panel border border-line bg-surface text-ink outline-none motion-safe:animate-[tk-rise_0.28s_var(--ease-out-soft)] sm:rounded-panel"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3.5 right-3.5 z-10 grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-sunken hover:text-ink"
        >
          <X className="size-[1.125rem]" aria-hidden />
        </button>

        {success ? (
          <div className="flex flex-col items-center overflow-y-auto px-6 py-12 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-brand-fill text-white">
              <Check className="size-7" aria-hidden />
            </span>
            <h2 id={titleId} className="tk-title mt-5 text-[1.5rem]">
              Candidature envoyée !
            </h2>
            <p className="mt-2.5 max-w-[44ch] text-ink-2">
              Nous avons bien reçu votre candidature pour le poste de{" "}
              <strong className="font-semibold text-ink">{job.job_title}</strong>. Nous reviendrons vers vous dans les
              plus brefs délais.
            </p>
            <Button variant="soft" onClick={onClose} className="mt-6">
              Fermer
            </Button>
          </div>
        ) : (
          <>
            <header className="border-b border-line px-5 pt-5 pr-14 pb-4 sm:px-7 sm:pr-16">
              <h2 id={titleId} className="tk-title text-[1.25rem]">
                Postuler — {job.job_title}
              </h2>
              <p className="mt-1 text-[0.875rem] text-ink-2">
                {job.department} · {job.location.city}
              </p>
            </header>

            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
              className="flex flex-col gap-4 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
            >
              <div className="grid gap-4 xs:grid-cols-2">
                <Field label="Prénom" required error={errors.first_name}>
                  {(field) => (
                    <Input {...field} type="text" placeholder="Jean" autoComplete="given-name" value={form.first_name} onChange={setField("first_name")} />
                  )}
                </Field>
                <Field label="Nom" required error={errors.last_name}>
                  {(field) => (
                    <Input {...field} type="text" placeholder="Ahouansou" autoComplete="family-name" value={form.last_name} onChange={setField("last_name")} />
                  )}
                </Field>
              </div>

              <Field label="Adresse email" required error={errors.email}>
                {(field) => (
                  <IconInput {...field} icon={Mail} type="email" placeholder="jean@email.com" autoComplete="email" value={form.email} onChange={setField("email")} />
                )}
              </Field>

              <Field label="Numéro de téléphone" required error={errors.phone}>
                {(field) => (
                  <IconInput {...field} icon={Phone} type="tel" placeholder="+229 01 XXXXXXXX" autoComplete="tel" value={form.phone} onChange={setField("phone")} />
                )}
              </Field>

              <Field label="CV" required hint="PDF uniquement, 10 Mo maximum" error={errors.cv}>
                {(field) => (
                  <FileUpload
                    {...field}
                    file={cv}
                    accept=".pdf"
                    onChange={(file) => handleFileChange("cv", file)}
                    placeholder="Glissez votre CV ou cliquez pour parcourir"
                  />
                )}
              </Field>

              <Field label="Lettre de motivation" hint="Facultatif, PDF uniquement" error={errors.motivationFile}>
                {(field) => (
                  <FileUpload
                    {...field}
                    file={motivationFile}
                    accept=".pdf"
                    onChange={(file) => handleFileChange("motivationFile", file)}
                    placeholder="Glissez votre lettre ou cliquez pour parcourir"
                  />
                )}
              </Field>

              <Field label="Message" hint="Facultatif">
                {(field) => (
                  <Textarea {...field} rows={3} placeholder="Présentez-vous brièvement…" value={form.message} onChange={setField("message")} />
                )}
              </Field>

              {isDelivery && (
                <>
                  <Field label="Numéro de permis de conduire" hint="Facultatif">
                    {(field) => (
                      <Input {...field} placeholder="Ex. : BJ-123456" value={form.license_number} onChange={setField("license_number")} />
                    )}
                  </Field>

                  <div className="grid gap-4 xs:grid-cols-2">
                    <Field label="Expérience passée ?">
                      {(field) => <YesNoSelect {...field} value={form.has_experience} onChange={setField("has_experience")} />}
                    </Field>
                    <Field label="Avez-vous un véhicule ?">
                      {(field) => <YesNoSelect {...field} value={form.own_vehicle} onChange={setField("own_vehicle")} />}
                    </Field>
                  </div>

                  {form.own_vehicle === "no" && (
                    <Field label="Souhaitez-vous qu'on vous en fournisse un ?">
                      {(field) => <YesNoSelect {...field} value={form.want_vehicle} onChange={setField("want_vehicle")} />}
                    </Field>
                  )}
                </>
              )}

              {errors.submit && (
                <p role="alert" className="flex items-center gap-2 rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-[0.875rem] text-danger">
                  <CircleAlert className="size-4 shrink-0" aria-hidden />
                  {errors.submit}
                </p>
              )}

              <Button type="submit" size="lg" disabled={submitting} className="w-full shrink-0">
                {submitting ? "Envoi en cours…" : "Envoyer ma candidature"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
