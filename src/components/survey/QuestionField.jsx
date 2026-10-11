"use client";

import { Check, ClipboardList } from "@/components/icons";
import { useId } from "react";
import { Field, Textarea } from "@/components/ui/Field";

const OPTION =
  "flex min-h-12 cursor-pointer items-start gap-3 rounded-media border border-line bg-surface px-3.5 py-3 transition-colors duration-150 hover:border-line-strong has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand";

const QUESTION = "tk-title text-[1.125rem] text-ink";

export function isOtherOption(id) {
  return id === "autre" || id === "other" || !!id?.toLowerCase().includes("autre");
}

export function hasAnswer(step, answers) {
  if (step.type === "text") return !!(answers[step.id] || "").trim();
  if (step.type === "multi") return (answers[step.id] || []).length > 0;
  return !!answers[step.id];
}

/** Valeur après un clic sur une option, ou `null` quand le maximum de choix est atteint. */
function nextValue(step, value, optionId, exclusiveOther) {
  if (step.type !== "multi") return optionId;

  const current = value || [];
  if (current.includes(optionId)) return current.filter((id) => id !== optionId);
  if (exclusiveOther && isOtherOption(optionId)) return [optionId];

  const kept = exclusiveOther ? current.filter((id) => !isOtherOption(id)) : current;
  if (step.maxSelect && kept.length >= step.maxSelect) return null;
  return [...kept, optionId];
}

/**
 * Une question du sondage : choix unique (radio), choix multiples (cases à cocher) ou texte libre.
 * `copy.other` active le champ « Autre » et le rend exclusif des autres choix.
 */
export function QuestionField({ step, answers, onChange, copy, script, showIntro = true, showDescriptions = true, markAnswered = false }) {
  const id = useId();
  const value = answers[step.id];
  const isMulti = step.type === "multi";
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const answered = markAnswered && hasAnswer(step, answers);
  const otherSelected = !!copy.other && selected.some(isOtherOption);
  const compact = step.options?.every((option) => option.label.length <= 28 && !option.desc);

  const select = (optionId) => {
    const next = nextValue(step, value, optionId, !!copy.other);
    if (next !== null) onChange(step.id, next);
  };

  return (
    <div className={`relative rounded-card border bg-surface p-4 transition-colors duration-200 sm:p-5 ${answered ? "border-line-strong" : "border-line"}`}>
      {answered && <Check className="absolute top-4 right-4 size-4 text-brand sm:top-5 sm:right-5" aria-hidden />}

      {script && (
        <div className="mb-4 rounded-media bg-clay-soft p-3.5">
          <p className="tk-label flex items-center gap-1.5 text-[0.8125rem] text-clay">
            <ClipboardList className="size-4" aria-hidden />
            Script à lire à voix haute
          </p>
          <p className="mt-1.5 text-[0.9375rem] text-ink">{script}</p>
        </div>
      )}
      {showIntro && step.intro && (
        <p className="mb-4 rounded-media bg-brand-soft p-3.5 text-[0.9375rem] text-ink-2">{step.intro}</p>
      )}

      {step.type === "text" ? (
        <>
          <label htmlFor={id} className={`${QUESTION} block ${markAnswered ? "pr-7" : ""}`}>
            {step.question}
          </label>
          <Textarea
            id={id}
            rows={4}
            className="mt-3"
            placeholder={step.placeholder || copy.textPlaceholder}
            value={value || ""}
            onChange={(event) => onChange(step.id, event.target.value)}
          />
        </>
      ) : (
        <fieldset className="min-w-0" aria-describedby={isMulti ? `${id}-aide` : undefined}>
          <legend className={`${QUESTION} ${markAnswered ? "pr-7" : ""}`}>{step.question}</legend>
          {isMulti && (
            <p id={`${id}-aide`} className="mt-1 text-[0.8125rem] text-ink-2">
              {step.maxSelect ? copy.multiMax(step.maxSelect) : copy.multiAny}
            </p>
          )}
          <div className={`mt-3 grid gap-2 ${compact ? "sm:grid-cols-2" : ""}`}>
            {step.options?.map((option) => {
              const checked = selected.includes(option.id);

              return (
                <label key={option.id} className={OPTION}>
                  <input
                    type={isMulti ? "checkbox" : "radio"}
                    name={id}
                    value={option.id}
                    checked={checked}
                    onChange={() => select(option.id)}
                    // Un radio déjà coché n'émet pas `change` : le clic doit quand même valider la réponse.
                    onClick={!isMulti && checked ? () => select(option.id) : undefined}
                    className="mt-[0.1875rem] size-[1.125rem] shrink-0 accent-brand outline-none"
                  />
                  <span className="min-w-0 text-[0.9375rem]">
                    <span className="tk-label block text-ink [overflow-wrap:anywhere]">{option.label}</span>
                    {showDescriptions && option.desc && (
                      <span className="mt-0.5 block text-[0.8125rem] text-ink-2">{option.desc}</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {otherSelected && (
        <Field label={copy.other.label} className="mt-4">
          {(props) => (
            <Textarea
              {...props}
              rows={2}
              autoFocus={copy.other.autoFocus}
              placeholder={copy.other.placeholder}
              value={answers[`${step.id}_autre`] || ""}
              onChange={(event) => onChange(`${step.id}_autre`, event.target.value)}
            />
          )}
        </Field>
      )}

      {step.endIfLabel && step.endIf?.values?.includes(value) && (
        <Field label={step.endIfLabel} className="mt-4">
          {(props) => (
            <Textarea
              {...props}
              rows={3}
              placeholder={copy.reasonPlaceholder}
              value={answers[`${step.id}_reason`] || ""}
              onChange={(event) => onChange(`${step.id}_reason`, event.target.value)}
            />
          )}
        </Field>
      )}
    </div>
  );
}
