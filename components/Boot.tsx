"use client";

import { useLayoutEffect } from "react";
import { boot } from "../lib/boot";

// Re-applies the theme and preloader state after React mounts (see lib/boot.ts). Rendered before
// <Motion> so this layout effect runs before the Hero reads is-loading.
export default function Boot() {
  useLayoutEffect(boot, []);
  return null;
}
