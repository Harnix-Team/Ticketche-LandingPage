import QuestionnairesClient from "./QuestionnairesClient";

export const metadata = {
  title: "Questionnaires | Ticketché",
  description: "Répondez aux questionnaires Ticketché pour nous aider à améliorer nos services.",
  robots: { index: false, follow: false },
};

export default function QuestionnairesPage() {
  return <QuestionnairesClient />;
}