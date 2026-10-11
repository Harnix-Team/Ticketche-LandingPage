import { Plus } from "@/components/icons";
import { FaqStructuredData } from "@/components/StructuredData";
import { HOME_FAQ } from "@/data/faq";

export function Faq({ questions = HOME_FAQ }) {
  return (
    <section className="tk-shell grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16" aria-labelledby="questions">
      <FaqStructuredData questions={questions} />
      <div>
        <h2 id="questions" className="tk-display text-[clamp(2rem,4vw,3.25rem)]">
          Questions fréquentes
        </h2>
        <p className="mt-4 max-w-[40ch] text-ink-2">
          Une autre question ? Écrivez à{" "}
          <a href="mailto:support@ticketche.com" className="text-brand underline underline-offset-4">
            support@ticketche.com
          </a>
          .
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        {questions.map(({ question, answer }) => (
          <details key={question} className="group/faq rounded-card border border-line bg-surface transition-colors duration-300 open:border-line-strong hover:border-line-strong">
            <summary className="tk-label flex list-none items-center justify-between gap-4 px-5 py-4.5 text-[1.0625rem] text-ink [&::-webkit-details-marker]:hidden">
              {question}
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                <Plus className="size-4 transition-transform duration-300 ease-out-soft group-open/faq:rotate-45" aria-hidden />
              </span>
            </summary>
            <p className="max-w-[68ch] px-5 pb-5 text-ink-2">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
