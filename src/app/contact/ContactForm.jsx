"use client";

import { Bike, CalendarDays, CircleCheck, Handshake, Loader2, MapPin, MessageCircle, UtensilsCrossed } from "@/components/icons";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { PHONE_NUMBER } from "@/config/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.ticketche.com/api/v2";

const EMPTY = { name: "", email: "", service: "", message: "", website: "" };

// Ce que couvre Ticketché aujourd'hui, plus les deux demandes qui n'entrent dans aucun service.
// Les valeurs sont celles de l'enum `ContactRequestTopic` de l'API.
const SERVICES = [
  { value: "event", label: "Événements", hint: "Billetterie, organisation", icon: CalendarDays },
  { value: "place", label: "Lieux", hint: "Hôtel, parking, garage, culture", icon: MapPin },
  { value: "restaurant", label: "Restaurants", hint: "Menu, commande en ligne", icon: UtensilsCrossed },
  { value: "delivery", label: "Livraison", hint: "Course, colis, repas", icon: Bike },
  { value: "partner", label: "Partenariat", hint: "Référencer votre activité", icon: Handshake },
  { value: "other", label: "Autre demande", hint: "Compte, paiement, assistance", icon: MessageCircle },
];

/** Même message, prêt à partir par WhatsApp : la solution de repli quand l'envoi échoue. */
function whatsappUrl(form) {
  const text = [
    "Bonjour,",
    "",
    `Nom : ${form.name}`,
    `Email : ${form.email}`,
    `Sujet : ${SERVICES.find((service) => service.value === form.service)?.label ?? "Non précisé"}`,
    "",
    form.message,
  ].join("\n");

  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Formulaire de contact : le message part à l'API (POST /contact-requests), qui notifie les administrateurs
 * dans l'application et par e-mail.
 */
export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setError("");
    if (status === "failed") setStatus("idle");
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(`${API_URL}/contact-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          topic: form.service || null,
          message: form.message,
          website: form.website,
        }),
      });

      if (response.status === 422) {
        const payload = await response.json().catch(() => null);
        setError(Object.values(payload?.errors ?? {}).flat()[0] ?? "Vérifiez les informations saisies.");
        setStatus("idle");
        return;
      }
      if (!response.ok) throw new Error(String(response.status));

      setStatus("sent");
      setForm(EMPTY);
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex min-h-64 flex-col items-center justify-center gap-2 py-8 text-center">
        <CircleCheck className="size-12 text-ok" aria-hidden />
        <p className="tk-title mt-2 text-xl text-ink">Message envoyé</p>
        <p className="max-w-[40ch] text-[0.9375rem] text-ink-2">
          L’équipe Ticketché l’a reçu et vous répondra par e-mail.
        </p>
        <Button variant="soft" className="mt-3" onClick={() => setStatus("idle")}>
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Votre nom" required>
          {(field) => (
            <Input {...field} name="name" value={form.name} onChange={handleChange} placeholder="Nom complet" autoComplete="name" />
          )}
        </Field>
        <Field label="Votre email" required>
          {(field) => (
            <Input
              {...field}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Entrez votre email"
              autoComplete="email"
            />
          )}
        </Field>
      </div>

      <fieldset>
        <legend className="tk-label mb-2 text-[0.875rem] text-ink">Votre demande concerne</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SERVICES.map(({ value, label, hint, icon: Icon }) => (
            <label
              key={value}
              className="group/service flex cursor-pointer flex-col gap-2 rounded-xl border border-line-strong bg-surface p-3 transition-colors duration-200 hover:border-brand has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
            >
              <input
                type="radio"
                name="service"
                value={value}
                checked={form.service === value}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand transition-colors duration-200 group-has-[:checked]/service:bg-brand-fill group-has-[:checked]/service:text-white">
                <Icon className="size-[1.125rem]" aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="tk-label block text-[0.9375rem] text-ink">{label}</span>
                <span className="mt-0.5 block text-[0.75rem] text-ink-3">{hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Le message est contrôlé à l'envoi et non par le navigateur, pour afficher le message d'erreur d'origine. */}
      <Field label="Votre message" required error={error}>
        {(field) => (
          <Textarea
            {...field}
            required={false}
            aria-required
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Décrivez votre demande…"
            className="resize-y"
          />
        )}
      </Field>

      {/* Champ leurre : invisible et hors tabulation, seul un robot le remplit. */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Site web
          <input type="text" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "failed" && (
        <p role="alert" className="rounded-xl border border-danger/40 bg-danger/8 px-4 py-3 text-[0.9375rem] text-ink">
          L’envoi n’a pas abouti. Vérifiez votre connexion et réessayez, ou{" "}
          <a href={whatsappUrl(form)} target="_blank" rel="noopener noreferrer" className="tk-label text-brand underline underline-offset-4">
            envoyez ce message par WhatsApp
          </a>
          .
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={sending}>
        {sending && <Loader2 className="size-5 animate-spin" aria-hidden />}
        {sending ? "Envoi en cours" : "Envoyer le message"}
      </Button>
    </form>
  );
}
