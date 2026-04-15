"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  X,
  CheckCircle,
  Check,
  Warning,
  EnvelopeSimple,
  Phone,
  FileText,
  UploadSimple,
  ArrowRight,
} from "@phosphor-icons/react";
import { submitApplication } from "@/app/services/jobsApi";

const MODAL_STYLES = `
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    display: flex; align-items: flex-end; justify-content: center;
    padding: 0;
  }
  @media (min-width: 640px) {
    .modal-overlay { align-items: center; padding: 20px; }
  }
  .modal-box {
    background: #fff;
    border-radius: 24px 24px 0 0;
    width: 100%; max-width: 600px;
    max-height: 92vh; overflow-y: auto;
    position: relative;
    scrollbar-width: none;
  }
  .modal-box::-webkit-scrollbar { display: none; }
    outline: none;
  }
  .modal-box:focus { outline: none; }
  .modal-overlay:focus { outline: none; }
  @media (min-width: 640px) { .modal-box { border-radius: 24px; } }

  .modal-close {
    position: sticky; top: 16px; float: right; margin: 16px 16px 0 0; z-index: 10;
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(0,0,0,0.06); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #374151; transition: background 0.2s;
  }
  .modal-close:hover { background: rgba(0,0,0,0.12); }

  .modal-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(0,95,105,0.1);
  }
  .modal-header h2 { font-size: 1.1rem; font-weight: 900; color: #111827; margin: 0 0 4px; }
  .modal-header p { font-size: 13px; color: #7aaeb4; margin: 0; }

  .modal-body { padding: 20px 24px 28px; display: flex; flex-direction: column; gap: 16px; }

  .modal-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 480px) { .modal-row-2 { grid-template-columns: 1fr; } }

  .modal-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  @media (max-width: 640px) { .modal-row-3 { grid-template-columns: 1fr; } }

  .modal-field { display: flex; flex-direction: column; gap: 5px; }
  .modal-field label { font-size: 12px; font-weight: 700; color: #374151; }
  .modal-field label .req { color: #e53e3e; margin-left: 2px; }
  .field-wrap { position: relative; }
  .field-wrap.has-icon input { padding-left: 36px; }
  .field-icon {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    color: #7aaeb4; display: flex; align-items: center;
  }
  .modal-field input, .modal-field textarea {
    width: 100%; padding: 10px 12px;
    border: 1.5px solid rgba(0,95,105,0.15);
    border-radius: 10px; font-size: 14px;
    font-family: 'Archivo', sans-serif; color: #111827;
    background: #fafeff; outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }
  .modal-field input:focus, .modal-field textarea:focus { border-color: #005f69; }
  .modal-field input.field-error, .modal-field textarea.field-error { border-color: #e53e3e; }
  .field-err-msg {
    font-size: 11px; color: #e53e3e; font-weight: 600;
    display: flex; align-items: center; gap: 4px;
  }

  .file-drop {
    border: 2px dashed rgba(0,95,105,0.2);
    border-radius: 10px; padding: 16px;
    cursor: pointer; text-align: center;
    background: rgba(0,95,105,0.03);
    transition: border-color 0.2s, background 0.2s;
  }
  .file-drop:hover { border-color: #005f69; background: rgba(0,95,105,0.06); }
  .file-placeholder { display: flex; flex-direction: column; align-items: center; gap: 6px; color: #7aaeb4; font-size: 12px; }
  .file-selected { display: flex; align-items: center; gap: 8px; justify-content: center; font-size: 13px; color: #005f69; font-weight: 600; }

  .modal-error-band {
    display: flex; align-items: center; gap: 8px;
    background: #fff5f5; border: 1px solid #feb2b2;
    border-radius: 8px; padding: 10px 14px;
    font-size: 13px; color: #e53e3e; font-weight: 500;
  }

  .modal-submit-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: linear-gradient(135deg, #005f69, #007d88);
    color: #fff; padding: 14px 24px; border-radius: 12px;
    font-size: 15px; font-weight: 800;
    border: none; cursor: pointer; width: 100%;
    font-family: 'Archivo', sans-serif;
    transition: opacity 0.2s;
  }
  .modal-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .modal-submit-btn:not(:disabled):hover { opacity: 0.9; }

  .modal-success { padding: 48px 24px; text-align: center; }
  .modal-success-icon {
    width: 76px; height: 76px; border-radius: 50%;
    background: #00818f;
    box-shadow: 0 0 0 8px rgba(0,129,143,0.15);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }
  .modal-success h3 { font-size: 1.3rem; font-weight: 900; color: #111827; margin: 0 0 10px; }
  .modal-success p { font-size: 14px; color: #5a7a80; line-height: 1.7; margin: 0 0 24px; }
  .modal-btn-close {
    padding: 10px 28px; border-radius: 100px;
    background: rgba(0,95,105,0.1); border: none;
    color: #005f69; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'Archivo', sans-serif;
    transition: background 0.2s;
  }
  .modal-btn-close:hover { background: rgba(0,95,105,0.18); }
`;

