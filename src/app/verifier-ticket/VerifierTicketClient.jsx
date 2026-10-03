"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  requestTicketCode,
  confirmTicketCode,
  requestTicketReplacement,
} from "@/api/ticketApi";
import { normalizeReference, validateReference } from "@/utils/ticketReference";

const PRIMARY = "#005F69";
const RESEND_DELAY = 60;

const STATUS_CHIPS = {
  ISSUED: { label: "Valide", bg: "#dff3e6", fg: "#1b6b3a" },
  SCANNED: { label: "Utilisé", bg: "#e6eaee", fg: "#46525e" },
  CANCELLED: { label: "Annulé", bg: "#fde2de", fg: "#a3271a" },
  LOST: { label: "Perdu", bg: "#fdecd0", fg: "#8a5a00" },
};

const REPLACEMENT_LABELS = {
  PENDING: "Demande de remplacement en attente",
  APPROVED: "Demande acceptée",
  ACCEPTED: "Demande acceptée",
  REJECTED: "Demande refusée",
  REFUSED: "Demande refusée",
  DECLINED: "Demande refusée",
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
};

/** Maps an API failure to a French message; `expired` means the token is no longer valid. */
function describeError(err, context) {
  const status = err?.status;
  if (status === 0) return { message: "Connexion impossible. Vérifiez votre réseau et réessayez." };
  if (status === 404) return { message: "Aucun ticket ne correspond à cette référence." };
  if (status === 429)
    return { message: "Trop de tentatives. Patientez quelques minutes avant de réessayer." };
  if (status === 423)
    return { message: "Cette référence est temporairement bloquée. Réessayez plus tard." };
  if (status === 401 && context === "confirm")
    return { message: "Code invalide ou expiré. Vérifiez le code ou demandez-en un nouveau." };
  if (status === 401)
    return {
      message: "Votre session de vérification a expiré. Veuillez recommencer.",
      expired: true,
    };
  if (status === 422 && err.serverMessage) return { message: err.serverMessage };
  return { message: "Une erreur est survenue. Veuillez réessayer." };
}

const cardClass = "rounded-2xl bg-white p-5 shadow-sm border border-[#d5e6e7]";
const primaryBtn =
  "w-full rounded-2xl bg-[#005F69] px-5 py-3.5 font-semibold text-white transition hover:bg-[#00515a] disabled:cursor-not-allowed disabled:opacity-50";
const linkBtn = "text-sm font-semibold text-[#005F69] underline disabled:opacity-50 disabled:no-underline";

function Chip({ status }) {
  const chip = STATUS_CHIPS[status] || { label: status, bg: "#e6eaee", fg: "#46525e" };
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-semibold"
      style={{ background: chip.bg, color: chip.fg }}
    >
      {chip.label}
    </span>
  );
}

function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl bg-[#fde2de] px-4 py-3 text-sm text-[#a3271a]">
      {message}
    </p>
  );
}

