"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NavLinks from "./NavLinks";
import CTALink from "../ui/CTALink";

/**
 * Site header: nav bar + mobile open/close toggle, reimplemented as React
 * state (`useState`/`useEffect` + a ref for click-outside) replacing the
 * legacy `toggleHeader()`/`onHeaderClickOutside()` imperative DOM code in
 * `index.js` (STORY-1.2 AC Scenario 2, ADR-001). Client Component — the
 * only interactive piece of the layout.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("click", onClickOutside);
    return () => window.removeEventListener("click", onClickOutside);
  }, [open]);

  return (
    <header className="absolute top-0 z-20 flex h-[60px] w-full px-[5%] max-lg:px-4 lg:justify-around">
      <Link className="h-[50px] p-1 text-2xl font-medium" href="/">
        Deep.S
      </Link>
      <div
        ref={panelRef}
        className={`flex flex-col gap-5 text-base text-black transition-all lg:flex-row lg:place-items-center ${
          open ? "block" : "hidden lg:flex"
        }`}
      >
        <NavLinks />
        <CTALink href="mailto:deepsenchowa1@gmail.com" label="Get in touch" icon="bi-arrow-up-right" />
      </div>
      <button
        className={`bi absolute right-3 top-3 z-50 text-3xl text-black lg:hidden ${open ? "bi-x" : "bi-list"}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="menu"
        aria-expanded={open}
      ></button>
    </header>
  );
}
