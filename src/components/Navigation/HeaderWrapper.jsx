"use client";
import { usePathname } from "next/navigation";
import { Header } from "./header";

const HIDDEN_ROUTES = [/^\/places\/[^/]+\/?$/, /^\/events\/[^/]+\/?$/];

export function HeaderWrapper() {
  const pathname = usePathname();
  const hidden = HIDDEN_ROUTES.some((r) => r.test(pathname));
  if (hidden) return null;
  return <Header />;
}