function Field({ label, error, icon, children }) {
  // Split label so the * renders in red
  const parts = label.split("*");
  const hasRequired = parts.length > 1;
  return (
    <div className="modal-field">
      <label>
        {hasRequired ? (
          <>
            {parts[0]}
            <span className="req">*</span>
            {parts[1]}
          </>
        ) : (
          label
        )}
      </label>
      <div className={`field-wrap${icon ? " has-icon" : ""}`}>
        {icon && <span className="field-icon">{icon}</span>}
        {children}
      </div>
      {error && (
        <span className="field-err-msg">
          <Warning size={12} /> {error}
        </span>
      )}
    </div>
  );
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + " Mo";
  if (bytes >= 1024) return Math.round(bytes / 1024) + " Ko";
  return bytes + " o";
}

function FileUpload({ file, accept, onChange, placeholder }) {
  const inputRef = useRef();
  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  };
  return (
    <div
      className="file-drop"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => onChange(e.target.files[0])}
      />
      {file ? (
        <div className="file-selected">
          <FileText size={18} style={{ color: "#005f69" }} />
          <span>{file.name}</span>
          <span style={{ fontSize: 11, color: "#7aaeb4" }}>
            ({formatSize(file.size)})
          </span>
        </div>
      ) : (
        <div className="file-placeholder">
          <UploadSimple size={20} style={{ color: "#7aaeb4" }} />
          <span>{placeholder}</span>
        </div>
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
        message:
          "Ceci est une candidature de test (environnement de développement).",
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

  const MAX_SIZE = 10 * 1024 * 1024;

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

  return (
    <>
      <style>{MODAL_STYLES}</style>
      <div
        className="modal-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="modal-box"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <button className="modal-close" onClick={onClose}>
            <X size={18} weight="bold" />
          </button>

          {success ? (
            <div className="modal-success">
              <div className="modal-success-icon">
                <Check size={30} weight="regular" color="#fff" />
              </div>
              <h3>Candidature envoyée !</h3>
              <p>
                Nous avons bien reçu votre candidature pour le poste de{" "}
                <b>{job.job_title}</b>. Nous reviendrons vers vous dans les plus
                brefs délais.
              </p>
              <button onClick={onClose} className="modal-btn-close">
                Fermer
              </button>
            </div>
          ) : (
            <>
              <div className="modal-header">
                <h2>Postuler — {job.job_title}</h2>
                <p>
                  {job.department} · {job.location.city}
                </p>
              </div>

              <div className="modal-body">
                <div className="modal-row-2">
                  <Field label="Prénom *" error={errors.first_name}>
                    <input
                      type="text"
                      placeholder="Jean"
                      value={form.first_name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, first_name: e.target.value }))
                      }
                      className={errors.first_name ? "field-error" : ""}
                    />
                  </Field>
                  <Field label="Nom *" error={errors.last_name}>
                    <input
                      type="text"
                      placeholder="Ahouansou"
                      value={form.last_name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, last_name: e.target.value }))
                      }
                      className={errors.last_name ? "field-error" : ""}
                    />
                  </Field>
                </div>

                <Field
                  label="Adresse email *"
                  error={errors.email}
                  icon={<EnvelopeSimple size={15} />}
                >
                  <input
                    type="email"
                    placeholder="jean@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className={errors.email ? "field-error" : ""}
                  />
                </Field>

                <Field
                  label="Numéro de téléphone *"
                  error={errors.phone}
                  icon={<Phone size={15} />}
                >
                  <input
                    type="tel"
                    placeholder="+229 01 XXXXXXXX"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className={errors.phone ? "field-error" : ""}
                  />
                </Field>

                <Field
                  label="CV * (PDF uniquement — max 10 Mo)"
                  error={errors.cv}
                >
                  <FileUpload
                    file={cv}
                    accept=".pdf"
                    onChange={(f) => handleFileChange("cv", f)}
                    placeholder="Glissez votre CV ou cliquez pour parcourir"
                  />
                </Field>

                <Field
                  label="Lettre de motivation (optionnel — PDF uniquement)"
                  error={errors.motivationFile}
                >
                  <FileUpload
                    file={motivationFile}
                    accept=".pdf"
                    onChange={(f) => handleFileChange("motivationFile", f)}
                    placeholder="Glissez votre lettre ou cliquez pour parcourir"
                  />
                </Field>

                <Field label="Message (optionnel)">
                  <textarea
                    placeholder="Présentez-vous brièvement…"
                    rows={3}
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                  />
                </Field>

                {(job?.job_title?.toLowerCase().includes("livreur") ||
                  job?.id === "delivery_man") && (
                  <>
                    <Field label="Numéro de permis de conduire *">
                      <input
                        placeholder="Ex: BJ-123456"
                        value={form.license_number}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            license_number: e.target.value,
                          }))
                        }
                      />
                    </Field>

                    <div className="modal-row-2">
                      <Field label="Expérience passée ?">
                        <select
                          value={form.has_experience}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              has_experience: e.target.value,
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "10px",
                            border: "1.5px solid rgba(0,95,105,0.15)",
                            background: "#fafeff",
                          }}
                        >
                          <option value="">Sélectionner</option>
                          <option value="yes">Oui</option>
                          <option value="no">Non</option>
                        </select>
                      </Field>
                      <Field label="Avez-vous un véhicule ?">
                        <select
                          value={form.own_vehicle}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              own_vehicle: e.target.value,
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "10px",
                            border: "1.5px solid rgba(0,95,105,0.15)",
                            background: "#fafeff",
                          }}
                        >
                          <option value="">Sélectionner</option>
                          <option value="yes">Oui</option>
                          <option value="no">Non</option>
                        </select>
                      </Field>
                    </div>

                    {form.own_vehicle === "no" && (
                      <Field label="Souhaitez-vous qu'on vous en fournisse un ?">
                        <select
                          value={form.want_vehicle}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              want_vehicle: e.target.value,
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "10px",
                            border: "1.5px solid rgba(0,95,105,0.15)",
                            background: "#fafeff",
                          }}
                        >
                          <option value="">Sélectionner</option>
                          <option value="yes">Oui</option>
                          <option value="no">Non</option>
                        </select>
                      </Field>
                    )}
                  </>
                )}

                {errors.submit && (
                  <div className="modal-error-band">
                    <Warning size={16} /> {errors.submit}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="modal-submit-btn"
                >
                  {submitting ? "Envoi en cours…" : "Envoyer ma candidature"}
                  {!submitting && <ArrowRight size={16} weight="bold" />}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}
