"use client";

import { useLayoutEffect } from "react";
import { boot } from "../lib/boot";

// Re-applies the motion / preloader classes after React mounts (see lib/boot.ts).
export default function Boot() {
  useLayoutEffect(boot, []);
  return null;
}