function Modal({ label, onClose, children }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-full w-full max-w-md overflow-auto rounded-2xl bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// White background and quiet zone are forced so scanners work even in dark UI.
function QrBox({ value, size }) {
  return (
    <div className="inline-block rounded-xl bg-white p-4" style={{ background: "#ffffff" }}>
      <QRCodeSVG value={value} size={size} bgColor="#ffffff" fgColor="#000000" level="M" marginSize={4} />
    </div>
  );
}

function ItemCard({ item, onReplace }) {
  const [showQr, setShowQr] = useState(false);
  const [zoom, setZoom] = useState(false);
  const online = item.format_chosen === "EN_LIGNE";
  const canShowQr = item.status === "ISSUED" && !online && !!item.qr_data;
  const pending = item.pending_replacement;

  return (
    <li className={cardClass}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-[#003c42]">{item.ticket_title}</p>
          <p className="text-sm text-gray-600">
            {item.reference} · Quantité : {item.quantity} · {online ? "En ligne" : "Présentiel"}
          </p>
        </div>
        <Chip status={item.status} />
      </div>

      {pending && (
        <p className="mt-3 rounded-xl bg-[#ecf5f5] px-4 py-3 text-sm text-[#003c42]">
          {REPLACEMENT_LABELS[pending.status] || "Demande de remplacement en cours"}
          {pending.new_reference ? ` : nouvelle référence ${pending.new_reference}` : ""}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {canShowQr && (
          <button type="button" className={`${linkBtn} no-underline rounded-xl bg-[#ecf5f5] px-4 py-2`} onClick={() => setShowQr((v) => !v)}>
            {showQr ? "Masquer mon QR" : "Afficher mon QR"}
          </button>
        )}
        {item.can_request_replacement && (
          <button type="button" className={`${linkBtn} rounded-xl px-2 py-2`} onClick={() => onReplace(item)}>
            J&apos;ai perdu mon ticket
          </button>
        )}
      </div>

      {canShowQr && showQr && (
        <div className="mt-4 text-center">
          <QrBox value={item.qr_data} size={240} />
          <div className="mt-2">
            <button type="button" className={linkBtn} onClick={() => setZoom(true)}>
              Agrandir
            </button>
          </div>
        </div>
      )}

      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="QR code agrandi"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white p-4"
        >
          <QrBox value={item.qr_data} size={Math.min(360, typeof window !== "undefined" ? window.innerWidth - 80 : 300)} />
          <button type="button" className={primaryBtn + " max-w-xs"} onClick={() => setZoom(false)}>
            Fermer
          </button>
        </div>
      )}
    </li>
  );
}

function OnlineAccessCard({ access }) {
  const available = !!access.available;
  return (
    <section className={cardClass}>
      <h2 className="mb-2 text-lg font-bold text-[#003c42]">Accès en ligne</h2>
      {available ? (
        <>
          {access.online_link ? (
            <a
              href={access.online_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-2xl bg-[#005F69] px-5 py-3.5 text-center font-semibold text-white"
            >
              Rejoindre l&apos;événement
            </a>
          ) : (
            <p className="text-sm text-gray-600">Le lien d&apos;accès n&apos;est pas encore communiqué.</p>
          )}
          {access.access_code && (
            <p className="mt-3 text-sm text-gray-700">
              Code d&apos;accès : <strong className="tracking-wider">{access.access_code}</strong>
            </p>
          )}
        </>
      ) : (
        <>
          <button type="button" disabled className={primaryBtn}>
            Rejoindre l&apos;événement
          </button>
          <p className="mt-3 text-sm text-gray-600">
            {access.opens_at
              ? `Disponible à partir du ${formatDate(access.opens_at)}`
              : "Disponible prochainement"}
          </p>
        </>
      )}
    </section>
  );
}

export default function VerifierTicketClient() {
  const [step, setStep] = useState("reference");
  const [reference, setReference] = useState("");
  const [channel, setChannel] = useState("email");
  const [destination, setDestination] = useState(null);
  const [code, setCode] = useState("");
  const [token, setToken] = useState(null); // memory only
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [replaceItem, setReplaceItem] = useState(null);
  const [reason, setReason] = useState("");
  const [replaceError, setReplaceError] = useState("");
  const [replaceDone, setReplaceDone] = useState(false);
  const normalized = useRef("");

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const restart = (message = "") => {
    setStep("reference");
    setToken(null);
    setSummary(null);
    setCode("");
    setDestination(null);
    setReplaceItem(null);
    setReplaceDone(false);
    setResendIn(0);
    setError(message);
  };

  const sendCode = async (e) => {
    e?.preventDefault();
    setError("");
    const ref = step === "reference" ? normalizeReference(reference) : normalized.current;
    const check = validateReference(ref);
    if (!check.valid) {
      setError(
        check.reason === "empty"
          ? "Saisissez la référence de votre ticket."
          : check.reason === "checksum"
            ? "Cette référence semble erronée. Vérifiez chaque caractère."
            : "Format de référence invalide. Exemple : TKEV-7K3M-Q9X2.",
      );
      return;
    }
    setLoading(true);
    try {
      const data = await requestTicketCode(ref, channel);
      normalized.current = ref;
      setReference(ref);
      setDestination(data?.destination || null);
      setCode("");
      setResendIn(RESEND_DELAY);
      setStep("code");
    } catch (err) {
      setError(describeError(err, "request").message);
    } finally {
      setLoading(false);
    }
  };

  const confirm = async (e) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("Saisissez le code à 6 chiffres.");
      return;
    }
    setLoading(true);
    try {
      const data = await confirmTicketCode(normalized.current, code);
      setToken(data.verification_token);
      setSummary(data.reservation);
      setStep("result");
    } catch (err) {
      setError(describeError(err, "confirm").message);
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const onCodeChange = (value) => setCode(value.replace(/\D/g, "").slice(0, 6));

  const submitReplacement = async () => {
    setReplaceError("");
    setLoading(true);
    try {
      await requestTicketReplacement(token, replaceItem.id, reason.trim() || undefined);
      setSummary((s) => ({
        ...s,
        items: s.items.map((it) =>
          it.id === replaceItem.id
            ? { ...it, can_request_replacement: false, pending_replacement: { id: null, status: "PENDING" } }
            : it,
        ),
      }));
      setReplaceDone(true);
    } catch (err) {
      const info = describeError(err, "replacement");
      if (info.expired) restart(info.message);
      else setReplaceError(info.message);
    } finally {
      setLoading(false);
    }
  };

  const closeReplace = () => {
    setReplaceItem(null);
    setReplaceDone(false);
    setReplaceError("");
    setReason("");
  };

  return (
    <main
      className="min-h-screen px-4 py-10"
      style={{ background: "#ecf5f5", fontFamily: "'Archivo', sans-serif" }}
    >
      <div className="mx-auto max-w-xl space-y-5">
        <Link href="/" className="text-sm font-semibold" style={{ color: PRIMARY }}>
          ← Retour à l&apos;accueil
        </Link>
        <h1 className="text-3xl font-extrabold text-[#003c42]">Vérifier mon ticket</h1>

        {step === "reference" && (
          <form onSubmit={sendCode} className={`${cardClass} space-y-4`} noValidate>
            <p className="text-sm text-gray-600">
              Saisissez la référence de votre ticket. Nous vous enverrons un code de vérification.
            </p>
            <label className="block text-sm font-semibold text-[#003c42]" htmlFor="reference">
              Référence du ticket
            </label>
            <input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="TKEV-7K3M-Q9X2"
              autoCapitalize="characters"
              autoComplete="off"
              className="w-full rounded-xl border border-[#b9d3d5] px-4 py-3 uppercase tracking-wide text-black"
            />
            <fieldset className="flex gap-3">
              <legend className="mb-2 text-sm font-semibold text-[#003c42]">Recevoir le code par</legend>
              {[
                ["email", "E-mail"],
                ["sms", "SMS"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className={`flex-1 cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-semibold ${
                    channel === value ? "border-[#005F69] bg-[#ecf5f5] text-[#005F69]" : "border-[#b9d3d5] text-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="channel"
                    value={value}
                    checked={channel === value}
                    onChange={() => setChannel(value)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            <ErrorBox message={error} />
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? "Envoi en cours..." : "Recevoir mon code"}
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={confirm} className={`${cardClass} space-y-4`} noValidate>
            <p className="text-sm text-gray-600">
              Un code à 6 chiffres a été envoyé
              {destination?.masked ? ` à ${destination.masked}` : ""}
              {destination?.channel === "sms" ? " par SMS" : destination?.channel === "email" ? " par e-mail" : ""}.
            </p>
            <label className="block text-sm font-semibold text-[#003c42]" htmlFor="code">
              Code de vérification
            </label>
            <input
              id="code"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              onPaste={(e) => {
                e.preventDefault();
                onCodeChange(e.clipboardData.getData("text"));
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              autoFocus
              className="w-full rounded-xl border border-[#b9d3d5] px-4 py-3 text-center text-2xl tracking-[0.5em] text-black"
            />
            <ErrorBox message={error} />
            <button type="submit" disabled={loading || code.length !== 6} className={primaryBtn}>
              {loading ? "Vérification..." : "Vérifier"}
            </button>
            <div className="flex items-center justify-between">
              <button type="button" className={linkBtn} disabled={resendIn > 0 || loading} onClick={sendCode}>
                {resendIn > 0 ? `Renvoyer le code (${resendIn} s)` : "Renvoyer le code"}
              </button>
              <button type="button" className={linkBtn} onClick={() => restart()}>
                Changer de référence
              </button>
            </div>
          </form>
        )}

        {step === "result" && summary && (
          <div className="space-y-5">
            <section className={cardClass}>
              {summary.event?.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={summary.event.cover_image_url}
                  alt=""
                  className="mb-4 h-40 w-full rounded-xl object-cover"
                />
              )}
              <h2 className="text-xl font-bold text-[#003c42]">{summary.event?.title}</h2>
              {summary.event?.start_date && (
                <p className="mt-1 text-sm text-gray-700">
                  {formatDate(summary.event.start_date)}
                  {summary.event.end_date ? ` au ${formatDate(summary.event.end_date)}` : ""}
                </p>
              )}
              {summary.event?.location_name && (
                <p className="text-sm text-gray-700">{summary.event.location_name}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">Réservation {summary.reference}</p>
            </section>

            {summary.online_access && <OnlineAccessCard access={summary.online_access} />}

            <ul className="space-y-4">
              {summary.items?.map((item) => (
                <ItemCard key={item.id} item={item} onReplace={setReplaceItem} />
              ))}
            </ul>

            <button type="button" className={linkBtn} onClick={() => restart()}>
              Vérifier un autre ticket
            </button>
          </div>
        )}
      </div>

      {replaceItem && (
        <Modal label="Remplacement de ticket" onClose={closeReplace}>
          {replaceDone ? (
            <div className="space-y-4">
              <p className="font-semibold text-[#003c42]">Votre demande a été envoyée à l&apos;organisateur</p>
              <button type="button" className={primaryBtn} onClick={closeReplace}>
                Fermer
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#003c42]">J&apos;ai perdu mon ticket</h2>
              <p className="text-sm text-gray-600">
                L&apos;organisateur examinera votre demande de remplacement pour {replaceItem.ticket_title}.
              </p>
              <label className="block text-sm font-semibold text-[#003c42]" htmlFor="reason">
                Motif (facultatif)
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full rounded-xl border border-[#b9d3d5] px-4 py-3 text-black"
              />
              <ErrorBox message={replaceError} />
              <button type="button" disabled={loading} className={primaryBtn} onClick={submitReplacement}>
                {loading ? "Envoi..." : "Envoyer la demande"}
              </button>
              <button type="button" className={linkBtn} onClick={closeReplace}>
                Annuler
              </button>
            </div>
          )}
        </Modal>
      )}
    </main>
  );
}
