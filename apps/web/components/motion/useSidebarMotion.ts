"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";

/** Animate layout width on desktop and an overlay translation on mobile. */
export function useSidebarMotion(root: RefObject<HTMLDivElement | null>, selector: string, open: boolean, mobile: boolean) {
    const previous = useRef<{ open: boolean; mobile: boolean } | null>(null);
    useLayoutEffect(() => {
        const sidebar = root.current?.querySelector<HTMLElement>(selector);
        const before = previous.current;
        previous.current = { open, mobile };
        if (!sidebar) return;
        sidebar.inert = !open;
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (!before || before.mobile !== mobile || before.open === open || media.matches) return;
        const context = gsap.context(() => {
            if (mobile) {
                gsap.fromTo(sidebar,
                    { visibility: "visible", xPercent: before.open ? 0 : -100, x: 0, transition: "none" },
                    { xPercent: open ? 0 : -100, duration: .28, ease: "power2.inOut", clearProps: "transform,visibility,transition" });
            } else {
                gsap.fromTo(sidebar,
                    { display: "flex", overflow: "hidden", width: before.open ? 236 : 0, paddingLeft: before.open ? 16 : 0, paddingRight: before.open ? 16 : 0, opacity: before.open ? 1 : 0 },
                    { width: open ? 236 : 0, paddingLeft: open ? 16 : 0, paddingRight: open ? 16 : 0, opacity: open ? 1 : 0, duration: .28, ease: "power2.inOut", clearProps: "display,overflow,width,paddingLeft,paddingRight,opacity" });
            }
        }, root);
        const reduce = () => { if (media.matches) context.revert(); };
        media.addEventListener("change", reduce);
        return () => { media.removeEventListener("change", reduce); context.revert(); };
    }, [root, selector, open, mobile]);
}
