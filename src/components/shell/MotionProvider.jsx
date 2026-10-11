"use client";

import { MotionConfig } from "motion/react";

/** Les icones animees respectent le reglage « reduire les animations » du systeme. */
export function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
