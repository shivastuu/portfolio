"use client";

// Opens the command palette (components/Palette.tsx), for people who don't know the shortcut.
export default function CmdButton() {
  return (
    <button type="button" className="cmdk mono" onClick={() => dispatchEvent(new Event("palette:open"))} aria-label="Open command menu (Command K)">
      ⌘K
    </button>
  );
}
