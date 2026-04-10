"use client";
import { usePathname } from "next/navigation";
import AppNotification from "./AppNotification";

const HIDDEN_ROUTES = [/^\/recrutement(\/.*)?$/];

export function AppNotificationWrapper() {
  const pathname = usePathname();
  const hidden = HIDDEN_ROUTES.some((r) => r.test(pathname));
  if (hidden) return null;
  return <AppNotification />;
}